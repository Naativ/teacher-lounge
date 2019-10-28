import * as Service from '@/Lessons/Service'

export const Actions = {
  COURSE_GET: 'courses:GET',
  UNITS_GET: 'units:GET',
  BLOCKS_GET: 'blocks:GET',
  LESSONS_GET: 'lessons:GET',
  GET: 'lesson:GET',
  GET_LESSON_SHELL: 'lesson:GET_SHELL'
}

export const LessonStore = {
  actions: {
    [Actions.COURSE_GET]: async () => {
      const courses = await Service.getCourses()
      return courses
    },
    [Actions.UNITS_GET]: async (_, courseId) => {
      const units = await Service.getUnits(courseId)
      return units
    },
    [Actions.BLOCKS_GET]: async (_, unitId) => {
      const blocks = await Service.getBlocks(unitId)
      return blocks
    },
    [Actions.LESSONS_GET]: async (_, blockId) => {
      const lessons = await Service.getLessons(blockId)
      return lessons
    },
    [Actions.GET]: async ({ commit, state }, lessonId) => {
      const lesson = await Service.getLesson(lessonId)
      return lesson
    },
    [Actions.GET_LESSON_SHELL]: async ({ commit, state }, lessonId) => {
      const lesson = await Service.getLessonShell(lessonId)
      return lesson
    }
  }
}
