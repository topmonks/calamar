describe("Block detail page", () => {
	beforeEach(() => {
		cy.clearCookies();
		cy.visit("/kusama/block/0014932897-93378");
		cy.wait(1000); // TODO find out better waiting until page is loaded
	});

	it("shows block detail page", () => {
		//cy.argosScreenshot("block", { overwrite: true });
	});
});
