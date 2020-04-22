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
                            <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                    v-model="computedEcheanceFormatted"
                                    label="Date de l'échéance"
                                    readonly
                                    v-on="on"
                                    required
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="echeance" no-title @input="menu = false"></v-date-picker>
                            </v-menu>

                            <v-select v-model="client" :items="tabloClient" :rules="[v => !!v || 'Client is required']" label="Client" required>
                            </v-select>

                            <v-select v-model="statut" :items="items" :rules="[v => !!v || 'Statut is required']" label="Statut" required>
                            </v-select>
                            
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

                            <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                    v-model="computedEcheanceFormatted"
                                    label="Date de l'échéance"
                                    readonly
                                    v-on="on"
                                    required
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="echeance" no-title @input="menu = false"></v-date-picker>
                            </v-menu>

                            <v-text-field v-model="client"  label="Client" required></v-text-field>
                            
                            <v-select v-model="statut" :items="items" :rules="[v => !!v || 'Statut is required']" label="Statut" required>
                            </v-select>
                            
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
        tabloClient: [],
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
        items: ['À faire', 'En cours', 'En recette','Livré', 'Terminé'],
        menu: false,
        menu2: false,
  }),
  computed: {
      computedEcheanceFormatted () {
        return this.formatDate(this.echeance)
      },
  },
  methods: {
      formatDate (echeance) {
        if (!echeance) return null

        const [year, month, day] = echeance.split('-')
        return `${day}/${month}/${year}`
      },
      formatEcheance (echeance){
          if (!echeance) return null

        const [day, month, year] = echeance.split('/')
        return `${year}-${month}-${day}`
      },
      validate: function () {
          let entry = {
            name: this.name,
            user: this.user.uid,
            echeance: this.formatDate(this.echeance),
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
            echeance: this.formatDate(this.echeance),
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
          this.echeance = this.formatEcheance(this.editedPid.echeance);
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
        firebase.database().ref("clients/").orderByChild("user").equalTo(this.user.uid).limitToLast(5).on("value", snapshot => {
            if (snapshot.val() !== null){
                for(let project of Object.values(snapshot.val())) {
                    this.tabloClient.push(project.name)
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