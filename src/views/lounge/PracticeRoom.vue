<template>
  <div id="classroom">
    <div id="classroom-container">
      <MediaPermissions :showPermissionModal="showPermissionModal"/>
      <BrowserAlert/>
      <div class="top-row">
        <div class="vid">
          <v-card class="ma-1" ref="localTrack" id="Local">
            <div class="local-actions">
              <v-icon color="white" @click="toggleVideo" v-if="!videoOff">videocam</v-icon>
              <v-icon color="red" @click="toggleVideo" v-if="videoOff">videocam_off</v-icon>
              <v-icon color="white" @click="toggleMute" v-if="!muted">volume_up</v-icon>
              <v-icon color="red" @click="toggleMute" v-if="muted">volume_off</v-icon>
            </div>
            <div class="tracks"></div>
          </v-card>
          <v-card class="ma-1 centered" ref="remoteTrack" id="Remote">
            <p class="remote-name">Student</p>
            <div class="tracks"></div>
          </v-card>
          <v-card class="ma-1 my-1 centered" id="streamActions">
            <v-layout row wrap>
              <v-flex v-if="startTime" xs12>
                <h2>Elapsed Time</h2>
                <CountupTimer :from="startTime" :threshold="60"/>
              </v-flex>
              <v-flex xs12>
                <h2>Actions</h2>
              </v-flex>
              <v-flex xs12>
                <VideoAudioSettings @change="updateTracks" :videoId="videoId" :audioId="audioId" :remoteAudio="remoteAudio" :classroom="true" :permissionsSet="permissionsSet"/>
              </v-flex>
              <v-flex xs12>
                <v-btn color="#fcba00" small depressed class="mx-1 text-capitalize " @click="leaveClassroom">Leave Practice room
                  <v-icon right dark>exit_to_app</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12>
                <v-btn v-if="!startTime" color="#fcba00" small depressed class="mx-1 text-capitalize " @click="startTimer">Start Timer
                  <v-icon right dark>alarm</v-icon>
                </v-btn>
                <v-btn v-if="startTime" color="#fcba00" small depressed class="mx-1 text-capitalize " @click="startTime = null">Stop Timer
                  <v-icon right dark>alarm</v-icon>
                </v-btn>
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
          </v-tabs>
        </v-card>
      </div>
    </div>
    <v-snackbar v-model="snackbar" bottom :timeout="3000">
      {{snackbarMessage}}
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import { Actions as LessonActions } from '@/Lessons/Store'
import ActionsOutput from '@/Classroom/ActionsOutput.vue'
import BrowserAlert from '@/components/BrowserAlert.vue'
import ClassEnd from '@/Classroom/ClassEnd.vue'
import CountupTimer from '@/components/interviewRoom/CountupTimer.vue'
import LeaveEarlyDialog from '@/components/classroom/LeaveEarlyDialog.vue'
import MediaPermissions from '@/components/MediaPermissions.vue'
import slides from '@/Classroom/Slides.vue'
import TeacherTips from '@/Classroom/TeacherTips.vue'
import VideoAudioSettings from '@/components/interviewRoom/VideoAudioSettings.vue'

const {
  createLocalTracks,
  createLocalVideoTrack,
  createLocalAudioTrack
} = require('twilio-video')

export default {
  name: 'PractiveRoom',
  components: {
    ActionsOutput,
    BrowserAlert,
    ClassEnd,
    CountupTimer,
    LeaveEarlyDialog,
    MediaPermissions,
    slides,
    TeacherTips,
    VideoAudioSettings
  },
  beforeRouteLeave(to, from, next) {
    this.stop()
    next()
  },
  beforeDestroy() {
    this.stop()
  },
  async mounted() {
    this.getLocalTracks()
    this.lesson = await this.getLesson(~~this.$route.params.lessonId)
    this.loadingLesson = false
    this.$nextTick(function () {
      this.totalSlides = this.$refs.curriculumSlides.slides.map((slide, index) => { return index + 1 })
    })
  },
  data() {
    return {
      lesson: null,
      loadingLesson: true,
      slidesReady: false,
      currentSlide: 1,
      disabledNext: false,
      disabledPrevious: true,
      localVid: '',
      remoteAudio: 'default',
      mouse: {
        current: { x: 0, y: 0 },
        previous: { x: 0, y: 0 },
        remote: { x: 0, y: 0 },
        down: false
      },
      muted: false,
      newTracks: {},
      showPermissionModal: false,
      slideLoading: false,
      totalSlides: [],
      snackbar: false,
      snackbarMessage: null,
      tracks: { video: null, audio: null },
      videoOff: false,
      startTime: null,
      permissionsSet: false
    }
  },
  methods: {
    ...mapActions({
      getLesson: LessonActions.GET
    }),
    startTimer() {
      this.startTime = new Date()
    },
    canEnter() {
      if (this.booking && this.canEnterClass && !this.connecting && this.slidesReady) {
        return false
      }
      return true
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
      this.clearWhiteboard()
      this.updateSlideButtons()
    },
    previousSlide() {
      this.slideLoading = true
      const prevSlide = this.$refs.curriculumSlides.currentSlideIndex - 1
      this.$refs.curriculumSlides.currentSlideIndex = prevSlide
      this.currentSlide = this.$refs.curriculumSlides.currentSlideIndex
      this.clearWhiteboard()
      this.updateSlideButtons()
    },
    goToSlide(slide, remote) {
      this.slideLoading = true
      this.$refs.curriculumSlides.currentSlideIndex = slide
      this.currentSlide = this.$refs.curriculumSlides.currentSlideIndex
      this.updateSlideButtons()
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
    },
    toggleMute() {
      this.tracks['audio'].enable(this.muted)
      this.muted = !this.muted
    },
    toggleVideo() {
      this.tracks['video'].enable(this.videoOff)
      this.videoOff = !this.videoOff
    },
    draw(event, type) {
      let c = document.getElementById('localCanvas')
      let ctx = c.getContext('2d')
      ctx.lineTo(this.currentMouse.x, this.currentMouse.y)
      ctx.strokeStyle = '#f382ae'
      ctx.lineWidth = 2
      ctx.stroke()
    },
    handleMouseDown(event, type, data) {
      let c = document.getElementById('localCanvas')
      let ctx = c.getContext('2d')
      this.mouse.down = true
      const x = event.touches ? event.touches[0].clientX : event.clientX
      const y = event.touches ? event.touches[0].clientY : event.clientY
      this.mouse.current = { x, y }
      ctx.beginPath()
      ctx.moveTo(this.currentMouse.x, this.currentMouse.y)
    },
    handleMouseUp(type) {
      let c = document.getElementById('localCanvas')
      let ctx = c.getContext('2d')
      ctx.closePath()
      this.mouse.down = false
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
    async endClass() {
      this.stop()
      this.isClassOver = true
    },
    async leaveClassroom() {
      this.stop()
      this.isClassOver = true
      this.$router.push('/lounge/curriculum')
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
  computed: {
    videoId() {
      return this.tracks.video && this.tracks.video.mediaStreamTrack.getSettings().deviceId
    },
    audioId() {
      return this.tracks.audio && this.tracks.audio.mediaStreamTrack.getSettings().deviceId
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
      background-image: url(../../assets/images/bubble-snip.jpeg)
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
