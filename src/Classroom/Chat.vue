<template>
  <v-card class="chat">
    <div>
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
            height="35px"
          />
          <v-btn color="#00d3e6" depressed class="text-capitalize white--text" type="submit">Send</v-btn>
        </v-form>
      </div>
    </div>
  </v-card>
</template>
<script>
export default {
  name: 'ClassroomChat',
  props: {
    addChat: {
      type: Function
    },
    chat: {
      type: Array
    }
  },
  data() {
    return {
      currentChat: ''
    }
  },
  methods: {
    sendChat() {
      this.addChat(this.currentChat, 'local')
      this.currentChat = ''
    }
  }
}
</script>
<style lang="stylus" scoped>
.chat
  height 100%

  .bubbles
    overflow scroll
    height 275px

  .local
    text-align left

    .bubble
      margin 5px 2px
      padding 2px 10px
      border 2px solid #f382ae
      border-radius 15px 15px 15px 0
      display inline-block

  .remote
    text-align right

    .bubble
      margin 5px 2px
      padding 2px 10px
      border 2px solid #00d3e6
      border-radius 15px 0 15px 15px
      display inline-block

  &.active
    top 0

.chat-actions
  position absolute
  bottom 0
  left 0
  right 0

</style>
