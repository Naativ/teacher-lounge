<template>
  <v-content>
    <NaativHeader :alt="true"/>
    <v-container class="register">
      <div>
        <v-alert
          type="success"
          :value="success">You've registered!</v-alert>
        <v-alert
          type="error"
          :value="errors.length > 0">
          <ul>
            <li
              v-for="error in errors"
              :key="error.message">{{ error.message || error }}</li>
          </ul>
        </v-alert>
          <v-alert type="error" :value="true" v-if="!$browser.supported">
            {{ $browser.invalidMessage }}
          </v-alert>
          <v-alert type="error" :value="true" v-if="!hasLocalStorage">
            Cookies are required to complete registration. Please enable cookies in your browser settings
          </v-alert>
        <h2>Sign up for Naativ</h2>
        <v-form
          class="registration"
          ref="registration"
          @submit.prevent="createAccount"
          lazy-validation>
          <div class="yellow-bubble"/>
          <v-layout row wrap>
            <v-flex xs12 sm6 px-1>
              <v-text-field
                data-cy="First Name"
                label="First Name"
                v-model.trim="applicant.firstName"
                :rules="rules.required"
                required
                :disabled="!hasLocalStorage"
              />
            </v-flex>
            <v-flex xs12 sm6 px-1>
              <v-text-field
                data-cy="Last Name"
                label="Last Name"
                v-model.trim="applicant.lastName"
                :rules="rules.required"
                required
                :disabled="!hasLocalStorage"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                data-cy="Email"
                label="Email"
                v-model.trim="applicant.email"
                :rules="rules.email"
                :error-messages="usernameErrors"
                @change="checkAvailability()"
                :disabled="!hasLocalStorage"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                data-cy="Password"
                name="Password"
                label="Enter your password"
                hint="At least 8 characters"
                v-model="applicant.password"
                min="8"
                :rules="rules.password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                @click:append="showPassword = !showPassword"
                counter
                :disabled="!hasLocalStorage"
              />
            </v-flex>
            <v-flex xs12 sm4 px-1>
              <v-text-field
                data-cy="Birth Date"
                label="Birth Date"
                v-model.trim="applicant.birthday"
                :rules="rules.birthday"
                placeholder="mm/dd/yyyy"
                mask="##/##/####"
                return-masked-value
                required
                :disabled="!hasLocalStorage"
              />
            </v-flex>
            <v-flex xs12 sm8 px-1>
              <v-text-field
                data-cy="Phone"
                label="Phone Number"
                v-model.trim="applicant.phoneNumber.phoneNumber"
                mask="phone"
                :rules="rules.phone"
                :disabled="!hasLocalStorage"
              />
            </v-flex>
            <v-flex xs12>
            <v-text-field
              data-cy="Street1"
              label="Street 1"
              v-model.trim="applicant.address.street"
              :rules="rules.required"
              :disabled="!hasLocalStorage"
            />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                data-cy="Street2"
                label="Street 2"
                v-model.trim="applicant.address.street2"
                :disabled="!hasLocalStorage"/>
            </v-flex>
            <v-flex xs12 sm4 px-1>
              <v-text-field
                data-cy="City"
                label="City"
                v-model.trim="applicant.address.city"
                :rules="rules.required"
                :disabled="!hasLocalStorage"/>
            </v-flex>
            <v-flex xs12 sm4 px-1>
              <v-text-field
                data-cy="State"
                label="State/Province"
                v-model.trim="applicant.address.province"
                :rules="rules.required"
                :disabled="!hasLocalStorage"
              />
            </v-flex>
            <v-flex xs12 sm4 px-1>
              <v-text-field
                data-cy="Zip"
                label="Zip/Postal Code"
                v-model.trim="applicant.address.postalCode"
                :rules="rules.required"
                :disabled="!hasLocalStorage"
              />
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="applicant.address.country"
                label="Country"
                :rules="rules.required"
                :items="availableCountries"
                item-text="name"
                item-value="code"
                :disabled="!hasLocalStorage"
              />
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="applicant.legalLocaleId"
                label="Country of Citizenship"
                persistent-hint
                hint="This is used for data residency and information privacy purposes only."
                :rules="rules.required"
                :items="settings.legalLocales"
                item-text="name"
                item-value="id"
                :disabled="!hasLocalStorage"
              />
            </v-flex>
            <v-flex xs12>
              <v-checkbox type="checbox" v-model="accepted" :rules="rules.required" color="#00d3e4"
              :disabled="!hasLocalStorage">
                <div slot="label">
                  I agree to the terms in the <a target="_blank" href="/naativ-independent-contractor-agreement.pdf">Independent Contractor Agreement</a>
                </div>
              </v-checkbox>
            </v-flex>
            <v-flex xs12>
              <v-checkbox type="checkbox" v-model="acceptedPP" :rules="rules.required" color="#00d3e4" :disabled="!hasLocalStorage">
                <div slot="label">
                  I agree to all the <a target="_blank" href="/naativ-policies-and-procedures.pdf">Policies and Procedures</a>
                </div>
              </v-checkbox>
            </v-flex>
            <v-flex xs12>
              <v-btn
                data-cy="Create Account"
                color="#00d3e6"
                depressed
                round
                large
                class="text-capitalize white--text font-weight-black"
                type="submit"
                :loading="loading"
                :disabled="!hasLocalStorage"
              >Create Account</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
        <div class="centered">

        </div>
      </div>
    </v-container>
  </v-content>
</template>
<script>
import { rules } from '@/utils/Validation.js'
import NaativHeader from '@/components/Header.vue'
import { Mutations, Actions } from '@/store'

import * as AccountGql from '@/graphql/Account.gql.js'
import { localeSettings } from '@/graphql/LocaleSettings.gql.js'

const tenantId = ~~process.env.VUE_APP_TENANT_ID

export default {
  name: 'Registration',
  components: {
    NaativHeader
  },
  data() {
    return {
      availableCountries: [],
      showPassword: false,
      loading: false,
      disabled: false,
      success: false,
      errors: [],
      usernameErrors: [],
      checkingUsername: false,
      accepted: false,
      acceptedPP: false,
      applicant: {
        password: null,
        firstName: null,
        lastName: null,
        email: null,
        birthday: null,
        languageId: 1,
        legalLocaleId: 235,
        phoneNumber: {
          phoneNumber: null,
          type: 'CELL'
        },
        address: {
          street: null,
          street2: null,
          city: null,
          province: null,
          postalCode: null,
          country: 'USA',
          type: 'BILLING'
        },
        tags: ['registrant']
      },
      hasLocalStorage: false,
      rules,
      settings: {}
    }
  },
  methods: {
    async createAccount() {
      this.errors = []

      if (this.$refs.registration.validate()) {
        this.success = false
        this.loading = true

        // Find Timezone
        const [timezone] = this.settings.timezones.filter(
          _ => _.name === Intl.DateTimeFormat().resolvedOptions().timeZone
        )
        const name = `${this.applicant.firstName} ${this.applicant.lastName}`
        this.applicant.address.name = name
        const member = {
          ...this.applicant,
          birthday: this.$moment(this.applicant.birthday, 'MM/DD/YYYY').format('YYYY-MM-DD'),
          tenantId,
          displayName: name,
          name,
          slug: name.replace(' ', ''),
          timezoneId: timezone.id,
          typeId: 1002
        }
        try {
          const {
            data: { register }
          } = await this.$apollo.mutate({
            mutation: AccountGql.registerMember,
            variables: { member }
          })
          this.$store.commit(Mutations.SET_JWT, register.token)
          await this.$store.dispatch(Actions.GENERATE_TOKEN, {
            type: 'claim'
          })
          this.success = true
          this.loading = false
          this.$router.push('/lounge/dashboard')
        } catch (e) {
          this.success = false
          this.loading = false
          // this.errors.push(e)
          // TODO: This is just a band aid until we get schema stitching errors working
          this.errors.push('Oops! There was an error in your registration. Please review your data and try again.')
        }
      }
    },
    async checkAvailability() {
      this.checkingUsername = true
      const { data: { isUsernameAvailable } } = await this.$apollo.query({
        query: AccountGql.isUsernameAvailable,
        variables: {
          input: { tenantId, username: this.applicant.email }
        }
      })

      this.usernameErrors = isUsernameAvailable === false
        ? ['Email is already taken']
        : []
      this.checkingUsername = false
    },
    checkLocalStorage() {
      try {
        this.hasLocalStorage = !!window.localStorage
      } catch (error) {
        console.error({ error })
        this.hasLocalStorage = false
      }
    }
  },
  mounted() {
    this.checkLocalStorage()
  },
  apollo: {
    settings: {
      query: localeSettings,
      update({ allLegalLocales, allTimezones, allLanguages }) {
        this.availableCountries = allLegalLocales.nodes.filter(_ => ['USA', 'CAN'].indexOf(_.code) > -1)
        return {
          legalLocales: allLegalLocales.nodes,
          timezones: allTimezones.nodes,
          languages: allLanguages.nodes
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.register {
  padding-top: 85px;
  max-width: 850px;
  margin: auto;
}

.registration {
  background-color: #ffffff;
  padding: 10px;
  position: relative;
}

.yellow-bubble {
  position: absolute;
  z-index: 100;
  width: 130px;
  height: 79px;
  background-image: url('../assets/images/yellow-bubble.png');
  animation: yellowmotion 12s ease-in-out infinite;
  right: -25px;
}

@keyframes yellowmotion {
  0% {
    bottom: -5px;
  }

  50% {
    bottom: -25px;
  }

  100% {
    bottom: -5px;
  }
}
</style>
