import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from 'vue-cookies'

import { createProvider } from './vue-apollo'
import { DejaVue } from '@/utils/DejaVue'
import * as MUTATIONS from '@/store.mutations'
// Queries
import { authenticate, resetOneTimeToken } from '@/graphql/Account.gql.js'
import { GENERATE_TOKEN } from '@/graphql/Tokens.gql.js'
// Stores
import AppointmentStore from '@/appointment/Store'
import { BookingStore } from '@/booking/BookingStore'
import { ContentStore } from '@/content/ContentStore'
import { ScheduleStore } from '@/schedule/ScheduleStore'
import { LessonStore } from '@/Lessons/Store'

const COOKIE_DOMAIN = process.env.VUE_APP_COOKIE_DOMAIN || 'localhost:3000'
const tenantId = ~~process.env.VUE_APP_TENANT_ID

const apollo = createProvider().defaultClient

Vue.use(Vuex)

const LOCAL_STORAGE_NAME = 'store'

export const Mutations = MUTATIONS

const verifyPrincipal = hydratedState => {
  if (!hydratedState.principal || !hydratedState.jwt) {
    localStorage.clear()
    window.location = '/'
  }
}

export const Actions = {
  LOGOUT: 'logout',
  LOGIN: 'login',
  GENERATE_TOKEN: 'generateToken',
  RESET_PASSWORD: 'resetPassword'
}

export default new Vuex.Store({
  plugins: [DejaVue.plugin(MUTATIONS.INIT, LOCAL_STORAGE_NAME, ['jwt', 'principal', 'member'])],
  modules: { BookingStore, ContentStore, ScheduleStore, AppointmentStore, LessonStore },
  state: {
    isImpersonating: false,
    jwt: null,
    principal: {},
    member: {}
  },
  mutations: {
    [MUTATIONS.INIT]: DejaVue.mutation(LOCAL_STORAGE_NAME, [verifyPrincipal]),
    [MUTATIONS.SET_PRINCIPAL](state, principal) {
      this.state.principal = principal
    },
    [MUTATIONS.SET_JWT](state, jwt) {
      this.state.jwt = jwt
      VueCookies.set('hexlyJwt', jwt, null, null, COOKIE_DOMAIN)
    },
    [MUTATIONS.SET_MEMBER](state, member) {
      state.member = { ...state.member, ...member }
    },
    [MUTATIONS.TOGGLE_IMPERSONATION]: state => {
      state.isImpersonating = !state.isImpersonating
    }
  },
  actions: {
    [Actions.LOGOUT]({ commit }) {
      localStorage.removeItem(LOCAL_STORAGE_NAME)
      VueCookies.remove('hexlyJwt')
    },
    async [Actions.LOGIN]({ commit }, creds) {
      const { data } = await apollo.mutate({
        mutation: authenticate,
        variables: { creds }
      })
      if (data.login.success) {
        const { member } = data.login.principal
        delete data.login.principal.member
        commit(MUTATIONS.SET_JWT, data.login.token)
        commit(MUTATIONS.SET_PRINCIPAL, data.login.principal)
        commit(MUTATIONS.SET_MEMBER, member)
      }
      return data.login
    },
    async [Actions.GENERATE_TOKEN]({ commit }, payload) {
      await apollo.mutate({
        mutation: GENERATE_TOKEN,
        variables: {
          token: { ...payload, domain: window.location.origin, tenantId }
        }
      })
    },
    async [Actions.RESET_PASSWORD]({ commit }, payload) {
      await apollo.mutate({
        mutation: resetOneTimeToken,
        variables: { input: payload }
      })
    }
  },
  getters: {
    member: state => state.member
  }
})
