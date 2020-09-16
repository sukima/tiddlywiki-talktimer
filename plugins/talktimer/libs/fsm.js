/*\
title: $:/plugins/sukima/talktimer/libs/fsm.js
type: application/javascript
module-type: library

A micro FSM implementation

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

function transitionMachine(machine, { value: state = machine.initial } = {}, { type: event }) {
  const A = i => Array.isArray(i) ? i : [i];
  let transition = machine.states[state].on?.[event] ?? machine.on?.[event] ?? { target: state };
  let value = transition.target ?? transition;
  let changed = value !== state;
  let actions = [
    ...(changed ? A(machine.states[state].exit ?? []) : []),
    ...A(transition.actions ?? []),
    ...(changed ? A(machine.states[value].entry ?? []) : [])
  ];
  return { value, changed, actions };
}

function interpret(machine, actions = {}) {
  const STOPPED = Symbol('stopped');
  let listners = new Set();
  let service = {
    state: STOPPED,
    send(evt, extra = {}) {
      if (service.state === STOPPED) { return service; }
      let event = { ...extra, ...(evt.type ? evt : { type: evt }) };
      service.state = transitionMachine(machine, service.state, event);
      service.state.actions.forEach(action => actions[action]?.(event));
      listners.forEach(listener => listener(service.state, event));
      return service;
    },
    onTransition(cb) {
      listeners.add(cb);
      return service;
    },
    start() {
      service.state = undefined;
      return service.send('#init');
    },
    stop() {
      service.state = STOPPED;
      listners.clear();
    }
  };
  return service;
}

exports.transitionMachine = transitionMachine;
exports.interpret = interpret;

})();
