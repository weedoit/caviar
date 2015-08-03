/// <reference path="defs/jquery/jquery.d.ts" />
/**
 * XHR module
 * @todo Implements methods get and post without uses jQuery
 * @module Caviar.HTTP
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
module Caviar.HTTP {
    /**
     * Alias to jQuery $.get
     * @type {Function}
     */
    export var get = $.get;

    /**
     * Alias to jQuery $.post
     * @type {Function}
     */
    export var post = $.post;
}
