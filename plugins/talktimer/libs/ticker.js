/*\
title: $:/plugins/sukima/talktimer/libs/ticker.js
type: application/javascript
module-type: library

A Toast Master compatible time ticker

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const { interpret } = require('$:/plugins/sukima/talktimer/libs/fsm.js');

const TIMER_MACHINE = {
  initial: 'init',
  on: {
    RESET: { target: 'paused', actions: '_setTimeToZero' }
  },
  states: {
    init: {
      on: { START: 'paused' }
    },
    running: {
      entry: ['_activateTimer', '_nextTick'],
      on: { TOGGLE: 'paused' }
    },
    paused: {
      entry: '_deactivateTimer',
      on: { TOGGLE: 'running' }
    }
  }
};

const TICKER_MACHINE = {
  initial: 'undertime',
  on: { RESET: 'undertime' },
  states: {
    undertime: { on: { OK: 'oktime' } },
    oktime: { on: { WARN: 'warntime' } },
    warntime: { on: { OVER: 'overtime' } },
    overtime: {}
  }
};

class Ticker {

  elapsedTime = 0;
  _timerService = interpret(TIMER_MACHINE, this).start();
  _tickerService = interpret(TICKER_MACHINE, this).start();

  constructor({ oktime, warntime, overtime, onTick = () => {}}) {
    this.overtime = overtime || 5 * 60e3;
    this.oktime = oktime || Math.ceil(this.overtime / 2);
    this.warntime = warntime || Math.ceil(this.oktime / 2) + this.oktime;
    this.onTick = onTick;
  }

  get state() {
    return [this._timerService.state.value,this._tickerService.state.value].filter(Boolean).join(' ');
  }

  start() {
    this._sendEvent('START');
    this._notifyOnTick();
  }

  toggle() {
    this._sendEvent('TOGGLE');
    this._notifyOnTick();
  }

  reset() {
    this._sendEvent('RESET');
    this._notifyOnTick();
  }

  destroy() {
    this._deactivateTimer();
    this._timerService.stop();
    this._tickerService.stop();
  }

  _sendEvent(event) {
    this._timerService.send(event);
    this._tickerService.send(event);
  }

  _notifyOnTick() {
    let { state, elapsedTime } = this;
    this.onTick({ state, elapsedTime });
  }

  _setTimeToZero() {
    this.elapsedTime = 0;
  }

  _activateTimer() {
    this._timer = setInterval(() => this._nextTick(), 1000);
  }

  _deactivateTimer() {
    clearInterval(this._timer);
    this._lastTrackingTime = 0;
  }

  _nextTick() {
    let { _lastTrackingTime: lastTrackingTime = 0 } = this;
    let now = new Date().getTime();
    this._lastTrackingTime = now;
    if (lastTrackingTime !== 0) {
      this.elapsedTime = this.elapsedTime + (now - lastTrackingTime);
    }
    if (this.elapsedTime >= this.oktime) { this._sendEvent('OK'); }
    if (this.elapsedTime >= this.warntime) { this._sendEvent('WARN'); }
    if (this.elapsedTime >= this.overtime) { this._sendEvent('OVER'); }
    this._notifyOnTick();
  }

}

exports.ticker = Ticker;

})();
