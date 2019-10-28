<template>
    <v-textarea
      :label="question.name"
      :hint="question.description || question.hint"
      :persistent-hint="!!question.description"
      v-model="value"
      @input="propUpdated"
      :placeholder="question.placeholder"
      :rules="question.required ? rules.required : []"
    ></v-textarea>
</template>
<script>
import { rules } from '@/utils/Validation.js'

export default {
  name: 'SurveyParagraph',
  props: ['question'],
  data() {
    return {
      value: '',
      rules
    }
  },
  methods: {
    propUpdated() {
      this.$emit('propUpdated', {
        name: this.question.name,
        value: this.value
      })
    }
  }
}
</script>
