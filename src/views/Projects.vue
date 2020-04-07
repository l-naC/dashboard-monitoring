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
                        <th class="text-left">Client</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items" :key="item.name">
                        <td>{{ item.name }}</td>
                        <td>{{ item.clients }}</td>
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
                    <v-row class="mx-2">
                        <v-col class="align-center justify-space-between" cols="12">
                            <v-text-field prepend-icon="mdi-text" placeholder="Name"/>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field prepend-icon="mdi-account" placeholder="Responsable"/>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field prepend-icon="mdi-account" placeholder="Client"/>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field prepend-icon="mdi-text" placeholder="Description"/>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field prepend-icon="mdi-mail" placeholder="Email"/>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field type="tel" prepend-icon="mdi-phone" placeholder="(000) 000 - 0000"/>
                        </v-col>
                    </v-row>
                    </v-container>
                    <v-card-actions>
                    <v-spacer />
                    <v-btn text color="primary" @click="dialog = false">Cancel</v-btn>
                    <v-btn text @click="dialog = false">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </Navigation>
</template>

<script>
import Navigation from '@/components/Navigation.vue'

export default {
  name: 'Projects',
  components: {
    Navigation
  },
  data: () => ({
      dialog: false,
  }),
  methods: {
      
  }
}
</script>

<style scoped>
    .v-card-material-table{
        position: relative;
        top: -30px;
    }
</style>