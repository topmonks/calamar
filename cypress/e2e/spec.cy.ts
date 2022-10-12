describe("test spec", () => {
	it("contains search button", () => {
		cy.visit("/");
		cy.contains("button", "Search");
	});
});
