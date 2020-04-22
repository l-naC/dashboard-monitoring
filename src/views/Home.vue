<template>
    <Navigation>
        <div class="container">
          <v-row no-gutters>
            <v-col >
              <v-card class="pa-2 ma-2">
                <div class="d-flex grow flex-wrap">
                    <v-card class="v-card-material-table px-5 py-5" color="primary" dark>
                        <v-icon>mdi-clipboard-text</v-icon>
                    </v-card>
                    <v-card-title class="align-start px-5 py-0">List of 5 last projects</v-card-title>
                    <v-spacer />
                </div>
                <v-data-table dense :headers="headers" :items="tabloProject" item-key="name" class="elevation-1">
                    <template v-slot:item.statut="{ item }">
                        <v-chip :color="getColor(item.statut)" dark>{{ item.statut }}</v-chip>
                    </template>
                </v-data-table>
              </v-card>
            </v-col>
            <v-col >
              <v-card class="pa-2 ma-2">
                <div class="d-flex grow flex-wrap">
                    <v-card class="v-card-material-table px-5 py-5" color="primary" dark>
                        <v-icon>mdi-account-supervisor</v-icon>
                    </v-card>
                    <v-card-title class="align-start px-5 py-0">List of 5 last clients</v-card-title>
                    <v-spacer />
                </div>
                <v-simple-table dense>
                    <thead>
                        <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in tabloClient" :key="i" :lat-lng="item">
                            <td class="text-left">{{ item.name }}</td>
                            <td class="text-left">{{ item.email }}</td>
                        </tr>
                    </tbody>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>
        </div>
    </Navigation>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import firebase from 'firebase';

export default {
  name: 'Home',
  components: {
    Navigation
  },
  data: () => ({
    tabloClient: [],
    tabloProject: [],
    user: false,
    headers: [
            { text: 'Name', value: 'name',},
            { text: 'Echeance', value: 'echeance' },
            { text: 'Statut', value: 'statut' }
        ],
  }),
  methods: {
    getColor: function(statut) {
      if (statut == "À faire") return 'red'
      else if (statut == "En cours") return 'orange'
      else if (statut == "En recette") return 'blue'
      else if (statut == "Livré") return 'purple'
      else return 'green'
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
        firebase.database().ref("projects/").orderByChild("user").equalTo(this.user.uid).limitToLast(5).on("value", snapshot => {
            if (snapshot.val() !== null){
                //console.log(snapshot.key)
                this.tabloProject = Object.values(snapshot.val())
            }
        });
        firebase.database().ref("clients/").orderByChild("user").equalTo(this.user.uid).limitToLast(5).on("value", snapshot => {
            if (snapshot.val() !== null){
                //console.log(snapshot.key)
                this.tabloClient = Object.values(snapshot.val())
            }
        });
      });
  }
}
</script>
