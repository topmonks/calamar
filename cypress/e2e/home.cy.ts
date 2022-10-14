import { getArchives, getNetwork } from "../../src/services/archiveRegistryService";

describe("Home page", () => {
	beforeEach(() => {
		cy.clearCookies();
		cy.visit("/");
	});

	it("shows home page", () => {
		cy.get(".MuiSelect-select").click();
		cy.contains(".MuiMenuItem-root", /^Kusama$/).click();

		cy.argosScreenshot("home", {overwrite: true});
		cy.argosScreenshot("xx", {overwrite: true});
	});

	it("keeps last selected network after reload", () => {
		//cy.visit("/");
		cy.get(".MuiSelect-select").click();
		cy.contains(".MuiMenuItem-root", /^Kusama$/).click();
		cy.reload();
		cy.contains(".MuiSelect-select", "Kusama");
	});
});
