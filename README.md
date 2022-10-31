# Calamar block explorer of the Subsquid Archives

Calamar is a block explorer for Polkadot, Kusama and their parachains. The explorer is a React frontend application, showing data from [Subsquid archives](https://github.com/subsquid/archive-registry).

This app is based on [Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

## Setup

Clone the repo and install the NPM dependencies.

```
$ git clone https://github.com/topmonks/calamar
$ cd calamar
$ npm install
```

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
