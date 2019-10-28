<template>
  <div class="calendar-wrapper">
    <full-calendar id="calendar" :config="config" :events="allEvents" ref="calendar" />
  </div>
</template>

<script>
import moment from 'moment-timezone'

export default {
  name: 'Calendar',
  props: {
    events: { type: Array, default: () => [] },
    bookings: { type: Array, default: () => [] },
    timezone: {
      type: String,
      default: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  },
  data() {
    moment.tz.setDefault(this.timezone)
    return {
      config: {
        allDaySlot: false,
        columnHeaderFormat: this.isDesktop() ? 'dddd D' : 'ddd D',
        defaultView: 'agendaWeek',
        editable: true,
        eventColor: '#00d3e4',
        eventDrop: this.onEventUpdated,
        eventOverlap: false,
        eventRender: this.onEventRender,
        eventResize: this.onEventUpdated,
        eventAfterRender: this.onEventAfterRender,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'agendaWeek, agendaDay'
        },
        height: 'parent',
        longPressDelay: 500,
        nowIndicator: true,
        select: this.onEventCreated,
        selectHelper: false,
        selectOverlap: false,
        timeFormat: 'h:mm a',
        timezone: 'local',
        validRange: {
          start: moment(),
          end: moment().add(3, 'months')
        },
        viewRender: this.viewRender
      }
    }
  },
  methods: {
    isDesktop() {
      return this.$vuetify.breakpoint.smAndUp
    },
    onEventAfterRender(event, element) {
      if (element.get(0).style.left === '50%') {
        element.get(0).style.left = '10%'
      }
      if (element.get(0).style.marginRight === '20px') {
        element.get(0).style.marginRight = '0px'
      }
    },
    onEventRender(event, element) {
      if (event.editable !== false) {
        element.append("<span id='archive' style='position:absolute;top:0px;right:0px;z-index:10;background-color:white;border-radius:50%;color:#00d3e4;font-size:10px;width:13px;height:13px;text-align:center;'>X</span>")
        element.find('#archive').click(() => this.onEventDeleted(event))
      }
      if (event.profile && event.profile.displayName) {
        element.append(`<span style='position:absolute;top:0px;right:0px;z-index:10;background-color:white;color:#000; padding: 0 5px;font-size:10px;text-align:center;'>${event.profile.displayName}</span>`)
      }
    },
    onEventUpdated(event) { this.$emit('updated', event) },
    onEventCreated(start, end) {
      this.$emit('created', { start, end })
    },
    onEventDeleted(event) {
      this.$emit('deleted', event)
      this.$refs.calendar.fireMethod('removeEvents', [event._id])
    },
    async viewRender(view, element) {
      const { start, end } = this.$refs.calendar.fireMethod('getView')
      const range = {
        start: start.utc().toISOString(),
        end: end.utc().toISOString()
      }
      this.$emit('range', range)
    }
  },
  computed: {
    allEvents() {
      return [...this.events, ...this.bookings]
    }
  },
  watch: {
    timezone(newVal, oldVal) {
      moment.tz.setDefault(newVal)
    }
  }
}
</script>

<style lang="stylus" scoped>
.calendar-wrapper
  padding-top 10px
  height 80vh
</style>
