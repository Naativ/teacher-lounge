import moment from 'moment'

export const rules = {
  required: [v => !!v || 'Field is required'],
  email: [
    v => !!v || 'Field is required',
    v => /^\w+([+.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Please enter a valid email address'
  ],
  password: [
    v => !!v || 'Field is required',
    v => (v && v.length > 8) || 'Password must be more than 8 characters'
  ],
  birthday: [
    v => !!v || 'Field is required',
    v =>
      (v && moment(v, 'MM/DD/YYYY', true).isValid()) ||
      `Your bithday needs to be a valid date. Please follow the format 'mm/dd/yyyy'`
  ],
  phone: [
    v => !!v || 'Field is required',
    v =>
      (v && v.length >= 10 && v.length <= 11) ||
      'Please enter a valid phone number'
  ],
  time: [
    v => !!v || 'Field is required',
    v =>
      (v.indexOf('am') >= 0 || v.indexOf('pm') >= 0) ||
      'Please enter AM or PM'
  ],
  slug: [
    v =>
      !!v ||
      'Field is required and cannot be changed once submitted',
    v =>
      (v && /^[a-zA-Z0-9_]{4,20}$/.test(v)) ||
      'Special characters other than underscores are not allowed.  Must be a minimum of 4 characters in length.'
  ]
}
