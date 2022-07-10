# Calamar block explorer of the Subsquid Archives

Web application allowing you to explore block, extrinsics and accounts from the [https://github.com/subsquid/archive-registry](Subsquid Archives).

This app is based on [Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

## Setup

Clone the repo and install the NPM dependencies.

```
$ git clone https://github.com/topmonks/calamar
$ cd calamar
$ npm install
```

## Run

Run the application in developmnet mode

```
$ npm start
```

The running application will open in the browser on url [https://localhost:3000](https://localhost:3000)

## Deploy to Github pages

Update `homepage` property in `package.json` to match your GH pages url. Then run deploy script.

```
$ npm run deploy
```

## Custom deploy

You can deploy the app on any web server. You need to create the production build which you will upload to the web server to folder from where the web server serves the files to the public.

```
$ npm run build
$ ... upload
```
