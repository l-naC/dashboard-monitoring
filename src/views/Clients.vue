<template>
    <Navigation>
        <v-container  fluid tag="section">
            <v-card class="px-5 py-3 mt-5">
                <div class="d-flex grow flex-wrap">
                    <v-card class="v-card-material-table px-5 py-5" color="primary" dark>
                        <v-icon>mdi-clipboard-text</v-icon>
                    </v-card>
                    <v-card-title class="align-start px-5 py-0">List of clients</v-card-title>
                    <v-spacer />
                    <v-btn right color="primary" dark  @click="dialog = !dialog">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </div>
                <v-simple-table dense>
                    <thead>
                        <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Email</th>
                        <th class="text-left">Phone number</th>
                        <th class="text-left">Adress</th>
                        <th class="text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in tablo" :key="i" :lat-lng="item">
                            <td class="text-left">{{ item.name }}</td>
                            <td class="text-left">{{ item.email }}</td>
                            <td class="text-left">{{ item.phoneNumber }}</td>
                            <td class="text-left">{{ item.adress }}</td>
                            <td class="text-left">
                                <v-btn class="ma-4" @click="editClient(item, item.id)">Edit</v-btn>
                                <v-btn class="ma-4" @click="() => deleteClient(item.id)">Delete</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
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
                            <v-btn color="primary" :disabled="!valid" class="mr-4" @click="validate">Validate</v-btn>
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
                            <v-btn color="primary" :disabled="!valid" class="mr-4" @click="update">Update</v-btn>
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
              this.$router.push('/clients')
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
      deleteClient: function(id) {
          //console.log(id)
          firebase.database().ref('clients').child(id).remove()
            .then(function() {
                //this.$router.replace('clients')
                console.log("Remove succeeded.")
            })
            .catch(function(error) {
                console.log("Remove failed: " + error.message)
            });
      }
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
                //console.log(snapshot.key)
                //this.tablo = Object.entries(snapshot.val())
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