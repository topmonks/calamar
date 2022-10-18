/// <reference types="cypress" />

import "@argos-ci/cypress/support";

Cypress.Commands.overwrite<"screenshot", Cypress.PrevSubject>("screenshot", (originalFn, prevSubject, name, options) => {
	cy.document().then((doc) =>
		doc.querySelector("[data-test=top-bar]")
			&& cy.get("[data-test=top-bar]").invoke("css", "position", "relative")
	);

	cy.document().then((doc) =>
		doc.querySelector("[data-test=background]")
			&& cy.get("[data-test=background]").invoke("css", "position", "absolute")
	);

	cy.then(() => originalFn(prevSubject, name, options));

	cy.document().then((doc) =>
		doc.querySelector("[data-test=background]")
			&& cy.get("[data-test=background]").invoke("css", "position", "fixed")
	);

	cy.document().then((doc) =>
		doc.querySelector("[data-test=top-bar]")
			&& cy.get("[data-test=top-bar]").invoke("css", "position", "sticky")
	);
});
