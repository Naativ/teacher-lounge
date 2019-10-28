<template>
  <div>
    <v-card class="pa-5" v-if="!lessonOrConversationSet" type="error" :value="error">
      <v-layout row justify-center>
        <img src="@/assets/images/logo-alt.svg" width="30%"/>
      </v-layout>
      <v-layout class="pt-3" justify-space-around align>
        <h2>You can't set availability until you set your preference for Lessons or Conversation.</h2>
      </v-layout>
      <v-layout justify-space-around align>
        <h3>
          <a @click="goToProfile">
            Click here to set your preferences.
          </a>
        </h3>
      </v-layout>
    </v-card>
    <div v-else>
      <h1>Availability Calendar</h1>
      <h2>You are currently setting availability for: </h2>
      <div v-if="member.tags.includes(childLessonTag) || member.tags.includes(adultLessonTag)">
        <v-layout row>
          <h3>Lessons: </h3>
          <p v-if="member.tags.includes(adultLessonTag)">Adult</p>
          <p v-if="member.tags.includes(childLessonTag) && member.tags.includes(adultLessonTag)">&</p>
          <p v-if="member.tags.includes(childLessonTag)">Youth</p>
        </v-layout>
      </div>
      <div v-if="member.tags.includes(childConversationTag) || member.tags.includes(adultConversationTag)">
        <v-layout row>
          <h3>Conversations: </h3>
          <p v-if="member.tags.includes(adultConversationTag)">Adult</p>
          <p v-if="member.tags.includes(adultConversationTag) && member.tags.includes(adultConversationTag)">&</p>
          <p v-if="member.tags.includes(childConversationTag)">Youth</p>
        </v-layout>
      </div>
      <v-autocomplete
          v-model="selectedTimezone"
          :items="settings.timezones"
          color="white"
          item-text="name"
          item-value="name"
          label="Timezone"
          @change="timezoneChanged"
          :filter="fuzzyFilter"
        ></v-autocomplete>
      <Calendar
        :events="availabilities"
        :bookings="bookings"
        :timezone="selectedTimezone"
        @created="onEventCreated"
        @deleted="onEventDeleted"
        @updated="onEventUpdated"
        @range="onRangeUpdated"
      />
      <v-alert class="alert" type="success" :value="success">{{ success }}</v-alert>
      <v-alert class="alert" type="error" :value="error">{{error}}</v-alert>
      <v-snackbar v-model="snackbar" bottom :timeout="0">{{snackbarMessage}}</v-snackbar>
    </div>
  </div>
</template>

<script>
import { delay } from '@/utils/Helpers.js'
import moment from 'moment-timezone'
import { mapActions, mapGetters } from 'vuex'
import { localeSettings } from '@/graphql/LocaleSettings.gql.js'
import Calendar from '@/components/Calendar'
import { Actions } from '@/schedule/ScheduleStore'
import { Actions as BookingActions } from '@/booking/BookingStore.js'

export default {
  name: 'Availability',
  components: { Calendar },
  data() {
    return {
      availabilities: [],
      childLessonTag: 'audience:lesson:child',
      adultLessonTag: 'audience:lesson:adult',
      childConversationTag: 'audience:conversation:child',
      adultConversationTag: 'audience:conversation:adult',
      tags: ['audience:lesson:child', 'audience:lesson:adult', 'audience:conversation:child', 'audience:conversation:adult'],
      bookings: [],
      profileInfo: {
        certified: '',
        welcomeMessage: '',
        interests: '',
        education: '',
        onlineHours: '',
        selectedTeachingTags: [],
        selectedPersonalityTags: [],
        profileAssets: [],
        profilePic: null,
        preferences: {
          child: false,
          adult: false,
          video: false,
          audio: false
        }
      },
      error: null,
      success: null,
      range: {
        start: moment().utc().startOf('week').subtract(1, 'day'), // Because time is just dumb
        end: moment().utc().endOf('week').add(1, 'day')
      },
      snackbar: false,
      snackbarMessage: '',
      settings: {},
      selectedTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  },
  computed: {
    ...mapGetters({
      member: 'member'
    }),
    lessonOrConversationSet() {
      const loadedTags = this.tags.filter(x => this.member.tags.includes(x))
      return loadedTags.length > 0
    }
  },
  methods: {
    ...mapActions({
      getBookings: BookingActions.GET_BOOKINGS
    }),
    goToProfile() {
      this.$router.push(`/lounge/profile`)
    },
    fuzzyFilter(item, queryText, itemText) {
      return itemText.toLowerCase().indexOf(queryText.toLowerCase()) > -1
    },
    async getEvents() {
      this.snackbar = true
      this.snackbarMessage = 'Loading Availability'
      const action = Actions.GET_AVAILABILITY
      const result = await this.$store.dispatch(action, this.range)
      const { data: { availabilities } } = result
      const bookings = await this.getBookings(this.range)
      this.bookings = bookings.map(_ => {
        return { ..._, editable: false, color: '#f382ae', borderColor: '#f382ae', backgroundColor: '#f382ae', startEditable: false, durationEditable: false, resourceEditable: false }
      })
      this.availabilities = availabilities.map(_ => {
        return { ..._, start: moment(_.start), end: moment(_.end) }
      })
      this.snackbar = false
    },
    async upsertEvent(event) {
      const action = Actions.UPSERT_AVAILABILITY
      const _event = { start: event.start.utc(), end: event.end.utc() }
      const result = await this.$store.dispatch(action, _event)
      const { data: { availabilityUpsert } } = result
      return { ...availabilityUpsert, start: moment(availabilityUpsert.start), end: moment(availabilityUpsert.end) }
    },
    parseEvent(e) {
      return {
        end: moment(e.end),
        id: e.id,
        start: moment(e.start)
      }
    },
    parseEvents(availabilities) {
      return availabilities.map(this.parseEvent)
    },
    async onEventCreated(_event) {
      try {
        const event = await this.upsertEvent(this.parseEvent(_event))
        this.availabilities.push(this.parseEvent(event))
        this.success = 'Update Successful!'
        await delay(3000)
        this.success = ''
      } catch (e) {
        this.error = 'Update Failed!'
      }
    },
    async onEventDeleted(event) {
      try {
        const action = Actions.REMOVE_AVAILABILITY
        await this.$store.dispatch(action, this.parseEvent(event))
        await this.getEvents()
        this.success = 'Update Successful!'
        await delay(3000)
        this.success = ''
      } catch (e) {
        this.error = 'Update Failed!'
      }
    },
    async onEventUpdated(event) {
      try {
        const action = Actions.UPSERT_AVAILABILITY
        await this.$store.dispatch(action, this.parseEvent(event))
        await this.getEvents()
        this.success = 'Update Successful!'
        await delay(3000)
        this.success = ''
      } catch (e) {
        this.error = 'Update Failed!'
      }
    },
    async onRangeUpdated(range) {
      try {
        this.range.end = moment(range.end).add(1, 'day') // Because time is just dumb
        this.range.start = moment(range.start).subtract(1, 'day')
        await this.getEvents()
      } catch (e) {
        this.error = 'Update Failed!'
      }
    },
    timezoneChanged(timezone) {
      this.availabilities = this.availabilities.map(_ => {
        return {
          ..._,
          start: moment(_.start).tz(this.selectedTimezone),
          end: moment(_.end).tz(this.selectedTimezone)
        }
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    moment.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone)
    next()
  },
  apollo: {
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
.alert
  position fixed
  top 40px
  width 80%
  z-index 1
p
  margin-bottom: 0px
  padding-left: 5px
  font-size: 1.17em
</style>
