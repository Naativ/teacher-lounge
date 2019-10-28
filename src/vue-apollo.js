import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import * as Sentry from '@sentry/browser'

// Install the vue plugin
Vue.use(VueApollo)

const getAuth = tokenName => {
  const store = JSON.parse(localStorage.getItem('store'))
  const token = store ? store[tokenName] : undefined
  return token ? `Bearer ${token}` : undefined
}

const httpEndpoint = process.env.VUE_APP_BASE_URL
  ? `${process.env.VUE_APP_BASE_URL}/graphql`
  : 'http://localhost:3000/graphql'

// Apollo cache
const cache = new InMemoryCache()

const setStuffUp = setContext((request, previousContext) => {
  return {
    headers: {
      ...previousContext.headers
      // 'x-hexly-client': `naativ-lounge-web||${window.$version}`
    }
  }
})

const batchCfg = { uri: httpEndpoint }
if (process.env.VUE_APP_USE_CREDENTIALS === 'true') {
  batchCfg.credentials = 'include'
}
const link = setStuffUp.concat(new BatchHttpLink(batchCfg))

const errorLink = onError(({ response, graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    const errors = []
    graphQLErrors.map(({ message, locations, path }) => errors.push(`Message: ${message}, Path: ${path}`))
    Sentry.captureException(new Error(errors))
    console.log('[GraphQL error]:', errors)
  }
  if (networkError) {
    Sentry.captureException(networkError)
    console.log('[Network error]:', networkError)
    if (response) response.errors = null
  }
})

const defaultOptions = {
  httpEndpoint,
  // wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:3000/graphql',
  tokenName: 'jwt',
  persisting: false,
  websocketsOnly: false,
  ssr: false,
  link: ApolloLink.from([errorLink, link]),
  cache,
  getAuth,
  defaultHttpLink: false
  // Additional ApolloClient options
  // apollo: { shouldBatch: true }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
}

// Call this in the Vue app file
export function createProvider(options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options
  })
  apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      }
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log(
        '%cError',
        'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
        error.message
      )
    }
  })

  return apolloProvider
}
