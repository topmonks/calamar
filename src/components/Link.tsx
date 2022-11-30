import { AnchorHTMLAttributes, forwardRef } from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";

export interface LinkProps extends Omit<RouterLinkProps, "to"> {
	to?: RouterLinkProps["to"];
	href?: AnchorHTMLAttributes<HTMLAnchorElement>["href"];
}

export const Link = forwardRef<any, LinkProps>((props, ref) => {
	const {href, to, ...restProps}  = props;

	const linkProps: MuiLinkProps = {
		...restProps,
		underline: "none"
	};

	if (to) {
		return <MuiLink ref={ref} component={RouterLink} to={to} {...linkProps} />;
	}

	return <MuiLink href={href} {...linkProps} />;
});

Link.displayName = "Link";
