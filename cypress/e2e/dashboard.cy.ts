/// <reference types="cypress" />

describe('Dashboard', () => {

  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[placeholder="tu@correo.com"]').type('gerald.urbina@gmail.com')
    cy.get('input[placeholder="••••••••"]').type('123456')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('debe mostrar el dashboard correctamente', () => {
    cy.get('h1').contains('Dashboard').should('be.visible')
  })

  it('debe mostrar las métricas principales', () => {
    cy.contains('Balance actual').should('be.visible')
    cy.contains('Ingresos del mes').should('be.visible')
    cy.contains('Egresos del mes').should('be.visible')
  })

  it('debe mostrar el gráfico de resumen mensual', () => {
    cy.contains('Resumen mensual').should('be.visible')
  })

  it('debe mostrar la sección de presupuestos', () => {
    cy.contains('Presupuestos del mes').should('be.visible')
  })

  it('debe mostrar la sección de movimientos recientes', () => {
    cy.contains('Movimientos recientes').should('be.visible')
  })

  it('debe navegar a movimientos desde el sidebar', () => {
    cy.get('nav').contains('Movimientos').click({ force: true })
    cy.url().should('include', '/movimientos')
  })

  it('debe navegar a categorías desde el sidebar', () => {
    cy.get('nav').contains('Categorías').click({ force: true })
    cy.url().should('include', '/categorias')
  })

  it('debe navegar a reportes desde el sidebar', () => {
    cy.get('nav').contains('Reportes').click({ force: true })
    cy.url().should('include', '/reportes')
  })

})