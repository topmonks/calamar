import { isRouteErrorResponse, useRouteError } from "react-router";

import { Card, CardHeader } from "../components/Card";
import { ErrorMessage } from "../components/ErrorMessage";

import { NotFoundPage } from "./notFound";

export const ErrorPage = () => {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			return <NotFoundPage />;
		}
	}

	return (
		<>
			<Card>
				<CardHeader>Error</CardHeader>
				<ErrorMessage
					message="Unexpected error occured while loading page"
					details={error}
					showReported
				/>
			</Card>
		</>
	);
};
