<template>
  <div>
    <v-flex>
    <div v-scroll-class:shrink=50 class="header">
      <div class="logo">
        <img src="../assets/images/logo.svg" alt="Naativ Logo">
      </div>
      <v-flex class="text-capitalize white--text font-weight-bold text-xs-center">
        <h3>Sorry, Naativ is Currently Under Construction</h3>
        <h3>Please Check Back In a Few Minutes</h3>
      </v-flex>
    <v-spacer></v-spacer>
    </div>
    </v-flex>
  </div>
</template>

<script>
export default {
  name: 'maintenance'
}
</script>

<style lang='stylus' scoped>
.shrink
  background-color #fcba00

  .logo
    img
      width 125px

.logo
  flex 1

  img
    transition 0.3s all
    width 150px
    margin 12px 0 0 10px

.header
  background-color #fcba00
  display flex
  padding 10px 0
  position fixed
  left 0
  right 0
  top 0
  z-index 100
</style>
