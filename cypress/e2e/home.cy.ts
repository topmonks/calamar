describe("Home page", () => {
	beforeEach(() => {
		cy.clearCookies();
		cy.visit("/");
	});

	it("shows home page", () => {
		cy.get(".MuiSelect-select").click();
		cy.contains(".MuiMenuItem-root", /^Kusama$/).click();

		cy.argosScreenshot("home", {overwrite: true});
	});

	it("keeps last selected network after reload", () => {
		cy.get(".MuiSelect-select").click();
		cy.contains(".MuiMenuItem-root", /^Kusama$/).click();
		cy.reload();
		cy.contains(".MuiSelect-select", "Kusama");
	});
});
