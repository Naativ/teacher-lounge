<template>
  <v-layout row class="interview-end">
    <v-flex v-if="isHost" xs12>
      <v-card class="full-height full-center centered">
        <div class="center">
          <p>What did you think of the interviewee?</p>
          <p>
            <v-dialog max-width="600px" v-model="promoteDialog" persistent>
              <v-btn
                slot="activator"
                color="#00d3e6"
                large
                depressed
                class="text-capitalize white--text"
              >Promote To Teacher</v-btn>
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Confirm Choice.</h3>
                  </div>
                </v-card-title>
                <v-card-text>Are you sure you want to promote them to Teacher?</v-card-text>
                <v-card-actions>
                  <v-btn
                    :loading="processing"
                    :disabled="processing"
                    color="#00d3e6"
                    @click="addTag(['teacher', 'audience:lesson:child', 'audience:lesson:adult'])"
                  >Yes! Promote!</v-btn>
                  <v-btn depressed color="#f382ae" @click.native="promoteDialog = false">Not yet.</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog max-width="600px" v-model="waitlistDialog" persistent>
              <v-btn
                slot="activator"
                color="#f382ae"
                large
                depressed
                class="text-capitalize white--text"
              >Add To Waitlist</v-btn>
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Confirm Choice.</h3>
                  </div>
                </v-card-title>
                <v-card-text>Are you sure you want to add them to the waitlist?</v-card-text>
                <v-card-actions>
                  <v-btn
                    :loading="processing"
                    :disabled="processing"
                    color="#00d3e6"
                    @click="addTag(['waitlist'])"
                  >Yes!</v-btn>
                  <v-btn depressed color="#f382ae" @click.native="waitlistDialog = false">Not yet.</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </p>
        </div>
      </v-card>
    </v-flex>
    <v-flex v-if="!isHost" xs12>
      <v-card class="full-height full-center centered">
        <div class="center">Thank you for interviewing with Naativ.
          <br/>You are now being redirected back to the lounge
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { UPDATE_MEMBER_TAGS } from '@/graphql/Member.gql.js'
export default {
  name: 'InterviewEnd',
  data() {
    return {
      promoteDialog: false,
      waitlistDialog: false,
      processing: false
    }
  },
  props: {
    isHost: Boolean,
    participantId: Number
  },
  methods: {
    async addTag(tags) {
      this.processing = true
      await this.$apollo.mutate({
        mutation: UPDATE_MEMBER_TAGS,
        variables: {
          input: {
            memberId: this.participantId,
            tags: tags
          }
        }
      })
      this.processing = false
      this.$router.push('/lounge/dashboard')
    }
  }
}
</script>
<style lang="stylus" scoped>
.interview-end {
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 10000;
}
</style>
