<template>
    <v-card>
      <UploadDialog
        v-on:uploaded="refresh"
        :forVerification="true"
      />
      <v-card flat>
        <v-card-text>
          <h1>Certificates</h1>
          <p>
            Your uploaded verification documents.
          </p>
          <Assets
            :assets="filtered"
            :verification="true"
          />
        </v-card-text>
      </v-card>
    </v-card>
</template>

<script>
import Assets from '@/components/Assets.vue'
import UploadDialog from '@/components/UploadDialog.vue'

import { mapActions, mapGetters } from 'vuex'
import { ContentActions, ContentGetters } from '@/content/ContentStore'

export default {
  components: {
    Assets,
    UploadDialog
  },
  methods: {
    ...mapActions({
      refreshPersonal: ContentActions.REFRESH_PERSONAL_ASSETS,
      archive: ContentActions.REMOVE_ASSET
    }),
    async refresh() {
      await this.refreshPersonal()
    }
  },
  computed: {
    ...mapGetters({
      personal: ContentGetters.personalAssets,
      member: 'member'
    }),
    filtered() {
      const arr = this.personal.assets.filter(element => {
        return element.tags.find(tag => {
          return tag.key === 'aud:verification'
        })
      })
      return arr
    }
  }
}
</script>

<style>

</style>
