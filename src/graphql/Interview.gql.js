import gql from 'graphql-tag'

export const GET_APPOINTMENT = gql`
  query getInterviewById($apptId: Int!){
    appointment(id: $apptId){
      id
      hostId
      scheduledDate
      startTime
      endTime
      timeLimit
      maxParticipant
      canceled
      canceledReason
      type
      createdOn
      updatedOn
      participantIds
      host{
        id
        name
        contactEmail
      }
      participants{
        id
        name
        contactEmail
        surveys{
          id
          answers{
            questionName
            values{
              value
            }
          }
        }
      }
    }
  }
`

export const PENDING_INTERVIEWS = gql`
  query applicants($limit: Int!, $searchTerm: String) {
    getApplicantsToBeInterviewed(limit: $limit, searchTerm: $searchTerm) {
      id
      name
      contactEmail
      province
      timezone
      answers {
        questionName
        values {
          value
        }
      }
    }
  }
`
