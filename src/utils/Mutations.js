import { Mutations } from '@/store'

import { MEMBER, ADDRESS, USERNAME, PASSWORD, PHONE_NUMBER, SLUG } from '@/graphql/profile/Mutations.gql.js'

const profile = async (apollo, sectionInfo, store) => {
  const { id } = store.state.member
  const { firstName, lastName, birthdate, legalLocaleId, timezoneId, displayName } = sectionInfo
  const { data: { updateMemberSubset: { member } } } = await apollo.mutate({
    mutation: MEMBER,
    variables: {
      input: { id, firstName, lastName, birthday: birthdate, legalLocaleId, timezoneId, name, displayName }
    }
  })

  store.commit(Mutations.SET_MEMBER, member)
}

const username = async (apollo, sectionInfo, store) => {
  const { email } = sectionInfo
  const { data: { setMemberEmail: { member } } } = await apollo.mutate({
    mutation: USERNAME,
    variables: { input: { email } }
  })

  store.commit(Mutations.SET_MEMBER, member)
}

const phoneNumber = (apollo, sectionInfo) => {
  const { id, phoneNumber: number } = sectionInfo
  return apollo.mutate({
    mutation: PHONE_NUMBER,
    variables: { input: { id, number } }
  })
}

const address = (apollo, sectionInfo, store) => {
  const { displayName } = store.state.member
  const { id, street, street2, city, country, province, postalCode } = sectionInfo
  const { memberId } = sectionInfo
  return apollo.mutate({
    mutation: ADDRESS,
    variables: {
      input: { id, country, name: displayName, street, street2, city, province, postalCode, memberId }
    }
  })
}

const password = (apollo, sectionInfo) => {
  const { newPassword, oldPassword } = sectionInfo
  return apollo.mutate({
    mutation: PASSWORD,
    variables: { input: { newPassword, oldPassword } }
  })
}

const link = (apollo, sectionInfo) => {
  const { slug } = sectionInfo
  return apollo.mutate({
    mutation: SLUG,
    variables: { input: { slug } }
  })
}

export const profileMap = {
  address,
  password,
  phoneNumber,
  profile,
  username,
  link
}
