/*\
title: $:/plugins/sukima/talk-timer/libs/ticker.js
type: application/javascript
module-type: library

A Toast Master compatible time ticker

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

class Ticker {
  constructor({ green, yellow, red, onTick }) {
    this.greenTime = green;
    this.yellowTime = yellow;
    this.redTime = red;
    this.onTick = onTick;
  }
  toggle() {
  }
  reset() {
  }
  activate() {
    this.timer = setInterval(() => this._tick(), 1000);
  }
  deactivate() {
    clearInterval(this.timer);
  }
  _tick() {
  }
}

exports.ticker = Ticker;

})();
