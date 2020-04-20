<template>
    <Navigation>
        <v-container  fluid tag="section">
            <v-card class="px-5 py-3 mt-5">
                <div class="d-flex grow flex-wrap">
                    <v-card class="v-card-material-table px-5 py-5" color="primary" dark>
                        <v-icon>mdi-clipboard-text</v-icon>
                    </v-card>
                    <v-card-title class="align-start px-5 py-0">List of projects</v-card-title>
                    <v-spacer />
                    <v-btn right color="primary" dark  @click="dialog = !dialog">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </div>
                <v-simple-table dense>
                    <thead>
                        <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Echéance</th>
                        <th class="text-left">Client</th>
                        <th class="text-left">Statut</th>
                        <th class="text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in tablo" :key="i" :lat-lng="item">
                            <td class="text-left">{{ item.name }}</td>
                            <td class="text-left">{{ item.echeance }}</td>
                            <td class="text-left">{{ item.client }}</td>
                            <td class="text-left">{{ item.statut }}</td>
                            <td class="text-left">
                                <v-btn class="ma-4" @click="editProject(item, item.id)">Edit</v-btn>
                                <v-btn class="ma-4" @click="() => deleteProject(item.id)">Delete</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-card>
            <v-dialog v-model="dialog" width="800px">
                <v-card>
                    <v-card-title class="primary">
                    Create project
                    </v-card-title>
                    <v-container>
                        <v-form ref="form" v-model="valid">

                            <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>

                            <v-text-field v-model="echeance" label="Echéance" required></v-text-field>

                            <v-text-field v-model="client"  label="Client" required></v-text-field>
                            
                            <v-text-field v-model="statut"  label="Statut" required></v-text-field>
                            
                            <v-btn class="mr-4" @click="reset">Reset</v-btn>
                            <v-btn color="primary" :disabled="!valid" class="mr-4" @click="validate">Validate</v-btn>
                        </v-form>
                    </v-container>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogEdit" width="800px">
                <v-card>
                    <v-card-title class="primary">
                    Edit project
                    </v-card-title>
                    <v-container>
                        <v-form ref="form" v-model="valid">
                            <v-text-field v-model="name" :counter="10" :rules="nameRules" label="Name" required></v-text-field>

                            <v-text-field v-model="echeance" label="Echéance" required></v-text-field>

                            <v-text-field v-model="client"  label="Client" required></v-text-field>
                            
                            <v-text-field v-model="statut"  label="Statut" required></v-text-field>
                            
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
  name: 'Projects',
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
        echeance: '',
        client: '',
        statut: '',
        user: false,
  }),
  methods: {
      validate: function () {
          let entry = {
            name: this.name,
            user: this.user.uid,
            echeance: this.echeance,
            client: this.client,
            statut: this.statut,
          }
          firebase.database().ref('projects').push(entry, (error) => {
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
            echeance: this.echeance,
            client: this.client,
            statut: this.statut,
          }
          firebase.database().ref('projects/'+ this.id).update(entry, (error) => {
            if (error) {
              alert('Oops. ' + error.message)
            } else {
              //this.$router.push('/projects')
            }
          });
      },
      editProject: function(index, id) {
          this.dialogEdit = !this.dialogEdit;
          this.editedPid = index;

          this.name = this.editedPid.name;
          this.client = this.editedPid.client;
          this.echeance = this.editedPid.echeance;
          this.statut = this.editedPid.statut;
          this.id = id;
      },
      deleteProject: function(id) {
          //console.log(id)
          firebase.database().ref('projects').child(id).remove()
            .then(function() {
                //this.$router.replace('projects')
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
        firebase.database().ref("projects/").orderByChild("user").equalTo(this.user.uid).on("value", snapshot => {
            if (snapshot.val() !== null){
                //console.log(snapshot.key)
                //this.tablo = Object.entries(snapshot.val())
                for(let [projectId, project] of Object.entries(snapshot.val())) {
                    this.tablo.push({
                        "id": projectId,
                        "echeance": project.echeance,
                        "client": project.client,
                        "name": project.name,
                        "statut": project.statut,
                        "user": project.user
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