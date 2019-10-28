import { LESSON_BY_ID,
  GET_COURSES,
  GET_BLOCKS,
  GET_UNITS,
  GET_LESSONS,
  GET_LESSON_SHELL } from './api.js'
import { createProvider } from '@/vue-apollo'

const apollo = createProvider().defaultClient

export const getCourses = async () => {
  const { data } = await apollo.query({
    query: GET_COURSES
  })
  return data.getCourses
}

export const getUnits = async courseIds => {
  const { data } = await apollo.query({
    query: GET_UNITS,
    variables: {
      input: {
        page: 1,
        pageSize: 100,
        courseIds
      }
    }
  })
  return data.getUnits
}

export const getBlocks = async unitIds => {
  const { data } = await apollo.query({
    query: GET_BLOCKS,
    variables: {
      input: {
        page: 1,
        pageSize: 100,
        unitIds
      }
    }
  })
  return data.getBlocks
}

export const getLessons = async blockIds => {
  const { data } = await apollo.query({
    query: GET_LESSONS,
    variables: {
      input: {
        page: 1,
        pageSize: 100,
        blockIds
      }
    }
  })
  return data.getLessons
}

export const getLesson = async lessonId => {
  return apollo.query({
    query: LESSON_BY_ID,
    variables: {
      condition: {
        id: lessonId
      }
    }
  })
    .then(({ data: { getLessonById } }) => getLessonById)
}

export const getLessonShell = async lessonId => {
  return apollo.query({
    query: GET_LESSON_SHELL,
    variables: {
      condition: {
        id: lessonId
      }
    }
  }).then(({ data: { getLessonById } }) => getLessonById)
}
