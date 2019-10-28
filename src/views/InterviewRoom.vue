<template>
  <div id="interview-room">
    <div id="interview-container">
      <MediaPermissions :showPermissionModal="showPermissionModal"/>
      <BrowserAlert/>
      <interviewEnd
        v-if="interviewOver"
        :isHost="isHost"
        :participantId="appointment.participantIds[0]"
      />
      <div class="top-row">
        <div class="vid">
          <v-card class="ma-1" ref="localTrack" id="Local">
            <div v-if="connected" class="local-actions">
              <v-icon color="white" @click="toggleVideo" v-if="!videoOff">videocam</v-icon>
              <v-icon color="red" @click="toggleVideo" v-if="videoOff">videocam_off</v-icon>
              <v-icon color="white" @click="toggleMute" v-if="!muted">volume_up</v-icon>
              <v-icon color="red" @click="toggleMute" v-if="muted">volume_off</v-icon>
            </div>
            <div class="tracks"></div>
          </v-card>
          <v-card class="ma-1 centered" ref="remoteTrack" id="Remote">
            <p v-if="connected" class="remote-name">{{remoteName}}</p>
            <div class="tracks"></div>
          </v-card>
          <v-card class="ma-1 my-1 centered" id="streamActions">
            <v-layout row wrap>
              <v-flex v-if="connected" xs12>
                <h2>Elapsed Time</h2>
                <CountupTimer :from="appointment.start"/>
              </v-flex>
              <v-flex xs12>
                <h2>Actions</h2>
              </v-flex>
              <v-flex xs12>
                <VideoAudioSettings
                  @change="updateTracks"
                  :videoId="videoId"
                  :audioId="audioId"
                  :remoteAudio="remoteAudio"
                />
              </v-flex>
              <v-flex v-if="connected" xs12>
                <v-btn
                  v-if="isHost"
                  color="#00d3e6"
                  small
                  depressed
                  class="mx-1 text-capitalize white--text"
                  @click="endInterview"
                >End Interview
                  <v-icon right dark>check_box</v-icon>
                </v-btn>
              </v-flex>
              <v-flex v-if="connected" xs12>
                <v-btn
                  v-if="isHost"
                  color="#00d3e6"
                  small
                  depressed
                  class="mx-1 text-capitalize white--text"
                  @click="cancelInterview(true)"
                >Leave Interview
                  <v-icon right dark>exit_to_app</v-icon>
                </v-btn>
              </v-flex>
              <v-flex v-if="connected" xs12>
                <v-btn
                  v-if="!isHost"
                  color="#00d3e6"
                  small
                  depressed
                  class="mx-1 text-capitalize white--text"
                  @click="leaveInterview"
                >Leave Interview
                  <v-icon right dark>exit_to_app</v-icon>
                </v-btn>
              </v-flex>
              <v-flex v-if="showDebug">
                <v-btn
                  color="#00d3e6"
                  small
                  depressed
                  class="mx-1 text-capitalize white--text"
                  @click="showStats"
                >Show Stats</v-btn>
              </v-flex>
            </v-layout>
          </v-card>
        </div>
      </div>
      <div class="bottom-row">
        <v-card v-if="!connected" class="centered full-height full-center">
          <div class="center">
            <img class="logo" src="../assets/images/logo-alt.svg">
            <br>Please make sure you look presentable
            <br>
            <v-btn
              :disabled="!appointment || connecting"
              :loading="!appointment || connecting"
              color="#00d3e6"
              large
              depressed
              class="text-capitalize white--text"
              @click="connectRoom"
            >Connect To Interview</v-btn>
            <br>
            <div v-if="isHost">Note: By clicking this button you are starting the interview.</div>
            <v-btn
              color="#00d3e6"
              large
              depressed
              class="text-capitalize white--text"
              @click="cancelInterview(false)"
            >Back To Lounge</v-btn>
          </div>
        </v-card>
        <div v-if="connected" style="display: inline-block; vertical-align: top;">
          <div class="whiteboard mx-1" ref="whiteboard" style="width: 700px; height: 394px;">
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
              :onStartExit="endOfSlides"
              :onEndExit="endOfSlides"
              :mouseNavigation="false"
              :keyboardNavigation="false"
              class="slides"
              :repeat="false"
            />
          </div>
          <v-card class="ma-1 centered pa-1" id="whiteboardActions">
            <v-layout align-center justify-space-around row fill-height>
              <v-flex d-flex xs12>
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
                <v-btn
                  :disabled="disabledPrevious || slideLoading"
                  :loading="slideLoading"
                  color="#00d3e6"
                  small
                  depressed
                  class="text-capitalize white--text"
                  @click="previousSlide"
                >Previous</v-btn>
                <v-btn
                  color="#00d3e6"
                  small
                  depressed
                  class="text-capitalize white--text"
                  @click="clearWhiteboard"
                >Clear Whiteboard</v-btn>
                <v-btn
                  :disabled="disabledNext || slideLoading"
                  :loading="slideLoading"
                  color="#00d3e6"
                  small
                  depressed
                  class="text-capitalize white--text"
                  @click="nextSlide"
                >Next</v-btn>
                <v-badge v-if="connected && !interviewOver" color="red" overlap>
                  <span v-if="unreadMessages > 0" slot="badge">{{unreadMessages}}</span>
                  <v-btn
                    color="#f382ae"
                    @click="toggleChat"
                    small
                    depressed
                    class="text-capitalize white--text"
                  >{{toggleChatText}}</v-btn>
                </v-badge>
              </v-flex>
            </v-layout>
          </v-card>
        </div>
        <v-card
          v-if="connected"
          id="whiteboardNotes"
          style="height: 454px; overflow: hidden; display: inline-block; width: 312px;  vertical-align: top;"
        >
          <v-tabs color="#00d3e6" dark slider-color="rgb(252, 186, 0)">
            <v-tab v-if="isHost" ripple key="extra">Extra</v-tab>
            <v-tab ripple key="notes">Notes</v-tab>
            <v-tab-item v-if="isHost" key="extra" style="height: 391px; overflow: scroll;">
              <v-card flat>
                <v-card-text>
                  <ul v-if="getSurvey">
                    <li v-for="(answer, index) in getSurvey" :key="index">
                      <strong>{{answer.questionName}}</strong>
                      <br>
                      {{answer.values[0].value}}
                    </li>
                  </ul>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="notes" style="height: 391px; overflow: scroll;">
              <v-card flat>
                <v-card-text>
                  <mockNotes :currentSlide="currentSlide"/>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>
      </div>
      <v-card class="chat" :class="{'active': showChat}">
        <div class="bubbles">
          <div v-for="(bubble, i) in chat" :key="i" :class="bubble.type">
            <span class="bubble">{{bubble.value}}</span>
          </div>
        </div>
        <div class="chat-actions">
          <v-form @submit.prevent="sendChat">
            <v-textarea
              @keyup.enter.native="sendChat"
              outline
              v-model.trim="currentChat"
              label="Enter Message"
            />
            <v-btn color="#00d3e6" depressed class="text-capitalize white--text" type="submit">Send</v-btn>
          </v-form>
        </div>
      </v-card>
    </div>
    <v-snackbar v-model="snackbar" bottom :timeout="3000">{{snackbarMessage}}</v-snackbar>
  </div>
</template>

<script>
import { VIDEO_ROOM_TOKEN } from '@/graphql/Tokens.gql.js'
import { upsertAppointment } from '@/graphql/Appointments.gql.js'
import { GET_APPOINTMENT } from '@/graphql/Interview.gql.js'
import { delay } from '@/utils/Helpers.js'
import CountupTimer from '@/components/interviewRoom/CountupTimer.vue'
import slides from '@/components/interviewRoom/IntreviewSlides.vue'
import mockNotes from '@/components/interviewRoom/MockClassNotes.vue'
import interviewEnd from '@/components/interviewRoom/InterviewEnd.vue'
import VideoAudioSettings from '@/components/interviewRoom/VideoAudioSettings.vue'
import BrowserAlert from '@/components/BrowserAlert.vue'
import MediaPermissions from '@/components/MediaPermissions.vue'
import moment from 'moment'
const { connect, createLocalTracks, LocalDataTrack, createLocalVideoTrack, createLocalAudioTrack } = require('twilio-video')
export default {
  name: 'InterviewRoom',
  components: {
    slides,
    CountupTimer,
    mockNotes,
    interviewEnd,
    VideoAudioSettings,
    BrowserAlert,
    MediaPermissions
  },
  beforeDestroy() {
    if (!this.interviewOver) {
      this.stop()
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.interviewOver) {
      this.stop()
    }
    next()
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
      error: false,
      totalSlides: [],
      showPermissionModal: false,
      showDebug: false,
      connecting: false,
      currentSlide: 1,
      slideLoading: false,
      appointment: null,
      disabledNext: false,
      disabledPrevious: true,
      showChat: false,
      isHost: false,
      remoteConnected: false,
      snackbar: false,
      snackbarMessage: null,
      interviewOver: false,
      chat: [],
      currentChat: '',
      connected: false,
      remoteDisconnected: false,
      remoteAudio: 'default',
      room: null,
      mouse: {
        current: {
          x: 0,
          y: 0
        },
        previous: {
          x: 0,
          y: 0
        },
        remote: {
          x: 0,
          y: 0
        },
        down: false
      },
      localVid: '',
      remoteVid: '',
      tracks: {
        video: null,
        audio: null,
        data: null
      },
      newTracks: {},
      muted: false,
      videoOff: false,
      toggleChatText: 'Show Chat',
      unreadMessages: 0
    }
  },
  methods: {
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
      } catch (e) {
        this.showPermissionModal = true
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
    toggleChat() {
      this.showChat = !this.showChat
      this.toggleChatText = this.showChat ? 'Close Chat' : 'Show Chat'
      this.unreadMessages = 0
    },
    endOfSlides() {
      return false
    },
    scrollTo(id) {
      this.currentSlide = id
      document.querySelector(`#slide${id}`).scrollIntoView()
    },
    nextSlide(type) {
      this.slideLoading = true
      const nextSlide = this.$refs.curriculumSlides.currentSlideIndex + 1
      this.$refs.curriculumSlides.currentSlideIndex = nextSlide
      if (type !== 'remote') {
        this.tracks.data.send(JSON.stringify({ type: 'goToSlide', slide: nextSlide }))
      }
      this.scrollTo(nextSlide)
      this.clearWhiteboard(type)
      this.updateSlideButtons()
    },
    previousSlide(type) {
      this.slideLoading = true
      const prevSlide = this.$refs.curriculumSlides.currentSlideIndex - 1
      this.$refs.curriculumSlides.currentSlideIndex = prevSlide
      if (type !== 'remote') {
        this.tracks.data.send(JSON.stringify({ type: 'goToSlide', slide: prevSlide }))
      }
      this.scrollTo(prevSlide)
      this.clearWhiteboard(type)
      this.updateSlideButtons()
    },
    goToSlide(slide, force) {
      this.slideLoading = true
      this.$refs.curriculumSlides.currentSlideIndex = slide
      this.scrollTo(slide)
      this.updateSlideButtons()
      if (force) {
        this.tracks.data.send(JSON.stringify({ type: 'goToSlide', slide }))
      }
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
      const c1 = document.getElementById('localCanvas')
      const context1 = c1.getContext('2d')
      context1.clearRect(0, 0, c1.width, c1.height)
      const c2 = document.getElementById('remoteCanvas')
      const context2 = c2.getContext('2d')
      context2.clearRect(0, 0, c2.width, c2.height)
      if (type !== 'remote') {
        this.tracks.data.send(JSON.stringify({ type: 'clear' }))
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
      this.snackbarMessage = 'Connecting to Interview Room'
      this.tracks.data = new LocalDataTrack()
      const roomName = `interview-${this.$route.params.apptId}`
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
          preferredVideoCodecs: ['H264', 'VP8']
        }
      )
      this.connected = true
      this.connecting = false
      await this.updateAppointment({ startTime: moment.utc(), status: 100 })
      this.$nextTick(async function () {
        this.room.participants.forEach(this.addParticipant)
        this.room.on('participantConnected', this.addParticipant)
        this.room.on('participantDisconnected', this.participantDisconnected)
        this.snackbar = true
        this.snackbarMessage = 'Connected Successfully!'
        this.totalSlides = this.$refs.curriculumSlides.slides.map((slide, index) => { return index + 1 })
      })
    },
    addParticipant(participant) {
      this.remoteConnected = true
      this.remoteDisconnected = false
      if (this.isHost) {
        this.snackbarMessage = 'The Interviewee has joined'
      } else {
        this.snackbarMessage = 'The interviewer has joined'
      }
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
      const { type, value, slide } = JSON.parse(data)
      if (type === 'whiteboard') {
        const { x, y } = value
        this.mouse.remote = { x, y }
        this.draw(null, 'remote')
      } else if (type === 'chat') {
        this.addChat(value, 'remote')
      } else if (type === 'clear') {
        this.clearWhiteboard('remote')
      } else if (type === 'mouseDown') {
        this.handleMouseDown(null, 'remote', value)
      } else if (type === 'nextSlide') {
        this.nextSlide('remote')
      } else if (type === 'previousSlide') {
        this.previousSlide('remote')
      } else if (type === 'goToSlide') {
        this.goToSlide(slide)
      } else if (type === 'endInterview') {
        this.leaveInterview()
      }
    },
    sendChat() {
      if (this.currentChat.length) {
        this.addChat(this.currentChat, 'local')
        this.tracks.data.send(
          JSON.stringify({ type: 'chat', value: this.currentChat })
        )
        this.currentChat = ''
      }
    },
    addChat(message, type) {
      if (type === 'remote' && !this.showChat) {
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
          this.tracks.data.send(
            JSON.stringify({ type: 'whiteboard', value: this.currentMouse })
          )
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
      if (type === 'remote') {
        c = document.getElementById('remoteCanvas')
        ctx = c.getContext('2d')
      }
      if (type === 'remote') {
        ctx.beginPath()
        ctx.moveTo(data.x, data.y)
      } else {
        this.mouse.down = true
        this.mouse.current = {
          x: event.clientX,
          y: event.clientY
        }
        ctx.beginPath()
        ctx.moveTo(this.currentMouse.x, this.currentMouse.y)
        this.tracks.data.send(
          JSON.stringify({ type: 'mouseDown', value: this.currentMouse })
        )
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
        this.tracks.data.send(
          JSON.stringify({ type: 'mouseDown' })
        )
        this.mouse.down = false
      }
    },
    handleMouseMove(event) {
      let c = document.getElementById('localCanvas')
      c.getBoundingClientRect()
      if (this.mouse.down) {
        this.mouse.current = {
          x: event.clientX,
          y: event.clientY
        }
        this.draw(event)
      }
    },
    stop() {
      if (this.tracks && this.tracks.audio) {
        this.tracks.audio.stop()
      }
      if (this.tracks && this.tracks.video) {
        this.tracks.video.stop()
      }
    },
    async updateAppointment(updates) {
      this.appointment = { ...this.appointment, ...updates }
      await this.$apollo.mutate({
        mutation: upsertAppointment,
        variables: {
          appt: {
            id: this.appointment.id,
            hostId: this.appointment.hostId,
            scheduledDate: this.appointment.scheduledDate,
            participants: this.appointment.participantIds,
            type: this.appointment.type,
            endTime: this.appointment.endTime,
            startTime: this.appointment.startTime,
            status: this.appointment.status
          }
        }
      })
    },
    cancelInterview(force) {
      if (force) {
        this.tracks.data.send(JSON.stringify({ type: 'endInterview' }))
      }
      this.$router.push('/lounge/dashboard')
    },
    async endInterview() {
      this.tracks.data.send(JSON.stringify({ type: 'endInterview' }))
      this.showChat = false
      await this.updateAppointment({ endTime: moment.utc(), status: 200 })
      this.stop()
      this.room.disconnect()
      this.interviewOver = true
    },
    async leaveInterview() {
      this.showChat = false
      this.stop()
      this.interviewOver = true
      this.room.disconnect()
      await delay(2000)
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
    }
  },
  apollo: {
    appointment: {
      query: GET_APPOINTMENT,
      variables() {
        return { apptId: ~~this.$route.params.apptId }
      },
      update({ appointment }) {
        this.isHost = ~~appointment.hostId === this.$store.state.member.id
        return appointment
      }
    }
  },
  computed: {
    videoId() {
      return this.tracks.video && this.tracks.video.mediaStreamTrack.getSettings().deviceId
    },
    audioId() {
      return this.tracks.audio && this.tracks.audio.mediaStreamTrack.getSettings().deviceId
    },
    remoteName() {
      if (this.connected) {
        if (this.isHost) {
          if (this.remoteDisconnected) {
            return `${this.appointment.participants[0].name} has disconnected`
          }
          if (!this.remoteConnected && this.connected) {
            return `Waiting for ${this.appointment.participants[0].name} to join`
          }
          return this.appointment.participants[0].name
        }
        if (this.remoteDisconnected) {
          return `${this.appointment.host.name} has disconnected`
        }
        if (!this.remoteConnected && this.connected) {
          return `Waiting for ${this.appointment.host.name} to join`
        }
        return this.appointment.host.name
      }
    },
    currentMouse: function () {
      var c = document.getElementById('localCanvas')
      var rect = c.getBoundingClientRect()
      return {
        x: this.mouse.current.x - rect.left,
        y: this.mouse.current.y - rect.top
      }
    },
    getSurvey() {
      return this.appointment.participants[0].surveys[0].answers
    }
  },
  created: function () {
    document.addEventListener('keyup', this.leftKeyListener)
    document.addEventListener('keyup', this.rightKeyListener)
  },
  destroyed: function () {
    document.removeEventListener('keyup', this.leftKeyListener)
    document.removeEventListener('keyup', this.rightKeyListener)
  }
}
</script>

<style lang="stylus">
#interview-room {
  #interview-container {
    width: 1024px;
    height: 768px;
    margin: auto;
    background-color: #fcba00;
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

    .chat-tab {
      position: absolute;
      right: 5px;
      bottom: 5px;
      z-index: 550;
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

    #whiteboardActions {
      position: absolute;
      z-index: 200;
      width: 700px;

      #slideSelector {
        z-index: 250;
      }
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

    .chat {
      position: absolute;
      width: 300px;
      height: 100%;
      top: -950px;
      right: 0;
      z-index: 500;

      .bubbles {
        overflow: scroll;
        height: 685px;
      }

      .local {
        text-align: left;

        .bubble {
          margin: 5px 2px;
          padding: 2px 10px;
          border: 2px solid #f382ae;
          border-radius: 15px 15px 15px 0;
          display: inline-block;
        }
      }

      .remote {
        text-align: right;

        .bubble {
          margin: 5px 2px;
          padding: 2px 10px;
          border: 2px solid #00d3e6;
          border-radius: 15px 0 15px 15px;
          display: inline-block;
        }
      }

      &.active {
        top: 0;
      }
    }

    .chat-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 215px;
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
