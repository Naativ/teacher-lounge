<template>
  <span :class="{'before': isBefore}" id="time" v-html="time"></span>
</template>
<script>
import moment from 'moment'
export default {
  props: ['from', 'threshold', 'warning'],
  data: function () {
    return {
      state: 'started',
      startTime: moment(this.from).toDate(),
      thresholdTime: moment(this.from).add(this.threshold, 'minutes'),
      currentTime: Date.now(),
      interval: null,
      isBefore: false
    }
  },
  mounted: function () {
    this.interval = setInterval(this.updateCurrentTime)
  },
  destroyed: function () {
    clearInterval(this.interval)
  },
  computed: {
    time: function () {
      return this.hours + ':' + this.minutes + ':' + this.seconds
    },
    milliseconds: function () {
      return this.currentTime - this.startTime
    },
    hours: function () {
      var lapsed = this.milliseconds
      var hrs = Math.abs(Math.floor((lapsed / 1000 / 60 / 60)))
      return hrs >= 10 ? hrs : '0' + hrs
    },
    minutes: function () {
      var lapsed = this.milliseconds
      var min = Math.abs(Math.floor((lapsed / 1000 / 60) % 60))
      return min >= 10 ? min : '0' + min
    },
    seconds: function () {
      var lapsed = this.milliseconds
      var sec = Math.abs(Math.ceil((lapsed / 1000) % 60))
      return sec >= 10 ? sec : '0' + sec
    }
  },
  methods: {
    reset: function () {
      this.state = 'started'
      this.startTime = this.from ? moment(this.from).toDat() : Date.now()
      this.currentTime = Date.now()
    },
    pause: function () {
      this.state = 'paused'
    },
    resume: function () {
      this.state = 'started'
    },
    updateCurrentTime: function () {
      if (this.threshold && this.thresholdTime.isBefore(moment())) {
        this.$emit('thresholdHit')
      }
      this.isBefore = moment().isBefore(this.startTime)
      if (this.state === 'started') {
        this.currentTime = Date.now()
      }
    }
  }
}
</script>
<style scope>
.before{
  color: red;
}
.before::before{
  content: '-'
}
</style>
