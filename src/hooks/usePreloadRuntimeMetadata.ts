import { useEffect, useState } from "react";
import { getNetworks } from "../services/networksService";
import { getLatestRuntimeSpecVersion } from "../services/runtimeSpecService";
import { loadRuntimeMetadata } from "../services/runtimeMetadataService";

export function usePreloadRuntimeMetadata() {
	const [progress, setProgress] = useState<number>(localStorage.getItem("runtime-metadata-preloaded") ? 100 : 0);

	useEffect(() => {
		if (localStorage.getItem("skip-runtime-metadata-preload")) {
			return;
		}

		Promise.allSettled(getNetworks().map(async (it) => {
			try {
				const specVersion = await getLatestRuntimeSpecVersion(it.name);
				await loadRuntimeMetadata(it.name, specVersion);
			} catch (e) {
				// pass
			}

			setProgress(prev => prev + 100 / getNetworks().length);
		})).then(() => {
			setProgress(100);
			localStorage.setItem("runtime-metadata-preloaded", "true");
		});
	}, []);

	return {
		loading: progress < 100,
		progress
	};
}
