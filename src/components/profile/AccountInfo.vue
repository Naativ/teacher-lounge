<template>
  <div class="account-info px-2">
    <h1>Account Information</h1>
    <div>
      <h2>Your Info</h2>
      <v-alert type="success" :value="profile.success">{{profile.success}}</v-alert>
      <v-alert type="error" :value="profile.error">{{profile.error}}</v-alert>
      <v-form ref="profile" @submit.prevent="update('profile')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12 sm6 px-1>
            <v-text-field label="First Name" v-model.trim="profile.firstName" :rules="rules.required" required />
          </v-flex>
          <v-flex xs12 sm6 px-1>
            <v-text-field label="Last Name" v-model.trim="profile.lastName" :rules="rules.required" required />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Display Name" v-model.trim="profile.displayName" :rules="rules.required" required />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Birth Date" v-model.trim="profile.birthdate" :rules="rules.birthday" placeholder="mm/dd/yyyy" required mask="date" return-masked-value/>
          </v-flex>
          <v-flex xs12>
            <v-select label="Country Of Citizenship" v-model="profile.legalLocaleId" :rules="rules.required" :items="settings.legalLocales" item-text="name" item-value="id" />
          </v-flex>
          <v-flex xs12>
            <v-select label="Timezone" v-model="profile.timezoneId" :rules="rules.required" :items="settings.timezones" item-text="name" item-value="id" />
          </v-flex>
          <v-flex xs12>
            <v-btn
              color="#00d3e6"
              depressed
              round
              large
              class="text-capitalize white--text font-weight-black"
              type="submit" :loading="profile.loading"
              >Update Info
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
      <v-divider class="my-5"/>
      <h2>Your Shareable Profile Link</h2>
      <p v-if="incompleteProfile">Please make sure your profile is complete before you create your profile link.</p>
      <v-alert type="success" :value="link.success">{{link.success}}</v-alert>
      <v-alert type="error" :value="link.error">{{link.error}}</v-alert>
      <v-form ref="link" @submit.prevent="update('link')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
            label="Profile Link"
            @keyup="slugChanged"
            :rules="rules.slug"
            v-model="formatedSlug"
            :hint="`https://www.naativ.com/teacher/${formatedSlug}`" persistent-hint
            :error-messages="slugErrors"
            :disabled="disabledSlug || incompleteProfile"
            counter="20" maxLength="20"/>
          </v-flex>
          <v-flex xs12>
            <v-btn color="#00d3e6" depressed round large class="text-capitalize white--text font-weight-black" type="submit" :loading="link.loading"
            :disabled="!this.slugIsUnique || disabledSlug">
            Update Profile Link
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
      <v-divider class="my-5"/>
      <h2>Your Phone Number</h2>
      <v-alert type="success" :value="phoneNumber.success">{{phoneNumber.success}}</v-alert>
      <v-alert type="error" :value="phoneNumber.error">{{phoneNumber.error}}</v-alert>
      <v-form ref="phoneNumber" @submit.prevent="update('phoneNumber')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field label="Phone Number" v-model.trim="phoneNumber.phoneNumber" :rules="rules.phone" mask="phone"/>
          </v-flex>
          <v-flex xs12>
            <v-btn color="#00d3e6" depressed round large class="text-capitalize white--text font-weight-black" type="submit" :loading="phoneNumber.loading" >
              Update Phone
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>

      <v-divider class="my-5"/>
      <h2>Your Address</h2>
      <v-alert type="success" :value="address.success">{{address.success}}</v-alert>
      <v-alert type="error" :value="address.error">{{address.error}}</v-alert>
      <v-form  ref="address" @submit.prevent="update('address')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field label="Street 1" v-model.trim="address.street" :rules="rules.required" />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Street 2" v-model.trim="address.street2" />
          </v-flex>
          <v-flex xs12 sm4 px-1>
            <v-text-field label="City" v-model.trim="address.city" :rules="rules.required"/>
          </v-flex>
          <v-flex xs12 sm4 px-1>
            <v-text-field label="State" v-model.trim="address.province" :rules="rules.required" />
          </v-flex>
          <v-flex xs12 sm4 px-1>
            <v-text-field label="Zip" v-model.trim="address.postalCode" :rules="rules.required" />
          </v-flex>
          <v-flex xs12>
            <v-btn color="#00d3e6" depressed round large class="text-capitalize white--text font-weight-black" type="submit" :loading="address.loading" >
              Update Address
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
      <v-divider class="my-5"/>
      <h2>Your Email</h2>
      <v-alert type="success" :value="username.success">{{username.success}}</v-alert>
      <v-alert type="error" :value="username.error">{{username.error}}</v-alert>
      <v-form  ref="username" @submit.prevent="update('username')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field label="Email" v-model.trim="username.email" :rules="rules.email" />
          </v-flex>
          <v-flex xs12>
            <v-btn color="#00d3e6" depressed round large class="text-capitalize white--text font-weight-black" type="submit" :loading="username.loading" >
              Update Email
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
       <v-divider class="my-5"/>
      <h2>Your Password</h2>
      <v-alert type="success" :value="password.success">{{password.success}}</v-alert>
      <v-alert type="error" :value="password.error">{{password.error}}</v-alert>
      <v-form  ref="password" @submit.prevent="update('password')" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field label="Old Password" v-model="password.oldPassword" type="password" :rules="rules.password" />
          </v-flex>
          <v-flex xs12>
            <v-text-field label="New Password" v-model="password.newPassword" type="password" :rules="rules.password" />
          </v-flex>
          <v-flex xs12>
            <v-btn color="#00d3e6" depressed round large class="text-capitalize white--text font-weight-black" type="submit" :loading="password.loading" >
              Update Password
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
    </div>
  </div>
</template>
<script>
import moment from 'moment'

import { delay } from '@/utils/Helpers.js'
import { rules } from '@/utils/Validation.js'
import { profileMap } from '@/utils/Mutations.js'

import { ADDRESS, PHONE_NUMBER, getMemberSlug, CHECK_SLUG } from '@/graphql/profile/ProfileInfo.gql.js'

import { localeSettings } from '@/graphql/LocaleSettings.gql.js'
import * as AccountGql from '@/graphql/Account.gql.js'

const tenantId = ~~process.env.VUE_APP_TENANT_ID

export default {
  name: 'Profile',
  data() {
    return {
      slugErrors: [],
      slugIsUnique: true,
      disabledSlug: false,
      profile: {
        loading: false,
        success: false,
        error: null,
        firstName: this.$store.state.member.firstName,
        lastName: this.$store.state.member.lastName,
        displayName: this.$store.state.member.displayName,
        birthdate: moment.utc(this.$store.state.member.birthdate).format('MM/DD/YYYY'),
        languageId: this.$store.state.member.languageId,
        legalLocaleId: this.$store.state.member.legalLocaleId,
        timezoneId: this.$store.state.member.timezoneId
      },
      phoneNumber: {
        loading: false,
        success: false,
        error: null,
        id: null,
        phoneNumber: null,
        type: 'CELL'
      },
      address: {
        memberId: this.$store.state.member.id,
        name,
        loading: false,
        success: false,
        error: null,
        id: null,
        street: null,
        street2: null,
        city: null,
        province: null,
        postalCode: null,
        country: 'USA',
        type: 'BILLING'
      },
      username: {
        loading: false,
        success: false,
        error: null,
        email: this.$store.state.member.contactEmail
      },
      password: {
        loading: false,
        success: false,
        error: null,
        oldPassword: null,
        newPassword: null
      },
      link: {
        loading: false,
        sucesss: false,
        disabled: false,
        error: null,
        slug: null
      },
      rules,
      settings: {}
    }
  },
  computed: {
    incompleteProfile() {
      return !this.$store.state.member.tags.find(_ => _ === 'early_access:availability')
    },
    formatedSlug: {
      get() {
        return this.link.slug
      },
      set(value) {
        this.link.slug = value.toLowerCase()
      }
    }
  },
  methods: {
    async slugChanged () {
      if (this.$refs.link.validate()) {
        this.slugIsUnique = false
        const { data: { checkSlug } } = await this.$apollo.query({
          query: CHECK_SLUG,
          variables: {
            input: {
              tenantId,
              slug: this.link.slug
            }
          }
        })
        if (checkSlug && checkSlug.id) {
          this.slugErrors = ['This profile url is already taken.']
        } else {
          this.slugErrors = []
          this.slugIsUnique = true
        }
      } else {
        this.slugErrors = []
      }
    },
    async checkAvailability() {
      const { data: { isUsernameAvailable } } = await this.$apollo.query({
        query: AccountGql.isUsernameAvailable,
        variables: {
          input: { tenantId, username: this.username.email }
        }
      })
      return isUsernameAvailable === false ? 'Email is already taken' : true
    },
    async update(section) {
      if (!this.$refs[section].validate() || !this.slugIsUnique) {
        this[section].error = 'Fix the errors above to update your info'
        await delay(2000)
        this[section].error = null
        return
      }
      try {
        this[section].loading = true
        await profileMap[section](this.$apollo, this[section], this.$store)
        this[section].loading = false
        this[section].success = 'Update Successful'
        if (section === 'link') {
          this.disabledSlug = true
        }
        await delay(3000)
        this[section].success = null
      } catch (e) {
        console.error(e)
        this[section].loading = false
        this[section].error = 'Update Failed'
        await delay(3000)
        this[section].error = null
      }
    }
  },
  apollo: {
    address() {
      return {
        query: ADDRESS,
        variables: {
          input: {
            tenantId: this.$store.state.tenantId,
            memberId: this.$store.state.member.id
          }
        },
        update({ addressByMemberOrTenant }) {
          return { ...this.address, ...addressByMemberOrTenant[0] }
        }
      }
    },
    slug() {
      return {
        query: getMemberSlug,
        variables: {
          id: this.$store.state.member.id,
          priority: 0
        },
        update({ member }) {
          const slug = member.slugs.length > 0 ? member.slugs[0] : {}
          this.link.slug = slug.slug
          if (this.link.slug) {
            this.disabledSlug = true
          }
          return slug
        }
      }
    },
    phoneNumber() {
      return {
        query: PHONE_NUMBER,
        variables: {
          input: { tenantId, memberId: this.$store.state.member.id }
        },
        update({ phoneNumberByMember }) {
          const { id, number: phoneNumber } = phoneNumberByMember[0]
          return { ...this.phoneNumber, id, phoneNumber }
        }
      }
    },
    settings: {
      query: localeSettings,
      update({ allLegalLocales, allTimezones, allLanguages }) {
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
</style>
