self.onmessage = async (e: MessageEvent) => {
	self.postMessage(JSON.stringify(undefined));
};

export {};
