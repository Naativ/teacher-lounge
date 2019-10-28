<template>
  <div class="lounge" ref="lounge">
    <div class="loading" v-if="!$store.state.member.id">
      <Loading/>
    </div>
    <v-alert :value="error" type="error">{{error}}</v-alert>
    <v-alert :value="success" type="success">{{success}}</v-alert>
    <div class="centered" v-if="$store.state.member.id">
      <v-layout row wrap>
        <v-flex pa-4 d-flex xs12 sm6 md8>
          <v-layout row wrap>
            <v-flex d-flex>
              <v-layout row wrap>
                <v-flex v-if="hasTag('teacher')" d-flex xs12 mb-2>
                  <Agenda />
                </v-flex>
                <v-flex d-flex xs12 mb-2>
                  <appointment-view
                    title="Scheduled Interviews"
                    :member-id="$store.state.member.id"
                    :host="!!hasTag('interviewer')"
                    @load="t => interviewScheduled = t"
                  />
                </v-flex>
                <v-flex d-flex xs12>
                  <v-card>
                    <h2 class="mb-3">Agenda</h2>
                    <v-layout row wrap>
                      <v-flex xs12 md3>
                        <h5>Verify E-mail</h5>
                        <div class="my-2" v-if="!isClaimed">
                          <v-icon x-large>radio_button_unchecked</v-icon>
                          <br>
                          <v-btn
                            color="#00d3e6"
                            small
                            depressed
                            round
                            class="text-capitalize white--text"
                            @click="resendClaimEmail"
                          >Resend Email</v-btn>
                        </div>
                        <div class="my-2" v-if="isClaimed">
                          <v-icon x-large color="green">check_circle_outline</v-icon>
                          <br>
                          <v-btn disabled small depressed round class="text-capitalize">Completed</v-btn>
                        </div>
                      </v-flex>
                      <v-flex xs12 md3>
                        <h5>Apply to Teach</h5>
                        <div class="my-2" v-if="!isClaimed">
                          <v-icon x-large>radio_button_unchecked</v-icon>
                          <br>
                          <v-btn
                            color="#00d3e6"
                            disabled
                            small
                            depressed
                            round
                            class="text-capitalize white--text"
                          >Pending</v-btn>
                        </div>
                        <div v-if="isClaimed">
                          <div
                            class="my-2"
                            v-if="(!hasTag('applicant') && !hasTag('interview_scheduled')) && !hasTag('teacher')"
                          >
                            <v-icon x-large>radio_button_unchecked</v-icon>
                            <br>
                            <v-dialog max-width="600px" v-model="applicationDialog" persistent>
                              <v-btn
                                slot="activator"
                                color="#00d3e6"
                                small
                                depressed
                                round
                                class="text-capitalize white--text"
                              >Apply</v-btn>
                              <v-card>
                                <v-card-title class="application-title">
                                  <h3>Apply to be a teacher with Naativ</h3>
                                  <v-btn
                                    class="application-close"
                                    color="darken-1"
                                    flat
                                    fab
                                    @click.native="applicationDialog = false"
                                  >
                                    <v-icon>cancel</v-icon>
                                  </v-btn>
                                </v-card-title>
                                <v-card-text>
                                  <Application @submitted="submitted"/>
                                </v-card-text>
                              </v-card>
                            </v-dialog>
                          </div>
                          <div
                            class="my-2"
                            v-if="hasTag('applicant') || hasTag('interview_scheduled') || hasTag('teacher')"
                          >
                            <v-icon x-large color="green">check_circle_outline</v-icon>
                            <br>
                            <v-btn
                              color="#00d3e6"
                              disabled
                              small
                              depressed
                              round
                              class="text-capitalize white--text"
                            >Completed</v-btn>
                          </div>
                        </div>
                      </v-flex>
                      <v-flex xs12 md3>
                        <h5>Schedule Interview</h5>
                        <div class="my-2" v-if="!interviewScheduled && !hasTag('teacher')">
                          <v-icon x-large>radio_button_unchecked</v-icon>
                          <br>
                          <v-btn disabled small depressed round class="text-capitalize">Pending</v-btn>
                        </div>
                        <div class="my-2" v-if="interviewScheduled || hasTag('teacher')">
                          <v-icon x-large color="green">check_circle_outline</v-icon>
                          <br>
                          <v-btn disabled small depressed round class="text-capitalize">Complete</v-btn>
                        </div>
                      </v-flex>
                      <v-flex xs12 md3>
                        <h5>Status</h5>
                        <div class="my-2" v-if="hasTag('teacher')">
                          <v-icon x-large color="green">check_circle_outline</v-icon>
                          <br>
                          <v-btn
                            color="#00d3e6"
                            disabled
                            small
                            depressed
                            round
                            class="text-capitalize white--text"
                          >Teacher</v-btn>
                        </div>
                        <div class="my-2" v-else-if="hasTag('waitlist')">
                          <v-icon x-large color="yellow">hourglass_empty</v-icon>
                          <br>
                          <v-btn
                            color="#00d3e6"
                            disabled
                            small
                            depressed
                            round
                            class="text-capitalize white--text"
                          >Waitlist</v-btn>
                        </div>
                        <div class="my-2" v-else-if="hasTag('unqualified')">
                          <v-icon x-large color="red">error_outline</v-icon>
                          <br>
                          <v-btn
                            color="#00d3e6"
                            disabled
                            small
                            depressed
                            round
                            class="text-capitalize white--text"
                          >Denied</v-btn>
                        </div>
                        <div class="my-2" v-else>
                          <v-icon x-large>radio_button_unchecked</v-icon>
                          <br>
                          <v-btn
                            color="#00d3e6"
                            disabled
                            small
                            depressed
                            round
                            class="text-capitalize white--text"
                          >Pending</v-btn>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
                <v-flex d-flex xs12 pt-2>
                  <v-card>
                    <div class="pa-4" style="max-width: 800px; margin: auto;">
                      <div v-if="!isClaimed">
                        <h2>Announcements</h2>
                        <v-card-text>
                          Congratulations on starting the process to become a Naativ teacher!
                          We need to be sure that we have your correct email address.
                          Please Verify your Email by clicking on the link in the banner above.
                          Once your email is verified, you will be able to complete your application.
                          <br>Have any questions? Please contact us at <a href="mailto:support@naativ.com">support@naativ.com</a>
                        </v-card-text>
                      </div>
                      <div
                        v-else-if="isClaimed && (!hasTag('applicant') && !hasTag('interview_scheduled'))&& !hasTag('teacher') && !hasTag('waitlist')"
                      >
                      <h2>Announcements</h2>
                        <v-card-text>
                          Thank you for verifying your email address!
                          The next step is to complete your Application.
                          Please click on the Application link above to complete and submit your Application.
                          We look forward to learning more about you!
                          <br>Have any questions? Please contact us at <a href="mailto:support@naativ.com">support@naativ.com</a>
                        </v-card-text>
                      </div>
                      <div
                        v-else-if="(hasTag('applicant') || hasTag('interview_scheduled')) && (!hasTag('teacher') && !hasTag('waitlist'))"
                      >
                      <h2>Announcements</h2>
                      <v-card-text>
                        <p>Thank you so much for your interest in joining Naativ. We received your application and we look forward to meeting you!</p>
                        <p>Demand for a teaching position with Naativ has been overwhelming! We are excited to provide thousands of teachers the opportunity to teach students around the world. We want to make sure that any teacher that applies and is accepted to teach with Naativ has the opportunity to teach. Therefore, at the moment, we have paused interviewing any new teacher applicants and will resume interviewing teacher applicants after we launch (in the first quarter of 2019) and we have enough demand from students to support onboarding new teachers.</p>
                        <p>Your application will remain in our queue and we look forward to getting to know you in 2019. We hope that you will still be interested in teaching with us. We will keep you updated as Naativ continues forward.</p>
                        <p>Thank you again for applying to teach with us. We'll be in touch soon!</p>
                        <p>Have any questions? Please contact us at <a href="mailto:support@naativ.com">support@naativ.com</a></p>
                        </v-card-text>
                      </div>
                      <div v-if="hasTag('teacher')" id="todo-list">
                          <h2>Hello, Naativ Teachers!</h2>
                          <h2>Here's an Updated To Do List</h2>
                          <v-card-text class="todo-list">
                          <ul>
                            <li>Upload documents for Education/Certification Verification. Go to Profile>Verification. Click on the plus sign icon in the top right corner to upload your documents. You will need to provide a document for each credential you claim. If you do not have any certifications outside of your degree, you will only need to upload a copy of your diploma/transcript. If you claim a state teaching certificate, TESOL, or TEFL certification, you will need to provide evidence for each claim. Naativ will review and confirm all submitted documentation. If there is a question or concern about any submitted documentation, you will be contacted.</li>
                            <br>
                            <li>Make sure your Account and Profile information is correct. Your Display Name is what will appear to parents/students. Your Display Name can be whatever you like. Your teacher number, on the other hand, is your unique identifier and will be used to differentiate between teachers.</li>
                            <br>
                            <li>To appear in the Teacher Availability Search, you must have a complete profile. A complete profile must include a set Profile Pic. Remember that these are uploaded through the Library (by selecting to display it in your profile, then setting it as your Profile Pic). WHEN YOUR PROFILE IS COMPLETE, IT WILL SHOW UNDER ‘PROFILE STATUS’ in the teacher info box on the right side of this page.</li>
                            <br>
                            <li>Availability: Please make sure that your availability is accurate! Students are able to book two weeks out at any time (a two week, rolling window). They cannot book anything within 24 hours currently. We can’t guarantee any bookings, so please plan accordingly. Only open available times that work for you. If you have other work commitments, please don’t miss those commitments. We hope that your open availability is filled with Naativ Students but we also don’t want you to miss out on other earning opportunities.</li>
                          </ul>
                        </v-card-text>
                        <v-card-text class="todo-list">
                        <p>Have you joined our Facebook group?<a target="blank" href ="https://www.facebook.com/groups/OfficialNaativTeachers/"> Officail Naativ Teachers</a></p>
                        <p>
                          Our exclusive Facebook group is where we provide training, support, and collaborate our experiences and share tips to becoming the best you can be. You don’t have to post but we hope that you do. We encourage you to post fun stories or experiences, wins you had that week, and solutions to any issues you encounter. The page is meant to be a positive place of sharing and support. Join Today!
                        </p>
                        <p>Have any questions? Please contact us at <a href="mailto:support@naativ.com">support@naativ.com</a> or <a href="mailto:techsupport@naativ.com">techsupport@naativ.com </a> </p>
                        </v-card-text>
                      </div>
                      <div v-if="hasTag('waitlist') && (!hasTag('teacher'))">
                        <h2>Announcements</h2>
                        <v-card-text>
                        <p>
                          Thank you for applying to be a teacher with Naativ and for going through our interview
                          process. You are currently on our wait list to becoming a Naativ teacher. The best way to move
                          ahead on the wait list is to attend a training session. This training session will be offered
                          within the next 30 days and you will be invited to participate. Our goal is to empower you
                          with tools to succeed in teaching online.
                        </p>
                        <p>
                          Once the training session is completed, you will be invited to go through the interview
                          process again in the hopes of being Approved. We will email you once the next training session
                          is available.
                        </p>
                        <p>Thank you again for applying with Naativ,
                          <br>Your Naativ Team
                        </p>
                        </v-card-text>
                      </div>
                      <div v-if="hasTag('unqualified')"></div>
                    </div>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex pa-4 d-flex xs12 sm6 md4>
          <v-card>
            <img class="avatar" :src="avatar" alt="Profile Pic">
            <div>
              <h4>Teacher Number</h4>
              <p>{{$store.state.member.mrn}}</p>
            </div>
            <div>
              <h4>Name</h4>
              <p>{{$store.state.member.displayName}}</p>
            </div>
            <div>
              <h4>Email</h4>
              <p>{{$store.state.member.contactEmail}}</p>
            </div>
            <div>
              <h4>Birthday</h4>
              <p>{{birthday}}</p>
            </div>
            <div>
              <h4>Joined On</h4>
              <p>{{joinedOn}}</p>
            </div>
            <div v-if="hasTag('teacher')">
              <h4>Profile Status</h4>
              <v-tooltip bottom>
                <v-item-group slot="activator" >
                  <span style="vertical-align: top;">{{isProfileComplete() ? 'Complete' : 'Incomplete'}}</span>
                  <v-icon small>info</v-icon>
                </v-item-group>
                <span>{{isProfileComplete() ? 'You are eligible to be booked' : 'You are NOT eligible to be booked'}}</span>
              </v-tooltip>
            </div>
            <div v-if="hasTag('teacher')">
              <h4>Profile Link</h4>
              <p v-if="!$store.state.member.slugs || !$store.state.member.slugs[0]">
                Create your profile link in your account! <router-link to="/lounge/profile">Go to account.</router-link>
              </p>
              <p v-else>
                <input class="copy-clipboard" ref="profileLink" :value="profileLink" :readonly="true" />
                <v-btn small @click="copy">Copy To Clipboard</v-btn>
              </p>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
    <v-snackbar
        v-model="textCopied"
        :bottom="true"
        :right="true"
        :timeout="4000"
      >Your profile link has been copied to your clipboard
      </v-snackbar>
  </div>
</template>

<script>
import moment from 'moment'
import Agenda from '@/components/dashboard/Agenda.vue'
import AppointmentView from '@/components/AppointmentView.vue'
import Application from '@/components/Application.vue'
import Loading from '@/components/Loading.vue'
import { Actions, Mutations } from '@/store'
import { delay } from '@/utils/Helpers.js'
import { getAsset } from '@/content/ContentService.js'
import { getMemberAttribute } from '@/graphql/profile/ProfileInfo.gql.js'

export default {
  name: 'lounge',
  components: {
    Agenda,
    Application,
    AppointmentView,
    Loading
  },
  data() {
    return {
      applicationDialog: false,
      interviewScheduled: false,
      success: null,
      error: null,
      textCopied: false
    }
  },
  methods: {
    async resendClaimEmail() {
      try {
        await this.$store.dispatch(Actions.GENERATE_TOKEN, {
          type: 'claim'
        })
        this.setSuccess('Email successfully sent!')
      } catch (e) {
        this.setError(e.message || e)
      }
    },
    hasTag(tag) {
      const tags = this.$store.state.member.tags
      return tags.indexOf(tag) > -1
    },
    async setSuccess(message) {
      this.success = message
      await delay(5000)
      this.success = null
    },
    async setError(message) {
      this.error = message
      await delay(6000)
      this.error = null
    },
    async submitted() {
      this.applicationDialog = false
      const { tags } = this.$store.state.member
      tags.push('applicant')
      this.$store.commit(Mutations.SET_MEMBER, { tags })
      this.setSuccess('Form submitted successfully!')
      window.scrollTo(0, 0)
    },
    isProfileComplete() {
      if (this.teacherProfile && this.teacherProfile.profilePic) {
        return true
      }
      return false
    },
    copy() {
      this.$refs.profileLink.select()
      document.execCommand('copy')
      this.textCopied = true
    }
  },
  computed: {
    profileLink() {
      return `https://www.naativ.com/teacher/${this.$store.state.member.slugs[0].slug}`
    },
    avatar() {
      const { firstName, lastName } = this.$store.state.member
      if (this.teacherProfile && this.teacherProfile.profilePic) {
        return getAsset(this.teacherProfile.profilePic)
      }
      return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&size=128&background=00d3e6`
    },
    birthday() {
      return moment.utc(this.$store.state.member.birthdate).format('MMM Do YYYY')
    },
    joinedOn() {
      return moment.utc(this.$store.state.member.joinedOn).format('MMM Do YYYY')
    },
    isClaimed() {
      return !!this.$store.state.member.claimedOn
    }
  },
  apollo: {
    teacherProfile() {
      return {
        query: getMemberAttribute,
        variables() {
          return {
            input: {
              key: 'teacher-profile',
              memberId: this.$store.state.member.id
            }
          }
        },
        update(result) {
          return result.getMemberAttribute ? result.getMemberAttribute.value : {}
        },
        skip() {
          return !this.$store.state.member.id
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.lounge {
  min-height: calc(100vh - 48px);
  overflow: scroll;

  .v-icon {
    width: 40px;
    height: 40px;
    display: inline-block;
  }
}

.copy-clipboard
  width 100%
  text-align center
  cursor pointer

  &:focus
    outline none

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.avatar {
  width: 175px;
  height: 175px;
  margin: 10px 0;
  border-radius: 100% 0 100% 100% !important;
}

.application-close {
  margin-left: auto;
}

.application-title {
  flex-wrap: nowrap;
}

.todo-list {
  text-align: justify;
}
</style>
