import gql from 'graphql-tag'

export const MEMBER_INFO = gql`
  query membersByIds($ids: [Int]) {
    membersByIds(ids: $ids) {
      id
      displayName
    }
  }
`

export const SEARCH_MEMBERS = gql`
query members($memberCon: MemberSearchCondition!){
  members(condition:$memberCon){
    id
    name
    firstName
    lastName
    displayName
    contactEmail
    profileUrl
    timezone{
      name
      utcOffset
      utcDstOffset
      countryCode
      comments
    }
    birthdate
    tags
    surveys {
      surveyId
      answers{
        questionName
        values {
          value
        }
      }
    }
    status
  }
}
`
export const MEMBER_PHONE = gql`
query memberPhone($phoneInput:MemberOrTenantInput){
  phoneNumberByMember(input:$phoneInput){
    id
    number
  }
}
`

export const GET_PROFILES = gql`
  query lmsProfiles($input: LmsProfileFilter!) {
    lmsProfiles(input: $input){
      page
      pageSize
      totalPages
      totalResults
      results {
        id
        memberId
        displayName
        avatarUrl
        genderId
        priority
      }
    }
  }
`

export const GET_ENROLLMENTS = gql`
  query lmsEnrollments($input: LmsEnrollmentFilter!) {
    lmsEnrollments(input: $input){
      page
      pageSize
      totalPages
      totalResults
      results {
        id
        profileId
        courseId
        priority
        lastLessonId
        lastLesson {
          id
          blockId
          name
          key
          description
        }
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
`

export const UPSERT_ENROLLMENT = gql`
  mutation lmsEnrollmentUpsert($input: LmsEnrollmentInput!){
    lmsEnrollmentUpsert(input: $input){
      id
      profileId
      courseId
      priority
    }
  }
`

export const UPDATE_MEMBER_TAGS = gql`
  mutation UpdateTags($input: MemberTagInput!) {
    updateTags( input: $input ) {
      id
      name
      tags
    }
  }
`

export const ADJUST_TAGS = gql`
  mutation adjustTags($input: MemberTagAdjustmentInput!) {
    adjustTags( input: $input ) {
      id 
      name
      tags
    }
  }
`
