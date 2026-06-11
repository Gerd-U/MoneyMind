/// <reference types="cypress" />

describe('Movimientos', () => {

  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[placeholder="tu@correo.com"]').type('gerald.urbina@gmail.com')
    cy.get('input[placeholder="••••••••"]').type('123456')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.visit('/movimientos')
  })

  it('debe mostrar la página de movimientos', () => {
    cy.get('h1').contains('Movimientos').should('be.visible')
    cy.contains('+ Nuevo').should('be.visible')
  })

  it('debe filtrar por tipo ingreso', () => {
    cy.contains('button', 'Ingresos').click()
    cy.contains('button', 'Ingresos').should('be.visible')
  })

  it('debe filtrar por tipo egreso', () => {
    cy.contains('button', 'Egresos').click()
    cy.contains('button', 'Egresos').should('be.visible')
  })

  it('debe buscar por descripción', () => {
    cy.get('input[placeholder="Buscar por descripción..."]').type('test')
    cy.get('input[placeholder="Buscar por descripción..."]').should('have.value', 'test')
  })

  it('debe abrir el modal de nuevo movimiento', () => {
    cy.contains('button', '+ Nuevo').click()
    cy.contains('Nuevo movimiento').should('be.visible')
  })

  it('debe cerrar el modal al cancelar', () => {
    cy.contains('button', '+ Nuevo').click()
    cy.contains('button', 'Cancelar').click()
    cy.contains('Nuevo movimiento').should('not.exist')
  })

})