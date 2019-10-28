<template>
  <div class="countdown" :class="{ clock: warn }">
    <p v-if="days > 0" class="mx-1">
      <strong>{{ days }}</strong>d
    </p>
    <p v-if="hours > 0" class="mx-1">
      <strong>{{ hours % 24 }}</strong>h
    </p>
    <p v-if="minutes > 0" class="mx-1">
      <strong>{{ minutes % 60 }}</strong>m
    </p>
    <p v-if="seconds > 0 || minutes > 0" class="mx-1">
      <strong>{{ seconds % 60 }}</strong>s
    </p>
    <p v-if="seconds < 1 && minutes < 1" class="mx-1">
      <strong>In Progress</strong>
    </p>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CountdownTimer',
  props: { timer: { type: Object, required: true } },
  mounted() { this.updateTime() },
  data() { return { currentTime: moment(), warn: false } },
  methods: {
    updateTime() {
      this.currentTime = moment()
      if (this.seconds <= 10) {
        this.warn = !this.warn
      }
      return this.seconds <= 0
        ? this.$emit('expired')
        : setTimeout(this.updateTime, 1000)
    }
  },
  computed: {
    days() { return this.timer.diff(this.currentTime, 'days') },
    hours() { return this.timer.diff(this.currentTime, 'hours') },
    minutes() { return this.timer.diff(this.currentTime, 'minutes') },
    seconds() {
      const second = this.timer.diff(this.currentTime, 'seconds')
      return second < 0 ? 0 : second
    }
  }
}
</script>

<style lang="stylus" scoped>
.countdown
  display flex
.clock
  color red
  font-style bold

</style>
