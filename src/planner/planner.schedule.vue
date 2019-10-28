<template>
  <div class="schedule">
    <h1>Schedule</h1>
    <div>
      <v-layout align-center justify-space-between row fill-height>
        <v-flex xs1>
          <v-btn icon @click="previousMonth">
            <v-icon>chevron_left</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs10 class="centered">
          <p class="headline">
          {{getMonth(start)}}
          </p>
        </v-flex>
        <v-flex xs1>
          <v-btn icon @click="nextMonth">
            <v-icon>chevron_right</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </div>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="bookings"
      hide-actions
      class="elevation-1"
    >
      <template v-slot:no-data>
        <p class="headline centered">
          No classes scheduled for this month
        </p>
      </template>
      <template v-slot:items="props">
        <td>{{ $moment(props.item.start).format('dddd Do h:mm a') }}</td>
        <td>{{ props.item.host.displayName }}</td>
        <td>{{ props.item.profile.displayName }}</td>
        <td :class="bookingStatusClass(props.item)">{{ checkBookingStatus(props.item) }}</td>
        <td>
          <v-btn v-if="canEnter(props.item)" small @click="enterClassroom(props.item)">Enter</v-btn>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import sortBy from 'lodash.sortby'
import { mapActions } from 'vuex'
import Bookings from '@/booking/BookingStore'

export default {
  name: 'Schedule',
  data() {
    return {
      loading: false,
      start: this.$moment().startOf('month'),
      end: this.$moment().endOf('month'),
      bookings: [],
      headers: [
        { text: 'Start', align: 'left', sortable: false },
        { text: 'Teacher', align: 'left', sortable: false },
        { text: 'Student', align: 'left', sortable: false },
        { text: 'Status', align: 'left', sortable: false },
        { text: 'Actions', align: 'left', sortable: false }
      ]
    }
  },
  mounted() {
    this.getSortedBookings()
  },
  methods: {
    ...mapActions({
      searchBookings: Bookings.actions.SEARCH_BOOKINGS
    }),
    async getSortedBookings() {
      this.loading = true
      const bookings = await this.searchBookings({ start: this.start, end: this.end })
      this.bookings = sortBy(bookings, b => new Date(b.start)).reverse()
      this.loading = false
    },
    checkBookingStatus(booking) {
      if (this.canCancel(booking)) {
        return 'Upcoming'
      }
      if (booking.status.key !== 'reserved') {
        return 'Cancelled'
      }
      if (booking.appointments.length > 0 && booking.appointments[0].endTime) {
        return 'Done'
      }
      return 'Abandoned'
    },
    bookingStatusClass(booking) {
      if (booking.statusId !== 200) {
        return 'cancelled'
      }
      if (this.canCancel(booking)) {
        return 'upcoming'
      }
      if (booking.appointments.length > 0 && booking.appointments[0].endTime) {
        return 'done'
      }
      return 'incomplete'
    },
    canEnter(booking) {
      if (booking.statusId !== 200) {
        return false
      }
      return this.$moment().add(24, 'hours').isAfter(this.$moment(booking.start)) && this.canCancel(booking)
    },
    canCancel(booking) {
      if (booking.statusId !== 200) {
        return false
      }
      return this.$moment(booking.start).isAfter(this.$moment())
    },
    enterClassroom(booking) {
      this.$router.push(`/classroom/${booking.id}`)
    },
    previousMonth() {
      this.start = this.$moment(this.start).subtract(1, 'month').startOf('month')
      this.end = this.$moment(this.start).endOf('month')
      this.getSortedBookings()
    },
    nextMonth() {
      this.start = this.$moment(this.start).add(1, 'month').startOf('month')
      this.end = this.$moment(this.start).endOf('month')
      this.getSortedBookings()
    },
    getMonth() {
      return this.$moment(this.start).format('MMMM YYYY')
    }
  }
}
</script>

<style lang="stylus" scoped>
.done
  color: green
.upcoming
  color: blue
.cancelled
  color: red
</style>
