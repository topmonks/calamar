import Card from "../components/Card";

function NotFoundPage() {
	return (
		<>
			<Card>
				<div className="calamar-table-header" style={{ paddingBottom: 48 }}>
					Page not found
				</div>
				<div>This page doesn&apos;t exist</div>
			</Card>
		</>
	);
}

export default NotFoundPage;
