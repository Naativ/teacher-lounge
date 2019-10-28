<template>
  <v-app>
    <v-flex xs12>
      <v-dialog max-width="600px" v-model="show" persistent>
        <v-card>
          <v-card-title class="justify-center" primary-title>
            <div>
              <h3 class=" text-xs-center headline mb-0">Unsupported Browser</h3>
            </div>
          </v-card-title>
            <v-divider></v-divider>
          <v-card-text>
            <div class="text-xs-center invalidBrowser">
              <p>You are currently using <strong>{{ browser.name }}</strong> version <strong>{{ browser.version }}</strong> on a <strong>{{ system.name || unspecified }}</strong> operating system.  Please update to the latest version of a supported browser to continue.</p>
            </div>
            <div class="text-xs-left">
              <h3>Supported Browsers:</h3>
              <p>Laptop/Desktop - Latest version of Chrome/Firefox/Safari<br>
              Android - Latest version of Chrome or Firefox<br>
              iOS - Latest version of Safari</p>
            </div>
          </v-card-text>
            <v-divider></v-divider>
          <v-container>
            <v-layout row wrap justify-space-between>
              <v-layout column align-center>
                <a href="https://www.google.com/chrome/">
                  <img src="./assets/images/chrome.png" alt="Chrome" height="100px" width="100px"/>
                </a>
              </v-layout>
              <v-layout column align-center>
                <a href="https://www.mozilla.org/en-US/firefox/new/">
                  <img src="./assets/images/firefox.png" alt="firefox" height="100px" width="100px"/>
                </a>
              </v-layout>
              <v-layout column align-center>
                <a href="https://support.apple.com/en-us/HT201541">
                  <img src="./assets/images/safari.png" alt="safari" height="100px" width="100px"/>
                </a>
              </v-layout>
            </v-layout>
          </v-container>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-app>
</template>

<script>
import bowser from 'bowser'

export default {
  name: 'BrowserAlert',
  data() {
    return {
      show: true
    }
  },
  computed: {
    browser() {
      const browser = bowser.getParser(window.navigator.userAgent)
      return browser.parsedResult.browser
    },
    system() {
      const system = bowser.getParser(window.navigator.userAgent)
      return system.parsedResult.os
    }
  }
}
</script>

<style lang="stylus" scoped>

.invalidBrowser
  font-weight 500em
  color red
  text-align center

</style>
