import { AnchorHTMLAttributes } from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";

export interface LinkProps extends Omit<RouterLinkProps, "to"> {
	to?: RouterLinkProps["to"];
	href?: AnchorHTMLAttributes<HTMLAnchorElement>["href"];
}

export const Link = (props: LinkProps) => {
	const {href, to, ...restProps}  = props;

	const linkProps: MuiLinkProps = {
		...restProps,
		underline: "none"
	};

	if (to) {
		return <MuiLink component={RouterLink} to={to} {...linkProps} />;
	}

	return <MuiLink href={href} {...linkProps} />;
};
