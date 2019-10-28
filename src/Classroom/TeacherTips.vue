<template>
  <div class="class-notes">
    <div>
      <h2>{{lesson.name}}</h2>
      <h4 class="my-3">LESSON DESCRIPTION</h4>
      <div v-html="lesson.description"></div>
      <h4 class="my-3">STUDENT LEARNING OBJECTIVES</h4>
      <div v-html="lesson.metadata.objectives"></div>
      <h4 class="my-3">WORD LIST</h4>
      <h4 v-html="lesson.metadata.wordList"></h4>
      <div
        v-for="(slide, index) in slides"
        :key="index"
        :class="{'active': isCurrentSlide(index + 1)}"
      >
        <h4 class="my-3" :ref="`notesSlide${index + 1}`">{{slide.name}}</h4>
        <p>{{slide.description}}</p>
        <ul>
          <li v-for="tip in slide.metadata.tips" v-html="tip" :key="tip"></li>
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
        this.$refs[`notesSlide${this.currentSlide}`][0].scrollIntoView()
      }
    }
  },
  watch: {
    currentSlide(newVal, oldVal) {
      // Since we are in a loop, the ref gets added to an array... weird
      this.$refs[`notesSlide${newVal}`][0].scrollIntoView()
    }
  }
}
</script>

<style lang="stylus" scoped>
.active {
  background-color: rgba(252, 186, 0, 0.25);
}
</style>
