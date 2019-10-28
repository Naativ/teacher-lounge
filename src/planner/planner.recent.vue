<template>
  <div class="planner-dashboard">
    <BookingTable
      :slice="recent.data"
      :loading="recent.loading"
      title="Recent Appointments"
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
import BookingDetails from '@/planner/components/planner.booking.details'
import BookingTable from '@/booking/components/booking.table'
export default {
  props: {
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
