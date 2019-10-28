import * as Scheduling from '@/graphql/Scheduling.gql.js'
import { createProvider } from '@/vue-apollo'
import store from '@/store'

const apollo = createProvider().defaultClient

export const STATUS = {
  'archive': 204,
  'live': 200
}

export const TYPE = {
  'available': 1001
}

export const getAvailability = range => {
  const { start, end } = range
  return apollo.query({
    query: Scheduling.getAvailability,
    fetchPolicy: 'no-cache',
    variables: {
      input: {
        end,
        memberIds: [store.state.member.id],
        statusIds: [STATUS['live']],
        start,
        typeIds: [TYPE['available']]
      }
    }
  })
}

export const upsertAvailability = _avail => {
  const availability = build(_avail, STATUS['live'], TYPE['available'])
  return upsert(availability)
}

export const removeAvailability = _avail => {
  const availability = build(_avail, STATUS['archive'], TYPE['available'])
  return upsert(availability)
}

const build = (_availability, statusId, typeId) => {
  const { end, id, start } = _availability
  return {
    end: end.utc().toISOString(),
    id,
    start: start.utc().toISOString(),
    statusId,
    typeId
  }
}

const upsert = availability => {
  return apollo.mutate({
    mutation: Scheduling.upsertAvailability,
    variables: { availability }
  })
}
