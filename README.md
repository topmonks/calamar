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

The application will start in development mode and will automatically open in the browser windows on the url [https://localhost:3000](https://localhost:3000).

## Deploy to Github pages

You can deploy the app very easily to Github pages.

Update `homepage` property in `package.json` to match your GH pages url. Then run deploy script.

```
$ npm run deploy
```

## Custom deploy

You can of course deploy the app on any web server. You need to create the production build which you will upload to the web server to folder from where the web server serves the files to the public.

```
$ npm run build
$ ... upload
```
