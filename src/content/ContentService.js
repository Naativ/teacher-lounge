import pathOr from 'ramda/src/pathOr'
import { assetMeta, assetCreate, seachAllAssets, getAssets } from './content.gql'
import { createProvider } from '@/vue-apollo'
const apolloClient = createProvider().defaultClient

const tenantId = ~~process.env.VUE_APP_TENANT_ID
const BASE_URL = process.env.VUE_APP_ASSET_HTTP || 'http://localhost:3000/assets'

export const getAsset = (assetId) => `${BASE_URL}/${tenantId}/${assetId}`

const doQuery = (query, args = {}) => {
  return apolloClient.query({
    query: query,
    variables: args,
    fetchPolicy: 'network-only'
  })
}

const doMutate = (mutation, args = {}) =>
  apolloClient.mutate({
    mutation,
    variables: args
  })

export const getAssetMeta = async avail => {
  const result = pathOr(
    {},
    ['data', 'assetManagementConfig'],
    await doQuery(assetMeta)
  )
  const tags = pathOr([], ['tags'], result)
  return {
    providers: result.providers || [],
    approval: tags.filter(e => e.key.indexOf('approval:') === 0),
    tags: tags.filter(e => e.key.indexOf('search:') === 0),
    audiences: tags.filter(e => e.key.indexOf('aud:') === 0),
    types: result.types || []
  }
}

export const createAsset = async input => {
  const result = pathOr(
    {},
    ['data', 'assetCreate'],
    await doMutate(assetCreate, { input })
  )
  return result
}

export const searchAssets = async (op, input, jwt) => {
  const result = pathOr(
    { assets: [] },
    ['data'],
    await doQuery(seachAllAssets(op), { input })
  )
  const { assetSearch } = result
  return {
    assetSearch
  }
}

export const getAllAssets = async (op, input, jwt) => {
  const result = pathOr(
    { assets: [] },
    ['data'],
    await doQuery(getAssets(op), { input })
  )
  const { assets } = result
  return {
    assets
  }
}
