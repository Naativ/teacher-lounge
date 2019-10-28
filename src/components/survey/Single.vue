<template>
    <v-text-field
      :label="question.name"
      :hint="question.description || question.hint"
      :persistent-hint="!!question.description"
      :placeholder="question.placeholder"
      v-model="value"
      @input="propUpdated"
      :rules="question.required ? rules.required : []"
    ></v-text-field>
</template>
<script>
import { rules } from '@/utils/Validation.js'

export default {
  name: 'SurveySingle',
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
