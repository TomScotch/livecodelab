var LexerRule, LexerState;

LexerState = (function() {

  function LexerState() {}

  LexerState.prototype.rules = [];

  LexerState.prototype.addRule = function(regex, action) {
    this.rules.push(new LexerRule(regex, action));
    return null;
  };

  LexerState.prototype.lex = function(input) {
    var nextAction;
    nextAction = this.findAndRunActionPairedToLongestAppliableRegex(input);
    while (typeof nextAction === "function") {
      nextAction = nextAction();
    }
    return nextAction;
  };

  LexerState.prototype.findAndRunActionPairedToLongestAppliableRegex = function(input) {
    var i, longestMatch, longestMatchedLength, longestMatchedRule, m, r;
    longestMatchedRule = null;
    longestMatch = null;
    longestMatchedLength = -1;
    i = this.rules.length - 1;
    while (i >= 0) {
      r = this.rules[i];
      m = r.matches(input);
      if (m && (m[0].length >= longestMatchedLength)) {
        longestMatchedRule = r;
        longestMatch = m;
        longestMatchedLength = m[0].length;
      }
      --i;
    }
    if (longestMatchedRule) {
      return longestMatchedRule.action(longestMatch, input.substring(longestMatchedLength), this);
    } else {
      throw "Lexing error; no match found for: '" + input + "'";
    }
  };

  LexerState.prototype.returnAFunctionThatAppliesRulesAndRunsActionFor = function(input) {
    var _this = this;
    return function() {
      return _this.findAndRunActionPairedToLongestAppliableRegex(input);
    };
  };

  return LexerState;

})();

LexerRule = (function() {

  function LexerRule(regex, action) {
    this.regex = regex;
    this.action = action;
    this.regex = new RegExp("^(" + this.regex.source + ")");
    if (this.regex.compile) {
      this.regex.compile(this.regex);
    }
    null;
  }

  LexerRule.prototype.matches = function(s) {
    var m;
    m = s.match(this.regex);
    if (m) {
      m.shift();
    }
    return m;
  };

  return LexerRule;

})();
