/// <reference types="cypress" />

describe('Reportes', () => {

  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[placeholder="tu@correo.com"]').type('gerald.urbina@gmail.com')
    cy.get('input[placeholder="••••••••"]').type('123456')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.visit('/reportes')
  })

  it('debe mostrar la página de reportes', () => {
    cy.get('h1').contains('Reportes').should('be.visible')
  })

  it('debe mostrar las cards de resumen', () => {
    cy.contains('Total ingresos').should('be.visible')
    cy.contains('Total egresos').should('be.visible')
    cy.contains('Tasa de ahorro').should('be.visible')
  })

  it('debe mostrar el selector de mes', () => {
    cy.get('select').first().should('be.visible')
    cy.get('select').first().find('option').should('have.length', 12)
  })

  it('debe mostrar el selector de año', () => {
    cy.get('select').last().should('be.visible')
    cy.get('select').last().find('option').should('have.length.gte', 1)
  })

  it('debe mostrar el grafico de movimientos por semana', () => {
    cy.contains('Movimientos por semana').should('be.visible')
  })

  it('debe mostrar la seccion de egresos por categoria', () => {
    cy.contains('Egresos por categoría').should('be.visible')
  })

  it('debe cambiar el mes seleccionado', () => {
    cy.get('select').first().select('Enero')
    cy.contains('Enero').should('be.visible')
  })

  it('debe cambiar el año seleccionado', () => {
    cy.get('select').last().then($select => {
      const options = $select.find('option')
      if (options.length > 1) {
        const secondVal = options.eq(1).val() as string
        cy.get('select').last().select(secondVal)
      }
    })
    cy.get('h1').contains('Reportes').should('be.visible')
  })

})