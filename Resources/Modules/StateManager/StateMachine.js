'use strict';

var State = require('fsm/State');

/**
 * @TODO Convert this to TypeScript. Thinking this can be good for FSM for UI/etc?
 * @Class StateMachine
 * @constructor
 */
function StateMachine() {
  // track state transitions allowed for an event { event: { from: [ to ] } }
  this.map = {};

  // track events allowed from a state { state: [ event ] }
  this._transitions = {};

  this.current = 'none';
  this.transition = null;
  this.terminal = null;
}

StateMachine.prototype.add = function add(e) {
  if (StateMachine.DEBUG) {
    console.log('StateMachine.add()');
    console.log(e);
  }
  // allow 'wildcard' transition if 'from' is not specified
  var from = (e.from instanceof Array) ? e.from : (e.from ? [e.from] : [StateMachine.WILDCARD]);
  this.map[e.name] = this.map[e.name] || {};

  for (var n = 0; n < from.length; n++) {
    this._transitions[from[n]] = this._transitions[from[n]] || [];
    this._transitions[from[n]].push(e.name);

    // allow no-op transition if 'to' is not specified
    this.map[e.name][from[n]] = e.to || from[n];
  }
};

StateMachine.prototype.is = function is(state) {
  return (state instanceof Array) ? (state.indexOf(this.current) >= 0) : (this.current === state);
};

StateMachine.prototype.can = function can(event) {
  return !this.transition
         && (this.map[event].hasOwnProperty(this.current)
             || this.map[event].hasOwnProperty(StateMachine.WILDCARD));
};

StateMachine.prototype.cannot = function cannot(event) {
  return !this.can(event);
};

StateMachine.prototype.transitions = function transitions() {
  return this._transitions[this.current];
};

StateMachine.prototype.isFinished = function isFinished() {
  return this.is(this.terminal);
};

StateMachine.prototype.error = function error(name, from, to, args, error, msg, e) {
  throw e || msg;
};

StateMachine.prototype.doCallback = function doCallback(func, name, from, to, args) {
  if (func) {
    try {
      return func.apply(this, [name, from, to].concat(args));
    } catch (e) {
      return this.error(
        name,
        from,
        to,
        args,
        StateMachine.Error.INVALID_CALLBACK,
        'an exception occurred in a caller-provided callback function',
        e
      );
    }
  }
};

StateMachine.prototype.beforeAnyEvent = function beforeAnyEvent(name, from, to, args) {
  return this.doCallback(this['onBeforeEvent'], name, from, to, args);
};

StateMachine.prototype.afterAnyEvent = function afterAnyEvent(name, from, to, args) {
  return this.doCallback(this['onAfterEvent'] || this['onEvent'], name, from, to, args);
};

StateMachine.prototype.enterAnyState = function enterAnyState(name, from, to, args) {
  return this.doCallback(this['onEnterState'] || this['onState'], name, from, to, args);
};

StateMachine.prototype.leaveAnyState = function leaveAnyEvent(name, from, to, args) {
  return this.doCallback(this['onLeaveState'], name, from, to, args);
};

StateMachine.prototype.changeState = function changeState(name, from, to, args) {
  return this.doCallback(this['onChangeState'], name, from, to, args);
};

StateMachine.prototype.beforeThisEvent = function beforeThisEvent(name, from, to, args) {
  return this.doCallback(this['onBefore' + name], name, from, to, args);
};

StateMachine.prototype.afterThisEvent = function afterThisEvent(name, from, to, args) {
  return this.doCallback(this['onAfter' + name] || this['on' + name], name, from, to, args);
};

StateMachine.prototype.enterThisState = function enterThisState(name, from, to, args) {
  return this.doCallback(this['onEnter' + to] || this['on' + to], name, from, to, args);
};

StateMachine.prototype.leaveThisState = function leaveThisState(name, from, to, args) {
  return this.doCallback(this['onLeave' + from], name, from, to, args);
};

StateMachine.prototype.beforeEvent = function beforeEvent(name, from, to, args) {
  if ((false === this.beforeThisEvent(name, from, to, args)) ||
      (false === this.beforeAnyEvent(name, from, to, args))) {
    return false;
  }
};

StateMachine.prototype.afterEvent = function afterEvent(name, from, to, args) {
  this.afterThisEvent(name, from, to, args);
  this.afterAnyEvent(name, from, to, args);
};

StateMachine.prototype.enterState = function enterState(name, from, to, args) {
  this.enterThisState(name, from, to, args);
  this.enterAnyState(name, from, to, args);
};

StateMachine.prototype.leaveState = function leaveState(name, from, to, args) {
  var specific = this.leaveThisState(name, from, to, args);
  var general = this.leaveAnyState(name, from, to, args);

  if (false === specific || false === general) {
    return false;
  } else if (StateMachine.ASYNC === specific || StateMachine.ASYNC === general) {
    return StateMachine.ASYNC;
  }
};

StateMachine.Result = {
  // the event transitioned successfully from one state to another
  SUCCEEDED: 1,

  // the event was successful but no state transition was necessary
  NOTRANSITION: 2,

  // the event was cancelled by the caller in a beforeEvent callback
  CANCELLED: 3,

  // the event is asynchronous and the caller is in control of when the transition occurs
  PENDING: 4
};

StateMachine.Error = {
  // caller tried to fire an event that was inappropriate in the current state
  INVALID_TRANSITION: 100,

  // caller tried to fire an event while an async transition was still pending
  PENDING_TRANSITION: 200,

  // caller provided callback function threw an exception
  INVALID_CALLBACK: 300
};

StateMachine.WILDCARD = '*';
StateMachine.ASYNC = 'async';
StateMachine.DEBUG = false;
StateMachine.VERSION = '1.0.0';

StateMachine.Factory = {
  create: function create(cfg, target) {
    if (StateMachine.DEBUG) {
      console.log(cfg);
      console.log(target);
    }

    // allow for a simple string, or an object with
    // { state: 'foo', event: 'setup', defer: true|false }
    var fsm = target || cfg.target || new StateMachine();
    var initial = (typeof cfg.initial == 'string') ? {state: cfg.initial} : cfg.initial;
    var events = cfg.events || [];
    var callbacks = cfg.callbacks || {};
    fsm.terminal = cfg.terminal || cfg['final'];

    if (initial) {
      initial.event = initial.event || 'startup';
      fsm.add({name: initial.event, from: 'none', to: initial.state});
    }

    for (var n = 0; n < events.length; n++) {
      fsm.add(events[n]);
    }

    for (var map in fsm.map) {
      if (fsm.map.hasOwnProperty(map)) {
        fsm[map] = StateMachine.Factory.buildEvent(fsm, map);
      }
    }

    for (var callback in callbacks) {
      if (callbacks.hasOwnProperty(callback)) {
        fsm[callback] = callbacks[callback]
      }
    }

    // default behavior when something unexpected happens is to throw an exception, but
    // caller can override this behavior if desired (see github issue #3 and #17)
    if (typeof cfg.error === 'function') {
      fsm.error = cfg.error;
    }

    if (initial && !initial.defer) {
      fsm[initial.event]();
    }

    return fsm;
  },

  buildEvent: function buildEvent(fsm, name) {
    if (StateMachine.DEBUG) {
      console.log(name);
      console.log(fsm);
    }

    var map = fsm.map[name];

    return function () {
      var from = fsm.current;
      var to = map[from] || map[StateMachine.WILDCARD] || from;

      // turn arguments into pure array
      var args = Array.prototype.slice.call(arguments);

      if (fsm.transition) {
        return this.error(
          name,
          from,
          to,
          args,
          StateMachine.Error.PENDING_TRANSITION,
          'event ' + name + ' inappropriate because previous transition did not complete'
        );
      }

      if (fsm.cannot(name)) {
        return this.error(
          name,
          from,
          to,
          args,
          StateMachine.Error.INVALID_TRANSITION,
          'event ' + name + ' inappropriate in current state ' + fsm.current
        );
      }

      if (false === fsm.beforeEvent(name, from, to, args)) {
        return StateMachine.Result.CANCELLED;
      }

      if (from === to) {
        fsm.afterEvent(name, from, to, args);
        return StateMachine.Result.NOTRANSITION;
      }

      // prepare a transition method for use EITHER lower down, or by caller if they want an
      // async transition (indicated by an ASYNC return value from leaveState)
      fsm.transition = function () {
        // this method should only ever be called once
        fsm.transition = null;
        fsm.current = to;
        fsm.enterState(name, from, to, args);
        fsm.changeState(name, from, to, args);
        fsm.afterEvent(name, from, to, args);

        return StateMachine.Result.SUCCEEDED;
      };

      // provide a way for caller to cancel async transition if desired (issue #22)
      fsm.transition.cancel = function () {
        fsm.transition = null;
        fsm.afterEvent(name, from, to, args);
      };

      var leave = fsm.leaveState(name, from, to, args);

      if (false === leave) {
        fsm.transition = null;
        return StateMachine.Result.CANCELLED;
      } else if (StateMachine.ASYNC === leave) {
        return StateMachine.Result.PENDING;
      } else {
        // need to check in case user manually called transition() but forgot to
        // return StateMachine.ASYNC
        if (fsm.transition) {
          return fsm.transition();
        }
      }
    };
  }
};

if (typeof exports === 'object') {
  // module.exports.StateMachine = StateMachine;
  module.exports = StateMachine;
}
