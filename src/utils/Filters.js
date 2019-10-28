import Vue from 'vue'
import moment from 'moment'

const dateFormat = (value, format) => {
  if (value) {
    return moment(String(value)).format(format || 'MM/DD/YY')
  }
}

Vue.filter('dateFormat', dateFormat)

Vue.filter('capitalize', function(value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

// Global Filters
// Vue.filter('formatDate', function (date, DATE_SHORT) {
//   return DateTime.fromISO(date).toLocaleString(DateTime.DATE_SHORT)
// })
Vue.filter('momentDate', function(date, format = 'MMMM Do YYYY, h:mm:ss a') {
  return date ? moment(date).format(format) : ''
})
