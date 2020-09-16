/*\
title: $:/plugins/sukima/talktimer/libs/time-utils.js
type: application/javascript
module-type: library

Simple utils for converting time values

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const SECONDS = 1e3;
const MINUTES = 6e4;
const HOURS = 36e5;

function seconds(str) {
  return parseInt(str, 10) * SECONDS;
}

function minutes(str) {
  return parseInt(str, 10) * MINUTES;
}

function hours(str) {
  return parseInt(str, 10) * HOURS;
}

function *reduceParts(milliseconds) {
  for (let unit of [HOURS, MINUTES, SECONDS]) {
    let t = Math.floor(milliseconds / unit);
    milliseconds = milliseconds - t;
    yield t;
  }
}

function pad(number = 0) {
  return `0${number}`.slice(-2);
}

function tDehumanize(humanizedString = '') {
  let parts = humanizedString.split(':');
  switch (parts.length) {
    case 1: return seconds(parts[0]);
    case 2: return minutes(parts[0]) + seconds(parts[1]);
    case 3: return hours(parts[0]) + minutes(parts[1]) + seconds(parts[2]);
    default: return undefined;
  }
}

function tHumanize(milliseconds) {
  let [hours, minutes, seconds] = [...reduceParts(milliseconds)];
  if (hours === 0) {
    return `${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}

function tISODuration(milliseconds) {
  let parts = [...reduceParts(milliseconds)].filter(i => i > 0);
  switch (parts.length) {
    case 1: return `PT${parts[0]}S`;
    case 2: return `PT${parts[0]}M${parts[1]}S`;
    case 3: return `PT${parts[0]}H${parts[1]}M${parts[2]}S`;
    default: return undefined;
  }
}

exports.tDehumanize = tDehumanize;
exports.tHumanize = tHumanize;
exports.tISODuration = tISODuration;

})();
