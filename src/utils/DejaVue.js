import pick from 'lodash.pick'
import * as MUTATIONS from '@/store.mutations'
import { Actions } from '@/store'

export const DejaVue = {
  plugin: (init, localStorageName, fieldsToSave = []) => store => {
    store.commit(init, store)
    store.subscribe((mutation, state) => {
      let objectToSave = state
      if (fieldsToSave.length > 0) {
        objectToSave = pick(state, fieldsToSave)
      }
      localStorage.setItem(
        localStorageName,
        JSON.stringify(objectToSave))
    })
  },
  mutation: (localStorageName, setup) => async (state, { commit, dispatch }) => {
    const dehydratedState = localStorage.getItem(localStorageName)
    if (dehydratedState) {
      try {
        const hydratedState = JSON.parse(dehydratedState)
        if (Array.isArray(setup)) {
          setup.forEach(s => s(hydratedState))
        }
        if (typeof setup === 'function') {
          setup(hydratedState)
        }
        Object.assign(state, hydratedState)
      } catch (e) {
        await dispatch(Actions.LOGOUT)
        window.location = '/'
      }
    }

    commit(MUTATIONS.SET_JWT, state ? state.jwt : undefined)
  }
}
