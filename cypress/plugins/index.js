/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on("task", {
    log(message) {
      console.log(message);
      return null;
    },
  });
};
