<template>
  <div class="planner-dashboard">
    <div v-if="(notifications && notifications.length)">
      <v-card>
        <v-card-title>Notifications</v-card-title>
        <v-expansion-panel>
          <v-expansion-panel-content v-for="item in notifications" :key="item.id">
            <div slot="header" v-html="item.title"/>
            <v-card>
              <v-card-text v-html="item.content"/>
              <v-card-actions>
                <v-spacer/>
                <v-btn
                  v-for="(action, idx) in item.actions"
                  :key="idx"
                  @click="action.fn"
                >{{action.label}}</v-btn>
              </v-card-actions>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-card>
      <br>
      <br>
      <br>
      <br>
    </div>
    <BookingTable
      :slice="upcoming.data"
      :loading="upcoming.loading"
      title="Upcoming Appointments"
      :hide-pagination="true"
    >
      <template slot="expander" slot-scope="props">
        <BookingDetails
          :booking="props.item"
          :responseRequired="isResponseRequired(props.item)"
          @submitted="onReview"
        />
      </template>
    </BookingTable>
  </div>
</template>

<script>
import _ from 'lodash'
import BookingDetails from '@/planner/components/planner.booking.details'
import BookingTable from '@/booking/components/booking.table'
export default {
  props: {
    upcoming: Object,
    recent: Object,
    onReview: Function
  },
  components: {
    BookingTable,
    BookingDetails
  },
  methods: {
    isResponseRequired(booking = {}) {
      const { appointments = [], surveyResponses = [] } = booking
      const [apt] = appointments
      return apt && (booking.typeId === 1006 || apt.type === 'PLACEMENT') && (
        (apt.canceled && surveyResponses.length < 1) ||
        (apt.endTime && surveyResponses.length < 1)
      )
    },
    viewRecent() {
      this.$router.push('/lounge/planner/recent')
    }
  },
  computed: {
    notifications() {
      const result = []

      const flagged = _.get(this, 'recent.data.results', []).filter(this.isResponseRequired)
      if (flagged.length > 0) {
        const list = flagged.map(b => `<li>${_.get(b, 'guest.displayName')}</li>`)
        let content = `All lesson reviews should be completed within 12 hours. ` +
          `Please fill in the reviews for the following student${flagged.length > 1 ? 's' : ''}:` +
          `<ul>${list}</ul>`
        result.push({
          id: 1,
          title: `You have <b>${flagged.length}</b> recent lesson${flagged.length > 1 ? 's' : ''} that requires a review`,
          content,
          actions: [
            { type: 'action', label: 'View recent lessons', fn: this.viewRecent }
          ]
        })
      }
      return result
    }
  }
}
</script>

<style lang="stylus">
.planner-dashboard {
  margin: 15px;

  .actions-td {
    padding: 0 !important;
    width: 26px !important;
    text-align: center;
  }

  .v-datatable__expand-content {
    .v-card__text {
      padding-top: 0;
    }
  }
}
</style>
