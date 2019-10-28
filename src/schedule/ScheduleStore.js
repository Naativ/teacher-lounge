import * as Schedule from '@/schedule/ScheduleService'

export const Actions = {
  GET_AVAILABILITY: 'scheduleGetAvailability',
  REMOVE_AVAILABILITY: 'scheduleRemoveAvailability',
  UPSERT_AVAILABILITY: 'scheduleUpsertAvailability'
}

export const ScheduleStore = {
  mutations: {},
  actions: {
    [Actions.REMOVE_AVAILABILITY]: (_, availability) =>
      Schedule.removeAvailability(availability),
    [Actions.UPSERT_AVAILABILITY]: (_, availability) =>
      Schedule.upsertAvailability(availability),
    [Actions.GET_AVAILABILITY]: (_, range) =>
      Schedule.getAvailability(range)
  }
}
