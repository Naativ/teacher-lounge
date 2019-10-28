<template>
  <div class="profile">
    <v-tabs centered color="cyan" dark icons-and-text>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#profile">Profile
        <v-icon>portrait</v-icon>
      </v-tab>

      <v-tab href="#account">Account
        <v-icon>subject</v-icon>
      </v-tab>

      <v-tab href="#verification">verification
        <v-icon>person</v-icon>
      </v-tab>

      <v-tab href="#preferences">Preferences
        <v-icon>settings</v-icon>
      </v-tab>

      <v-tab-item value="profile">
        <ProfileInfo />
      </v-tab-item>

      <v-tab-item value="account">
        <AccountInfo />
      </v-tab-item>

      <v-tab-item value="verification">
        <Certificates />
      </v-tab-item>

      <v-tab-item value="preferences">
        <Preferences />
      </v-tab-item>

    </v-tabs>
  </div>
</template>
<script>
import AccountInfo from '@/components/profile/AccountInfo.vue'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import Certificates from '@/components/profile/Certificates.vue'
import Preferences from '@/components/profile/Preferences.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  components: {
    AccountInfo,
    ProfileInfo,
    Certificates,
    Preferences
  },
  computed: {
    ...mapGetters({
      member: 'member'
    })
  }
}
</script>
<style lang="stylus" scoped>
.profile
  margin -24px
</style>
