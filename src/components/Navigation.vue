<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
          <v-list-item v-for="item in items" :key="item.message" :to="item.link" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content >
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="ml-0 pl-4">
        <span class="hidden-sm-and-down">Dashboard Monitoring</span>
      </v-toolbar-title>
      <v-spacer />
      <router-link to="home">
        <v-btn icon>
            <v-icon>mdi-apps</v-icon>
        </v-btn>
      </router-link>
      <router-link to="profil">
        <v-btn icon>
            <v-icon>mdi-account</v-icon>
        </v-btn>
      </router-link>
    </v-app-bar>
    <v-content>
        <slot></slot>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
      items: [
        { icon: 'mdi-contacts', text: 'Clients', link: 'clients' },
        { icon: 'mdi-content-copy', text: 'Projects', link:'projects' },
      ],
    }),
  }
</script>
