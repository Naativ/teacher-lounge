import moment from 'moment'

describe('Registration and Login Tests', function () {
  const mockUser = {
    firstName: 'Hexly',
    lastName: 'Test',
    email: `test-${moment().valueOf()}@test.net`,
    password: 'Password1',
    phone: '1234567890',
    birthDate: '01012010',
    street1: '123 Disney Street',
    street2: 'Apartment 123',
    city: 'Orlando',
    state: 'FL',
    zip: '11111',
    county: 'United States of America',
    citizenship: 'United States of America'
  }

  it('Simple Registration', function () {
    cy.visit('http://localhost:8080/')
    cy.get('[data-cy=\'Apply Today\']').click()
    cy.get('[data-cy=\'First Name\']').type(mockUser.firstName)
    cy.get('[data-cy=\'Last Name\']').type(mockUser.lastName)
    cy.get('[data-cy=\'Email\']').type(mockUser.email)
    cy.get('[data-cy=\'Password\']').type(mockUser.password)
    cy.get('[data-cy=\'Birth Date\']').type(mockUser.birthDate)
    cy.get('[data-cy=\'Phone\']').type(mockUser.phone)
    cy.get('[data-cy=\'Street1\']').type(mockUser.street1)
    cy.get('[data-cy=\'Street2\']').type(mockUser.street2)
    cy.get('[data-cy=\'City\']').type(mockUser.city)
    cy.get('[data-cy=\'State\']').type(mockUser.state)
    cy.get('[data-cy=\'Zip\']').type(mockUser.zip)
    cy.get('.flex:nth-child(14) > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple').click()
    cy.get('.flex:nth-child(15) > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple').click()
    cy.get('[data-cy=\'Create Account\']').click()
    cy.get('[data-cy=\'Logout\']').click()
  })

  it('Simple Login', function () {
    cy.get('[data-cy="Login Home Page"]').click()
    cy.get('[data-cy=\'Email Login Page\']').type(mockUser.email)
    cy.get('[data-cy=\'Password Login Page\']').type(mockUser.password)
    cy.get('[data-cy=\'Login Page Login\']').click()
  })
})
