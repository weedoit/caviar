(function() {
  define('SFG', function() {
    var SFG, globals;
    globals = {};
    return SFG = {
      globals: {

        /**
        			 * Get a variable of application global scope
        			 * @param {String} key
        			 *
         */
        get: function(key) {
          return globals[key] || null;
        },

        /**
        			 * Add/update a application global scope variable
        			 * @param {String} key
        			 * @param {Mixed} value
        			 *
         */
        set: function(key, value) {
          return globals[key] = value;
        }
      },
      contentBox: $('#content'),

      /**
      		 * Implements a extends utils
      		 * @param {Mixed} superclass Object or function that will be extended
      		 * @param {Mixed} def Object or function with override implementation
      		 * @return {Function}
      		 *
       */
      extend: function(superclass, def) {
        var child, extended, hasProp, key, parent, _i, _len;
        hasProp = {}.hasOwnProperty;
        parent = function() {};
        child = typeof def === 'function' ? new def() : def;
        extended = function() {};
        parent.prototype = typeof superclass === 'function' ? new superclass() : superclass;
        extended.prototype = new parent();
        for (_i = 0, _len = child.length; _i < _len; _i++) {
          key = child[_i];
          if (hasProp.call(child, key)) {
            extended.prototype[key] = child[key];
          }
        }
        return extended;
      }
    };
  });

}).call(this);
