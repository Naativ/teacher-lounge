import gql from 'graphql-tag'

export const localeSettings = gql`
  query {
    allLegalLocales {
      nodes {
        id
        code
        name
        enabled
      }
    }
    allTimezones {
      nodes {
        id
        name
      }
    }
    allLanguages {
      nodes {
        id
        name
        localName
      }
    }
  }
`
