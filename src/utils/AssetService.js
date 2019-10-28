const tenantId = ~~process.env.VUE_APP_TENANT_ID
const ASSET_URL = process.env.VUE_APP_BASE_URL
  ? `${process.env.VUE_APP_BASE_URL}/assets`
  : 'http://localhost:3000/assets'

export const getAsset = (assetId) => `${ASSET_URL}/${tenantId}/${assetId}`
