/*\
title: $:/plugins/sukima/talk-timer/widgets/talktimer.js
type: application/javascript
module-type: widget

A Toast Master compatible talk timer

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

const Widget = require('$:/core/modules/widgets/widget.js').widget;
const Ticker = require('$:/plugins/sukima/talk-timer/libs/ticker.js').ticker;

class TalkTimer extends Widget {

	render(parent, nextSibling) {
		this.parentDomNode = parent;
		this.computeAttributes();
		this.execute();
    let timerNode = this.document.createElement('TIME');
    timerNode.className = 'talk-timer';
		parent.insertBefore(timerNode,nextSibling);
		this.domNodes.push(timerNode);
    if ($tw.browser) {
      this.addEventListeners([
        {type:'click',handler:'_toggle'},
        {type:'doubleclick',handler:'_reset'},
      ]);
      this.ticker = new Ticker({
        onTick: currentTime => this.updateValue(currentTime)
      });
    }
	}

  execute() {
  }

  removeChildDomNodes() {
    this.ticker?.deactivate();
    super.removeChildDomNodes();
  }

  _toggle() {
    this.ticker?.toggle();
  }

  _reset() {
    this.ticker?.reset();
  }

  _updateValue(currentValue) {
  }

}

exports.talktimer = TalkTimer;

})();
