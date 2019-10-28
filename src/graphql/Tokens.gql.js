import gql from 'graphql-tag'

export const GENERATE_TOKEN = gql`
 mutation token($token: GenerateOneTimeTokenInput!) {
    generateOneTimeToken(input: $token)
  }
`

export const VIDEO_ROOM_TOKEN = gql`
 mutation grantVideoAccess($roomInput: VideoAccessInput!) {
    grantVideoAccess(input: $roomInput) {
      token
    }
  }
`
