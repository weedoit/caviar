/// <reference path="Config.ts" />
/// <reference path="IntentManager.ts" />
/// <reference path="defs/cordova/cordova.d.ts" />
/**
 * Execute steps to start the application
 * @module Caviar.Bootstrap
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */

module Caviar.Bootstrap {

    var onDeviceReady: Function,
        getNavigatorObject: Function,
        processCallbacksStack: Function,
        onApplicationStartCallbacks: Array<Function> = [];

    /**
     * Wrapper to avoid TypeScript error
     */
    getNavigatorObject = function () : any {
        return navigator;
    }

    /**
     * Runs all callback registered for app startup
     * @return {void}
     */
    processCallbacksStack = function () : void {
        var len: number = onApplicationStartCallbacks.length,
            x: number,
            cur: Function;

        for (x = 0; x < len; x += 1) {
            cur = onApplicationStartCallbacks[x];
            cur();
        }
    }

    /**
     * onDeviceReady callback
     * @return {void}
     */
    onDeviceReady = function () : void {
        var nav: any = getNavigatorObject();
        var controller: string = Caviar.Config.get('startupController');

        processCallbacksStack();

        IntentManager.start(new Intent(controller), function () {
            document.body.classList.add('resolved');

            if (typeof nav.splashscreen !== 'undefined') {
                nav.splashscreen.hide();
            }
        });
    }

    /**
     * Bootup application
     * @param {Object} manifest Application manifest
     * @return {void}
     */
    export function bootup (manifest: any): void {
        var that = this;
        Config.set(manifest.configs || {});

        if (typeof cordova !== 'undefined') {
            document.addEventListener("deviceready", function () {
                onDeviceReady();
            }, false);
        } else {
            onDeviceReady();
        }

        IntentManager.bindIntentElements();
    }

    /**
     * Register a startup application callback
     * @param {Function} callback
     * @return {void}
     */
    export function onApplicationStart (callback: Function) : void {
        onApplicationStartCallbacks.push(callback);
    }
}
