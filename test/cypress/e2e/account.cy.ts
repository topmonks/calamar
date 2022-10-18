describe("Account detail page", () => {
	beforeEach(() => {
		cy.clearCookies();
		cy.visit("/kusama/account/0x885f84242d71e6e44ddbe5345d5050a9c1b4dcc908cb2b84102a27035177fe22");
		cy.wait(1000); // TODO find out better waiting until page is loaded
	});

	it("shows account detail page", () => {
		cy.get("[data-test=extrinsics-table] tr").invoke("css", "visibility", "hidden");
		cy.argosScreenshot("account", { overwrite: true });
	});
});
