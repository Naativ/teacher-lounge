<template>
  <v-dialog v-model="showDialog" width="500" persistent>
    <v-card>
      <v-card-title>
        <h2>Lesson Taught!</h2>
      </v-card-title>
      <v-card-text class="centered">
        <h4>It Appears this lesson has already ended.</h4>
      </v-card-text>
      <v-layout justify-end>
        <v-card-actions>
          <v-btn
            depressed
            round
            large
            color="primary"
            class="text-capitalize"
            @click="confirm"
          >
            Go To Lounge
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
    confirm() { this.$emit('confirm') }
  }
}
</script>
