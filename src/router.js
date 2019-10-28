import Vue from 'vue'
import Router from 'vue-router'

import store from './store'
import featureFlags from './utils/FeatureFlags'

import Home from './views/Home.vue'
import TeacherLounge from './views/Lounge.vue'
import AccountClaim from './views/AccountClaim.vue'
import Registration from './views/Registration.vue'
import ForgottenPassword from './views/ForgottenPassword.vue'
import ResetPassword from './views/ResetPassword.vue'
import Login from './views/Login.vue'
import PageNotFound from './views/PageNotFound.vue'
import Feedback from './views/Feedback.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  },
  {
    path: '/register',
    name: 'Registration',
    component: Registration
  },
  {
    path: '/account/reset',
    name: 'Forgot My Password',
    component: ForgottenPassword
  },
  {
    path: '/account/reset/:token/:email',
    name: 'Reset Password',
    component: ResetPassword
  },
  {
    path: '/account/claim/:token',
    name: 'AccountClaim',
    component: AccountClaim
  },
  {
    path: '/impersonate/:token',
    name: 'impersonate',
    component: () => import(/* webpackChunkName: "Impersonate" */ './views/Impersonate.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) =>
      store.state.jwt ? next('/lounge/dashboard') : next()
  },
  // Logged in routes
  {
    path: '/classroom/:bookingId',
    name: 'Classroom',
    component: () => import(/* webpackChunkName: "Classroom" */ './views/Classroom.vue'),
    beforeEnter: (to, from, next) =>
      !store.state.jwt ? next('/login') : next()
  },
  {
    path: '/conversation/:bookingId',
    name: 'Conversation',
    component: () => import(/* webpackChunkName: "Conversation" */ './views/Conversation.vue'),
    beforeEnter: (to, from, next) =>
      !store.state.jwt ? next('/login') : next()
  },
  {
    path: '/interview/:apptId',
    name: 'InterviewRoom',
    component: () => import(/* webpackChunkName: "InterviewRoom" */ './views/InterviewRoom.vue'),
    beforeEnter: (to, from, next) =>
      !store.state.jwt ? next('/login') : next()
  },
  {
    path: '/lounge',
    component: () => import(/* webpackChunkName: "MainView" */ './layouts/Main.vue'),
    beforeEnter: (to, from, next) =>
      !store.state.jwt ? next('/login') : next(),
    children: [
      {
        path: 'dashboard',
        name: 'TeacherLounge',
        component: TeacherLounge
      },
      {
        path: 'announcements',
        name: 'Announcements',
        component: () => import(/* webpackChunkName: "Announcements" */ './views/lounge/Announcements.vue')
      },
      {
        path: 'availability',
        name: 'Availability',
        component: () => import(/* webpackChunkName: "Availability" */ './views/Availability.vue')
      },
      {
        path: 'practice/:lessonId',
        name: 'Practice',
        component: () => import(/* webpackChunkName: "Practice" */ './views/lounge/PracticeRoom.vue')
      },
      {
        path: 'planner',
        component: () => import(/* webpackChunkName: "Planner" */ './planner/Planner.vue'),
        children: [
          {
            path: '',
            name: 'PlannerSchedule',
            component: () => import(/* webpackChunkName: "Planner" */ './planner/planner.schedule.vue')
          },
          {
            path: 'latest',
            name: 'PlannerDashboard',
            component: () => import(/* webpackChunkName: "Planner" */ './planner/planner.dashboard.vue')
          },
          {
            path: 'recent',
            name: 'PlannerRecent',
            component: () => import(/* webpackChunkName: "Planner" */ './planner/planner.recent.vue')
          },
          {
            path: 'archive',
            name: 'PlannerArchive',
            component: () => import(/* webpackChunkName: "Planner" */ './planner/planner.archive.vue')
          }
        ]
      },
      {
        path: 'curriculum',
        name: 'Curriculum',
        component: () => import(/* webpackChunkName: "Curriculum" */ './views/lounge/Curriculum.vue')
      },
      {
        path: 'library',
        name: 'Library',
        component: () => import(/* webpackChunkName: "Library" */ './views/lounge/Library.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "Profile" */ './views/lounge/Profile.vue')
      },
      {
        path: 'interviews',
        name: 'Interviews',
        component: () => import(/* webpackChunkName: "Interview" */ './views/lounge/Interview.vue')
      },
      {
        path: '/feedback/:apptId',
        name: 'FeedbackRoom',
        component: Feedback
      }
    ]
  }
]

const loungeRoutes = new Router({
  mode: 'history',
  routes
})

loungeRoutes.beforeEach((to, from, next) => {
  if (featureFlags.maintenance && to.path !== '/') {
    next('/')
  }
  next()
})

export default loungeRoutes
