import gql from 'graphql-tag'

export const SAVE_SURVEY = gql`
  mutation saveSurvey($response: SurveyResponseInput!) {
    surveyResponseUpsert(input: $response) {
      id
      surveyId
      answers {
        responseId
        questionName
      }
    }
  }
`

export const GET_SURVEY = gql`
  query getSurvey($SSInput: SurveySearchInput!) {
    surveySearch(input: $SSInput) {
      id
      title
      description
      elements {
        hint
        description
        placeholder
        id
        type
        dataType
        status
        name
        position
        allowOtherResponse
        required
        options {
          id
          value
          position
        }
      }
    }
  }
`

export const GET_SURVEY_RESPONSE = gql`
  query surveyResponse($input: SurveyResponseSearch!) {
    surveyResponse(input: $input) {
      id
      surveyId
      answers {
        questionName
        values {
          value
        }
      }
    }
  }
`
