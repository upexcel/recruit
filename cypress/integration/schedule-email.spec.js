import * as data from '../../cypress.json';

describe('Setting/User List Page Test', function () {


    beforeEach(function () {
        cy.login(data.email, data.password);
    })
    afterEach(function () {
        cy.logout();
    })
    it('add job Profile', function () {
        cy.addJobprofile();
        cy.get("#jobProfile").contains(data.jobprofile);
    })
    it('add imap', function () {
        cy.addImap(email, password, date);
        cy.get('#tbody tr:first ').then(() => {
            cy.get('#tbody tr:first>td #switchState').click()
            cy.get('#tbody tr:first>td #switchState').should('have.class', 'on');
            cy.get('#tbody tr:first>td button').should('have.attr', 'ng-reflect-disabled', 'true');
        });
    })
    it('add smtp', function () {
        cy.addSmtp();
        cy.get('#tbody tr:first>td:first').should('have.text', data.newSmtpEmail);       

    })
})