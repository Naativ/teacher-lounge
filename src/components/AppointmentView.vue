<template>
  <div>
    <v-card v-if="this.upcomingAppointments.length > 0">
      <h2>{{title}}</h2>
      <v-card-text>
        <v-progress-circular v-if="$apollo.loading" :size="50" color="primary" indeterminate></v-progress-circular>
      </v-card-text>
      <template v-if="!$apollo.loading">
        <v-list v-for="(value, key) in appointments" :key="key" three-line>
          <v-subheader>Interviewer: {{key}}</v-subheader>
          <v-divider></v-divider>
          <v-list-tile v-for="appt in value" :key="appt.id" @click="showDetail(appt)">
            <v-list-tile-content v-if="host">
              <v-list-tile-title>{{getNames(appt.participants)}}</v-list-tile-title>
              <v-list-tile-sub-title>{{getEmails(appt.participants)}}</v-list-tile-sub-title>
              <v-list-tile-sub-title>Tel: {{getPhones(appt.participants)}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-content v-if="!host">
              <v-list-tile-title>Date: {{formatDateIfSet(appt, 'dddd, MMMM Do YYYY')}}</v-list-tile-title>
              <v-list-tile-sub-title>Time: {{formatDateIfSet(appt, 'hh:mm A')}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-subheader>
              <CountdownTimer :countdownTo="appt.scheduledDate"/>
            </v-subheader>
            <v-list-tile-action>
              <v-btn
                @click="enterAppointment(appt)"
                color="#00d3e6"
                large
                depressed
                class="text-capitalize white--text"
              >Enter</v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </template>
    </v-card>
    <appointment-detail-dialog
      v-if="details.show"
      :visible="details.show"
      :id="details.id"
      :date="details.date"
      :participants="details.participants"
      @close="close"
    />
  </div>
</template>

<script>
import { getAppointments } from '@/graphql/Appointments.gql.js'
import AppointmentDetailDialog from '@/components/AppointmentDetailDialog.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import groupBy from 'lodash.groupby'
import moment from 'moment'

export default {
  name: 'AppointmentView',
  components: {
    AppointmentDetailDialog,
    CountdownTimer
  },
  props: {
    title: String,
    host: Boolean,
    memberId: Number
  },
  mounted() {
    this.$apollo.queries.appointments.refetch()
  },
  data() {
    return {
      details: {
        id: undefined,
        show: false,
        detail: undefined,
        date: new Date().toUTCString(),
        participants: []
      },
      appointments: {},
      upcomingAppointments: []
    }
  },
  methods: {
    close() {
      this.details = {
        show: false,
        id: undefined,
        participants: undefined
      }
      this.$apollo.queries.appointments.refetch()
    },
    showDetail({ id, participants = [], scheduledDate }) {
      if (this.host) {
        this.details = {
          show: true,
          id,
          participants,
          date: scheduledDate
        }
      }
    },
    formatDateIfSet(appt, format) {
      if (moment.utc(appt.scheduledDate).isBefore(appt.createdOn)) {
        return 'To be determined'
      }
      return moment(appt.scheduledDate).format(format)
    },
    getNames: (participants) => {
      return participants.map(p => `${p.displayName}`).join(', ')
    },
    getEmails: (participants) => {
      return participants.map(p => `${p.contactEmail}`).join(', ')
    },
    getPhones: (participants) => {
      return participants.map(p => `${p.phoneNumbers[0].number}`).join(', ')
    },
    enterAppointment(appt) {
      this.$router.push(`/interview/${appt.id}`)
    }
  },
  apollo: {
    appointments: {
      query: getAppointments,
      variables() {
        const input = {
          memberIds: [this.memberId],
          host: this.host,
          type: 'INTERVIEW'
        }
        return { input }
      },
      update({ appointments = [] }) {
        this.$emit('load', appointments.length > 0)
        this.upcomingAppointments = appointments.filter(a => !a.endTime)

        let grouped = groupBy(this.upcomingAppointments, a => a.host.displayName)
        return grouped
      }
    }
  }
}
</script>
