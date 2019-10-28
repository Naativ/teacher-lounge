import gql from 'graphql-tag'

export const getAvailability = gql`
  query getAvailability($input: AvailabilityFilter!) {
    availabilities(input: $input) {
      id
      memberId
      typeId
      start
      end
    }
  }
`

export const upsertAvailability = gql`
  mutation UpsertAvailability($availability: AvailabilityInput!) {
    availabilityUpsert(input: $availability) {
      id
      end
      start
    }
  }
`

export const getAvailabilityBlocks = gql`
  query getAvailabilityBlocks($input: AvailabilityBlockInput!) {
    availabilityBlocks(input: $input) {
      availabilityId
      memberId
      typeId
      start
      end
      booked
    }
  }
`
