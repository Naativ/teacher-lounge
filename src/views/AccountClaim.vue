<template>
  <v-container>
    <div class="claim">
      <v-alert v-if="error && tokenIsValid" type="error" :value="error">
        Oops! There was an error in your registration. Please review your data and try again.
      </v-alert>
      <v-card v-if="loading" >
        <v-container>
          <h2 class="centered">
            <Loading/>
            <p v-if="!error">Verifying Email Address</p>
            <router-link v-else to="/lounge/dashboard">
              <v-btn
                color="#00d3e6"
                depressed
                round
                large
                class="text-capitalize white--text font-weight-black"
                type="submit"
              >
              Return To Lounge</v-btn>
            </router-link>
          </h2>
        </v-container>
      </v-card>
      <v-card class="pa-5" v-if="!tokenIsValid" type="error" :value="error">
        <v-layout row justify-center>
          <img src="@/assets/images/logo-alt.svg" width="30%"/>
        </v-layout>
        <v-layout class="pt-3" justify-space-around align>
          <h2>The link has expired.
            <a @click="resendClaimEmail">
              Click here to resend verification email.
            </a>
          </h2>
        </v-layout>
      </v-card>
      <h2 v-if="!loading && !error" class="centered">
        Your Email Address has been Verified.
        <br/>Redirecting you back to the lounge.
      </h2>
    </div>
  </v-container>
</template>

<script>
import { delay } from '@/utils/Helpers.js'
import Loading from '@/components/Loading.vue'
import { consumeOneTimeToken } from '@/graphql/Account.gql.js'
import { Actions } from '@/store'

const claimTemplateId = process.env.VUE_APP_CLAIM_TEMPLATE_ID

export default {
  name: 'AccountClaim',
  components: { Loading },
  data() {
    return {
      loading: true,
      tokenIsValid: true,
      error: null
    }
  },
  async mounted() {
    try {
      await this.$apollo.mutate({
        mutation: consumeOneTimeToken,
        variables: {
          claimToken: { token: this.$route.params.token, simpleClaim: true }
        },
        update(store, { data }) { }
      })
      await delay(1000)
      this.loading = false
      await delay(2000)
      this.$router.push({ name: 'TeacherLounge' })
    } catch (e) {
      this.error = e.message
      if (e.message.includes('is not valid')) {
        this.tokenIsValid = false
        this.loading = false
      }
    }
  },
  methods: {
    async resendClaimEmail() {
      try {
        await this.$store.dispatch(Actions.GENERATE_TOKEN, {
          type: 'claim',
          templateId: claimTemplateId
        })
      } catch (e) {
        this.error = e.message || e
      }
    }
  }
}
</script>
