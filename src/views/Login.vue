<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field label="Login" name="login" type="text" v-model="email" placeholder="Email"/>
                  <v-text-field id="password" label="Password" name="password" type="password" v-model="password" placeholder="Password"/>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="login">Login</v-btn>
              </v-card-actions>
              <p>You don't have an account ? You can <router-link to="/sign-up"> create one</router-link></p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'login',
  data() {
      return {
          email: '',
          password: ''
      }
  },
  methods: {
      login: function() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(() =>{
            this.$router.replace('home')
        }).catch(function(error) {
            alert('Oops. ' + error.message)
        });
      }
  }
}
</script>

<style scoped>
   
</style>
