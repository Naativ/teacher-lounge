<template>
  <div class="class-notes">
    <div>
      <h2>{{lesson.name}}</h2>
      <div
        v-for="(slide, index) in slides"
        :key="index"
        :class="{'active': isCurrentSlide(index + 1)}"
      >
        <h4 class="my-3" :ref="`actionsSlide${index + 1}`" >{{slide.name}}</h4>
        <ul v-if="slide.metadata.actions">
          <li v-for="action in slide.metadata.actions" v-html="action" :key="action"></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { delay } from '@/utils/Helpers'
import sortBy from 'lodash.sortby'

export default {
  name: 'ClassNotes',
  props: ['currentSlide', 'lesson'],
  data: function() {
    return {
      slides: []
    }
  },
  mounted() {
    this.slides = sortBy(this.lesson.slides, 'priority')
  },
  methods: {
    isCurrentSlide(slide) {
      return this.currentSlide === slide
    },
    async update() {
      await delay(200)
      if (this.currentSlide > 1) {
        this.$refs[`actionsSlide${this.currentSlide}`][0].scrollIntoView()
      }
    }
  },
  watch: {
    currentSlide(newVal, oldVal) {
      // Since we are in a loop, the ref gets added to an array... weird
      this.$refs[`actionsSlide${newVal}`][0].scrollIntoView()
    }
  }
}
</script>

<style lang="stylus" scoped>
.active {
  background-color: rgba(252, 186, 0, 0.25);
}
</style>
