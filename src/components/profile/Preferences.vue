<template>
  <div class="px-2">
  <v-alert dismissible class="alert" type="success" :value="success">{{ success }}</v-alert>
  <v-alert dismissible class="alert" type="error" :value="error">{{error}}</v-alert>
    <v-layout row wrap style="max-width: 1024px; margin: auto;">
      <v-flex xs12>
        <h1 class="my-3">Teaching Preferences</h1>
        <p>
          Select which types of appointments and students you would like to teach.
          <br/>
          <i>(Changes to these settings will not affect booked appointments. This will only affect bookings that are made after you change your settings.)</i>
        </p>
        <v-layout row>
          <v-layout column>
            <v-subheader>Lessons</v-subheader>
            <v-checkbox class="subCheckbox" v-model="tags" :value="adultLessonTag" :disabled="checkboxFun(adultLessonTag)" label="Adult" />
            <v-checkbox class="subCheckbox" v-model="tags" :value="childLessonTag" :disabled="checkboxFun(childLessonTag)" label="Youth" />
          </v-layout>
          <v-layout column >
            <v-subheader>Conversations</v-subheader>
            <v-checkbox class="subCheckbox" v-model="tags" :value="adultConversationTag" :disabled="checkboxFun(adultConversationTag) || !hasTag('feature:early_access')" label="Adult" />
            <v-checkbox class="subCheckbox" v-model="tags" :value="childConversationTag" :disabled="checkboxFun(childConversationTag) || !hasTag('feature:early_access')" label="Youth" />
          </v-layout>
        </v-layout>
        <p v-if="!hasTag('feature:early_access')">
          Coming soon! Naativ Conversations will allow you to focus on conversational English with your students.
        </p>
      </v-flex>
      <v-layout pt-5 row>
        <v-flex xs12>
          <v-btn
            color="#00d3e6"
            depressed
            round
            large
            class="text-capitalize white--text font-weight-black"
            type="submit"
            @click="savePreferences"
            :loading="loading"
            :disabled="loading"
            >Save Preferences
          </v-btn>
        </v-flex>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ADJUST_TAGS } from '@/graphql/Member.gql.js'
import { delay } from '@/utils/Helpers.js'

export default {
  name: 'ProfileInfo',
  data() {
    return {
      childLessonTag: 'audience:lesson:child',
      adultLessonTag: 'audience:lesson:adult',
      childConversationTag: 'audience:conversation:child',
      adultConversationTag: 'audience:conversation:adult',
      adjustableTags: ['audience:lesson:child', 'audience:lesson:adult', 'audience:conversation:child', 'audience:conversation:adult'],
      loadedTags: [],
      conversation: false,
      lessons: false,
      tags: [],
      loading: false,
      success: null,
      error: null
    }
  },
  async mounted() {
    this.loadedTags = this.adjustableTags.filter( x => this.member.tags.includes(x))
    this.tags = this.loadedTags
    this.loadTags()
  },
  methods: {
    async savePreferences() {
      this.loading = true
      const newTags = this.tagsToAdd(this.tags, this.member.tags)
      const oldTags = this.tagsToRemove(this.tags, this.loadedTags)
      this.adjustTags(newTags, oldTags)
      await delay(5000)
      this.success = ''
    },
    isConversationSet() {
      this.conversation = (this.member.tags.includes(this.childConversationTag) || this.member.tags.includes(this.adultConversationTag))
    },
    isLessonSet() {
      this.lessons = (this.member.tags.includes(this.childLessonTag) || this.member.tags.includes(this.adultLessonTag))
    },
    tagsToAdd(tags, existingTags) {
      return tags.filter( x => !existingTags.includes(x))
    },
    tagsToRemove(tags, loadedTags) {
      return loadedTags.filter( x => !tags.includes(x))
    },
    loadTags() {
      this.loadedTags = this.adjustableTags.filter( x => this.member.tags.includes(x))
      this.tags = this.loadedTags
      this.isConversationSet()
      this.isLessonSet()
    },
    hasTag(tag) {
      return this.member.tags.includes(tag)
    },
    checkboxFun(tag) {
      if (this.tags.length === 1) {
        if (this.tags.includes(tag)) {
          return true
        }
      }
    },
    async adjustTags(tagsToAdd, tagsToRemove) {
      try {
        await this.$apollo.mutate({
          mutation: ADJUST_TAGS,
          variables: {
            input: {
              memberId: this.member.id,
              add: tagsToAdd,
              remove: tagsToRemove,
              set: []
            }
          }
        })
        this.loading = false
        this.success = 'Update Successful!'
        this.loadedTags = this.tags
      } catch (e) {
        this.error = 'Update Failed!'
      }
    }
  },
  computed: {
    ...mapGetters({
      member: 'member'
    })
  },
  watch: {
    member() {
      this.loadTags()
    }
  }
}
</script>
<style lang="stylus" scoped>
.alert
  position fixed
  top 40px
  width 80%
  z-index 1
.subCheckbox {
  height: 35px
  margin-top: 0px
  padding: 5px 40px
}

</style>
