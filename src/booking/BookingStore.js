import * as Booking from '@/booking/BookingService'

import * as RootMutations from '@/store.mutations'

export const Actions = {
  GET_BOOKINGS: 'BookingGetBookings',
  SEARCH_BOOKINGS: 'booking:search',
  GET_PROFILE_BOOKING: 'booking:searchProfileId'
}

export const Mutations = {
  SET: 'booking:set'
}

const DEFAULT_STATE = {
  fetching: false,
  latestPage: {}
}
export const BookingStore = {
  state: {
    ...DEFAULT_STATE
  },
  mutations: {
    [Mutations.SET]: (state, [value, fn]) => fn(state, value),
    [RootMutations.INIT]: state => {
      Object.assign(state, DEFAULT_STATE)
    }
  },
  actions: {
    [Actions.GET_BOOKINGS]: (_, range) => Booking.getBookings(range),
    [Actions.GET_PROFILE_BOOKING]: (_, range) => Booking.getProfileBookings(range),
    [Actions.SEARCH_BOOKINGS]: async ({ commit }, filter) => {
      // toggle fetching
      commit(Mutations.SET, [
        { fetching: true },
        (state, value) => Object.assign((state || {}).fetching, value)
      ])
      // do the work and cache the last page
      const page = await Booking.searchBookings(filter)
      commit(Mutations.SET, [
        page,
        (state, value) => Object.assign(state.latestPage, value)
      ])
      // toggle done
      commit(Mutations.SET, [
        { fetching: false },
        (state, value) => Object.assign(state.fetching, value)
      ])
      return page
    }
  }
}

export default {
  actions: Actions,
  mutations: Mutations,
  store: BookingStore
}
