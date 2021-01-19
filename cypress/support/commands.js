// ***********************************************
// https://on.cypress.io/custom-commands
// ***********************************************
Cypress.Commands.overwrite("log", (subject, message) =>
  cy.task("log", message)
);