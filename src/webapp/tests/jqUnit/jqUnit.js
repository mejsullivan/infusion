/*

 Copyright 2008 University of Toronto

 Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.

*/

var jqUnit = jqUnit || {};

(function ($) {
    function path(el) {
      return el? "path " + el: "root path";
    }
    function deepEqImpl(thing1, thing2, basename) {
      basename = basename || "";
      if (typeof(thing1) !== typeof(thing2)) {
        return "Type mismatch at " + path(basename) + ": " + typeof(thing1) + " to " + typeof(thing2);
        }
      if (thing1 === null ^ thing2 === null) {
        return "Unexpected null value at " + path(basename);
        }
      if (typeof(thing1) !== 'object') {
        if (thing1 !== thing2) {
          return "Primitive mismatch at " + path(basename) + ": " + thing1 + " to " + thing2;
          }
        }
      else {
        for (var name in thing1) {
          var n1 = thing1[name];
          var n2 = thing2[name];
          var neq = deepEqDiag(n1, n2, (basename? basename + ".": "") + name);
          if (neq) return neq;
        }
      }
      return null;
    }

    function deepEqDiag(thing1, thing2, basename) {
      var diag1 = deepEqImpl(thing1, thing2, basename);
      if (diag1) return diag1;
      var diag2 = deepEqImpl(thing2, thing1, basename);
      if (diag2) return diag2;
      return null;    
      }
    
    jqUnit.deepEq = function(thing1, thing2) {
      return !deepEqImpl(thing1, thing2) && !deepEqImpl(thing2, thing1);
      }
      
    jqUnit.deepEqDiag = function(thing1, thing2) {
      return deepEqDiag(thing1, thing2);
    }


    var jsUnitCompat = {
        assertEquals: function (msg, expected, actual) {
            jqUnit.equals (actual, expected, msg);
        },

        assertTrue: function (msg, expected) {
            jqUnit.ok (expected, msg);
        },

        assertFalse: function (msg, expected) {
            jqUnit.ok (!expected, msg);
        },

        assertUndefined: function (msg, expected) {
            jqUnit.equals ((typeof expected), 'undefined', msg);
        },

        assertNotUndefined: function (msg, expected) {
            jqUnit.ok (!(typeof expected === 'undefined'), msg);
        },

        assertNull: function (msg, expected) {
            jqUnit.equals (expected, null, msg);
        },

        assertNotNull: function (msg, expected) {
            jqUnit.ok (!(expected === null), msg);
        },
        assertDeepEq: function (msg, expected, actual) {
          var diag = deepEqDiag(expected, actual);
          jqUnit.ok(diag === null, msg + (diag === null? "" : ": " + diag));
        },
        assertDeepNeq: function(msg, unexpected, actual) {
          var diag = deepEqDiag(unexpected, actual);
          jqUnit.ok(diag !== null, msg);
        }
    };

    // Mix these compatibility functions into the jqUnit namespace.
    $.extend(jqUnit, jsUnitCompat);

    var testFns = {
        isVisible: function (msg, selector) {
            jqUnit.ok($(selector).is(':visible'), msg);
        },
        
        notVisible: function (msg, selector) {
            jqUnit.ok($(selector).is(':hidden'), msg);
        },
        
        exists: function (msg, selector) {
            jqUnit.ok($(selector)[0], msg);
        },
        
        notExists: function (msg, selector) {
            jqUnit.ok(!$(selector)[0], msg);
        }
    };
    
    // Mix these test functions into the jqUnit namespace.
    $.extend(jqUnit, testFns);
    
    // TestCase object
    function TestCase (moduleName, setUpFn, tearDownFn) {
        this.moduleName = moduleName;
        this.setUp = setUpFn || null;
        this.tearDown = tearDownFn || null;

        jqUnit.module(this.moduleName);
    };

    TestCase.prototype.test = function (string, testFn) {
        if (this.setUp) {
            this.setUp ();
        }

        jqUnit.test (string, testFn);

        if (this.tearDown) {
            this.tearDown ();
        }
    };

    //  Mix the TestCase type into the jqUnit namespace.
    $.extend(jqUnit, {TestCase: TestCase});
}) (jQuery);
