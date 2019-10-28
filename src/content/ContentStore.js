import store from '@/store'
import moment from 'moment'
import * as Content from '@/content/ContentService'
import * as Mutations from '@/store.mutations'

export const ContentActions = {
  REFRESH_ASSET_META: 'content:RefreshAssetMeta',
  REFRESH_PERSONAL_ASSETS: 'content:RefreshPersonalAssets',
  REFRESH_LIBRARY_ASSETS: 'content:RefreshLibraryAssets',
  UPDATE_ASSET: 'content:UpdateAsset',
  REMOVE_ASSET: 'content:RemoveAsset'
}

export const ContentMutations = {
  SET_ONE: 'contentSetOne',
  SET: 'contentSet',
  UPDATE: 'contentUpdate',
  REMOVE: 'removeUpdate'
}

export const ContentGetters = {
  assetMeta: 'contentAssetMeta',
  personalAssets: 'personalAssets',
  libraryAssets: 'libraryAssets'
}

const META_DEFAULT = {
  fetching: false,
  approval: [],
  tags: [],
  audiences: [],
  types: [],
  refreshed: null,
  error: undefined
}
const ASSET_DEFAULT = {
  fetching: false,
  assets: [],
  refreshed: null
}
const PAGED_ASSET_DEFAULT = {
  fetching: false,
  assetSearch: {},
  refreshed: null
}

const DEFAULT_STATE = {
  meta: {
    asset: { ...META_DEFAULT }
  },
  assets: {
    library: { ...PAGED_ASSET_DEFAULT },
    personal: { ...ASSET_DEFAULT }
  }
}
export const ContentStore = {
  state: DEFAULT_STATE,
  mutations: {
    [ContentMutations.SET]: (state, [value, fn]) => fn(state, value),
    [ContentMutations.SET_ONE]: (state, { property, value }) =>
      (state[property] = value),
    [Mutations.INIT]: state => {
      Object.assign(state, DEFAULT_STATE)
    },
    [ContentMutations.UPDATE]: (state, asset) => {
      const { assets } = state.assets.personal
      const assetToUpdate = assets.find(a => a.id === asset.id) || {}

      state.assets.personal.assets = assets
        .filter(a => a.id !== asset.id)
        .concat([{ ...assetToUpdate, ...asset }])
    },
    [ContentMutations.REMOVE]: (state, asset) => {
      console.log('REMOVE', asset)
      const { assets } = state.assets.personal
      state.assets.personal.assets = assets.filter(a => a.id !== asset.id)
      console.log(state.assets.personal.assets)
    }
  },
  actions: {
    [ContentActions.REFRESH_ASSET_META]: async ({ commit, state }) => {
      // reset state
      commit(ContentMutations.SET, [
        {
          ...state.meta.asset,
          fetching: true,
          error: null
        },
        (state, value) => Object.assign(state.meta.asset, value)
      ])

      const assetMeta = await Content.getAssetMeta()

      commit(ContentMutations.SET, [
        {
          ...META_DEFAULT,
          ...assetMeta,
          refreshed: moment().toISOString()
        },
        (state, value) => Object.assign(state.meta.asset, value)
      ])
    },
    [ContentActions.REFRESH_PERSONAL_ASSETS]: async ({ dispatch, commit, state }) => {
      // reset state
      commit(ContentMutations.SET, [
        {
          ...state.assets.personal,
          fetching: true,
          error: null
        },
        (state, value) => Object.assign(state.assets.personal, value)
      ])

      const { member } = store.state
      let meta = state.meta.asset

      if (!meta.refreshed) {
        await dispatch(ContentActions.REFRESH_ASSET_META)
      }

      const anyTags = meta.audiences.map(a => a.id)

      const filter = {
        anyTags,
        owners: [member.id],
        visibilityIds: [200, 201, 202, 203, 204]
      }
      const personalAssets = await Content.getAllAssets('personal', {
        ...filter,
        includeThumbnails: false,
        includeSources: false
      })

      commit(ContentMutations.SET, [
        {
          ...ASSET_DEFAULT,
          ...personalAssets,
          refreshed: moment().toISOString()
        },
        (state, value) => Object.assign(state.assets.personal, value)
      ])
    },
    [ContentActions.REFRESH_LIBRARY_ASSETS]: async ({
      dispatch,
      commit,
      state
    }, searchQuery) => {
      // reset state
      commit(ContentMutations.SET, [
        {
          ...state.assets.library,
          fetching: true,
          error: null
        },
        (state, value) => Object.assign(state.assets.library, value)
      ])

      const { member } = store.state
      let meta = state.meta.asset
      // load if meta not initialized
      if (!meta.refreshed) {
        await dispatch(ContentActions.REFRESH_ASSET_META)
      }

      const anyTags = member.tags
        .map(tag => {
          return meta.audiences.filter(a => a.key === 'aud:' + tag)
        })
        .reduce((acc, val) => acc.concat(val), []) // .flatMap(x => x)  iOS 11 Safari does not support flatMap, this is a temporary hackaround
        .map(x => x.id)

      const studentTag = meta.audiences.find(e => e.key === 'aud:student')
      studentTag && anyTags.push(studentTag.id)

      const approvedTag = meta.approval.find(e => e.key === 'approval:approved')
      const allTags = [approvedTag.id].concat(searchQuery.allTags)

      const libraryAssets = await Content.searchAssets('library', {
        allTags,
        anyTags,
        includeThumbnails: false,
        includeSources: false,
        pageSize: searchQuery.pageSize,
        page: searchQuery.page
      })

      commit(ContentMutations.SET, [
        {
          ...PAGED_ASSET_DEFAULT,
          ...libraryAssets,
          refreshed: moment().toISOString()
        },
        (state, value) => {
          Object.assign(state.assets.library, value)
        }
      ])
    },
    [ContentActions.UPDATE_ASSET]: async ({ commit, state }, asset) => {
      commit(ContentMutations.UPDATE, asset)
    },
    [ContentActions.REMOVE_ASSET]: async ({ commit, state }, asset) => {
      console.log('REMOVE ASSET', asset)
      commit(ContentMutations.REMOVE, asset)
    }
  },
  getters: {
    [ContentGetters.assetMeta]: state => state.meta.asset,
    [ContentGetters.personalAssets]: state => state.assets.personal,
    [ContentGetters.libraryAssets]: state => state.assets.library
  }
}
