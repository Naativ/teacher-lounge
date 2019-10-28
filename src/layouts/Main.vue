<template>
  <div id="main-layout">
    <v-navigation-drawer v-model="drawer" id="nav" app clipped width="200" mobile-break-point>
      <v-list>
        <v-list-tile color="white" :to="{ name: 'TeacherLounge' }" active-class="active">
          <v-list-tile-content>
            <v-list-tile-title class="text-lg-right">Teacher's Lounge</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile color="white" :to="{ name: 'Announcements' }" active-class="active">
          <v-list-tile-content>
            <v-list-tile-title class="text-lg-right">Announcements</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          color="white"
          v-if="hasTag('interviewer')"
          :to="{ name: 'Interviews'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="text-lg-right">Interviews</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          color="white"
          v-if="hasTag('teacher') && !flags.disabled.library"
          :to="{ name: 'Library'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="text-lg-right">Library</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          color="white"
          v-if="hasTag('teacher')"
          :to="{ name: 'Curriculum'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="text-lg-right">Curriculum</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          color="white"
          v-if="hasTag('teacher')"
          :to="{ name: 'PlannerDashboard'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="text-lg-right">Planner</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          color="white"
          v-if="hasTag('teacher') && !flags.disabled.availability"
          :to="{ name: 'Availability'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="text-lg-right">Availability</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="hasTag('teacher') && !flags.disabled.profile"
          color="white"
          :to="{ name: 'Profile'}"
          active-class="active"
        >
          <v-list-tile-content>
            <v-list-tile-title class="text-lg-right">Profile</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="toolbar" color="#fcba00" app dense fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/">
          <img class="logo" src="../assets/images/logo.svg" alt="Naativ Logo">
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="$store.state.member">
        <v-btn data-cy="Logout" flat @click="logout">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content app>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>
    <v-snackbar v-model="loadingPrincipal" bottom>Loading New Data</v-snackbar>
  </div>
</template>

<script>
import { Mutations, Actions } from '@/store'
import { getPrincipal } from '@/graphql/Account.gql.js'
import featureFlags from '@/utils/FeatureFlags'

export default {
  name: 'MainLayout',
  data() {
    return {
      drawer: null,
      flags: featureFlags,
      loadingPrincipal: true
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch(Actions.LOGOUT)
      // We need to force the page refresh on logout
      window.location = '/'
    },
    hasTag(tag) {
      const tags = this.$store.state.member.tags || []
      return tags.indexOf(tag) > -1
    }
  },
  apollo: {
    principal: {
      query: getPrincipal,
      async update({ getPrincipal }) {
        this.$sentry.configureScope((scope) => {
          scope.setUser({
            'id': getPrincipal.member.id,
            'username': `${getPrincipal.displayName}(${getPrincipal.member.mrn})`,
            'email': getPrincipal.username
          })
          scope.setTag({ 'version': window.$version })
        })
        this.$store.commit(Mutations.SET_MEMBER, getPrincipal.member)
        this.loadingPrincipal = false
      }
    }
  }
}
</script>
<style lang="stylus">
#main-layout {
  padding-bottom: 50px;

  .toolbar {
    z-index: 100;
  }

  .logo {
    height: 30px;
    margin-top: 10px;
  }

  #nav {
    background-color: #00d3e6;
    transform: translateY(-75px);

    .active {
      color: #000000;
      border-bottom: 1px solid #000000;
    }
  }
}
</style>
