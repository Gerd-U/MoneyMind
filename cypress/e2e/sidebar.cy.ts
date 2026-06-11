/// <reference types="cypress" />

describe('Sidebar', () => {

  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[placeholder="tu@correo.com"]').type('gerald.urbina@gmail.com')
    cy.get('input[placeholder="••••••••"]').type('123456')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('debe mostrar el nombre del usuario', () => {
    cy.contains('Gerald Urbina').scrollIntoView().should('exist')
  })

  it('debe mostrar el correo del usuario', () => {
    cy.contains('gerald.urbina@gmail.com').scrollIntoView().should('exist')
  })

  it('debe mostrar el botón de cerrar sesión', () => {
    cy.contains('Cerrar sesión').scrollIntoView().should('exist')
  })

  it('debe navegar a dashboard', () => {
    cy.get('nav').contains('Dashboard').click({ force: true })
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('debe navegar a movimientos', () => {
    cy.get('nav').contains('Movimientos').click({ force: true })
    cy.url().should('include', '/movimientos')
  })

  it('debe navegar a reportes', () => {
    cy.get('nav').contains('Reportes').click({ force: true })
    cy.url().should('include', '/reportes')
  })

  it('debe navegar a presupuestos', () => {
    cy.get('nav').contains('Presupuestos').click({ force: true })
    cy.url().should('include', '/presupuestos')
  })

  it('debe navegar a categorías', () => {
    cy.get('nav').contains('Categorías').click({ force: true })
    cy.url().should('include', '/categorias')
  })

  it('debe navegar a métodos de pago', () => {
    cy.get('nav').contains('Métodos de pago').click({ force: true })
    cy.url().should('include', '/metodos-pago')
  })

  it('debe navegar a perfil', () => {
    cy.get('nav').contains('Perfil').click({ force: true })
    cy.url().should('include', '/perfil')
  })

  it('debe cerrar sesión correctamente', () => {
    cy.contains('Cerrar sesión').click({ force: true })
    cy.url().should('include', '/login')
  })

})