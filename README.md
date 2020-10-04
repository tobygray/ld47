# ld47-main

A simple shared whiteboard web-app

## Setup

1. Install Node.js and NPM 12.16.4 from https://nodejs.org/en/
2. Restart any terminals you've got open to pick up the PATH changes if on Windows
3. Run `npm install`

## Running

Run the following commands in a different terminal each:
1. `npm run watch`
Alternatively you can use `npm run build` to build a production version of the client Javascript, but
you must run this manually whenever you update a file.
2. `SET DEBUG=sketchy-lectrics:* npm start`.

Navigate to http://localhost:3000/

## Tests

You can run tests with `npm run tests`.

You can run eslint with `npm run lint` and you can ask it to auto-fix some issues with `npm run lint-fix`.
