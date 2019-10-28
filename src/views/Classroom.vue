<template>
  <div id="classroom">
    <div id="classroom-container">
      <MediaPermissions :showPermissionModal="showPermissionModal"/>
      <BrowserAlert/>
      <ClassEnd
        v-if="isClassOver"
        :booking="booking"
        :isAssessment="isAssessment"
        :appointment="appointment"
        :remotePresent="this.remoteConnected"
      />
      <div class="top-row">
        <div class="vid">
          <v-card class="ma-1" ref="localTrack" id="Local">
            <div v-if="connected" class="local-actions">
              <v-icon color="white" @click="toggleVideo" v-if="!videoOff">videocam</v-icon>
              <v-icon color="red" @click="toggleVideo" v-if="videoOff">videocam_off</v-icon>
              <v-icon color="white" @click="toggleMute" v-if="!muted">volume_up</v-icon>
              <v-icon color="red" @click="toggleMute" v-if="muted">volume_off</v-icon>
              <img :src="networkIcon" style="width: 20px; height: 20px; float: right;" />
            </div>
            <div class="tracks"></div>
          </v-card>
          <v-card class="ma-1 centered" ref="remoteTrack" id="Remote">
            <p v-if="remoteName" class="remote-name">{{remoteName}}</p>
            <div class="tracks"></div>
          </v-card>
          <v-card class="ma-1 my-1 centered" id="streamActions">
            <v-layout row wrap>
              <v-flex v-if="connected" xs12>
                <h2>Elapsed Time</h2>
                <CountupTimer :from="booking.start" :threshold="60" @thresholdHit="endClass"/>
              </v-flex>
              <v-flex v-if="!connected && booking" xs12>
                <h2>Class Starts In:</h2>
                <CountdownTimer :countdownTo="booking.start" :threshold="300000" @thresholdHit="canEnterClass = true"/>
              </v-flex>
              <v-flex xs12>
                <h2>Actions</h2>
              </v-flex>
              <v-flex xs12>
                <VideoAudioSettings @change="updateTracks" :videoId="videoId" :audioId="audioId" :remoteAudio="remoteAudio" :classroom="true" :permissionsSet="permissionsSet" />
              </v-flex>
              <v-flex v-if="connected" xs12>
                <v-btn color="#fcba00" small depressed class="mx-1 text-capitalize " @click="endClass">End Class
                  <v-icon right dark>check_box</v-icon>
                </v-btn>
              </v-flex>
              <v-flex v-else xs12>
                <v-btn color="#fcba00" small depressed class="mx-1 text-capitalize " @click="confirmLeave">Leave Classroom
                  <v-icon right dark>exit_to_app</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12 v-if="!connected">
                <v-btn
                  :disabled="canEnter()"
                  :loading="!booking || connecting || !slidesReady"
                  color="#4CAF50"
                  large
                  depressed
                  class="text-capitalize "
                  @click="connectRoom"
                >Connect To Class</v-btn>
              </v-flex>
              <v-flex v-if="showDebug">
                <v-btn color="#fcba00" small depressed class="mx-1 text-capitalize " @click="showStats" >Show Stats</v-btn>
              </v-flex>
            </v-layout>
          </v-card>
        </div>
      </div>
      <div class="bottom-row">
        <div v-if="!slidesReady" class="lesson-loading">
          <v-card style="height: 100%; text-align: center; background: transparent;">
            <v-card-text>
              <p class="headline">
                The Lesson is loading...
              </p>
            </v-card-text>
          </v-card>
        </div>
        <div v-if="!loadingLesson && lesson" style="display: inline-block; vertical-align: top; width: 700px;">
          <div class="whiteboard mx-1" ref="whiteboard" style="width: 100%; height: 394px;">
            <canvas
              width="700"
              height="394"
              id="localCanvas"
              @touchstart.prevent="handleMouseDown"
              @touchmove.prevent="handleMouseMove"
              @touchend.prevent="handleMouseUp"
              @mousedown="handleMouseDown"
              @mouseup="handleMouseUp"
              @mousemove="handleMouseMove"
            ></canvas>
            <canvas width="700" height="394" id="remoteCanvas"></canvas>
            <slides
              ref="curriculumSlides"
              :lesson="lesson"
              :onStartExit="endOfSlides"
              :onEndExit="endOfSlides"
              :mouseNavigation="false"
              :keyboardNavigation="false"
              class="slides"
              :repeat="false"
              @slidesReady="slidesReady = true"
            />
          </div>
          <v-card class="ma-1 centered pa-1" id="whiteboardActions" style="width: 100%;">
            <v-layout align-center justify-space-around row fill-height>
              <v-flex md2>
                <v-select
                  hide-details
                  id="slideSelector"
                  :items="totalSlides"
                  v-model="currentSlide"
                  @change="goToSlide"
                  label="GO TO SLIDE"
                ></v-select>
              </v-flex>
              <v-flex md10>
                <v-btn
                  color="#fcba00"
                  small
                  depressed
                  class="text-capitalize white--text"
                  @click="disableWhiteboard"
                  :disabled="!connected"
                >{{remoteWhiteboard ? 'Disable Whiteboard' : 'Enable Whiteboard'}}</v-btn>
                <v-btn
                  :disabled="disabledPrevious || slideLoading"
                  :loading="slideLoading"
                  color="#fcba00"
                  small
                  depressed
                  class="text-capitalize white--text"
                  @click="previousSlide"
                >Previous</v-btn>
                <v-btn
                  color="#fcba00"
                  small
                  depressed
                  class="text-capitalize white--text"
                  @click="clearWhiteboard"
                >Clear Whiteboard</v-btn>
                <v-btn
                  :disabled="disabledNext || slideLoading"
                  :loading="slideLoading"
                  color="#fcba00"
                  small
                  depressed
                  class="text-capitalize white--text"
                  @click="nextSlide"
                >Next</v-btn>
              </v-flex>
            </v-layout>
          </v-card>
        </div>
        <v-card
          v-if="!loadingLesson && lesson"
          id="whiteboardNotes"
          style="height: 454px; overflow: hidden; display: inline-block; width: 312px; vertical-align: top; margin-left: 7px;"
        >
          <v-tabs ref="tabs" grow color="#fcba00" slider-color="#00d3e6">
            <v-tab ripple key="tips" @click="$refs.teacherTips.update()">Tips</v-tab>
            <v-tab ripple key="ActionsOutput" @click="$refs.actionOutput.update()">Student</v-tab>
            <v-tab ripple key="chat" @click="unreadMessages = 0">
              <v-badge color="red" overlap>
                <span v-if="unreadMessages > 0" slot="badge">{{unreadMessages}}</span>
                Chat
              </v-badge>
            </v-tab>
            <v-tab-item key="tips" style="height: 406px; overflow: scroll;">
              <v-card flat>
                <v-card-text>
                  <TeacherTips ref="teacherTips" :currentSlide="currentSlide" :lesson="lesson"/>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="ActionsOutput" style="height: 406px; overflow: scroll;">
              <v-card flat>
                <v-card-text>
                  <ActionsOutput ref="actionOutput" :currentSlide="currentSlide" :lesson="lesson"/>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="chat" style="height: 406px; overflow: scroll;">
              <div v-if="!connected">
                Please connect to the class before using this feature
              </div>
              <Chat v-else :addChat="addChat" :chat="chat"/>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </div>
    </div>
    <v-snackbar v-model="snackbar" bottom :timeout="3000">
      {{snackbarMessage}}
    </v-snackbar>
    <template v-if="appointment">
      <Heartbeat :frequency="10000" :fn="heartbeat" />
    </template>
    <LeaveEarlyDialog
      :showDialog="showLeaveEarly"
      @cancel="showLeaveEarly = false"
      @confirm="leaveClassroom(true)"
    />
    <LessonAlreadyEndedDialog
      :showDialog="appointmentAlreadyEnded"
      @confirm="leaveClassroom(true)"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'

import {
  upsertAppointment,
  APPOINTMENT_BY_BOOKING_ID
} from '@/appointment/Appointments.gql'
import { Actions } from '@/appointment/Store'
import { Actions as LessonActions } from '@/Lessons/Store'
import { GET_BOOKING } from '@/graphql/Booking.gql'
import { VIDEO_ROOM_TOKEN } from '@/graphql/Tokens.gql.js'

import ActionsOutput from '@/Classroom/ActionsOutput.vue'
import BrowserAlert from '@/components/BrowserAlert.vue'
import Chat from '@/Classroom/Chat.vue'
import ClassEnd from '@/Classroom/ClassEnd.vue'
import CountupTimer from '@/components/interviewRoom/CountupTimer.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import Heartbeat from '@/components/Heartbeat.vue'
import LeaveEarlyDialog from '@/components/classroom/LeaveEarlyDialog.vue'
import LessonAlreadyEndedDialog from '@/components/classroom/LessonAlreadyEnded.vue'
import MediaPermissions from '@/components/MediaPermissions.vue'
import slides from '@/Classroom/Slides.vue'
import TeacherTips from '@/Classroom/TeacherTips.vue'
import VideoAudioSettings from '@/components/interviewRoom/VideoAudioSettings.vue'

import { delay } from '@/utils/Helpers.js'

const {
  connect,
  createLocalTracks,
  LocalDataTrack,
  createLocalVideoTrack,
  createLocalAudioTrack
} = require('twilio-video')

export default {
  name: 'Classroom',
  components: {
    ActionsOutput,
    BrowserAlert,
    Chat,
    ClassEnd,
    CountdownTimer,
    CountupTimer,
    Heartbeat,
    LeaveEarlyDialog,
    MediaPermissions,
    slides,
    TeacherTips,
    VideoAudioSettings,
    LessonAlreadyEndedDialog
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isClassOver) {
      this.stop()
    }
    next()
  },
  beforeDestroy() {
    if (!this.isClassOver) {
      this.stop()
    }
  },
  mounted() {
    const kode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
    const length = kode.length
    var pos = 0
    document.addEventListener('keydown', (event) => {
      if (event.keyCode === kode[pos++]) {
        if (length === pos) {
          this.showDebug = !this.showDebug
          pos = 0
          return false
        }
      } else {
        pos = 0
      }
    }, false)
    this.$nextTick(function () {
      this.getLocalTracks()
    })
  },
  data() {
    return {
      lesson: null,
      lessonId: null,
      loadingLesson: true,
      slidesReady: false,
      appointment: null,
      booking: null,
      getBooking: null,
      appointmentAlreadyEnded: false,
      connecting: false,
      canEnterClass: null,
      chat: [],
      connected: false,
      currentSlide: 1,
      disabledNext: false,
      disabledPrevious: true,
      isClassOver: false,
      localVid: '',
      mouse: {
        current: { x: 0, y: 0 },
        previous: { x: 0, y: 0 },
        remote: { x: 0, y: 0 },
        down: false
      },
      muted: false,
      networkQualityLevel: 5,
      newTracks: {},
      remoteAudio: 'default',
      remoteConnected: false,
      remoteDisconnected: false,
      remoteVid: '',
      remoteWhiteboard: false,
      room: null,
      showDebug: false,
      showLeaveEarly: false,
      showPermissionModal: false,
      slideLoading: false,
      totalSlides: [],
      snackbar: false,
      snackbarMessage: null,
      tracks: { video: null, audio: null, data: null },
      unreadMessages: 0,
      videoOff: false,
      permissionsSet: false
    }
  },
  methods: {
    ...mapActions({
      insertLog: Actions.INSERT_LOG,
      getLesson: LessonActions.GET
    }),
    async showStats() {
      const convert = 1000
      let stats = await this.room.getStats()
      console.log(stats[0].localVideoTrackStats[0])
      let first = stats[0].localVideoTrackStats[0].bytesSent / convert
      await delay(1000)
      console.log('1 Second')
      stats = await this.room.getStats()
      let second = stats[0].localVideoTrackStats[0].bytesSent / convert
      console.log(`${second - first} kbs`)
      first = second
      await delay(1000)
      console.log('2 Second')
      stats = await this.room.getStats()
      second = stats[0].localVideoTrackStats[0].bytesSent / convert
      console.log(`${second - first} kbs`)
      first = second
      await delay(1000)
      console.log('3 Second')
      stats = await this.room.getStats()
      second = stats[0].localVideoTrackStats[0].bytesSent / convert
      console.log(`${second - first} kbs`)
      first = second
      await delay(1000)
      console.log('4 Second')
      stats = await this.room.getStats()
      second = stats[0].localVideoTrackStats[0].bytesSent / convert
      console.log(`${second - first} kbs`)
      first = second
      await delay(1000)
      console.log('5 Second')
      stats = await this.room.getStats()
      second = stats[0].localVideoTrackStats[0].bytesSent / convert
      console.log(`${second - first} kbs`)
      first = second
    },
    canEnter() {
      if (this.booking && this.canEnterClass && !this.connecting && this.slidesReady) {
        return false
      }
      return true
    },
    disableWhiteboard() {
      this.remoteWhiteboard = !this.remoteWhiteboard
      this.tracks.data.send(
        JSON.stringify({ type: 'remoteWhiteboard', value: this.remoteWhiteboard })
      )
    },
    async getLocalTracks() {
      this.showPermissionModal = false
      try {
        const userAgent = window.navigator.userAgent
        let videoConstraints = { facingMode: 'user', width: { ideal: 320 }, frameRate: 30 }
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
          console.log('USING DIFFERENT CONSTRAINTS ON mobile')
          videoConstraints = { facingMode: 'user' }
        }
        const localTrack = await createLocalTracks({
          audio: true,
          video: videoConstraints
        })
        const localMediaContainer = document.querySelector('#Local .tracks')
        localTrack.forEach(track => {
          this.tracks[track.kind] = track
          this.attachTracks([track], localMediaContainer)
        })
        this.permissionsSet = true
      } catch (e) {
        this.permissionsSet = false
        this.showPermissionModal = true
        this.$sentry.captureException(e)
        console.log(e)
      }
    },
    detachTracks(tracks) {
      tracks.forEach((track) => {
        track.detach().forEach((detachedElement) => {
          detachedElement.remove()
        })
      })
    },
    attachTracks(tracks, container) {
      tracks.forEach((track) => {
        container.appendChild(track.attach())
      })
    },
    updateTracks(newTracks) {
      if (newTracks.video) {
        this.tracks.video.stop()
        createLocalVideoTrack({ deviceId: { exact: newTracks.video } })
          .then(localVideoTrack => {
            const tracks = [this.tracks.video]
            if (this.room) {
              this.room.localParticipant.unpublishTracks(tracks)
            }
            this.detachTracks(tracks)
            if (this.room) {
              this.room.localParticipant.publishTrack(localVideoTrack)
            }
            const localMediaContainer = document.querySelector('#Local .tracks')
            this.attachTracks([localVideoTrack], localMediaContainer)
            this.tracks.video = localVideoTrack
          })
      }
      if (newTracks.audio) {
        createLocalAudioTrack({
          deviceId: { exact: newTracks.audio }
        }).then((localAudioTrack) => {
          const tracks = [this.tracks.audio]
          if (this.room) {
            this.room.localParticipant.unpublishTracks(tracks)
          }
          this.detachTracks(tracks)
          if (this.room) {
            this.room.localParticipant.publishTrack(localAudioTrack)
          }
          const localMediaContainer = document.querySelector('#Local .tracks')
          this.attachTracks([localAudioTrack], localMediaContainer)
          this.tracks.audio = localAudioTrack
        })
      }
      if (newTracks.speaker) {
        this.remoteAudio = newTracks.speaker
        const elem = document.querySelector('#Remote audio')
        if (elem && elem.setSinkId) {
          elem.setSinkId(newTracks.speaker)
        }
      }
    },
    endOfSlides() {
      return false
    },
    nextSlide() {
      this.slideLoading = true
      const nextSlide = this.$refs.curriculumSlides.currentSlideIndex + 1
      this.$refs.curriculumSlides.currentSlideIndex = nextSlide
      this.currentSlide = this.$refs.curriculumSlides.currentSlideIndex
      if (this.tracks.data) {
        this.tracks.data.send(JSON.stringify({ type: 'goToSlide', slide: nextSlide }))
      }
      this.clearWhiteboard()
      this.updateSlideButtons()
      this.insertLog({
        appointmentId: this.appointment.id,
        metadata: {
          memberId: this.$store.state.member.id,
          type: 'next',
          lobby: !this.connected
        },
        type: 'lesson:slide'
      })
    },
    previousSlide() {
      this.slideLoading = true
      const prevSlide = this.$refs.curriculumSlides.currentSlideIndex - 1
      this.$refs.curriculumSlides.currentSlideIndex = prevSlide
      this.currentSlide = this.$refs.curriculumSlides.currentSlideIndex
      if (this.tracks.data) {
        this.tracks.data.send(JSON.stringify({ type: 'goToSlide', slide: prevSlide }))
      }
      this.clearWhiteboard()
      this.updateSlideButtons()
      this.insertLog({
        appointmentId: this.appointment.id,
        metadata: {
          memberId: this.$store.state.member.id,
          type: 'previous',
          lobby: !this.connected
        },
        type: 'lesson:slide'
      })
    },
    goToSlide(slide, remote) {
      this.slideLoading = true
      this.$refs.curriculumSlides.currentSlideIndex = slide
      this.currentSlide = this.$refs.curriculumSlides.currentSlideIndex
      this.updateSlideButtons()
      if (!remote && this.tracks.data) {
        this.tracks.data.send(JSON.stringify({ type: 'goToSlide', slide }))
      }
      this.insertLog({
        appointmentId: this.appointment.id,
        metadata: {
          memberId: this.$store.state.member.id,
          type: 'goToSlide',
          slide,
          remote,
          lobby: !this.connected
        },
        type: 'lesson:slide'
      })
    },
    updateSlideButtons() {
      if (this.$refs.curriculumSlides.currentSlideIndex === 1) {
        this.disabledPrevious = true
      } else {
        this.disabledPrevious = false
      }
      if (this.$refs.curriculumSlides.currentSlideIndex === this.$refs.curriculumSlides.slides.length) {
        this.disabledNext = true
      } else {
        this.disabledNext = false
      }
      this.slideLoading = false
    },
    clearWhiteboard(type) {
      if (type === 'remote') {
        const c2 = document.getElementById('remoteCanvas')
        const context2 = c2.getContext('2d')
        context2.clearRect(0, 0, c2.width, c2.height)
      } else {
        const c1 = document.getElementById('localCanvas')
        const context1 = c1.getContext('2d')
        context1.clearRect(0, 0, c1.width, c1.height)
        const c2 = document.getElementById('remoteCanvas')
        const context2 = c2.getContext('2d')
        context2.clearRect(0, 0, c2.width, c2.height)
        if (this.tracks.data) {
          this.tracks.data.send(JSON.stringify({ type: 'clear' }))
        }
      }
    },
    toggleMute() {
      this.tracks['audio'].enable(this.muted)
      this.muted = !this.muted
    },
    toggleVideo() {
      this.tracks['video'].enable(this.videoOff)
      this.videoOff = !this.videoOff
    },
    async connectRoom() {
      this.connecting = true
      this.snackbar = true
      this.snackbarMessage = 'Connecting to Classroom'
      this.tracks.data = new LocalDataTrack()
      const roomName = `classroom-${this.$route.params.bookingId}`
      const { data: { grantVideoAccess } } = await this.$apollo.mutate({
        mutation: VIDEO_ROOM_TOKEN,
        variables: {
          roomInput: {
            room: roomName
          }
        }
      })
      this.room = await connect(
        grantVideoAccess.token,
        {
          name: roomName,
          tracks: Object.values(this.tracks),
          preferredVideoCodecs: ['H264', 'VP8'],
          networkQuality: true
        }
      )
      this.connected = true
      this.connecting = false
      if (!this.appointment.startTime) {
        await this.updateAppointment({ startTime: moment.utc(), status: 100 })
      }
      this.insertLog({
        appointmentId: this.appointment.id,
        metadata: {
          memberId: this.$store.state.member.id,
          userAgent: navigator.userAgent,
          lobby: !this.connected
        },
        type: 'room:connected'
      })
      this.$nextTick(async function () {
        this.room.localParticipant.on('networkQualityLevelChanged', this.networkQualityChanged)
        this.networkQualityLevel = this.room.localParticipant.networkQualityLevel
        this.room.on('participantConnected', this.addParticipant)
        this.room.on('participantDisconnected', this.participantDisconnected)
        this.room.participants.forEach(this.addParticipant)
        this.snackbar = true
        this.snackbarMessage = 'Connected Successfully!'
      })
    },
    networkQualityChanged(level) {
      this.networkQualityLevel = level
    },
    addParticipant(participant) {
      this.remoteConnected = true
      this.remoteDisconnected = false
      this.snackbarMessage = 'The student has joined'
      this.snackbar = true
      participant.tracks.forEach(this.trackSubscribed)
      participant.on('trackSubscribed', this.trackSubscribed)
    },
    trackSubscribed(track) {
      if (track.kind === 'data') {
        track.on('message', this.handleDataMessage)
      } else {
        const removeMe = document.querySelector(`#Remote ${track.kind}`)
        if (removeMe) {
          removeMe.remove()
        }
        const elem = track.attach()
        document.querySelector('#Remote .tracks').appendChild(elem)
        if (track.kind === 'audio') {
          if (elem.setSinkId) {
            elem.setSinkId(this.remoteAudio)
          }
        }
      }
    },
    participantDisconnected(participant) {
      this.remoteDisconnected = true
      const remoteVideo = document.getElementById('#Remote .tracks video')
      const remoteAudio = document.getElementById('#Remote .tracks audio')
      if (remoteVideo) {
        remoteVideo.remove()
      }
      if (remoteAudio) {
        remoteAudio.remove()
      }
    },
    handleDataMessage(data) {
      const { type, value } = JSON.parse(data)
      if (type === 'whiteboard') {
        const { x, y } = value
        this.mouse.remote = { x, y }
        this.draw(null, 'remote')
      } else if (type === 'clear') {
        this.clearWhiteboard('remote')
      } else if (type === 'mouseDown') {
        this.handleMouseDown(null, 'remote', value)
      } else if (type === 'chat') {
        this.addChat(value, 'remote')
      }
    },
    addChat(message, type) {
      if (type === 'local') {
        this.tracks.data.send(
          JSON.stringify({ type: 'chat', value: message })
        )
      } else {
        this.unreadMessages += 1
      }
      this.chat.push({
        type,
        value: message
      })
    },
    draw(event, type) {
      let c = document.getElementById('localCanvas')
      let ctx = c.getContext('2d')
      if (type === 'remote') {
        c = document.getElementById('remoteCanvas')
        ctx = c.getContext('2d')
      }
      if (this.mouse.down || type === 'remote') {
        if (type === 'remote') {
          ctx.strokeStyle = '#0D122B'
          ctx.lineTo(this.mouse.remote.x, this.mouse.remote.y)
        } else {
          if (this.tracks.data) {
            this.tracks.data.send(
              JSON.stringify({ type: 'whiteboard', value: this.currentMouse })
            )
          }
          ctx.lineTo(this.currentMouse.x, this.currentMouse.y)
          ctx.strokeStyle = '#f382ae'
        }
        ctx.lineWidth = 2
        ctx.stroke()
      }
    },
    handleMouseDown(event, type, data) {
      let c = document.getElementById('localCanvas')
      let ctx = c.getContext('2d')
      if (type === 'remote' && data) {
        c = document.getElementById('remoteCanvas')
        ctx = c.getContext('2d')
        ctx.beginPath()
        ctx.moveTo(data.x, data.y)
      } else {
        this.mouse.down = true
        const x = event.touches ? event.touches[0].clientX : event.clientX
        const y = event.touches ? event.touches[0].clientY : event.clientY
        this.mouse.current = { x, y }
        ctx.beginPath()
        ctx.moveTo(this.currentMouse.x, this.currentMouse.y)
        if (this.tracks.data) {
          this.tracks.data.send(
            JSON.stringify({ type: 'mouseDown', value: this.currentMouse })
          )
        }
      }
    },
    handleMouseUp(type) {
      if (type === 'remote') {
        let c = document.getElementById('remoteCanvas')
        let ctx = c.getContext('2d')
        ctx.closePath()
      } else {
        let c = document.getElementById('localCanvas')
        let ctx = c.getContext('2d')
        ctx.closePath()
        if (this.tracks.data) {
          this.tracks.data.send(
            JSON.stringify({ type: 'mouseDown' })
          )
        }
        this.mouse.down = false
        this.insertLog({
          appointmentId: this.appointment.id,
          metadata: {
            memberId: this.$store.state.member.id,
            lobby: !this.connected
          },
          type: 'drawing:completed'
        })
      }
    },
    handleMouseMove(event) {
      let c = document.getElementById('localCanvas')
      c.getBoundingClientRect()
      if (this.mouse.down) {
        const x = event.touches ? event.touches[0].clientX : event.clientX
        const y = event.touches ? event.touches[0].clientY : event.clientY
        this.mouse.current = { x, y }
        this.draw(event)
      }
    },
    stop() {
      if (this.tracks.audio) {
        this.tracks.audio.stop()
      }
      if (this.tracks.video) {
        this.tracks.video.stop()
      }
    },
    async updateAppointment(updates, lessonId) {
      this.appointment = { ...this.appointment, ...updates }
      await this.$apollo.mutate({
        mutation: upsertAppointment,
        variables: {
          appt: {
            id: this.appointment.id,
            hostId: this.booking.hostId,
            bookingId: this.booking.id,
            type: this.appointment.type,
            scheduledDate: this.booking.start,
            participants: [this.booking.guestId],
            endTime: this.appointment.endTime,
            startTime: this.appointment.startTime,
            status: this.appointment.status,
            lessonId,
            profileId: this.booking.profileId
          }
        }
      })
    },
    async endClass() {
      if (this.tracks.data) {
        this.tracks.data.send(JSON.stringify({ type: 'endClass' }))
      }
      await this.updateAppointment({ endTime: moment.utc(), status: 200 }, this.lessonId)
      this.stop()
      this.room.disconnect()
      this.isClassOver = true
    },
    confirmLeave() {
      const start = moment(this.booking.start)
      const validWindow = moment().isAfter(start.add(15, 'minutes'))
      if (!this.connected || (this.connected && validWindow)) {
        return this.leaveClassroom()
      }
      this.showLeaveEarly = true
    },
    async leaveClassroom(early = false) {
      if (early) {
        await this.updateAppointment({ status: 300 })
      }
      this.stop()
      if (this.connected) {
        this.room.disconnect()
      }
      if (this.appointment) {
        this.insertLog({
          appointmentId: this.appointment.id,
          metadata: {
            memberId: this.$store.state.member.id,
            trigger: 'leaveClassroom',
            lobby: !this.connected
          },
          type: 'session:ended'
        })
      }
      this.isClassOver = true
      this.$router.push('/lounge/dashboard')
    },
    leftKeyListener(event) {
      if (event.keyCode === 37) {
        if (this.$refs.curriculumSlides.currentSlideIndex > 1) {
          this.previousSlide()
        }
      }
    },
    rightKeyListener(event) {
      if (event.keyCode === 39) {
        if (this.$refs.curriculumSlides.currentSlideIndex < this.$refs.curriculumSlides.slides.length) {
          this.nextSlide()
        }
      }
    },
    unreadMessage() {
      this.unreadMessage++
    },
    heartbeat() {
      this.insertLog({
        appointmentId: this.appointment.id,
        metadata: {
          heartbeat: true,
          participant: 'teacher',
          memberId: this.$store.state.member.id,
          networkQualityLevel: this.networkQualityLevel,
          whiteboardEnabled: this.remoteWhiteboard,
          currentSlide: this.currentSlide,
          muted: this.muted,
          videoOff: this.videoOff,
          remoteConnected: this.remoteConnected,
          remoteDisconnected: this.remoteDisconnected,
          lobby: !this.connected
        },
        type: 'tech:misc'
      })
    },
    async prepareLesson() {
      this.isAssessment = this.booking.profile.enrollments.length === 0
      const { data } = await this.$apollo.mutate({
        mutation: APPOINTMENT_BY_BOOKING_ID,
        variables: {
          input: {
            bookingId: this.booking.id,
            timeLimit: 25,
            maxParticipant: 2,
            type: this.isAssessment ? 'PLACEMENT' : 'CLASSROOM'
          }
        }
      })
      this.appointment = data.appointmentObtain
      if (this.appointment.endTime || (this.appointment.attendance && this.appointment.attendance)) {
        this.appointmentAlreadyEnded = true
      } else {
        this.loadingLesson = true
        const age = moment(this.booking.profile.birthdate, 'YYYY-MM-DD')
        this.lessonId = moment().diff(age, 'years') <= 14 ? ~~process.env.VUE_APP_ASSESSMENT_LESSON_ID : ~~process.env.VUE_APP_ASSESSMENT_ADULT_LESSON_ID

        if (!this.isAssessment) {
          this.lessonId = this.booking.profile.enrollments[0].nextLessonIds[0]
        }
        this.lesson = await this.getLesson(this.lessonId)
        this.loadingLesson = false
        this.$nextTick(function () {
          if (this.$refs.curriculumSlides) {
            this.totalSlides = this.$refs.curriculumSlides.slides.map((slide, index) => { return index + 1 })
          }
        })
      }
    }
  },
  apollo: {
    getBooking: {
      query: GET_BOOKING,
      variables() {
        return { input:
          {
            ids: [~~this.$route.params.bookingId],
            start: moment().subtract(30, 'minutes'),
            end: moment().add(25, 'hours')
          }
        }
      },
      async update({ bookings }) {
        if (bookings && bookings.length) {
          const booking = bookings[0]
          const classStart = moment(booking.start)
          const canEnterClass = moment(classStart).subtract(5, 'minutes')
          this.booking = booking
          await this.prepareLesson()
          this.canEnterClass = moment().isAfter(canEnterClass)
          return booking
        }
        console.log('There is no booking with this id')
        return null
      }
    }
  },
  computed: {
    networkIcon() {
      return `/images/network-level-${this.networkQualityLevel}.png`
    },
    videoId() {
      return this.tracks.video && this.tracks.video.mediaStreamTrack.getSettings().deviceId
    },
    audioId() {
      return this.tracks.audio && this.tracks.audio.mediaStreamTrack.getSettings().deviceId
    },
    remoteName() {
      if (this.connected && this.booking) {
        if (this.remoteDisconnected) {
          return `${this.booking.profile.displayName} has disconnected`
        }
        if (!this.remoteConnected && this.connected) {
          return `Waiting for ${this.booking.profile.displayName} to join`
        }
        return this.booking.profile.displayName
      }
    },
    currentMouse: function () {
      var c = document.getElementById('localCanvas')
      var rect = c.getBoundingClientRect()
      return {
        x: this.mouse.current.x - rect.left,
        y: this.mouse.current.y - rect.top
      }
    }
  },
  created: function() {
    document.addEventListener('keyup', this.leftKeyListener)
    document.addEventListener('keyup', this.rightKeyListener)
  },
  destroyed: function() {
    document.removeEventListener('keyup', this.leftKeyListener)
    document.removeEventListener('keyup', this.rightKeyListener)
  }
}
</script>

<style lang="stylus">
#classroom {
  #classroom-container {
    width: 1024px;
    height: 768px;
    margin: auto;
    background-color: #00d3e6;
    border-radius: 5px;
    position: relative;

    .local-actions {
      position: absolute;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.4);
      width: 100%;
    }

    .remote-name {
      width: 100%;
      margin: 0px;
      padding: 0px;
      position: absolute;
      padding: 5px;
      background-color: rgba(0, 0, 0, 0.4);
      color: #fff;
      right: 0;
      font-weight: bold;
    }

    .bottom-row {
      position: absolute;
      width: 1022px;
      height: 440px;
      margin: 1px;
    }

    #streamActions {
      height: 300px;
      width: 200px;
    }

    .full-height {
      height: 100%;
      position: relative;
    }

    .full-height--actions {
      height: calc(100% - 48px);
      position: relative;
    }

    .full-center {
      position: relative;

      .center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .vid {
      width: 100%;
      display: inline-block;
      position: relative;
      height: 100%;

      & > div {
        display: inline-block;
        vertical-align: middle;
      }

      #Local, #Remote {
        width: 400px;
        height: 300px;

        .tracks {
          width: 100%;
        }

        video {
          width: 100%;
        }
      }

      .video-alert {
        background-color: rgba(0, 0, 0, 0.6);
        color: #ffffff;
        position: absolute;
        right: 0;
        left: 0;
        padding: 20px;
        text-align: center;
        font-size: 24px;
        z-index: 100;
      }
    }

    .lesson-loading {
      left: 4px;
      display: inline-block;
      vertical-align: top;
      width: 1015px;
      height: 454px;
      position: absolute;
      z-index: 200;
      background-image: url(../assets/images/bubble-snip.jpeg)
      background-size: cover;
      background-position: center;
    }

    #whiteboard {
      min-height: 460px;
    }

    .whiteboard {
      position: relative;
      height: 450px;

      canvas {
        box-shadow: 0px 0px 1px #000000;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;

        &#localCanvas {
          z-index: 100;
        }

        &#remoteCanvas {
          z-index: 50;
        }
      }
    }

  }
  .slides {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    width: 700px;
    height: 394px;
    overflow: hidden;
    /* 750/422 */
    /* 700/394 */
    /* 650/365 */
    /* 600/337 */
    /* 550/309 */
  }
}
</style>
