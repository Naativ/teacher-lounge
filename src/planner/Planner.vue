<template>
  <div class="planner">
    <v-tabs centered color="cyan" dark icons-and-text>
      <v-tabs-slider color="yellow"></v-tabs-slider>
      <!-- <v-tab :to="'/lounge/planner/schedule'">Latest Details
        <v-icon outline>assignment_late</v-icon>
      </v-tab> -->
      <v-tab :to="'/lounge/planner/latest'">Latest Details
        <v-icon outline>assignment_late</v-icon>
      </v-tab>
      <v-tab :to="'/lounge/planner/recent'">Recent
        <v-icon>av_timer</v-icon>
      </v-tab>
      <!-- <v-tab :to="'/lounge/planner/archive'">Archive
        <v-icon>archive</v-icon>
      </v-tab>-->
    </v-tabs>
    <router-view :upcoming="upcoming" :recent="recent" :on-review="fetchBookings"></router-view>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapActions } from 'vuex'
import Bookings from '@/booking/BookingStore'
export default {
  data() {
    return {
      page: {
        loading: true,
        data: {
          page: 1,
          pageSize: 250,
          totalPages: 1,
          totalResults: 0,
          results: []
        }
      }
    }
  },
  mounted() {
    this.fetchBookings()
  },
  methods: {
    ...mapActions({
      queryBookings: Bookings.actions.SEARCH_BOOKINGS
    }),
    async fetchBookings() {
      this.page.loading = true
      const page = await this.queryBookings({
        includeAppointments: true,
        start: moment().subtract(7, 'days').startOf('day').utc(),
        end: moment().add(1, 'weeks').endOf('day').utc()
      })
      this.page.data = page
      this.page.loading = false
    }
  },
  computed: {
    upcoming() {
      const results = _.get(this, 'page.data.results', []).filter(b => {
        const diff = b && moment.utc(b.start).local().diff(moment(), 'seconds')
        return diff >= 0
      })
      const data = {
        page: 1,
        pageSize: results.length,
        totalPages: 1,
        totalItems: results.length,
        results
      }
      return {
        loading: this.page.loading,
        data
      }
    },
    recent() {
      const results = _.get(this, 'page.data.results', []).filter(b => {
        const diff = b && moment.utc(b.start).local().diff(moment(), 'seconds')
        return diff <= 0
      })
      const data = {
        page: 1,
        pageSize: results.length,
        totalPages: 1,
        totalItems: results.length,
        results
      }
      return {
        loading: this.page.loading,
        data
      }
    }
  }
}
</script>

<style scoped>
.planner {
  margin: -25px;
}
</style>
