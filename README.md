# Calamar block explorer of the Subsquid Archives

Calamar is a block explorer for Polkadot, Kusama and their parachains. The explorer is a React frontend application, showing data from [Subsquid archives](https://github.com/subsquid/archive-registry).

This app is based on [Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

> [!WARNING]
> Since January 31, Calamar and its data source can only be **self-hosted**.
> This is following the deprecation of Firesquid archives and its resulting effect on Giant Squid.
> We apologize for any inconvenience.
>
> Read more about [data sources](https://github.com/topmonks/calamar/wiki/Data-sources).

## Setup

Clone the repo and install the NPM dependencies.

```
$ git clone https://github.com/topmonks/calamar
$ cd calamar
$ npm install
```

Edit `src/networks.json` and configure your network and its [data source's](https://github.com/topmonks/calamar/wiki/Data-sources) endpoints.

<details>
	<summary>Network configuration structure</summary>

- **name**: network identificator used in url etc. (required, `"polkadot"`)
- **displayName**: name of the network to be displayed in the app (required, `"Polkadot"`)
- **icon**: path to icon asset (required, e.g. `"/assets/network-icons/polkadot.svg"`)
- **color**: color associated with the network (optional, e.g. `"#e6007a"`)
- **prefix**: SS58 prefix (required, e.g. `0`)
- **decimals**: number of decimals for the network's symbol (required, e.g. `10`)
- **symbol**: network's symbol (required, `"DOT"`)
- **squids**:
	- **archive**: GraphQL API explorer of the [Firesquid archive](https://github.com/topmonks/calamar/wiki/Data-sources#firesquid-archive) (required, e.g. `"https://polkadot.explorer.subsquid.io/graphql"`)
	- **explorer**: [GiantSquid explorer](https://github.com/topmonks/calamar/wiki/Data-sources#giantsquid-explorer) (optional, but highly recommended, e.g. `"https://squid.subsquid.io/gs-explorer-polkadot/graphql"`)
	- **main**: [GiantSquid main](https://github.com/topmonks/calamar/wiki/Data-sources#giantsquid-main) (optional, e.g. `"https://squid.subsquid.io/gs-main-polkadot/graphql"`)
	- **identites**: [GiantSquid main](https://github.com/topmonks/calamar/wiki/Data-sources#giantsquid-main) if it provides indentity data (optional, e.g. `"https://squid.subsquid.io/gs-main-polkadot/graphql"`)
	- **stats**: [GianSquid stats](https://github.com/topmonks/calamar/wiki/Data-sources#giantsquid-stats) (optional, e.g. `"https://squid.subsquid.io/gs-stats-polkadot/graphql"`)
- **coinGeckoId**: CoinGecko network ID to fetch USD values (optional, `"polkadot"`)
</details>

## Run locally

To start the application locally, run the command

```
$ npm start
```

The application will start in development mode and will be availble on the url [https://localhost:3000](https://localhost:3000).

## Build & deploy

Calamar is a static web app built with [Create React App](https://facebook.github.io/create-react-app/docs/getting-started). So all you need is to build the app

```
$ npm run build
```

and then serve the files from `./build` folder using your webserver.

> Ensure your webserver serves index.html on every URL path to make the routing to work.

It also works well with various static hosting services like GitHub Pages, CloudFlare Pages, ...

### Github pages

The repository contains the Github Actions workflow to deploy the pages automatically.

All you need is to setup the pages in your Github repo's settings:

1. Go to `Settings` > `Pages`
2. Set `GitHub Actions` as the source
3. (Optional) Add custom domain
4. Update `homepage` property in `package.json` to match your GitHub pages url.
3. Edit the `.github/workflows/pages.yml` workflow file and uncomment the `push` subsection in `on` section to trigger the action on push to the branch

Commit the edited files and push to the branch specified in the workflow file.

## Docker

You can also use docker to run the app. Build the image first

```
$ docker build -t calamar .
```

and then run it

```
$ docker run -it --rm -p 3000:3000 calamar
```

Now the production-ready application is available on url [https://localhost:3000](https://localhost:3000).

## Test

Code contains E2E tests testing running instance. The tests are using [Playwright](https://playwright.dev/).

Fist install the Playwright's dependencies

```
$ npx playwright install --with-deps
```

then you can run the test suite

```
$ npm run test
```

After the tests are finished (failed or succeeded), you can view the report by

```
$ npm run test:report
```

[![argos](https://argos-ci.com/badge-large.svg)](https://argos-ci.com?utm_source=topmonks&utm_campaign=oss)
