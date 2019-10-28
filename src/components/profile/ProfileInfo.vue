<template>
  <div class="profile-info px-2" style="max-width: 1024px; margin: auto;">
    <h1>Your Profile</h1>
    <p>Welcome to your profile editor. Here you will be able to decide what is publicly visible about you.</p>
    <h4>Note: In order to be visible to students for booking, you must have a profile picture.</h4>
    <div>
      <v-layout row wrap justify-center>
        <v-flex xs12>
          <v-subheader>Welcome Message</v-subheader>
          <v-textarea
            solo
            v-model.trim="profileInfo.welcomeMessage"
            label="Welcome Message"
            counter="800"
            maxLength="800"
          />
        </v-flex>

        <v-flex xs12>
          <v-subheader>Teaching Style</v-subheader>
          <v-combobox
            v-model="profileInfo.selectedTeachingTags"
            :items="profileInfo.selectedTeachingTags.length < 3 ? teachingStyle :profileInfo.selectedTeachingTags"
            label="Teaching Style"
            small-chips
            clearable
            solo
            multiple
          ></v-combobox>
        </v-flex>
        <v-flex xs12>
          <v-subheader>Personality Type</v-subheader>
          <v-combobox
            v-model="profileInfo.selectedPersonalityTags"
            :items="profileInfo.selectedPersonalityTags.length < 3 ? personalityTags : profileInfo.selectedPersonalityTags"
            label="Personality"
            small-chips
            clearable
            solo
            multiple
          ></v-combobox>
        </v-flex>
          <v-flex xs4>
            <v-subheader>Education</v-subheader>
            <v-text-field
            solo
            v-model="profileInfo.education"
            persistent-hint
            label="College & Degree"
            counter="50"
            maxLength="50"
            ></v-text-field>
            </v-flex>
            <v-flex xs4>
            <v-subheader>Certifcations</v-subheader>
            <v-text-field
              solo
              v-model="profileInfo.certified"
              label="TESOL or TEFL Certified?"
              counter="25"
              maxLength="25"
              >
            </v-text-field>
          </v-flex>
            <v-flex xs4>
            <v-subheader>Hours Taught Online</v-subheader>
            <v-text-field
              solo
              v-model="profileInfo.onlineHours"
              label="Online Teaching Hours"
              type="number"
              maxLength="25"
              >
            </v-text-field>
          </v-flex>
        <v-flex xs12>
          <v-subheader>Interests</v-subheader>
          <v-textarea
            solo
            persisten
            v-model.trim="profileInfo.interests"
            label="Your Interests"
            counter="800"
            maxLength="800"
          />
        </v-flex>
        <v-flex xs12>
          <v-spacer></v-spacer>
          <v-btn
            color="#00d3e6"
            depressed
            round
            large
            class="text-capitalize white--text font-weight-black"
            type="submit"
            @click="saveProfile"
            :loading="loading"
            :disabled="loading"
          >Update Profile Info</v-btn>
        </v-flex>
        <v-alert dismissible class="alert" type="success" :value="success">{{ success }}</v-alert>
        <v-alert dismissible class="alert" type="error" :value="error">{{error}}</v-alert>
        <v-flex xs12>
          <UploadDialog
            :onlyProfile="true"
            v-on:uploaded="refresh"
          />
          <v-subheader>Images and Videos</v-subheader>
          <p>To add images or videos to your profile, you can either upload them here or in the "Your Uploads" section of the Library.</p>
          <p>Note: You may only select up to 3 images and 3 videos</p>
          <Assets
            :assets="personal.assets"
            :profile="profileInfo.profileAssets"
            :profilePic="profileInfo.profilePic"
            @addProfile="addProfile"
            @removeProfile="removeProfile"
            @makeProfilePic="makeProfilePic"
            @archive="archive"
          />
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>
<script>
import Assets from '@/components/Assets.vue'
import { delay } from '@/utils/Helpers.js'
import UploadDialog from '@/components/UploadDialog.vue'

import { mapActions, mapGetters, mapMutations } from 'vuex'
// import { profileMap } from '@/utils/Mutations.js'
import { UPDATE_MEMBER_TAGS } from '@/graphql/Member.gql.js'
import { Mutations } from '@/store'
import { ContentActions, ContentGetters } from '@/content/ContentStore'
import { getMemberAttribute, setMemberAttribute } from '@/graphql/profile/ProfileInfo.gql.js'
import { find, pick } from 'lodash'

const showAvailabilityTag = 'early_access:availability'

export default {
  name: 'ProfileInfo',
  components: { Assets, UploadDialog },
  data() {
    return {
      profileInfo: {
        certified: '',
        welcomeMessage: '',
        interests: '',
        education: '',
        onlineHours: '',
        selectedTeachingTags: [],
        selectedPersonalityTags: [],
        profileAssets: [],
        profilePic: null
      },
      memberAttributesId: null,
      loading: false,
      error: null,
      success: null,
      teachingStyle: [
        'Reading-focused',
        'Content-focused',
        'Discussion-focused',
        'Grammar-focused',
        'Conversation-focused',
        'Comprehension-focused',
        'Physical demonstration',
        'Pronunciation correction',
        'ESL beginner techniques',
        'ESL advanced techniques',
        'Topic-oriented',
        'Special Needs-Experienced',
        'Music-incorporated learning',
        'Dramatized style',
        'Uses teaching aids'],
      personalityTags: [
        'Outgoing',
        'Enthusiastic',
        'Adventurous',
        'Animated',
        'Dramatic',
        'Playful',
        'Funny',
        'Creative',
        'Traditional',
        'Personable',
        'Encouraging',
        'Adaptable',
        'Innovative',
        'Constructive',
        'Experienced',
        'Reserved',
        'Serious',
        'Easygoing',
        'Patient',
        'Caring',
        'Strict',
        'Challenging',
        'Detail-oriented',
        'Dedicated'
      ]
    }
  },
  async mounted() {
    await this.refreshPersonal()
    this.confirmAssetExistance()
  },
  methods: {
    ...mapActions({
      refreshPersonal: ContentActions.REFRESH_PERSONAL_ASSETS,
      archive: ContentActions.REMOVE_ASSET
    }),
    ...mapMutations({
      updateMember: Mutations.SET_MEMBER
    }),
    confirmAssetExistance() {
      const existingIds = this.personal.assets.map(_ => _.id)
      this.profileInfo.profileAssets = [
        ...this.profileInfo.profileAssets.filter(_ => existingIds.indexOf(_.id) > -1)
      ]
    },
    async refresh() {
      await this.refreshPersonal()
    },
    async saveProfile() {
      this.loading = true
      try {
        const { data } = await this.$apollo.mutate({
          mutation: setMemberAttribute,
          variables: {
            input: {
              id: this.memberAttributesId,
              key: 'teacher-profile',
              value: this.profileInfo
            }
          }
        })
        if (this.profileInfo.profilePic) {
          this.addTag(showAvailabilityTag, 'ADD')
        }
        // When we are ready to use cookies
        // if (this.memberAttributes.profilePic !== this.profileInfo.profilePic) {
        //   profileMap.profile(this.$apollo, { profileUrl }, this.$store)
        // }
        this.memberAttributesId = data.upsertMemberAttribute.id
        this.loading = false
        this.success = 'Update Successful!'
        await delay(5000)
        this.success = ''
      } catch (e) {
        this.error = 'Update Failed!'
      }
    },
    async addTag(tag) {
      if (this.member.tags.indexOf(tag) === -1) {
        await this.$apollo.mutate({
          mutation: UPDATE_MEMBER_TAGS,
          variables: {
            input: {
              memberId: this.member.id,
              tags: [tag]
            }
          }
        })
        this.updateMember({ ...this.member, tags: [...this.member.tags, tag] })
      }
    },
    addProfile(_asset) {
      const found = find(this.personal.assets, a => a.id === _asset.id)
      const newAsset = {
        categoryKey: _asset.categoryKey,
        id: _asset.id,
        ...pick(found, ['thumbnailUrl', 'description']) // we can do description right now because it's not editable
      }
      this.profileInfo.profileAssets.push(newAsset)
      this.saveProfile()
    },
    removeProfile(asset) {
      this.profileInfo.profileAssets = this.profileInfo.profileAssets.filter(a => a.id !== asset.id)
    },
    makeProfilePic(asset) {
      this.profileInfo.profilePic = asset.id
    }
  },
  computed: {
    ...mapGetters({
      personal: ContentGetters.personalAssets,
      member: 'member'
    })
  },
  apollo: {
    memberAttributes() {
      return {
        query: getMemberAttribute,
        variables: {
          input: {
            key: 'teacher-profile',
            memberId: this.$store.state.member.id
          }
        },
        update(result) {
          const { getMemberAttribute } = result
          if (getMemberAttribute) {
            this.profileInfo = {
              ...this.profileInfo,
              ...getMemberAttribute.value
            }
            if (getMemberAttribute.id) {
              this.memberAttributesId = getMemberAttribute.id
            }
            if (this.personal.length) {
              this.confirmAssetExistance()
            }
          }
          return getMemberAttribute
        }
      }
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
.mainCheckbox {
  height: 20px
  margin-top: 0px
  padding: 5px
}
.subCheckbox {
  height: 20px
  padding: 5px 40px
}
.learningProfile {
  padding: 0px
}

</style>
