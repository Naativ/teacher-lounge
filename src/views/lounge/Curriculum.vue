<template>
  <div class="classroom">
    <h1>Curriculum</h1>
    <v-breadcrumbs :items="selection">
      <template slot="item" slot-scope="props">
        <a>Test{{ props.item.name }}</a>
      </template>
    </v-breadcrumbs>
    <v-btn v-if="selection.length" small @click="goBack">
      Back
    </v-btn>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="currentList"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.description }}</td>
        <td>
          <v-btn @click="enter(props.item)">
            Enter
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
import { Actions } from '@/Lessons/Store'

export default {
  name: 'Curriculum',
  data() {
    return {
      loading: false,
      currentList: [],
      headers: [
        { text: 'Name', align: 'left', sortable: false },
        { text: 'Description', align: 'left', sortable: false },
        { text: 'Actions', align: 'left', sortable: false }
      ],
      courses: [],
      units: [],
      blocks: [],
      lessons: [],
      selection: []
    }
  },
  async mounted() {
    this.loading = true
    const results = await this.getCourses()
    this.courses = results.results
    this.currentList = this.courses
    this.loading = false
  },
  methods: {
    ...mapActions({
      getCourses: Actions.COURSE_GET,
      getUnits: Actions.UNITS_GET,
      getBlocks: Actions.BLOCKS_GET,
      getLessons: Actions.LESSONS_GET
    }),
    goBack(item) {
      this.selection.pop()
      const current = _.last(this.selection)
      if (!current) {
        this.currentList = this.courses
      } else if (current.__typename === 'CurriculumCourse') {
        this.currentList = this.units
      } else if (current.__typename === 'CurriculumUnit') {
        this.currentList = this.blocks
      } else if (current.__typename === 'CurriculumBlock') {
        this.currentList = this.lessons
      }
    },
    async enter(item) {
      const type = item.__typename
      this.selection.push(item)
      if (type === 'CurriculumCourse') {
        const units = await this.getUnits([item.id])
        this.units = units.results
        this.currentList = this.units
      } else if (type === 'CurriculumUnit') {
        const blocks = await this.getBlocks([item.id])
        this.blocks = blocks.results
        this.currentList = this.blocks
      } else if (type === 'CurriculumBlock') {
        const lessons = await this.getLessons([item.id])
        this.lessons = lessons.results
        this.currentList = this.lessons
      } else if (type === 'CurriculumLesson') {
        this.$router.push(`/lounge/practice/${item.id}`)
      }
    }
  }
}
</script>
