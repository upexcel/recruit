// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

import * as data from "../../cypress.json";
//login
Cypress.Commands.add("login", function(email, password) {
  cy.visit(data.baseUrl + "/login");
  cy.get("#loginForm #loginEmail").type(email);
  cy.get("#loginForm #loginPassword").type(password);
  cy.get("#loginForm #login").click();
  cy.url().should("eq", data.baseUrl + "/core/inbox");
});
//logout
Cypress.Commands.add("logout", function() {
  cy.get("#toolbar button#sideNav").click();
  cy.get("md-sidenav div#logout").click();
  // cy.url().should('eq',data.baseUrl+'/');
});

//addimap
Cypress.Commands.add("addImap", function() {
  cy.visit(data.baseUrl + "/core/setting/imap");
  cy.server()
  cy.route('POST',data.api_baseUrl+`/imap/save**`).as('postImap')
  cy.route('GET',data.api_baseUrl+`/imap/get**`).as('getImap')
  cy.get("#FormEmail input").type(data.newImapEmail);
  cy.get("#FormPassword input").type(data.newImapPassword);
  cy.get("#FormDate #date").type(data.date);
  cy.get("#FormButton button").click().then(function() {
  cy.wait('@postImap');
  cy.wait('@getImap');
  // cy.get("#switchState").should("be.visible")
  })
});
//delete imap
Cypress.Commands.add("deleteImap", function() {
  cy.visit(data.baseUrl + "/core/setting/imap");
  cy
    .get("#tbody tr:first>td button")
    .click()
});

//add smtp
Cypress.Commands.add("addSmtp", function() {
  cy.visit(data.baseUrl + "/core/setting/smtp");
  cy.get("#smtpFormUserEmail input").type(data.newSmtpEmail);
  cy.get("#smtpFormSendEmail input").type(data.newSmtpEmail);
  cy.get("#smtpFormPassword input").type(data.smtpPassword);
  cy.get("#smtpFormServerName input").type(data.serverName);
  cy.get("#smtpFormPort input").type(data.portNo);
  cy.get("#smtpFormRadio #option1").click();
  cy
    .get("#smtpFormSave button")
    .click()
});
//delete smtp
Cypress.Commands.add("deleteSmtp", function() {
  cy.visit(data.baseUrl + "/core/setting/smtp");
  cy.get("#tbody tr:last #status").click();
  cy
    .get("#tbody tr:first #remove")
    .click()
});

//add job profile
Cypress.Commands.add("addJobprofile", function(jobprofile) {
  cy.server()
  cy.route('GET',data.api_baseUrl+`/tag/get**`).as('get_tags');
  cy.get("#addTag button").click();
  cy.get("#add_tag #title").type(jobprofile);
  cy.get("#add_tag #tagSubject input").type(jobprofile);
  cy.get("#add_tag #tagDescription textarea").type(jobprofile);
  cy
    .get("#add_tag #tagBtn #save").click()
    cy.get("md-dialog-container").should("not.be.visible")
    cy.wait('@get_tags')
    
});
//delete job profile
Cypress.Commands.add("deleteJobprofile", function(jobprofile) {
     cy.get(`#${jobprofile}`).click();
     cy.get("#confirmYes").click();
    cy.get("md-dialog-container").should("not.be.visible");
});

//add automatic tag
Cypress.Commands.add("addAutomtictag", function() {
  cy.visit(data.baseUrl + "/core/setting/automaticTags");
  cy.get("#autoTag button").click();
  cy.get("#add_tag #title").type(data.automaticTag);
  cy.get("#add_tag #tagSubject input").type(data.automaticTag);
  cy
    .get("#add_tag #tagBtn #save")
    .click()
});
//delete automatic tag
Cypress.Commands.add("deleteAutomtictag", function(job) {
  cy.visit(data.baseUrl + "/core/setting/automaticTags");
  cy
    .get("#autotagPage #ul>#li:last #deleteAutotag")
    .click()
});
