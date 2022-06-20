const subdomains = ["", "kusama", "polkadot"];

export default function getSubdomain(): string {
  const { hostname } = window.location;
  const subdomain = hostname.split(".")[0];
  if (subdomain === "localhost") {
    return "";
  }
  if (subdomains.includes(subdomain)) {
    return subdomain;
  }
  return "";
}
