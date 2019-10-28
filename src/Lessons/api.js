import gql from 'graphql-tag'

export const GET_COURSES = gql`
  query getCourses {
    getCourses {
      page
      pageSize
      totalPages
      totalResults
      results {
        ...on CurriculumCourse {
          id
          key
          description
          tenantId
          name
        }
      }
    }
  }
`

export const GET_BLOCKS = gql`
  query getBlocks($input: CurriculumCondition) {
    getBlocks(input: $input) {
      page
      pageSize
      totalPages
      totalResults
      results {
        ...on CurriculumBlock {
          id
          unitId
          key
          name
          description
          priority
        }
      }
    }
  }
`

export const GET_UNITS = gql`
  query getUnits($input: CurriculumCondition) {
    getUnits(input: $input) {
      page
      pageSize
      totalPages
      totalResults
      results {
        ...on CurriculumUnit {
          id
          courseId
          key
          name
          description
          priority
        }
      }
    }
  }
`
export const GET_LESSONS = gql`
  query getLessons($input: CurriculumCondition) {
    getLessons(input: $input) {
      page
      pageSize
      totalPages
      totalResults
      results {
        ...on CurriculumLesson {
          id
          key
          priority
          description
          priority
          name
          metadata
        }
      }
    }
  }
`

export const LESSON_BY_ID = gql`
query lessonById($condition: CurriculumLessonCondition!){
  getLessonById(input:$condition){
    id
    name
    description
    metadata
    slides {
      id
      name
      description
      metadata
      priority
      type {
        name
      }
      assets {
        id
        url
      }
    }
  }
}
`
export const GET_LESSON_SHELL = gql`
query lessonById($condition: CurriculumLessonCondition!){
  getLessonById(input:$condition){
    id
    name
    description
    metadata
    progressions {
      fromId
      toId
      id
    }
  }
}
`
