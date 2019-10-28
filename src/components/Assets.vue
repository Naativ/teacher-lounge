<template>
  <v-layout row wrap>
    <AssetDialog
      :showAssetDialog="showAssetDialog"
      :asset="this.selectedAsset"
      @closeAssetDialog="closeAssetDialog"
    />
    <EditAssetDialog
      :showEditDialog="showEditDialog"
      :asset="this.selectedAsset"
      @closeEditDialog="closeEditDialog"
      @edit="editSuccessful"
    />
    <v-flex xs12 sm6 md4 lg3 pa-1 v-for="(asset, index) in assets" :key="index">
      <v-card>
        <div v-if="isPending(asset)" class="v-responsive v-image bordered">
          <div class="v-responsive__sizer" style="padding-bottom: 36.3636%;"></div>
          <div class="v-image__image v-image__image--cover image-missing">
            <strong>File is still processing</strong>
          </div>
          <div class="v-responsive__content"></div>
        </div>
        <div v-else-if="asset.visibilityId === 204" class="v-responsive v-image bordered">
          <div class="v-responsive__sizer" style="padding-bottom: 36.3636%;"></div>
          <div
            class="v-image__image v-image__image--cover image-missing"
          >Failed. Please try reprocessing</div>
          <div class="v-responsive__content"></div>
        </div>
        <v-img
          @click="showAsset(asset)"
          v-else-if="asset.thumbnailUrl"
          :src="asset.thumbnailUrl"
          aspect-ratio="2.75"
        ></v-img>
        <v-img
          @click="showAsset(asset)"
          v-else-if="asset.url && asset.categoryKey === 'image'"
          :src="asset.url"
          aspect-ratio="2.75"
        ></v-img>
        <div
          v-else-if="asset.url && asset.categoryKey === 'doc'"
          class="v-responsive v-image bordered"
        >
          <div class="v-responsive__sizer" style="padding-bottom: 36.3636%;"></div>
          <div class="v-image__image v-image__image--cover image-missing">
            <v-icon large>insert_drive_file</v-icon>
          </div>
          <div class="v-responsive__content"></div>
        </div>
        <div v-else class="v-responsive v-image bordered">
          <div class="v-responsive__sizer" style="padding-bottom: 36.3636%;"></div>
          <div class="v-image__image v-image__image--cover image-missing">Preview not available</div>
          <div class="v-responsive__content"></div>
        </div>
        <v-card-title primary-title style="overflow: hidden;">
          <div>
            <v-chip
              class="profile-chip"
              v-if="profile && inProfile(asset)"
              color="green"
              text-color="white"
            >In Profile</v-chip>
            <v-chip
              class="profile-chip"
              v-if="profile && asset.id === profilePic"
              color="green"
              text-color="white"
            >Profile Pic</v-chip>
            <h3 class="headline mb-0" style="text-overflow: ellipsis;">{{asset.name}}</h3>
            <div>
              <small>Teacher: {{asset.owner.displayName}} (#{{asset.owner.mrn}})</small>
              <br>
              <div v-if="filterTags(asset, 'search').length">
                <small>Tags:</small>
                <small>{{filterTags(asset, 'search').join(', ')}}</small>
              </div>
            </div>
            <div style="height: 50px;">{{asset.description}}</div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn
            flat
            color="primary"
            :disabled="asset.visibilityId !== 200"
            @click="showAsset(asset)"
          >{{ asset.categoryKey === 'doc' ? 'Open' : 'Show' }}</v-btn>
          <v-spacer/>
          <v-btn small v-if="(manage || profile) && !verification" flat disabled>{{statuses[asset.visibilityId]}}</v-btn>
          <v-btn small flat disabled v-if="verification">{{approval(asset)}}</v-btn>
          <v-spacer></v-spacer>
          <v-menu v-if="manage || profile" transition="slide-y-transition" bottom>
            <v-btn fab flat slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-dialog max-width="500px" v-model="deleteAsset[asset.id]" persistent>
              <v-card>
                <v-card-title class="headline primary">Confirm Deletion</v-card-title>
                <v-card-text>
                  <p v-if="asset.id === profilePic">It looks like you're trying to delete your profile picture.
                  <br>
                  <br>
                  Before you can delete this {{asset.categoryKey}}, you must select and save a new profile picture.</p>
                  <p v-else>Are you sure you want to delete this {{asset.categoryKey}}.</p>
                  </v-card-text>
                  <v-divider></v-divider>
                <v-card-actions v-if="asset.id === profilePic">
                  <v-btn flat color="red" @click="$set(deleteAsset, asset.id, false)">Close</v-btn>
                </v-card-actions>
                <v-card-actions v-else>
                  <v-btn flat color="red" @click="$set(deleteAsset, asset.id, false)">Cancel</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat color="green" @click="archive(asset)">Confirm</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-list>
              <v-list-tile @click="showEditAsset(asset)">
                <v-list-tile-title>Edit</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="$set(deleteAsset, asset.id, true)">
                <v-list-tile-title>Delete</v-list-tile-title>
              </v-list-tile>
              <v-list-tile v-if="isPending(asset)" @click="refresh(asset)">
                <v-list-tile-title>Refresh</v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                @click="addProfile(asset)"
                v-if="profile && !readonly"
                :disabled="!canAddToProfile(asset)"
              >
                <v-list-tile-title v-if="canAddToProfile(asset)">Add To Profile</v-list-tile-title>
                <v-list-tile-title v-else>Profile Max: 3</v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                @click="removeProfile(asset)"
                v-if="profile && !readonly"
                :disabled="!inProfile(asset)"
              >
                <v-list-tile-title>Remove From Profile</v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                @click="makeProfilePic(asset)"
                v-if="profile && !readonly && asset.categoryKey === 'image'"
              >
                <v-list-tile-title>Make Profile Pic</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="refresh(asset)" v-if="!profile && asset.visibilityId === 204">
                <v-list-tile-title>Reprocess</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-progress-linear v-if="loading" :indeterminate="true"></v-progress-linear>
  </v-layout>
</template>

<script>
import AssetDialog from '@/components/AssetDialog.vue'
import { processingStatus, assetUpdate } from '@/content/content.gql.js'
import EditAssetDialog from '@/components/EditAssetDialog.vue'

export default {
  name: 'Assets',
  components: { AssetDialog, EditAssetDialog },
  data() {
    return {
      deleteAsset: {},
      showAssetDialog: false,
      showEditDialog: false,
      selectedAsset: {},
      statuses: {
        200: 'Available',
        202: 'Pending',
        203: 'Processing',
        204: 'Failed',
        301: 'Archived'
      }
    }
  },
  props: {
    assets: {
      type: Array,
      default() {
        return []
      }
    },
    manage: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    profile: {
      type: Array
    },
    profilePic: {
      type: Number
    },
    readonly: {
      type: Boolean,
      default: false
    },
    verification: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    editSuccessful() {
      this.$emit('refresh')
    },
    filterTags(asset, key) {
      return asset.tags.filter(_ => _.key.indexOf(key) > -1).map(_ => _.name)
    },
    showAsset(asset) {
      if (asset.categoryKey === 'doc') {
        window.open(asset.url, '_blank')
      } else {
        this.showAssetDialog = true
        this.selectedAsset = asset
      }
    },
    showEditAsset(asset) {
      this.showEditDialog = true
      this.selectedAsset = asset
    },
    closeAssetDialog() {
      this.showAssetDialog = false
      this.selectedAsset = {}
    },
    closeEditDialog() {
      this.showEditDialog = false
      this.selectedAsset = {}
    },
    async archive(asset) {
      await this.$apollo.mutate({
        mutation: assetUpdate,
        variables: {
          input: {
            id: asset.id,
            visibilityId: 301
          }
        }
      })
      this.$emit('archive', asset)
    },
    async refresh(_asset) {
      const { data } = await this.$apollo.query({
        query: processingStatus,
        variables: { input: { assetId: _asset.id } },
        fetchPolicy: 'network-only'
      })
      const { asset } = data.assetProcessingStatus
      if (asset) this.$emit('updated', asset)
      if (this.isPending(asset)) {
        window.setTimeout(() => {
          this.refresh(asset)
        }, 15 * 1000)
      }
    },
    approval(asset) {
      if (asset.tags.find(tag => tag.key === 'approval:approved')) {
        return 'Approved'
      } else if (asset.tags.find(tag => tag.key === 'approval:rejected')) {
        return 'Rejected'
      } else {
        return 'Pending'
      }
    },
    addProfile(asset) {
      this.$emit('addProfile', asset)
    },
    removeProfile(asset) {
      this.$emit('removeProfile', asset)
    },
    makeProfilePic(asset) {
      this.$emit('makeProfilePic', asset)
    },
    inProfile(asset) {
      return this.profile.find(a => a.id === asset.id)
    },
    isPending(asset) {
      return [202, 203].indexOf(asset.visibilityId) > -1
    },
    canAddToProfile(asset) {
      let hasOfType = 0
      let found = false
      this.profile.forEach(a => {
        if (a.categoryKey === asset.categoryKey) {
          hasOfType++
        }
        if (a.id === asset.id) {
          found = true
        }
      })
      return hasOfType < 3 && !found
    }
  },
  updated() {
    this.$props.assets.forEach(a => {
      if (this.isPending(a)) this.refresh(a)
    })
  }
}
</script>

<style scoped>
.bordered {
  border-bottom: 1px solid #eee;
}
.image-missing {
  text-align: center;
  margin: auto;
  position: relative;
  height: 100%;
}
.profile-chip {
  position: absolute;
  right: 0;
  top: 0;
}
.profile-chip + .profile-chip {
  right: 85px;
}
</style>
