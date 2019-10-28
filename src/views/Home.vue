<template>
  <div class="home">
    <Maintenance v-if="flags.maintenance"/>
    <NaativHeader v-else/>
    <div class="hero">
      <div class="hero-action">
        <p class="font-weight-medium white--text">Connecting a Community.</p>
        <v-btn
          v-if="!flags.maintenance"
          color="#00d3e6"
          to="/register"
          depressed
          round
          large
          class="text-capitalize white--text font-weight-bold"
        >Apply Today</v-btn>
        <br>
        <a v-if="!flags.maintenance" href="/login" data-cy="Login Home Page" class="login-link">Login</a>
      </div>
    </div>
    <v-content style="background-color: #f6f3f2;">
      <div class="fixed">
        <v-layout :align-center="true" :justify-center="true">
          <v-flex xs10>
            <v-card class="pa-2" style="margin-top: -75px; text-align: center;" flat>
              <v-card-text
                class="blurb"
              >We're a community of educators and students, who together bring the English language to life. Our immersive online teaching platform provides students with tools for their future and educators with an opportunity to broaden their experience and influence today.</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout
          :align-center="true"
          :justify-center="true"
          style="overflow: hidden;"
          class="pt-5 pb-5"
        >
          <v-flex xs4 class="centered">
            <img class="green1" src="../assets/images/green1.jpg" alt="happy children smiling">
          </v-flex>
          <v-flex xs4 class="centered">
            <img class="green2" src="../assets/images/green3.jpg" alt="happy children smiling">
          </v-flex>
          <v-flex xs4 class="centered">
            <img class="green3" src="../assets/images/green2.jpg" alt="happy children smiling">
          </v-flex>
        </v-layout>
      </div>
    </v-content>
    <v-content style="background-color: #00d3e4;" class="section overflow-hidden pb-5">
      <div class="fixed">
        <v-layout row wrap>
          <v-flex d-flex xs12 md6 pa-4 pt-5>
            <h2
              style="min-width: 255px;"
              class="font-weight-medium white--text display-1 underline"
            >Seeking Online Educators</h2>
            <img class="shape" src="../assets/images/yellow-grid.png" alt="chat bubble grid">
          </v-flex>
          <v-flex d-flex xs12 md6 pa-4 pt-5>
            <p
              class="white--text blurb"
            >Naativ is U.S. based and recognizes the demand for students around the world to learn and expand their fluency in the English language. We need educators like YOU to support these students! We reward your efforts with generous compensation and connect you with students and other teachers in an empowering way.
              <v-spacer></v-spacer>
              <v-flex xs4>
                <CompStructure/>
              </v-flex>
            </p>
          </v-flex>
        </v-layout>
      </div>
    </v-content>
    <v-content style="background-color: #f6f3f2;" class="pb-5">
      <div class="fixed">
        <v-layout :align-center="true" :justify-center="true" row wrap class="card-list up">
          <v-flex xs10 md4 pa-3>
            <v-card class="pa-4" flat>
              <v-card-text title>
                <img src="../assets/images/Icon_Earnings.png" alt="Earnings Icon">
                <p class="font-weight-medium">Earn $20+ per hour</p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs10 md4 pa-3>
            <v-card class="pa-4" flat>
              <v-card-text title>
                <img src="../assets/images/Icon_Immediate.png" alt="Immediate Payout Icon">
                <p class="font-weight-medium">Immediate payment after every lesson</p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs10 md4 pa-3>
            <v-card class="pa-4" flat>
              <v-card-text title>
                <img src="../assets/images/Icon_Lesson.png" alt="Lessons Icon">
                <p class="font-weight-medium">25 minute one-on-one lessons</p>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <div style="text-align: center;">
          <p class="font-weight-medium">Be one of the first Naativ educators!</p>
          <v-btn
            data-cy="Apply Today"
            v-if="!flags.maintenance"
            color="#00d3e6"
            to="/register"
            depressed
            round
            class="text-capitalize white--text font-weight-bold"
          >Apply Today</v-btn>
        </div>
      </div>
    </v-content>
    <v-content style="background-color: #fcba00;" class="section overflow-hidden pb-5">
      <div class="fixed">
        <v-layout row wrap>
          <v-flex d-flex xs12 md6 pa-4 pt-5>
            <h2
              style="min-width: 255px;"
              class="font-weight-medium white--text display-1 underline"
            >World-Class Curriculum</h2>
            <img class="shape" src="../assets/images/blue-grid.png" alt="blue chat bubble grid">
          </v-flex>
          <v-flex d-flex xs12 md6 pa-4 pt-5>
            <p
              class="white--text blurb"
            >Our U.S. based team of curriculum developers have developed curriculum for some of the largest organizations in the world. Our team of writers has more than a century of combined experience. We did the heavy lifting as we carefully curated our curriculum so you wouldn't have to. Each lesson is standards-aligned with robust scaffolds and activities.</p>
            <ul>
              <li class="font-weight-medium">No lesson planning</li>
              <li class="font-weight-medium">No grading papers</li>
              <li class="font-weight-medium">On-going training</li>
            </ul>
          </v-flex>
        </v-layout>
      </div>
    </v-content>
    <v-content class="filler-image"/>
    <v-content style="background-color: #f6f3f2" class="section overflow-hidden pb-5">
      <div class="fixed">
        <v-layout row wrap>
          <v-flex d-flex xs12 sm6 pa-4 pt-5>
            <h2
              class="font-weight-medium display-1 underline"
            >Connecting students and teachers is at the heart of our business.</h2>
          </v-flex>
          <v-flex d-flex xs12 sm6 pa-4 pt-5>
            <div class="blurb">
              <p>Our community of educators support one another. Our teachers share their own experiences and successes, and our company offers continued training. Together, we grow and develop skills, relationships, and community.</p>
              <p>Join our teacher community with a quick and simple application process. You can be a part of our movement in a few easy steps.</p>
              <p>So, what're you waiting for? Be a part of our extensive teacher community right now!</p>
            </div>
          </v-flex>
        </v-layout>
        <v-layout
          :align-center="true"
          :justify-center="true"
          row
          wrap
          style="text-align: center;"
          class="card-list"
        >
          <v-flex xs10 md4 pa-3>
            <v-card class="pa-4" flat>
              <v-card-text title>
                <img src="../assets/images/Icon_Application.png" alt="Application Icon">
                <p class="font-weight-medium">Quick and easy application process</p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs10 md4 pa-3>
            <v-card class="pa-4" flat>
              <v-card-text title>
                <img src="../assets/images/Icon_Recognition.png" alt="Recognition Icon">
                <p class="font-weight-medium">Recognition Programs</p>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs10 md4 pa-3>
            <v-card class="pa-4" flat>
              <v-card-text title>
                <img src="../assets/images/Icon_Incentive.png" alt="Incentive Icon">
                <p class="font-weight-medium">Incentive Programs</p>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
        <div style="text-align: center;">
          <div>
            <v-btn
              v-if="!flags.maintenance"
              color="#00d3e6"
              to="/register"
              depressed
              round
              large
              class="text-capitalize white--text font-weight-bold"
            >Teach with us!</v-btn>
          </div>
          <div class="py-3">
            <span>
              <a href="https://www.instagram.com/naativco">Instagram</a>
            </span>
            -
            <span>
              <a href="https://facebook.com/Naativ-263842094331101/">Facebook</a>
            </span>
            -
            <span>
              <a href="https://mobile.twitter.com/NaativEducation">Twitter</a>
            </span>
          </div>
          <div class="py-3">
            <p>Naativ</p>
          </div>
        </div>
      </div>
    </v-content>
  </div>
</template>

<script>
import NaativHeader from '@/components/Header.vue'
import CompStructure from '@/components/CompStructure.vue'
import Maintenance from '@/components/Maintenance.vue'
import featureFlags from '@/utils/FeatureFlags'

export default {
  name: 'Home',
  data() {
    return {
      flags: featureFlags
    }
  },
  components: {
    NaativHeader,
    CompStructure,
    Maintenance
  }
}
</script>
<style lang="stylus" scoped>
.login-link
  font-weight 700
  font-size 17px
  text-decoration none

.home
  ul
    list-style-image url('../assets/images/Icon_Checkmark.png')

  .card-list
    text-align center

    &.up
      margin-top -75px

      @media only screen and (min-width: 960px)
        margin-top 0

  .fixed
    max-width 1200px
    margin auto

.hero
  text-align center
  background-color #f382ae
  background-image url('../assets/images/pink1-small.jpeg')
  background-position 58% center
  background-size cover
  height 600px

  @media only screen and (min-width: 1020px)
    background-position 0px -90px
    background-image url('../assets/images/pink1.jpg')

  p
    padding 215px 0 15px 0
    font-size 45px

  .hero-action
    @media only screen and (min-width: 1020px)
      width 400px
      margin auto
      margin-right 55%

.green1
  width 100%
  border-radius 100%
  margin-left -30%

  @media only screen and (min-width: 740px)
    max-width 200px
    max-height 200px
    margin 15px

.green2
  width 100%
  border-radius 100%

  @media only screen and (min-width: 740px)
    max-width 200px
    max-height 200px
    margin 15px

.green3
  width 100%
  border-radius 100%
  margin-left 30%

  @media only screen and (min-width: 740px)
    max-width 200px
    max-height 200px
    margin 15px

.blurb
  line-height 32px
  font-size 17px

.underline
  position relative

  &::after
    position absolute
    bottom -15px
    left 0
    content ''
    width 50px
    border-bottom 5px solid #000000

.white--text.underline::after
  border-bottom 5px solid #ffffff

.filler-image
  height 300px
  background-image url('../assets/images/blue1-small.jpg')
  background-size cover
  background-position top center

  @media only screen and (min-width: 960px)
    height 500px
    background-position center -140px
    background-image url('../assets/images/blue1.jpg')

@media only screen and (min-width: 740px)
  .shape
    max-height 130px
    max-width 228px
    padding-right 10px
</style>
