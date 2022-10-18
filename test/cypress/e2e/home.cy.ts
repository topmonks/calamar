describe("Home page", () => {
	beforeEach(() => {
		cy.clearCookies();
		cy.visit("/");
		cy.wait(1000); // TODO find out better waiting until page is loaded
	});

	it("shows home page", () => {
		cy.get(".MuiSelect-select").click();
		cy.contains(".MuiMenuItem-root", /^Polkadot$/).click();

		cy.argosScreenshot("home", {overwrite: true});
	});

	it("keeps last selected network after reload", () => {
		cy.get(".MuiSelect-select").click();
		cy.contains(".MuiMenuItem-root", /^Polkadot$/).click();
		cy.reload();
		cy.contains(".MuiSelect-select", "Polkadot");
	});
});
