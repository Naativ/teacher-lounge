<template>
  <v-card>
    <v-card-text v-if="responseRequired">
      <v-dialog v-model="showFeedback" :fullscreen="$vuetify.breakpoint.xsOnly">
        <v-card>
          <v-card-title class="headline lighten-2" primary-title>Lesson Feedback</v-card-title>
          <SurveyFrom :survey-id="SURVEY_ID" @change="feedbackChange" @submit="feedbackSubmit"/>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="error" flat @click="showFeedback = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success" flat @click="feedbackSubmit">Submit Feedback</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <br>Your lesson with
      <strong>{{ student }}</strong>
      started at
      <strong>{{ occurred.start | momentDate(dateFormat) }}</strong>
      and ended on
      <strong>{{ occurred.end | momentDate(dateFormat) }}</strong>
      based on your current browser settings. You have not completed your review
      of the lesson. Please do so as soon as possible.
    </v-card-text>
    <v-card-text v-else>
      <br>Your lesson with
      <strong>{{ student }}</strong>
      is scheduled for
      <strong>{{ scheduled | momentDate(dateFormat) }}</strong>
      based on your current browser settings. Please remember
      to join the waiting room a few minutes early.
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        flat
        v-if="responseRequired"
        @click="showFeedback = true"
      >Leave Feedback</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import SurveyFrom from '@/components/SurveyForm'
import { SAVE_SURVEY } from '@/graphql/Survey.gql.js'

const SURVEY_ID = process.env.VUE_APP_ASSESSMENT_SURVEY_ID || 2

export default {
  props: {
    booking: Object,
    responseRequired: Boolean
  },
  components: {
    SurveyFrom
  },
  data() {
    return {
      SURVEY_ID,
      showFeedback: false,
      feedback: {},
      dateFormat: 'MMMM Do YYYY, h:mm a'
    }
  },
  methods: {
    async feedbackChange(e) {
      this.feedback = e
    },
    async feedbackSubmit(e) {
      const { answers } = this.feedback
      const arr = []
      Object.keys(answers).forEach(name => {
        let value = answers[name].value
        if (Array.isArray(value)) {
          value.forEach(v => {
            arr.push({
              name,
              value: v.value
            })
          })
        } else {
          arr.push({
            name,
            value: value.value
          })
        }
      })

      try {
        const surveyResponse = {
          surveyId: SURVEY_ID,
          appointmentId: this.appointment.id,
          answers: arr
        }
        await this.$apollo.mutate({
          mutation: SAVE_SURVEY,
          variables: {
            response: surveyResponse
          }
        })

        this.$emit('submitted')
        this.loading = false
      } catch (e) {
        this.error = true
        this.loading = false
        console.error(e)
        throw e
      }

      this.showFeedback = false
      this.feedback = {}
    }
  },
  computed: {
    student() {
      return _.get(this.booking, 'profile.displayName')
    },
    scheduled() {
      const start = _.get(this.booking, 'start')
      return start ? moment(start) : undefined
    },
    appointment() {
      const appt = _.get(this.booking, 'appointments.0')
      return appt
    },
    occurred() {
      const start = _.get(this.booking, 'appointments.0.start')
      const end = _.get(this.booking, 'appointments.0.start')
      return {
        start: start ? moment(start) : undefined,
        end: end ? moment(end) : undefined
      }
    }
  }
}
</script>
