<template>
  <v-dialog max-width="500px" v-model="showPermissionModal" persistent>
    <v-card>
      <v-card-title primary-title>Media Permissions Required</v-card-title>
      <v-subheader>Naativ requires access to your Microphone and Camera in order to continue.</v-subheader>
      <v-btn
        @click="getLocalTracks"
        color="#00d3e6"
        large
        depressed
        class="text-capitalize white--text"
      >Retry</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['showPermissionModal'],
  methods: {
    async getLocalTracks() {
      // this.$emit('getLocalTracks')
      window.location.reload(true)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
