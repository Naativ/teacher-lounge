// import get from 'lodash.get'

// import { GET_BOOKING, UPSERT_BOOKING } from '@/graphql/Booking.gql.js'
// import store from '@/store'
// import { createProvider } from '@/vue-apollo'

// const apollo = createProvider().defaultClient

// export const STATUS = {
//   'reserved': 200,
//   'archived': 204
// }

// export const TYPE = {
//   'interview': 1003,
//   'classroom': 1004
// }

// export const upsertBooking = bookingObj => {
//   return apollo.mutate({
//     mutation: UPSERT_BOOKING,
//     variables: {
//       input: {
//         availabilityId: get(bookingObj, 'availabilityId'),
//         end: get(bookingObj, 'end'),
//         guestId: get(store, 'state.member.member.id'),
//         hostId: get(bookingObj, 'memberId'),
//         start: get(bookingObj, 'start'),
//         statusId: STATUS['reserved'],
//         typeId: TYPE['classroom']
//       }
//     }
//   })
//     .then(({ data: { bookingUpsert } }) => bookingUpsert)
// }

// export const getBookings = range => {
//   const { start, end } = range
//   return apollo.query({
//     query: GET_BOOKING,
//     variables: {
//       input: {
//         hostIds: [store.state.member.id],
//         typeIds: [TYPE['classroom'], TYPE['interview']],
//         statusIds: [STATUS['reserved']],
//         start: start.utc().toISOString(),
//         end: end.utc().toISOString()
//       }
//     }
//   })
//     .then(({ data: { bookings } }) => bookings)
// }
