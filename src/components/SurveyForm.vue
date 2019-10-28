<template>
  <div class="survey">
    <div v-if="survey">
      <v-form
        ref="apply"
        @submit.prevent="onSubmit"
        lazy-validation
      >
        <div
          v-for="question in survey.elements"
          :key="question.id"
        >
          <div v-if="question.type === 'SINGLE'">
            <Single
              :question="question"
              @propUpdated="updateAnswers"
            />
          </div>
          <div v-else-if="question.type === 'SELECT_SINGLE'">
            <SelectSingle
              :question="question"
              @propUpdated="updateAnswers"
            />
          </div>
          <div v-else-if="question.type === 'PARAGRAPH'">
            <Paragraph
              :question="question"
              @propUpdated="updateAnswers"
            />
          </div>
          <div v-else-if="question.type === 'PARAGRAPH'">
            <Paragraph
              :question="question"
              @propUpdated="updateAnswers"
            />
          </div>
          <div v-else-if="question.type === 'CHECKBOXES'">
            <h4>{{question.name}}</h4>
            <Checkboxes
              :question="question"
              labelProp="value"
              idProp="id"
              @propUpdated="updateAnswers"
            />
          </div>
          <div v-else>
            <p :data-type="question.type">
              We're sorry, an unexpected question type was provided.
              Please contact support (ref: 810-{{question.id}}
            </p>
          </div>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>

import { GET_SURVEY } from '@/graphql/Survey.gql.js'

import SelectSingle from '@/components/survey/SelectSingle.vue'
import Single from '@/components/survey/Single.vue'
import Paragraph from '@/components/survey/Paragraph.vue'
import Checkboxes from '@/components/survey/Checkboxes.vue'

export default {
  name: 'Application',
  components: {
    SelectSingle,
    Single,
    Paragraph,
    Checkboxes
  },
  props: {
    surveyId: Number
  },
  data () {
    return {
      answers: {}
    }
  },
  methods: {
    async onSubmit () {
      this.$emit('submit', {
        answers: this.answers
      })
    },
    updateAnswers ({ name, value, optionId }) {
      this.answers[name] = { name, value, optionId }
      this.$emit('change', {
        answers: this.answers
      })
    }
  },
  apollo: {
    survey: {
      query: GET_SURVEY,
      fetchPolicy: 'network-only',
      variables () {
        return {
          SSInput: {
            id: this.surveyId
          }
        }
      },
      update ({ surveySearch }) {
        const [result] = surveySearch || []
        return result
      }
    }
  }
}

</script>

<style scoped>
.survey {
  padding: 0 15px;
}
</style>
