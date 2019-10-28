<template>
  <v-dialog v-model="showEarlyDialog" width="500">
    <v-card>
      <v-card-title>
        <h2>Are you sure?</h2>
      </v-card-title>
      <v-card-text class="centered">
        <h4>It looks like you're trying to leave early.</h4>
        <h3>You will be penalized for this.</h3>
        <h4>Do you wish to continue?</h4>
      </v-card-text>
      <v-layout justify-end>
        <v-card-actions>
          <v-btn
            depressed
            round
            large
            class="text-capitalize"
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            depressed
            round
            large
            color="primary"
            class="text-capitalize"
            @click="confirm"
          >
            I'm Sure
          </v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LeaveEarlyDialog',
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
