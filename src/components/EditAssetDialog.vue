<template>
  <v-dialog
    width="100%"
    max-width="600px"
    persistent
    v-model="showEditDialog"
  >
    <v-card >
      <v-card-title class="application-title; justify-center">
        <h3>Edit {{asset.categoryKey | capitalize}} Info</h3>
        </v-card-title>
        <v-divider></v-divider>
      <v-card-text>
        <v-text-field
          solo
          label="Title"
          v-model="name"
          counter="25"
          maxLength="25"
        />
        <br>
          <v-textarea
            solo
            label="Description"
            v-model="description"
            counter="100"
            maxLength="100"
          ></v-textarea>
          <br>
        <v-select
          :disabled="true"
          solo
          label="Asset Tags"
          v-model="assetTags"
          item-text="name"
          item-value="id"
          :items="assetMeta.tags"
          chips
          deletable-chips
          multiple
          persistent-hint
        />
        <v-responsive>
        <video
          v-if="asset.categoryKey === 'video'"
          ref="video"
          style="width: 100%"
          controls
          :src="asset.url"
          :alt="asset.name"
        />
        <img
          v-if="asset.categoryKey === 'image'"
          ref="image"
          style="width: 100%"
          controls
          :src="asset.url"
          :alt="asset.name"
        >
        </v-responsive>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-center">
        <v-btn flat color="red" @click="$emit('closeEditDialog')">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn flat color="green" @click="edit(asset)">Edit</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { assetUpdate } from '@/content/content.gql.js'
import { mapGetters } from 'vuex'
import { ContentGetters } from '@/content/ContentStore'
export default {
  name: 'EditAssetDialog',
  data () {
    return {
      assetTags: [],
      name: null,
      description: null
    }
  },
  props: {
    showEditDialog: {
      type: Boolean,
      default: false
    },
    asset: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      assetMeta: ContentGetters.assetMeta
    })
  },
  methods: {
    async edit(asset) {
      await this.$apollo.mutate({
        mutation: assetUpdate,
        variables: {
          input: {
            id: asset.id,
            name: this.name,
            description: this.description
          }
        }
      })
      this.$emit('edit', asset)
      this.$emit('closeEditDialog')
    }
  },
  watch: {
    showEditDialog(newVal, oldVal) {
      if (this.asset.tags) {
        this.assetTags = this.asset.tags.map(tag => tag.id)
        this.name = this.asset.name
        this.description = this.asset.description
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
