import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false;

let app = '';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsX6P5238gt7b_pP-IxMu7AmC0cXoIcrw",
  authDomain: "dashboard-monitoring-58b33.firebaseapp.com",
  databaseURL: "https://dashboard-monitoring-58b33.firebaseio.com",
  projectId: "dashboard-monitoring-58b33",
  storageBucket: "dashboard-monitoring-58b33.appspot.com",
  messagingSenderId: "945931700919",
  appId: "1:945931700919:web:a7e12949af55558a909b32",
  measurementId: "G-LEGDP1GLT7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

firebase.auth().onAuthStateChanged(function() {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }
});