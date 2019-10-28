import get from 'lodash.get'

import {
  GET_BOOKING,
  UPSERT_BOOKING,
  SEARCH_BOOKING,
  SEARCH_BOOKING_WITH_APPTS,
  GET_PROFILE_BOOKING
} from '@/graphql/Booking.gql.js'
import store from '@/store'
import { createProvider } from '@/vue-apollo'

const apollo = createProvider().defaultClient

export const STATUS = {
  reserved: 200,
  archived: 204
}

export const TYPE = {
  interview: 1003,
  classroom: 1004,
  placement: 1006,
  conversation: 1007
}

export const upsertBooking = bookingObj => {
  return apollo
    .mutate({
      mutation: UPSERT_BOOKING,
      variables: {
        input: {
          id: get(bookingObj, 'id'),
          availabilityId: get(bookingObj, 'availabilityId'),
          profileId: get(bookingObj, 'profileId'),
          end: get(bookingObj, 'end'),
          guestId: get(bookingObj, 'guestId'),
          hostId: get(bookingObj, 'hostId'),
          start: get(bookingObj, 'start'),
          statusId: get(bookingObj, 'statusId', STATUS['reserved']),
          typeId: get(bookingObj, 'typeId', TYPE['classroom'])
        }
      }
    })
    .then(({ data: { bookingUpsert } }) => bookingUpsert)
}

export const getBookings = range => {
  const { start, end } = range
  return apollo
    .query({
      query: GET_BOOKING,
      variables: {
        input: {
          hostIds: [store.state.member.id],
          typeIds: [TYPE['classroom'], TYPE['interview'], TYPE['placement'], TYPE['conversation']],
          statusIds: [STATUS['reserved']],
          start: start.utc().toISOString(),
          end: end.utc().toISOString()
        }
      }
    })
    .then(({ data: { bookings } }) => bookings)
}

export const getProfileBookings = profile => {
  const { profileId, start, end } = profile
  return apollo.query({
    query: GET_PROFILE_BOOKING,
    variables: {
      input: {
        start: start.utc().toISOString(),
        end: end.utc().toISOString(),
        profileIds: [profileId]
      }
    }
  })
}

export const searchBookings = async (filter = {}) => {
  const apts = !!filter.includeAppointments
  const result = await apollo.query({
    query: apts ? SEARCH_BOOKING_WITH_APPTS : SEARCH_BOOKING,
    fetchPolicy: 'network-only',
    variables: {
      input: {
        hostIds: [store.state.member.id],
        typeIds: [TYPE['classroom'], TYPE['interview'], TYPE['placement']],
        statusIds: [STATUS['reserved']],
        start: filter.start.utc().toISOString(),
        end: filter.end.utc().toISOString()
      }
    }
  })
  // TODO error handling here
  return result.data.bookingSearch
}
