import React from "react";

export const AccountArrayContext = React.createContext<string[]>([]);

export const AccountArrayProvider = (props: any) => {
	return (
		<AccountArrayContext.Provider value={[]}>
			{props.children}
		</AccountArrayContext.Provider>
	);
};
