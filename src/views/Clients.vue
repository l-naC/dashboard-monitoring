<template>
    <Navigation>
        <v-container  fluid tag="section">
            <v-card class="px-5 py-3 mt-5">
                <div class="d-flex grow flex-wrap">
                    <v-card class="v-card-material-table px-5 py-5" color="primary" dark>
                        <v-icon>mdi-account-supervisor</v-icon>
                    </v-card>
                    <v-card-title class="align-start px-5 py-0">List of clients</v-card-title>
                    <v-spacer />
                    <v-btn right color="primary" dark  @click="dialog = !dialog">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </div>
                <v-data-table dense :headers="headers" :items="tablo" item-key="name" class="elevation-1">
                    <template v-slot:item.actions="{ item }">
                        <v-icon small class="mr-2" @click="editClient(item, item.id)">
                            mdi-pencil
                        </v-icon>
                        <v-icon small @click="deleteClient(item.id)">
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
            </v-card>
            <v-dialog v-model="dialog" width="800px">
                <v-card>
                    <v-card-title class="primary">
                    Create client
                    </v-card-title>
                    <v-container>
                        <v-form ref="form" v-model="valid">

                            <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>

                            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

                            <v-text-field v-model="phoneNumber" type="number" :rules="phoneNumberRules" label="Phone number" required></v-text-field>
                            
                            <v-text-field v-model="adress" :rules="adressRules" label="Adress" required></v-text-field>
                            
                            <v-btn class="mr-4" @click="reset">Reset</v-btn>
                            <v-btn color="primary" :disabled="!valid" class="mr-4" @click="validate" type="submit" @submit.prevent="submit">Validate</v-btn>
                        </v-form>
                    </v-container>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogEdit" width="800px">
                <v-card>
                    <v-card-title class="primary">
                    Edit client
                    </v-card-title>
                    <v-container>
                        <v-form ref="form" v-model="valid">
                            <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>

                            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

                            <v-text-field v-model="phoneNumber" type="number" :rules="phoneNumberRules" label="Phone number" required></v-text-field>
                            
                            <v-text-field v-model="adress" :rules="adressRules" label="Adress" required></v-text-field>
                            
                            <v-btn class="mr-4" @click="reset">Reset</v-btn>
                            <v-btn color="primary" :disabled="!valid" class="mr-4" @click="update" type="submit" @submit.prevent="submit">Update</v-btn>
                        </v-form>
                    </v-container>
                </v-card>
            </v-dialog>
        </v-container>
    </Navigation>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import firebase from 'firebase';
      

export default {
  name: 'Clients',
  components: {
    Navigation
  },
  data: () => ({
        headers: [
            { text: 'Name', value: 'name',},
            { text: 'Email', value: 'email' },
            { text: 'Phone number', value: 'phoneNumber' },
            { text: 'Adress', value: 'adress' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        dialog: false,
        dialogEdit: false,
        valid: true,
        tablo: [],
        name: '',
        id: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        email: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        phoneNumber: '',
        phoneNumberRules: [
            v => !!v || 'Phone number is required',
        ],
        adress: '',
        adressRules: [
            v => !!v || 'Phone number is required',
        ],
        user: false,
  }),
  methods: {
      validate: function () {
          let entry = {
            name: this.name,
            user: this.user.uid,
            email: this.email,
            phoneNumber: this.phoneNumber,
            adress: this.adress,
          }
          firebase.database().ref('clients').push(entry, (error) => {
            if (error) {
              alert('Oops. ' + error.message)
            } else {
              //this.$router.replace('clients')
            }
          });
      },
      reset () {
        this.$refs.form.reset()
      },
      update: function () {
          let entry = {
            name: this.name,
            user: this.user.uid,
            email: this.email,
            phoneNumber: this.phoneNumber,
            adress: this.adress,
          }
          firebase.database().ref('clients/'+ this.id).update(entry, (error) => {
            if (error) {
              alert('Oops. ' + error.message)
            } else {
              //this.$router.push('/clients')
            }
          });
      },
      editClient: function(index, id) {
          this.dialogEdit = !this.dialogEdit;
          this.editedCid = index;

          this.name = this.editedCid.name;
          this.email = this.editedCid.email;
          this.phoneNumber = this.editedCid.phoneNumber;
          this.adress = this.editedCid.adress;
          this.id = id;
          console.log(this.id)
      },
      deleteClient: function (id) {
        if (confirm('Are you sure you want to delete this client ?') ) {
            firebase.database().ref('clients').child(id).remove()
            .then(function() {
                console.log("Remove succeeded.")
            })
            .catch(function(error) {
                console.log("Remove failed: " + error.message)
            });
        }
      },
  },
  mounted: function() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          this.user = user
        } else {
          // No user is signed in.
          this.user = false
        }
        firebase.database().ref("clients/").orderByChild("user").equalTo(this.user.uid).on("value", snapshot => {
            if (snapshot.val() !== null){
                for(let [clientId, client] of Object.entries(snapshot.val())) {
                    this.tablo.push({
                        "id": clientId,
                        "adress": client.adress,
                        "email": client.email,
                        "name": client.name,
                        "phoneNumber": client.phoneNumber,
                        "user": client.user
                    })
                }
            }
        });
      });
  }
}

</script>

<style scoped>
    .v-card-material-table{
        position: relative;
        top: -30px;
    }
</style>