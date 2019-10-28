import { Month, Weekday } from 'dayspan'
export const holidays = [
  {
    data: {
      title: 'Mother\'s Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.MAY],
      dayOfWeek: [Weekday.SUNDAY],
      weekspanOfMonth: [1]
    }
  },
  {
    data: {
      title: 'New Year\'s Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.JANUARY],
      dayOfMonth: [1]
    }
  },
  {
    data: {
      title: 'Inauguration Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.JANUARY],
      dayOfMonth: [20]
    }
  },
  {
    data: {
      title: 'Martin Luther King, Jr. Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.JANUARY],
      dayOfWeek: [Weekday.MONDAY],
      weekspanOfMonth: [2]
    }
  },
  {
    data: {
      title: 'George Washington\'s Birthday',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.FEBRUARY],
      dayOfWeek: [Weekday.MONDAY],
      weekspanOfMonth: [2]
    }
  },
  {
    data: {
      title: 'Memorial Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.MAY],
      dayOfWeek: [Weekday.MONDAY],
      lastWeekspanOfMonth: [0]
    }
  },
  {
    data: {
      title: 'Independence Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.JULY],
      dayOfMonth: [4]
    }
  },
  {
    data: {
      title: 'Labor Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.SEPTEMBER],
      dayOfWeek: [Weekday.MONDAY],
      lastWeekspanOfMonth: [0]
    }
  },
  {
    data: {
      title: 'Columbus Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.OCTOBER],
      dayOfWeek: [Weekday.MONDAY],
      weekspanOfMonth: [1]
    }
  },
  {
    data: {
      title: 'Veterans Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.NOVEMBER],
      dayOfMonth: [11]
    }
  },
  {
    data: {
      title: 'Thanksgiving Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.NOVEMBER],
      dayOfWeek: [Weekday.THURSDAY],
      weekspanOfMonth: [3]
    }
  },
  {
    data: {
      title: 'Christmas Day',
      color: '#2196F3',
      calendar: 'US Holidays'
    },
    schedule: {
      month: [Month.DECEMBER],
      dayOfMonth: [25]
    }
  }
]
