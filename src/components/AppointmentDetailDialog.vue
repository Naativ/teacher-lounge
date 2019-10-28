<template>
  <v-dialog v-model="show" :fullscreen="$vuetify.breakpoint.xsOnly">
    <v-toolbar color="#00d3e4">
      <v-toolbar-title>{{displayName}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!unqualify && !unschedule">
        <v-btn color="error" @click="unqualify = true" class="mx-2">Ineligible</v-btn>
        <v-btn color="error" @click="unschedule = true" class="mx-2">Unschedule</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card v-if="!unschedule && !unqualify">
      <v-card-text>
        <v-container fluid grid-list-xl>
          <v-layout row wrap align-content-center>
            <v-flex xs12 md6>
              <v-list v-for="detail in participants" :key="detail.id">
                <v-list-tile v-for="(ph, idx) in detail.phoneNumbers" :key="idx">
                  <v-list-tile-action>
                    <v-icon v-if="idx === 0" color="indigo">phone</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ph.number}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider inset></v-divider>

                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon color="indigo">mail</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>
                      <a :href="`mailto:${detail.contactEmail}`">{{detail.contactEmail}}</a>
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider inset></v-divider>

                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon color="indigo">location_on</v-icon>
                  </v-list-tile-action>

                  <v-list-tile-content>
                    <v-list-tile-title>{{detail.timezone.name}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-flex>

            <v-flex xs12 md6>
              <v-form ref="updateForm" v-model="updateValid" lazy-validation>
                <v-menu
                  ref="dateMenu"
                  :close-on-content-click="false"
                  v-model="picker"
                  :nudge-right="40"
                  :return-value.sync="appointmentDate"
                  lazy
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="appointmentDate"
                    label="Appointment Date"
                    prepend-icon="event"
                    readonly
                    required
                  ></v-text-field>
                  <v-date-picker v-model="appointmentDate" :min="yesterday" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="picker = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.dateMenu.save(appointmentDate)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
                <v-text-field
                  return-masked-value
                  v-model="appointmentTime"
                  label="Appointment Time"
                  mask="##:## aa"
                  placeholder="00:00 am"
                  prepend-icon="access_time"
                  required
                  :rules="rules.time"
                ></v-text-field>
              </v-form>
            </v-flex>
            <v-flex xs12>
              <v-list v-if="!survey">
                <v-list-tile>Loading Application Information...</v-list-tile>
              </v-list>
              <v-list v-if="survey">
                <v-list-tile v-for="answer in survey.answers" :key="answer.questionName">
                  <v-list-tile-content>
                    <v-list-tile-title>{{answer.questionName}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{answer.values[0].value}}</v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn flat="flat" @click.stop="show = false">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" :loading="processing" @click="updateAppointment">Update</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-else-if="unschedule">
      <v-card-text>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-textarea
                  v-model="cancelReason"
                  solo
                  label="Cancel Reason"
                  autofocus
                  no-resize
                  required
                  :rules="[v => !!v || 'Please provide a cancel reason']"
                ></v-textarea>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn flat="flat" @click.stop="close">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="unschedule = false">Cancel</v-btn>
        <v-btn
          color="error"
          :disabled="processing"
          :loading="processing"
          @click="cancelAppointment('applicant')"
        >Unschedule</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else-if="unqualify">
      <v-card-text>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-textarea
                  v-model="cancelReason"
                  solo
                  label="Reason for applicant's ineligiblility."
                  autofocus
                  no-resize
                  required
                  :rules="[v => !!v || 'Please provide a cancel reason']"
                ></v-textarea>
              </v-form>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn flat="flat" @click.stop="close">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="unqualify = false">Cancel</v-btn>
        <v-btn
          color="error"
          :disabled="processing"
          :loading="processing"
          @click="cancelAppointment('unqualify')"
        >Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import moment from 'moment'
import { cancelAppointment, createAppointment } from '@/graphql/Appointments.gql.js'
import { UPDATE_MEMBER_TAGS } from '@/graphql/Member.gql.js'
import { GET_SURVEY_RESPONSE } from '@/graphql/Survey.gql.js'
import { rules } from '@/utils/Validation'

export default {
  name: 'AppointmentDetailDialog',
  props: {
    id: Number,
    visible: Boolean,
    date: {
      type: String,
      default: new Date().toISOString().substr(0, 10)
    },
    participants: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    const date = moment(this.date)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return {
      processing: false,
      unschedule: false,
      unqualify: false,
      cancelReason: '',
      today: new Date().toISOString().substr(0, 10),
      yesterday: yesterday.toISOString().substr(0, 10),
      appointmentDate: date.format('YYYY-MM-DD'),
      appointmentTime: date.format('hh:mm a'),
      picker: false,
      menu2: false,
      valid: true,
      updateValid: true,
      survey: null,
      rules
    }
  },
  methods: {
    close() {
      this.appointmentTime = null
      this.unschedule = false
      this.cancelReason = ''
      this.show = false
    },
    async updateAppointment() {
      if (this.$refs.updateForm.validate()) {
        try {
          this.processing = true

          const apptDate = moment(`${this.appointmentDate} ${this.appointmentTime}`, 'YYYY-MM-DD hh:mm a').utc().format()
          const participantIds = this.participants.map(p => p.id)

          await this.$apollo.mutate({
            mutation: createAppointment,
            variables: {
              appt: {
                id: this.id,
                hostId: this.$store.state.member.id,
                scheduledDate: apptDate,
                type: 'INTERVIEW',
                participants: participantIds,
                status: 1
              }
            },
            update: async (store, { data }) => {
              return data && data.upsertAppointment
            }
          })

          this.close()
        } catch (e) {
          console.error(e)
        } finally {
          this.processing = false
        }
      } else {
        console.error('Unable to validate form')
      }
    },
    async cancelAppointment(tag) {
      if (this.$refs.form.validate()) {
        try {
          const [memberId] = this.participants.map(p => p.id)

          this.processing = true
          await this.$apollo.mutate({
            mutation: cancelAppointment,
            variables: {
              input: {
                id: this.id,
                reason: this.cancelReason
              }
            }
          })

          await this.$apollo.mutate({
            mutation: UPDATE_MEMBER_TAGS,
            variables: {
              input: {
                memberId: memberId,
                tags: [tag]
              }
            }
          })

          this.close()
        } catch (e) {
          console.error('Error canceling appointment', e)
        } finally {
          this.processing = false
        }
      }
    }
  },
  apollo: {
    survey: {
      query: GET_SURVEY_RESPONSE,
      variables() {
        return {
          input: {
            memberId: this.participants[0].id,
            surveyIds: [1]
          }
        }
      },
      update({ surveyResponse }) {
        return surveyResponse[0]
      }
    }
  },
  computed: {
    displayName() {
      return this.participants.map(p => p.displayName).join(' ')
    },
    show: {
      get() {
        return this.visible
      },
      set(value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  }
}
</script>
