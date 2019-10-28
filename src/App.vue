<template>
  <v-app>
    <div id="lounge-app">
      <v-snackbar
        v-model="newVersionAvailable"
        :bottom="true"
        :right="true"
        :timeout="0"
      >A new version of the site is available
        <v-btn color="pink" flat @click="forceRefresh">Update</v-btn>
      </v-snackbar>
      <router-view/>
    </div>
  </v-app>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      newVersionAvailable: false,
      newVersion: null,
      appVersionInterval: null
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.appVersionInterval) {
      clearInterval(this.appVersionInterval)
    }
    next()
  },
  mounted() {
    this.checkAppVersion()
  },
  methods: {
    async checkAppVersion() {
      try {
        const response = await fetch('/manifest.json')
        const json = await response.json()
        if (!response.ok) {
          throw new Error('Failed to Fetch')
        }
        this.newVersion = json.buildTime
        const currentVersion = window.$version
        const current = moment(currentVersion)
        const newVersion = moment(json.buildTime)
        if (current.isValid() && current.isBefore(newVersion)) {
          this.newVersionAvailable = true
          clearInterval(this.appVersionInterval)
        } else {
          this.appVersionInterval = setTimeout(this.checkAppVersion, 1800000) // Check for the app version every 30 minutes
        }
      } catch (error) {
        this.$sentry.captureException(error)
      }
    },
    forceRefresh() {
      window.location.reload(true)
    }
  }
}
</script>

<style lang="stylus">
#app {
  font-family: 'TTNorms', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
}

* {
  font-variant-ligatures: none !important;
}
</style>
