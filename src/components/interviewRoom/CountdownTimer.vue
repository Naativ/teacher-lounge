<template>
  <div class="countdown">
    <div class="time-unite created">
      <div class="time-unite-value">{{ months }} months</div>
    </div>
    <div class="time-unite created">
      <div class="time-unite-value">{{ days }} days</div>
    </div>
    <div class="time-unite created">
      <div class="time-unite-value">{{ hours }} hours</div>
    </div>
    <div class="time-unite created">
      <div class="time-unite-value">{{ minutes }} minutes</div>
    </div>
    <div class="time-unite created">
      <div class="time-unite-value">{{ seconds }} seconds</div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      actualTime: moment().format('X'),
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  },
  methods: {
    addOneSecondToActualTimeEverySecond() {
      var component = this
      component.actualTime = moment().format('X')
      setTimeout(function () {
        component.addOneSecondToActualTimeEverySecond()
      }, 1000)
    },
    getDiffInSeconds() {
      return moment('2019-03-01 12:00:00').format('X') - this.actualTime
    },
    compute() {
      var duration = moment.duration(this.getDiffInSeconds(), 'seconds')
      this.months = duration.months() > 0 ? duration.months() : 0
      this.days = duration.days() > 0 ? duration.days() : 0
      this.hours = duration.hours() > 0 ? duration.hours() : 0
      this.minutes = duration.minutes() > 0 ? duration.minutes() : 0
      this.seconds = duration.seconds() > 0 ? duration.seconds() : 0
    }
  },
  created() {
    this.compute()
    this.addOneSecondToActualTimeEverySecond()
  },
  watch: {
    actualTime(val, oldVal) {
      this.compute()
    }
  }
}
</script>
 <style scoped>
</style>
