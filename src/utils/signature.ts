export function getSignatureAddress(signature: any) {
	return signature?.address.value || signature?.address;
}

export function getSignatureValue(signature: any) {
	return signature?.signature.value || signature?.signature;
}
