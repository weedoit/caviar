/// <reference path="Caviar.ts" />
/// <reference path="Intent.ts" />
/// <reference path="IntentHistory.ts" />
/// <reference path="ControllersInstanceManager.ts" />
/// <reference path="defs/jquery/jquery.d.ts" />

module Caviar {
    /**
     * Manages intents
     * @module Caviar.IntentManager
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export module IntentManager {
        var INDEX = 0,
            CURRENT_INDEX = 0,
            StateHistory: any = History,
            resultData: any = null,
            beforeStartIntentEvents: Array<Function> = [],
            onBackEvents: Array<Function> = [],
            processEventsStack: Function;

        processEventsStack = function (stack: Array<Function>) : boolean {
            var len: number = stack.length,
                x: number,
                cur: Function,
                hasFailed: boolean = false;

            for (x = 0; x < len; x += 1) {
                cur = stack[x];

                if (cur() === false) {
                    hasFailed = true;
                }
            }

            return !hasFailed;
        }

        /**
         * Create a id to identify all single intent on hash url
         * @return {Integer}
         */
        export function getIndex () {
            return (INDEX += 1);
        }

        /**
         * Set result data
         * @param {Mixed} data
         */
        export function setResult (data) {
            resultData = data;
        }

        /**
         * Get result data
         * @return {Mixed}
         */
        export function getResult () {
            return resultData;
        }

        /**
         * Clean result data
         * @return {void}
         */
        export function clearResult () {
            resultData = null;
        }

        /**
         * Set a callback to be called before start a intent.
         * @param {Function} callback
         */
        export function beforeStartIntent (callback: Function) {
            beforeStartIntentEvents.push(callback);
        }

        /**
         * Set a callback to be called when press backbutton or a 'caviar-back' element
         * @param {Function} callback
         */
        export function onBack (callback: Function) {
            onBackEvents.push(callback);
        }

        /**
         * Bind events from intents
         */
        export function bindIntentElements () {
            var $doc;
            $doc = $(document);

            StateHistory.Adapter.bind(window, 'statechange', function () {
                var currentIndex, prevIndex, state;
                state = StateHistory.getState();
                prevIndex = CURRENT_INDEX;
                currentIndex = state.data.index || 0;

                if (prevIndex > currentIndex) {
                    IntentManager.back();
                }

                CURRENT_INDEX = currentIndex;
            });

            document.addEventListener('backbutton', function (e) {
                if (!processEventsStack(onBackEvents)) {
                    e.preventDefault();
                }
            }, false);

            $doc.on('tap', '.caviar-back', function (e) {
                StateHistory.back();
                e.preventDefault();
            });

            $doc.on('tap', '[intent]', function (e) {
                var that = this;

                if (!Menu.isOpened()) {
                    IntentManager.start(new Intent(that), null);
                } else {
                    setTimeout(function () {
                        IntentManager.start(new Intent(that), null);
                    }, 200);

                    Menu.hide();
                }

                e.preventDefault();
            });
        }

        /**
         * Starts a intent
         * @param {Object} intent
         * @param {Function} callback
         */
        export function start (intent: Intent, callback: Function) {
            var currentIntent: Intent,
                nextIntent: Intent = intent;

            IntentHistory.add(nextIntent);

            // Create a new controller instance and load all resources
            ControllersInstanceManager.create(nextIntent, function (instanceId) {

                if (IntentHistory.hasPrev()) {
                    currentIntent = IntentHistory.getPrev();

                    UIManager.transitionIn(currentIntent, nextIntent, function () {
                        var index = IntentManager.getIndex();
                        StateHistory.pushState({index: index}, null, '?state=' + index);

                        if (Caviar.isFunction(callback)) {
                            callback();
                        }

                        return IntentManager.clearStack(nextIntent);
                    });

                } else {
                    // Start controller without transitions
                    UIManager.transitionNone(undefined, nextIntent, function () {
                        if (Caviar.isFunction(callback)) {
                            callback();
                        }
                    });
                }
            });
        }

        /**
         * Back to previous intent
         */
        export function back () {
            var current: Intent,
                controllerInstance: Controller,
                activeControllerInstance: Controller,
                prev: Intent;

            if (IntentHistory.hasPrev()) {
                current = IntentHistory.getCurrent();
                prev = IntentHistory.getPrev();

                controllerInstance = ControllersInstanceManager.get(prev.controllerInstanceId);
                activeControllerInstance = ControllersInstanceManager.get(prev.controllerInstanceId);

                controllerInstance.onResume(
                    activeControllerInstance.onLeave()
                );

                if (this.getResult() !== null) {
                    controllerInstance.onResult(this.getResult());
                    this.clearResult();
                }


                var last = IntentHistory.removeLast();

                UIManager.transitionOut(current, prev, function () {
                    ControllersInstanceManager.destroy(last.controllerInstanceId);
                });
            } else {
                // Close application when have no more instances to back
                // Its requires Cordova script included
                Caviar.exit();
            }
        }

        /**
         * Back to previous intent passing data
         * @param {Mixed} data
         * @todo: review it, may cause error.
         */
        export function result (data) {
            this.setResult(data);
            StateHistory.back();
        }

        /**
         * When start a intent with main controller destroy all previous controller instances.
         * This happens because understand that if the User back to the main screen of the application 
         * it will not have the intention to return to the previous screen.
         * @param  {Object} intent Started intent
         * @todo Enable to call using controllers differents of MainController
         */
        export function clearStack (intent) {
            var all, count, current, x, len, cIntent;

            if (intent.controller === 'MainController') {
                current = IntentHistory.getCurrent();
                all = IntentHistory.all();
                count = all.length;
                len = count - 1;

                // Destroy all previous controller instances
                for (x = 0; x < len; x += 1) {
                    cIntent = all[x];
                    ControllersInstanceManager.destroy(cIntent.controllerInstanceId);
                }

                IntentHistory.clear();
                IntentHistory.add(current);
            }
        }
    }
}
