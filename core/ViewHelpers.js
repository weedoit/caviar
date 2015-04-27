/*global define:true, Handlebars:true */
/**
 * Handlebars helpers
 * @module Caviar.ViewHelpers
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('ViewHelpers', function () {
    "use strict";
    var API, helpers;

    helpers = {};

    API = {
        // @TODO: create app/helpers path and add a autoload.
        initialize: function () {
            var helper;

            for (helper in helpers) {
                if (helpers.hasOwnProperty(helper)) {
                    Handlebars.registerHelper(helper, helpers[helper]);
                }
            }
        }
    };

    return API;
});