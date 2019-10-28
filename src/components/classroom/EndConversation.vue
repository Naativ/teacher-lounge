<template>
  <v-dialog v-model="showEarlyDialog" width="500">
    <v-card color="#00D3E6" class="white--text">
      <v-card-title>
        <v-spacer/>
        <h2>Confirm Conversation End</h2>
        <v-spacer/>
      </v-card-title>
      <v-divider/>
      <v-card-text class="centered">
        <h3>Please confirm that you would like to end this conversation.</h3>
      </v-card-text>
      <v-divider/>
      <v-card-actions class="justify-space-around">
        <v-btn
          depressed
          color="red"
          class="text-capitalize white--text"
          @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          depressed
          color="green"
          class="text-capitalize white--text"
          @click="confirm"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EndConversation',
  props: { showDialog: Boolean },
  methods: {
    cancel() { this.$emit('cancel') },
    confirm() { this.$emit('confirm') }
  },
  computed: {
    showEarlyDialog: {
      get() { return this.showDialog },
      set(v) { this.$emit('cancel') }
    }
  }
}
</script>
