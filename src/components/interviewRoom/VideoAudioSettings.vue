<template>
  <v-dialog max-width="600px" v-model="settingsDialog" persistent>
    <v-btn
      v-if="!conversation"
      slot="activator"
      :color="classroom ? '#fcba00' : '#00d3e6'"
      small
      depressed
      class="text-capitalize"
      :class="{'white--text': !classroom}"
    >Settings
      <v-icon right dark>settings</v-icon>
    </v-btn>
    <v-btn
      color="rgb(0,0,0,.4)"
      class="white--text"
      v-else icon slot="activator">
      <v-icon>settings</v-icon>
    </v-btn>
    <v-card v-if="settingsDialog">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Confirm Choice.</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-flex xs12>
          <label for="video-input">Video Source</label>
          <v-select
            id="video-input"
            :value="videoId"
            single-line
            @change="trackChanged('video', $event)"
            item-value="deviceId"
            item-text="label"
            :items="availableTracks.video"
            label="Video Source"
            outline
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <label for="audio-input">Audio Source</label>
          <v-select
            id="audio-input"
            :value="audioId"
            single-line
            @change="trackChanged('audio', $event)"
            item-value="deviceId"
            item-text="label"
            :items="availableTracks.audioInput"
            label="Audio Input"
            outline
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <label for="speaker">Speakers</label>
          <v-select
            id="speaker"
            :value="remoteAudio"
            single-line
            @change="trackChanged('speaker', $event)"
            item-value="deviceId"
            item-text="label"
            :items="availableTracks.audioOutput"
            label="Audio Output"
            outline
          ></v-select>
        </v-flex>
      </v-card-text>
      <v-card-actions>
        <v-btn depressed color="#00d3e6" @click="applyChanges">Save</v-btn>
        <v-btn
          depressed
          color="#f382ae"
          @click.native="newTracks = {}; settingsDialog = false"
        >Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { findIndex } from 'lodash'

export default {
  name: 'VideoAudioSettings',
  props: {
    videoId: String,
    conversation: { type: Boolean, default: false },
    audioId: String,
    remoteAudio: String,
    permissionsSet: Boolean,
    classroom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      availableTracks: {
        video: [],
        audioOutput: [],
        audioInput: []
      },
      newTracks: {},
      settingsDialog: false
    }
  },
  methods: {
    trackChanged(type, event) {
      if (event !== this[`${type}Id`]) {
        this.newTracks[type] = event
      } else {
        delete this.newTracks[type]
      }
    },
    applyChanges() {
      if (Object.keys(this.newTracks).length > 0) {
        this.$emit('change', this.newTracks)
      }
      this.settingsDialog = false
    },
    async loadLocalTracks() {
      this.availableTracks.audioInput = []
      this.availableTracks.audioOutput = []
      this.availableTracks.video = []
      const devices = await navigator.mediaDevices.enumerateDevices()
      devices.forEach(d => {
        if (d.kind === 'audioinput') {
          this.availableTracks.audioInput.push(d)
        }
        if (d.kind === 'audiooutput') {
          this.availableTracks.audioOutput.push(d)
        }
        if (d.kind === 'videoinput') {
          this.availableTracks.video.push(d)
        }
      })
    },
    nextVideoTrack(curTrack) {
      const tracks = this.availableTracks.video
      const curDeviceId = curTrack.mediaStreamTrack.getSettings().deviceId
      const curIndex = findIndex(tracks, t => t.deviceId === curDeviceId)
      const nextTrack = curIndex >= tracks.length - 1
        ? tracks[0]
        : tracks[curIndex + 1]
      return nextTrack
    }
  },
  watch: {
    async permissionsSet(newVal, oldVal) {
      this.loadLocalTracks()
    },
    async settingsDialog(newVal, oldVal) {
      if (newVal) {
        this.loadLocalTracks()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
