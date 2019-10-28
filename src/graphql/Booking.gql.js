import gql from 'graphql-tag'

export const UPSERT_BOOKING = gql`
  mutation bookingUpsert($input: BookingInput!) {
    bookingUpsert(input: $input) {
      id
      typeId
      hostId
      guestId
      start
      end
    }
  }
`

const BOOKING_PROPS = `
  id
  typeId
  statusId
  availabilityId
  hostId
  host {
    id
    displayName
  }
  type {
    name
  }
  guestId
  guest {
    id
    displayName
  }
  profileId
  profile {
    id
    displayName
    birthdate
    enrollments{
      id
      courseId
      priority
      nextLessonIds
      nextLessons {
        id
        blockId
        name
        key
        description
      }
      lastLesson {
        id
        blockId
        name
        key
        description
      }
    }
  }
  start
  end
`

const BOOKING_W_APPOINTMENT_PROPS = `
  ${BOOKING_PROPS}
  surveyResponses {
    id
    memberId
    answers {
      questionName
      values {
        value
      }
    }
  }
  appointments {
    id
    hostId
    participantIds
    startTime
    endTime
    canceled
    canceledReason
    type
    scheduledDate    
  }
`

export const GET_BOOKING = gql`
  query bookings($input: BookingFilter!) {
    bookings(input: $input) {
      ${BOOKING_PROPS}
    }
  }
`

export const SEARCH_BOOKING = gql`
  query searched($input: BookingFilter!) {
    bookingSearch(input: $input) {
      page
      pageSize
      totalPages
      totalResults
      results {
        ${BOOKING_PROPS}
      }      
    }
  }
`
export const SEARCH_BOOKING_WITH_APPTS = gql`
  query searched($input: BookingFilter!) {
    bookingSearch(input: $input) {
      page
      pageSize
      totalPages
      totalResults
      results {
        ${BOOKING_W_APPOINTMENT_PROPS}
      }      
    }
  }
`
export const GET_PROFILE_BOOKING = gql`
  query bookings($input: BookingFilter!) {
    bookings(input: $input) {
      id
      type {
        name
      }
      profile {
        id
        displayName
        birthdate
        enrollments{
          id
          courseId
          priority
          nextLessonIds
          nextLessons {
            id
            blockId
            name
            key
            description
          }
        }
      }
    }
  }
`
