<template>
  <v-container>
    <v-alert
      type="error"
      :value="error">Error while submitting form</v-alert>

    <div class="apply centered">
      <v-form ref="apply" @submit.prevent="saveSurvey" lazy-validation>
        <div
          v-for="question in survey.elements"
          :key="question.id">
          <div v-if="question.type === 'SINGLE'">
            <Single
              :question="question"
              @propUpdated="updateAnswers"/>
          </div>
          <div v-else-if="question.type === 'SELECT_SINGLE'">
            <SelectSingle
              :question="question"
              @propUpdated="updateAnswers"/>
          </div>
          <div v-else-if="question.type === 'PARAGRAPH'">
            <Paragraph
              :question="question"
              @propUpdated="updateAnswers"/>
          </div>
        </div>
        <div>
          <small>Naativ requires applicants to have at least a Bachelor's degree. Unfortunately, we do not accept applicants without a Bachelor's degree.</small>
        </div>
        <v-btn color="#00d3e6" :loading="loading" :disabled="loading" type="submit" depressed round large class="text-capitalize white--text font-weight-black"
        >Apply</v-btn>
      </v-form>
    </div>
  </v-container>
</template>
<script>
import { GET_SURVEY, SAVE_SURVEY } from '@/graphql/Survey.gql.js'

import SelectSingle from '@/components/survey/SelectSingle.vue'
import Single from '@/components/survey/Single.vue'
import Paragraph from '@/components/survey/Paragraph.vue'

const SURVEY_ID = 1

export default {
  name: 'Application',
  components: {
    SelectSingle,
    Single,
    Paragraph
  },
  data() {
    return {
      success: false,
      error: false,
      answers: {},
      survey: {},
      loading: false
    }
  },
  methods: {
    updateAnswers({ name, value, optionId }) {
      this.answers[name] = { name, value, optionId }
    },
    async saveSurvey() {
      this.error = false
      this.success = false
      this.loading = true
      if (this.$refs.apply.validate()) {
        const answers = Object.values(this.answers)
        const surveyResponse = {
          surveyId: SURVEY_ID,
          answers
        }

        try {
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
      }
    }
  },
  apollo: {
    survey: {
      query: GET_SURVEY,
      variables: {
        SSInput: {
          id: SURVEY_ID
        }
      },
      update({ surveySearch }) {
        return surveySearch[0] || {}
      }
    }
  }
}
</script>
