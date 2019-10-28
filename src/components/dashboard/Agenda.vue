<template>
  <v-card>
    <v-card-title class="text-xs-center">
      <h3 v-if="!loading && !bookings.length">
        You have no upcoming appointments
      </h3>
      <h3 v-else>Upcoming Appointments</h3>
    </v-card-title>
    <v-card-text>
      <v-layout v-if="loading" row justify-center>
        <v-progress-circular indeterminate size="64"/>
      </v-layout>
      <v-list three-line v-if="!loading && bookings.length">
        <template v-for="(booking, index) in bookings" >
          <v-list-tile :key="index">
            <v-list-tile-avatar>
              <v-icon v-if="!booking.profile.avatarUrl" x-large>account_circle</v-icon>
              <img
                v-if="booking.profile.avatarUrl"
                :src="booking.profile.avatarUrl"
              />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{booking.profile.displayName}}</v-list-tile-title>
              <v-list-tile-sub-title>
                {{
                  `${getStartTime(booking.start)} - ${getEndTime(booking.end)}`
                }}
              </v-list-tile-sub-title>
              <v-chip :class="convertBookingName(booking.type.name)" class="chip">
                  {{ convertBookingName(booking.type.name) }}
                </v-chip>
            </v-list-tile-content>
            <v-list-tile-action-text>
              <CountdownTimer :countdownTo="booking.start" :threshold="canJoin(booking) ? 0 : 900000" @thresholdHit="thresholdHit"/>
              <v-btn v-if="canJoin(booking)" small @click="join(booking)">Enter Class</v-btn>
            </v-list-tile-action-text>
          </v-list-tile>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment'
import CountdownTimer from '@/components/CountdownTimer.vue'

import { getAsset } from '@/utils/AssetService'
import { GET_PROFILES } from '@/graphql/Member.gql.js'
import { Actions } from '@/booking/BookingStore.js'

import { mapGetters } from 'vuex'

export default {
  name: 'DashboardAgenda',
  components: {
    CountdownTimer
  },
  data() {
    return {
      bookings: [],
      getAsset,
      loading: false,
      range: {
        start: moment().utc().subtract(30, 'minutes'),
        end: moment().utc().add(1, 'weeks')
      }
    }
  },
  mounted() {
    this.getBookings()
  },
  computed: {
    ...mapGetters({
      member: 'member'
    })
  },
  methods: {
    thresholdHit() {
      this.$forceUpdate()
    },
    async getBookings() {
      this.loading = true
      const action = Actions.GET_BOOKINGS
      const bookings = await this.$store.dispatch(action, this.range)
      this.bookings = await this.getProfileInfo(bookings)
      this.loading = false
    },
    async getProfileInfo(bookings) {
      const ids = bookings.map(b => b.profileId)
      const { data: { lmsProfiles } } = await this.$apollo.query({
        query: GET_PROFILES,
        variables: { input: { ids } }
      })
      return bookings.map(b => {
        const match = lmsProfiles.results.find(p => p.id === b.profileId)
        return { ...b, profile: { ...match } }
      })
    },
    canJoin(booking) {
      const earliest = moment(booking.start).subtract(24, 'hours')
      const latest = moment(booking.end)
      if (moment().isAfter(earliest) && moment().isBefore(latest)) {
        return true
      }
      return false
    },
    getEndTime(end) { return moment(end).format('h:mm a') },
    getStartTime(start) { return moment(start).format('MM/DD h:mm') },
    join(booking) {
      if (booking.typeId === 1007) {
        this.$router.push(`/conversation/${booking.id}`)
      } else {
        this.$router.push(`/classroom/${booking.id}`)
      }
    },
    convertBookingName(name) {
      if (name === 'Placement Test Token') {
        return 'Assessment'
      } else if (name === 'Classroom') {
        return 'Lesson'
      } else {
        return name
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.chip {
  height: 20px
  color: white!important
}
.Lesson {
  background-color: rgb(4,211,230)!important
}
.Assessment {
  background-color: rgb(219,109,138)!important
}
.Conversation {
  background-color: rgb(252,186,0)!important
}
</style>
