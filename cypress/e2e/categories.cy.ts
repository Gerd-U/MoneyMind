/// <reference types="cypress" />

describe('Categorías', () => {

  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[placeholder="tu@correo.com"]').type('gerald.urbina@gmail.com')
    cy.get('input[placeholder="••••••••"]').type('123456')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.visit('/categorias')
  })

  it('debe mostrar la página de categorías', () => {
    cy.get('h1').contains('Categorías').should('be.visible')
    cy.contains('button', '+ Nueva').should('be.visible')
  })

  it('debe abrir el modal de nueva categoría', () => {
    cy.contains('button', '+ Nueva').click()
    cy.contains('Nueva categoría').should('be.visible')
  })

  it('debe cerrar el modal al cancelar', () => {
    cy.contains('button', '+ Nueva').click()
    cy.contains('button', 'Cancelar').click()
    cy.contains('Nueva categoría').should('not.exist')
  })

  it('debe crear una categoría', () => {
    cy.contains('button', '+ Nueva').click()
    cy.get('input[placeholder="ej. Alimentación"]').type('Test Categoría')
    cy.get('input[placeholder="ej. Supermercado y restaurantes"]').type('Descripción test')
    cy.get('select').last().select('Egreso')
    cy.contains('button', 'Guardar categoría').click()
    cy.contains('Test Categoría').should('be.visible')
  })

  it('debe eliminar una categoría', () => {
    cy.contains('Test Categoría').parents('.rounded-xl').within(() => {
      cy.contains('button', 'Eliminar').click()
    })
    cy.contains('Test Categoría').should('not.exist')
  })

})