describe("Extrinsic detail page", () => {
	beforeEach(() => {
		cy.clearCookies();
		cy.visit("/kusama/extrinsic/0014932897-000002-93378");
		cy.wait(1001); // TODO find out better waiting until page is loaded
	});

	it("shows extrinsic detail page", () => {
		cy.argosScreenshot("extrinsic", { overwrite: true });
	});
});
