# ld47-main

Inspired by literally every cool car toy you had in the '90s this game sees you driving a car on a slot car racing circuity where (if you're any good at driving) you are literally "stuck in a loop". The aim of the game is to be stuck in a loop for as long as possible, ideally a complete lap. That's harder than it looks though!

All assets are original from during the Jam created by our team of 5.

Supported controls include keyboard, mouse, touchscreen and game pad. The game works best with an analogue input (i.e. anything but the keyboard!).

Once you click to start playing you need to pick a track with mouse/touchscreen inputs and choose 1 or 2 controllers.
- Controllers: press the accelerator button
- Keyboards: press "W", "space", "up arrow" which will become your accelerator
- Mouse: click the + on the mouse icon
- Touchscreen: tap the touch screen controller icon.

Tested and supported browsers include Chrome, Firefox, Edge, Safari on Windows, Mac, Linux and Android. (Sorry iOS users, we don't have one to test on but it probably works).

There's some limit high-score tracking functionality but this isn't very polished yet.

If you're feeling adventurous there's a track editor available in /editor, but no way to play your tracks yet. 

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
