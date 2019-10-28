<template>
  <div
    v-scroll-class:shrink=50
    class="header"
    :class="{alt}">
    <div class="logo">
      <router-link to="/">
        <img src="../assets/images/logo.svg" alt="Naativ Logo">
      </router-link>
    </div>
    <div class="actions">
      <v-btn
        v-if="!alt"
        color="#00d3e6"
        to="/register"
        depressed
        round
        class="text-capitalize white--text font-weight-bold"
        style="float: right;"
      >Apply Today</v-btn>
      <div v-if="member">
        <span>{{member.displayName}}</span>
        <span data-cy="Logout" @click="logout">logout</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Actions } from '@/store'
export default {
  name: 'NaativHeader',
  props: {
    alt: {
      type: Boolean,
      default: false
    },
    member: Object
  },
  methods: {
    async logout() {
      await this.$store.dispatch(Actions.LOGOUT)
      // We need to force the page refresh on logout
      window.location = '/'
    }
  }
}
</script>
<style lang="stylus" scoped>
.shrink
  background-color #fcba00
  .logo
    img
      width 125px
  .actions
    flex 1
    display inline-block
.alt
  .actions
    display inline-block
.logo
  flex 1
  img
    transition .3s all
    width 150px
    margin 12px 0 0 10px

.actions
  display none
  flex 1
  text-align right
  padding-right 10px

  span
    display inline-block
    padding 15px 0

.header
  display flex
  padding: 10px 0
  position fixed
  left 0
  right 0
  top 0
  z-index 100

  &.alt
    background-color #fcba00
</style>
