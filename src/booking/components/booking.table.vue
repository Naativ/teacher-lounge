<template>
  <v-card>
    <v-card-title v-if="title">{{title}}</v-card-title>
    <v-data-table
      :hide-actions="true"
      :headers="tableHeaders"
      :items="(slice && slice.results) || []"
      :pagination.sync="pagination"
      :loading="loading"
      item-key="id"
      expand
    >
      <template slot="items" slot-scope="props">
        <tr>
          <td>
            <v-tooltip top>
              <span slot="activator">{{ props.item.start | momentDate(dateFormat) }}</span>
              <span>Booking #{{ props.item.id }}</span>
            </v-tooltip>
          </td>
          <td>{{ props.item.profile.displayName }}</td>
          <td>
            <div v-if="props.item.typeId === 1003">Interview</div>
            <div v-else-if="props.item.typeId === 1004">Lesson</div>
            <div v-else-if="props.item.typeId === 1006">Placement</div>
            <div v-else>Unexpected type: {{props.item.typeId}}</div>
          </td>
          <td :class="bookingStatus(props.item).color">{{ bookingStatus(props.item).message }}</td>
          <td class="actions-td">
            <v-btn icon @click="props.expanded = !props.expanded">
              <v-icon>{{props.expanded ? 'expand_less' : 'expand_more'}}</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
      <template slot="expand" slot-scope="props">
        <slot name="expander" v-bind:item="props.item"></slot>
      </template>
    </v-data-table>
    <div v-if="!hidePagination" class="text-xs-center pt-2">
      <v-pagination
        v-model="slice.page"
        :disabled="loading"
        :length="slice.totalPages"
        :total-items="slice.totalItems"
      ></v-pagination>
    </div>
  </v-card>
</template>

<script>

export default {
  props: {
    loading: Boolean,
    slice: Object,
    title: String,
    headers: Array,
    hidePagination: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pagination: {},
      dateFormat: 'MMMM Do YYYY, h:mm a'
    }
  },
  methods: {
    bookingStatus(booking) {
      const STYLE_RED = 'text-red'
      const STYLE_GREEN = 'text-green'
      const STYLE_BLACK = 'text-black'

      let color = STYLE_RED
      let message = 'Unresolved status'
      if (booking.appointments && booking.appointments.length > 0) {
        if (booking.appointments.length > 1) {
          message = `Unknown status: ${booking.appointments.length} appointments`
        } else {
          const apt = booking.appointments[0]
          const responses = booking.surveyResponses
          if (apt.canceled) {
            if (responses.length < 1 && (booking.typeId === 1003 || apt.type === 'PLACEMENT')) {
              message = 'Response required'
            } else {
              color = STYLE_BLACK
              message = 'Session Canceled'
            }
          } else if (apt.endTime) {
            if (responses.length < 1 && (booking.typeId === 1003 || apt.type === 'PLACEMENT')) {
              message = 'Response required'
            } else {
              color = STYLE_GREEN
              message = 'Completed'
            }
          } else if (apt.startTime) {
            color = STYLE_RED
            message = `Started`
          } else {
            message = 'Unknown Appointment Status'
          }
        }
      } else {
        switch (booking.statusId) {
          case 200:
            color = STYLE_GREEN
            message = 'Confirmed'
            break
          case 204:
            color = STYLE_BLACK
            message = 'Canceled'
            break
          default:
            message = 'Unexpected Booking Status: ' + booking.statusId
            break
        }
      }
      return {
        message, color
      }
    }
  },
  computed: {
    tableHeaders() {
      return this.headers || [
        { text: 'Date', value: 'date' },
        { text: 'Student', value: 'student' },
        { text: 'Type', value: 'type' },
        { text: 'Status', value: 'status' },
        { text: '', value: 'expand', width: '26px' }
      ]
    }
  }
}
</script>

<style>
.text-red {
  color: red !important;
}
.text-green {
  color: green !important;
}
.text-black {
  color: black !important;
}
</style>
