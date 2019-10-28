<template>
  <div>
    <div v-for="val in question.options" :key="val[idProp]">
      <v-checkbox
        v-model="selection"
        :label="val[labelProp]"
        :value="valueProp ? val[valueProp] : val"
        @change="propUpdated"
      />
    </div>
  </div>
</template>
<script>
// import { rules } from '@/utils/Validation.js'

export default {
  name: 'SurveyCheckboxes',
  props: {
    question: Object,
    labelProp: String,
    valueProp: String,
    idProp: String
  },
  data() {
    return {
      selection: []
      // rules
    }
  },
  methods: {
    propUpdated() {
      this.$emit('propUpdated', {
        name: this.question.name,
        value: this.selection
      })
    }
  }
}
</script>
