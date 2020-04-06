<template>
  <div class="home">
    <Navigation>
        <div class="container">
            <v-btn color="primary" @click="logout">Logout</v-btn>
        </div>
    </Navigation>
  </div>
</template>

<script>
import firebase from 'firebase';

import Navigation from '@/components/Navigation.vue'

export default {
  name: 'Profil',
  components: {
    Navigation
  },
  methods: {
      logout: function() {
        firebase.auth().signOut().then(() => {
            this.$router.replace('login')
        });
      }
  }
}
</script>
