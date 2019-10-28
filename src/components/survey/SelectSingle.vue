<template>
    <v-select
      :items="question.options"
      item-text="value"
      :return-object="true"
      :label="question.name"
      :hint="question.description || question.hint"
      :persistent-hint="!!question.description"
      @change="propSelected"
      v-model="selection"
      :rules="question.required ? rules.required : []"
    ></v-select>
</template>
<script>
import { rules } from '@/utils/Validation.js'

export default {
  name: 'SurveySelectSingle',
  props: ['question'],
  data() {
    return {
      selection: '',
      rules
    }
  },
  methods: {
    propSelected() {
      this.$emit('propUpdated', {
        name: this.question.name,
        value: this.selection.value, // todo: grab this
        optionId: this.selection.id
      })
    }
  }
}
</script>
