<template>
  <div class="library">
    <v-tabs centered color="cyan" dark icons-and-text>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#library">Library
        <v-icon>local_library</v-icon>
      </v-tab>

      <v-tab href="#personal">Your Uploads
        <v-icon>account_box</v-icon>
      </v-tab>

      <v-tab-item value="library">
        <v-card flat>
          <v-card-text>
            <h1>Library</h1>
            <p>
              Welcome to the Naativ Library, a chronicle of content created exclusively by, and for, our Naativ community! Peruse the students’ section for inspiration and ideas on how to teach a tricky topic.
              Next, take a stroll through the teachers’ section to get your fellow teachers’ take on any and all things ESL, from A to Z. There’s no quiet zone in this library! Feel free to add to the collection
              of knowledge by creating and uploading content of your own to the Naativ Library!
            </p>
            <v-select
              solo
              label="Search Assets By Tag"
              v-model="librarySearch.allTags"
              item-text="name"
              item-value="id"
              :items="assetMeta.tags"
              chips
              deletable-chips
              multiple
              />
            <Assets @refresh="refresh" :assets="library.assetSearch.results" :loading="library.fetching"/>
            <div class="text-xs-center">
              <v-pagination v-model="librarySearch.page" :length="library.assetSearch.totalPages" :total-visible="7"></v-pagination>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item value="personal">
        <UploadDialog v-on:uploaded="refresh" @assetsUploaded="assetsUploaded"/>
        <v-alert
          type="success"
          :value="success"
        >
          {{success}}
        </v-alert>
        <v-card flat>
          <v-card-text>
            <h1></h1>
            <h1>Personal Uploads</h1>
            <div v-if="personal && personal.assets && personal.assets.length" class="user-assets">
              <Assets
                @refresh="refresh"
                :assets="personal.assets"
                :manage="true"
                @updated="updateAsset"
                @archive="archive"
                :profilePic="profileInfo.profilePic"
                :profile="profileInfo.profileAssets"
                :readonly="true"
            />
            </div>
            <p v-else>Your personal items will upload here</p>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import UploadDialog from '@/components/UploadDialog.vue'
import Assets from '@/components/Assets.vue'
import { mapActions, mapGetters } from 'vuex'
import { ContentActions, ContentGetters } from '@/content/ContentStore'
import { getMemberAttribute } from '@/graphql/profile/ProfileInfo.gql.js'
import { delay } from '@/utils/Helpers.js'

export default {
  name: 'Library',
  components: {
    UploadDialog,
    Assets
  },
  mounted() {
    this.refreshLibrary(this.librarySearch)
    this.refreshPersonal()
  },
  data() {
    return {
      profileInfo: {},
      error: null,
      success: null,
      loading: false,
      assetDialog: false,
      librarySearch: {
        pageSize: 25,
        page: 1,
        allTags: []
      }
    }
  },
  computed: {
    ...mapGetters({
      personal: ContentGetters.personalAssets,
      library: ContentGetters.libraryAssets,
      assetMeta: ContentGetters.assetMeta
    })
  },
  apollo: {
    profileInfo() {
      return {
        query: getMemberAttribute,
        variables: {
          input: {
            key: 'teacher-profile',
            memberId: this.$store.state.member.id
          }
        },
        update({ getMemberAttribute }) {
          return getMemberAttribute ? getMemberAttribute.value : {}
        }
      }
    }
  },
  methods: {
    ...mapActions({
      refreshPersonal: ContentActions.REFRESH_PERSONAL_ASSETS,
      refreshLibrary: ContentActions.REFRESH_LIBRARY_ASSETS,
      updateAsset: ContentActions.UPDATE_ASSET,
      archive: ContentActions.REMOVE_ASSET
    }),
    async refresh() {
      await this.refreshPersonal()
      await this.refreshLibrary(this.librarySearch)
    },
    async assetsUploaded() {
      this.success = 'Your document will be reviewed shortly!'
      await delay(5000)
      this.success = ''
    }
  },
  watch: {
    'librarySearch.page'(newVal, oldVal) {
      this.refreshLibrary(this.librarySearch)
    },
    'librarySearch.allTags'(oldVal, newVal) {
      this.refreshLibrary(this.librarySearch)
    }
  }
}
</script>

<style lang="stylus" scoped>
.library {
  margin -24px
  position relative
}
</style>
