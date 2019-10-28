<template>
  <div class="text-xs-center">
    <v-dialog v-model="openCompStructure" width="100%" max-width="800px">
      <v-btn
        slot="activator"
        color="blue"
        depressed
        round
        class="text-capitalize white--text font-weight-bold darken-4"
      >See Our Structure</v-btn>
      <v-card>
        <img src="../assets/images/naativ-compensation-structure-min.jpg"
          width="100%"
          alt="Comp Structure"
        >
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="openCompStructure = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'CompStructure',
  data() {
    return {
      openCompStructure: false
    }
  }
}
</script>

<style scoped>

</style>
