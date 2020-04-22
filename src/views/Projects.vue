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
                <v-data-table dense :headers="headers" :items="tablo" item-key="name" class="elevation-1">
                    <template v-slot:item.actions="{ item }">
                        <v-icon small class="mr-2" @click="editProject(item, item.id)">
                            mdi-pencil
                        </v-icon>
                        <v-icon small @click="deleteProject(item.id)">
                            mdi-delete
                        </v-icon>
                    </template>
                </v-data-table>
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
                            <v-btn color="primary" :disabled="!valid" class="mr-4" @click="validate" type="submit" @submit.prevent="submit">Validate</v-btn>
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

                            <v-select v-model="client" :items="tabloClient" :rules="[v => !!v || 'Client is required']" label="Client" required>
                            </v-select>
                            
                            <v-select v-model="statut" :items="items" :rules="[v => !!v || 'Statut is required']" label="Statut" required>
                            </v-select>
                            
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
  name: 'Projects',
  components: {
    Navigation
  },
  data: () => ({
        headers: [
            { text: 'Name', value: 'name',},
            { text: 'Echeance', value: 'echeance' },
            { text: 'Statut', value: 'statut' },
            { text: 'Client', value: 'client' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
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
              //this.$router.push(location)
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
        if (confirm('Are you sure you want to delete this project ?') ) {
            firebase.database().ref('projects').child(id).remove()
            .then(function() {
                console.log("Remove succeeded.")
            })
            .catch(function(error) {
                console.log("Remove failed: " + error.message)
            });
        }
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