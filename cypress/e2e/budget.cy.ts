/// <reference types="cypress" />

describe('Presupuestos', () => {

  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[placeholder="tu@correo.com"]').type('gerald.urbina@gmail.com')
    cy.get('input[placeholder="••••••••"]').type('123456')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.visit('/presupuestos')
  })

  it('debe mostrar la página de presupuestos', () => {
    cy.get('h1').contains('Presupuestos').should('be.visible')
    cy.contains('button', '+ Nuevo').should('be.visible')
  })

  it('debe abrir el modal de nuevo presupuesto', () => {
    cy.contains('button', '+ Nuevo').click()
    cy.contains('Nuevo presupuesto').should('be.visible')
  })

  it('debe cerrar el modal al cancelar', () => {
    cy.contains('button', '+ Nuevo').click()
    cy.contains('button', 'Cancelar').click()
    cy.contains('Nuevo presupuesto').should('not.exist')
  })

  it('debe crear un presupuesto', () => {
    cy.contains('button', '+ Nuevo').click()
    cy.contains('Nuevo presupuesto').should('be.visible')
    cy.get('select').first().then($select => {
      const options = $select.find('option').not('[disabled]')
      if (options.length > 0) {
        const firstValue = options.first().val() as string
        cy.get('select').first().select(firstValue)
      }
    })
    cy.get('input[type="number"]').first().clear().type('50000')
    cy.contains('button', 'Guardar presupuesto').click()
    cy.contains('Nuevo presupuesto').should('not.exist')
  })

  it('debe mostrar botones de editar y eliminar en cada presupuesto', () => {
    cy.get('body').then($body => {
      if ($body.find('button:contains("Editar")').length > 0) {
        cy.contains('button', 'Editar').should('be.visible')
        cy.contains('button', 'Eliminar').should('be.visible')
      }
    })
  })

  it('debe abrir modal de edicion al hacer click en Editar', () => {
    cy.get('body').then($body => {
      if ($body.find('button:contains("Editar")').length > 0) {
        cy.contains('button', 'Editar').first().click()
        cy.contains('Editar presupuesto').should('be.visible')
        cy.contains('button', 'Cancelar').click()
      }
    })
  })

  it('debe eliminar un presupuesto', () => {
    cy.get('body').then($body => {
      const cards = $body.find('button:contains("Eliminar")')
      if (cards.length > 0) {
        const countBefore = cards.length
        cy.contains('button', 'Eliminar').first().click()
        cy.get('button:contains("Eliminar")').should('have.length', countBefore - 1)
      }
    })
  })

})