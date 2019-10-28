import gql from 'graphql-tag'

export const getMemberSlug = gql`
  query getMemberSlug($id: Int, $priority: Int) {
    member(id:$id){
    id
    slugs(priority:$priority)
      {
        priority
        slug
      }
    }
  }
`

export const CHECK_SLUG = gql`
  query checkSlug($input: SlugInput!) {
    checkSlug(input: $input) {
      id
      slug
      priority
    }
  }
`

export const getMemberAttribute = gql`
  query getMemberAttribute($input: GetMemberAttributeInput!) {
    getMemberAttribute(input: $input) {
      key
      value
      memberId
      id
    }
  }
`

export const setMemberAttribute = gql`
  mutation upsertMemberAttribute($input: MemberAttributeInput!) {
    upsertMemberAttribute(input: $input) {
      key
      value
      memberId
      id
    }
  }
`

export const ADDRESS = gql`
  query addressByMemberOrTenant($input:MemberOrTenantInput) {
    addressByMemberOrTenant(input:$input) {
      id
      street
      street2
      city
      country
      province
      postalCode
    }
  }
`
export const PHONE_NUMBER = gql`
  query phoneNumberByMember($input:MemberOrTenantInput) {
    phoneNumberByMember(input: $input) {
      id
      number
    }
  }
`
