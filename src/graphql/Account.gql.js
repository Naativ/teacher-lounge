import gql from 'graphql-tag'

export const getPrincipal = gql`
  query principal {
    getPrincipal {
      role
      displayName
      username
      identityId
      tenantId
      permissions 
      member {
        id
        name
        firstName
        lastName
        displayName
        slugs(priority: 0){
          slug
        }
        mrn
        contactEmail
        profileUrl
        createdOn
        joinedOn
        claimedOn
        timezoneId
        languageId
        legalLocaleId
        status
        birthdate
        tags
      }
    }
  }
`

export const resetOneTimeToken = gql`
  mutation resetOneTimeToken($input:ResetOneTimeTokenInput!) {
    resetOneTimeToken(input:$input)
  }
`

export const authenticate = gql`
  mutation auth($creds: Credentials!) {
    login(input: $creds) {
      token
      success
      reason
      principal {
        identityId
        auditId
        credentialId
        username
        member {
          id
          name
          firstName
          lastName
          displayName
          slugs(priority: 0){
            slug
          }
          mrn
          contactEmail
          profileUrl
          createdOn
          joinedOn
          claimedOn
          timezoneId
          languageId
          legalLocaleId
          status
          birthdate
          tags
        }
        permissionIds
      }
    }
  }
`

export const isUsernameAvailable = gql`
  query isUsernameAvailable($input:UsernameInput) {
    isUsernameAvailable(input:$input)
  }
`

export const consumeOneTimeToken = gql`
  mutation claim($claimToken: ConsumeOneTimeTokenInput!) {
    consumeOneTimeToken(input: $claimToken)
  }
`

export const registerMember = gql`
  mutation registerMember($member: RegisterInput!) {
    register(input: $member) {
      token
      member{
        id
      }
    }
  }
`
