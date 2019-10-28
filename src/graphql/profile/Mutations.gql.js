import gql from 'graphql-tag'

export const ADDRESS = gql`
  mutation updateAddress($input:AddressInput) {
    updateAddress(input:$input) {
      street
      street2
      city
      province
      postalCode
    }
  }
`
export const MEMBER = gql`
  mutation updateMemberSubset($input:MemberInfoInputSubset) {
    updateMemberSubset(input:$input) {
      id
      firstName
      lastName
      birthdate
      legalLocaleId
      timezoneId
      displayName
    }
  }
`

export const PASSWORD = gql`
  mutation setMemberPassword($input:SetMemberPasswordInput!){
    setMemberPassword(input:$input)
  }
`

export const PHONE_NUMBER = gql`
  mutation updatePhoneNumber($input:ContactNumberInput!) {
    updatePhoneNumber(input:$input) {
      number
    }
  }
`

export const USERNAME = gql`
  mutation setMemberEmail($input:SetMemberEmailInput!) {
    setMemberEmail(input:$input) {
      member {
        contactEmail
      }
    }
  }
`

export const SLUG = gql`
  mutation setMemberSlug($input: SlugInput!) {
    addMemberSlug(input: $input) {
      slug
      priority
    }
  }
`
