<template>
  <v-layout row class="interview-end">
    <v-flex v-if="noShow">
      <v-card class="full-height full-center centered">
        <div class="center">
          <h3 class="display-2">Oh No!</h3>
          <br/>
          It appears the student never showed up?
          <br/>
          <br/>
          Is this incorrect? <a @click="noShow = false">Click Here!</a>
          <br/>
          <br/>
          <br/>
          <v-btn
            color="#00d3e6"
            large
            depressed
            class="text-capitalize white--text"
            @click="confirmNoShow"
          >Confirm Student No Show</v-btn>
        </div>
      </v-card>
    </v-flex>
    <v-flex v-else-if="isAssessment" xs12>
      <v-card class="full-height full-center centered">
        <div class="center">
          <h3 class="display-2">Great Assessment!</h3>
          <p>Where would you place this student?</p>
          <p>
            <v-dialog max-width="600px" v-model="beginnerDialog" persistent>
              <v-btn
                slot="activator"
                color="#00d3e6"
                large
                depressed
                class="text-capitalize white--text"
              >Beginner</v-btn>
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Confirm Choice.</h3>
                  </div>
                </v-card-title>
                <v-card-text>Are you sure you want to enroll this student in the beginner track?</v-card-text>
                <v-card-actions>
                  <v-btn
                    :loading="processing"
                    :disabled="processing"
                    color="#00d3e6"
                    @click="enrollProfileBeginner()"
                  >Yes! Enroll!</v-btn>
                  <v-btn depressed color="#f382ae" @click.native="beginnerDialog = false">Not yet.</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog max-width="600px" v-model="intermediateDialog" persistent>
              <v-btn
                slot="activator"
                color="#00d3e6"
                large
                depressed
                class="text-capitalize white--text"
              >Intermediate</v-btn>
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Confirm Choice.</h3>
                  </div>
                </v-card-title>
                <v-card-text>Are you sure you want to enroll this student in the intermediate track?</v-card-text>
                <v-card-actions>
                  <v-btn
                    :loading="processing"
                    :disabled="processing"
                    color="#00d3e6"
                    @click="enrollProfileIntermediate()"
                  >Yes! Enroll!</v-btn>
                  <v-btn depressed color="#f382ae" @click.native="intermediateDialog = false">Not yet.</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog max-width="600px" v-model="advancedDialog" persistent>
              <v-btn
                slot="activator"
                color="#00d3e6"
                large
                depressed
                class="text-capitalize white--text"
              >Advanced</v-btn>
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Confirm Choice.</h3>
                  </div>
                </v-card-title>
                <v-card-text>Are you sure you want to enroll this student in the advanced track?</v-card-text>
                <v-card-actions>
                  <v-btn
                    :loading="processing"
                    :disabled="processing"
                    color="#00d3e6"
                    @click="enrollProfileAdvanced()"
                  >Yes! Enroll!</v-btn>
                  <v-btn depressed color="#f382ae" @click.native="advancedDialog = false">Not yet.</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </p>
          <p>Did the student not show up? If so <a @click="noShow = true">Click Here!</a></p>
        </div>
      </v-card>
    </v-flex>
    <v-flex v-else xs12>
      <v-card class="full-height full-center centered">
        <div class="center">
          <h3 class="display-2">You're Done!</h3>
          <br/>
          This lesson is over!. Thank you for being a Naativ Teacher!
          <br/>
          <br/>
          <v-btn
            color="#00d3e6"
            large
            depressed
            class="text-capitalize white--text"
            @click="backToLounge"
          >Back To The Lounge</v-btn>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import moment from 'moment'

import { UPSERT_ENROLLMENT } from '@/graphql/Member.gql'
import { upsertAppointment } from '@/appointment/Appointments.gql'
import { upsertBooking } from '@/booking/BookingService.js'
export default {
  name: 'ClassEnd',
  data() {
    return {
      beginnerDialog: false,
      advancedDialog: false,
      intermediateDialog: false,
      processing: false,
      noShow: !this.remotePresent
    }
  },
  props: {
    isAssessment: Boolean,
    booking: Object,
    appointment: Object,
    remotePresent: Boolean
  },
  methods: {
    async enrollProfileBeginner() {
      const age = moment(this.booking.profile.birthdate, 'YYYY-MM-DD')
      const course = moment().diff(age, 'years') <= 14 ? 1001 : 1005
      this.enrollProfile(course)
    },
    async enrollProfileIntermediate() {
      const age = moment(this.booking.profile.birthdate, 'YYYY-MM-DD')
      const course = moment().diff(age, 'years') <= 14 ? 1002 : 1006
      this.enrollProfile(course)
    },
    async enrollProfileAdvanced() {
      const age = moment(this.booking.profile.birthdate, 'YYYY-MM-DD')
      const course = moment().diff(age, 'years') <= 14 ? 1003 : 1007
      this.enrollProfile(course)
    },
    async enrollProfile(course) {
      this.processing = true
      console.log('course', course)
      await this.$apollo.mutate({
        mutation: UPSERT_ENROLLMENT,
        variables: {
          input: {
            profileId: this.booking.profile.id,
            courseId: course,
            statusId: 101,
            placementAppointmentId: this.appointment.id
          }
        }
      })
      this.backToLounge()
    },
    async confirmNoShow() {
      await this.$apollo.mutate({
        mutation: upsertAppointment,
        variables: {
          appt: {
            id: this.appointment.id,
            hostId: this.booking.hostId,
            type: this.appointment.type,
            scheduledDate: this.booking.start,
            participants: [this.booking.guestId],
            endTime: this.appointment.endTime,
            startTime: this.appointment.startTime,
            status: 301
          }
        }
      })
      await upsertBooking({ ...this.booking, statusId: 301 })
      this.backToLounge()
    },
    backToLounge() {
      this.$router.push('/lounge/dashboard')
    }
  }
}
</script>
<style lang="stylus" scoped>
.interview-end {
  height: 100%!important;
  position: absolute;
  width: 100%;
  z-index: 10000;
}
</style>
