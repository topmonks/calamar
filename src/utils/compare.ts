import Decimal from "decimal.js";

import { SortDirection } from "../model/sortDirection";

export enum UndefinedOrder {
	ALWAYS_FIRST,
	ALWAYS_LAST,
	DIRECTION_FIRST,
	DIRECTION_LAST,
}

export function generalCompare<T>(a?: T, b?: T, direction = SortDirection.ASC, undefinedOrder = UndefinedOrder.ALWAYS_LAST) {
	if (a !== undefined && b !== undefined) {
		if (a! < b!) {
			return -1 * direction;
		} else if (a! > b!) {
			return 1 * direction;
		} else {
			return 0;
		}
	}

	return compareWithUndefined(a, b, direction, undefinedOrder);
}

export function compareDecimals(a?: Decimal, b?: Decimal, direction = SortDirection.ASC, undefinedOrder = UndefinedOrder.ALWAYS_LAST) {
	if (a !== undefined && b !== undefined) {
		return a.comparedTo(b) * direction;
	}

	return compareWithUndefined(a, b, direction, undefinedOrder);
}

export function compareStrings(a?: string, b?: string, direction = SortDirection.ASC, undefinedOrder = UndefinedOrder.ALWAYS_LAST) {
	if (a !== undefined && b !== undefined) {
		return a.localeCompare(b) * direction;
	}

	return compareWithUndefined(a, b, direction, undefinedOrder);
}

export function compareProps<T>(a: T, b: T, propGetter?: (obj: T) => any, direction = SortDirection.ASC, undefinedOrder = UndefinedOrder.ALWAYS_LAST) {
	const aProp = propGetter?.(a);
	const bProp = propGetter?.(b);

	if (aProp instanceof Decimal) {
		return compareDecimals(aProp, bProp, direction, undefinedOrder);
	} else if (typeof aProp === "string") {
		return compareStrings(aProp, bProp, direction, undefinedOrder);
	}

	return generalCompare(aProp, bProp, direction, undefinedOrder);
}

function compareWithUndefined<T>(a?: T, b?: T, direction = SortDirection.ASC, undefinedOrder = UndefinedOrder.ALWAYS_LAST) {
	const result = a === b ? 0
		: typeof a === "undefined" ? -1 : 1;

	switch(undefinedOrder) {
		case UndefinedOrder.ALWAYS_FIRST: return result;
		case UndefinedOrder.ALWAYS_LAST: return result * -1;
		case UndefinedOrder.DIRECTION_FIRST: return result * direction;
		case UndefinedOrder.DIRECTION_LAST: return result * direction * -1;
	}
}
