
import acala from "./icons/acala.svg";
import alephZeroTestnet from "./icons/aleph-zero-testnet.png";
import astar from "./icons/astar.png";
import bajun from "./icons/bajun.png";
import bifrost from "./icons/bifrost.svg";
import calamari from "./icons/calamari.png";
import crust from "./icons/crust.svg";
import efinity from "./icons/efinity.svg";
import equilibrium from "./icons/equilibrium.png";
import gear from "./icons/gear.png";
import gmordie from "./icons/gmordie.png";
import hydradx from "./icons/hydradx.svg";
import interlay from "./icons/interlay.svg";
import invarchTinkernet from "./icons/invarch-tinkernet.svg";
import karura from "./icons/karura.svg";
import khala from "./icons/khala.svg";
import kintsugi from "./icons/kintsugi.svg";
import kusama from "./icons/kusama.svg";
import litentry from "./icons/litentry.svg";
import litmus from "./icons/litmus.webp";
import moonbase from "./icons/moonbase-alpha.png";
import moonbeam from "./icons/moonbeam.png";
import moonriver from "./icons/moonriver.png";
import opal from "./icons/opal.png";
import peaq from "./icons/peaq.svg";
import phala from "./icons/phala.svg";
import polkadot from "./icons/polkadot.svg";
import quartz from "./icons/quartz.png";
import rococo from "./icons/rococo.svg";
import shiden from "./icons/shiden.webp";
import statemint from "./icons/statemint.png";
import subsocial from "./icons/subsocial.png";
import unique from "./icons/unique.png";

export const icons: Record<string, unknown> = {
	acala,
	"aleph-zero-testnet": alephZeroTestnet,
	astar,
	bajun,
	bifrost,
	calamari,
	crust,
	efinity,
	equilibrium,
	"gear-testnet": gear,
	gmordie,
	hydradx,
	interlay,
	"invarch-tinkernet": invarchTinkernet,
	karura,
	khala,
	kintsugi,
	kusama,
	litentry,
	litmus,
	moonbase,
	moonbeam,
	moonriver,
	opal,
	peaq,
	phala,
	polkadot,
	quartz,
	rococo,
	shibuya: shiden, // has got a same icon according to this: https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fshibuya-rpc.dwellir.com#/explorer
	shiden,
	statemine: statemint,
	statemint,
	"subsocial-parachain": subsocial,
	unique,
};
