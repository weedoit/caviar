/// <reference path="Caviar.ts" />
/// <reference path="StagedView.ts" />
/// <reference path="defs/CaviarViewEventListener.ts" />
/// <reference path="../../src/core/defs/jquery/jquery.d.ts" />
module Caviar {
    /**
     * Controller superclass.
     * This class will be used like a basic implementation that all controllers must to be
     * @module Caviar
     * @class Controller
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export class Controller {
        /**
         * Events listeners from view.
         * @type {Array<CaviarViewEventListener>}
         */
        eventListeners: Array<CaviarViewEventListener> = [];

        /**
         * Controller name
         * @type {String}
         */
        name: String = null;

        /**
         * View element
         * @type {Object}
         */
        view: StagedView = null;

        /**
         * Store data used by controller
         * @type {Object}
         */
        data: any = null;

        /**
         * Get a data stored on controller instance
         * @param  {String} key
         */
        public get (key: string) : any {
            return this.data[key];
        }

        /**
         * Add/Update a data on controller
         * @param {String} key
         * @param {Mixed} value
         */
        public set (key: string, value: any) : void {
            this.data[key] = value;
        }

        /**
         * Callback executed before call initialize method
         * @param {Object} intent The intent that generated the current instance
         * @return {void}
         */
        public beforeInitialize (intent) {
            return;
        }

        /**
         * Init controller's settings
         * @param {Object} intent The intent that generated the current instance
         * @return {void}
         */
        public initialize (intent) {
            return;
        }

        /**
         * Callback called when a controller instance back to front
         * @param {Any} data Data sent by method onLeave from controller that was actived
         */
        public onResume (data: any) {
            return;
        }

        /**
         * Callback called when user back to previous controller instance
         */
        public onLeave () {
            return;
        }

        /**
         * Callback called when a controller instance receives data from another
         * @param {Object} data Data sent by previous controller instance
         */
        public onResult (data: Object) {
            return;
        }

        /**
         * Get DOM element binded by controller
         */
        public getViewElement () {
            return this.view.getElement();
        }

        /**
         * Set event listeners on view
         * @param  {String}   event    Event name
         * @param  {String}   selector Element selector
         * @param  {Function} callback Callback
         * @return {void}
         */
        public listen (event: string, selector: string, callback: Function) : void {
            var view: Element = this.getViewElement(),
                cb: EventListener;

            $(view).on(<any> event, selector, callback);
            
            this.eventListeners.push({
                event: event,
                selector: selector,
                callback: cb
            });
        }

        /**
         * Remove all event listeners defined
         * @return {void}
         */
        public destroyEventListeners () : void {
            var view: Element = this.getViewElement(),
                len: number = this.eventListeners.length,
                x: number,
                cur: CaviarViewEventListener;

            for (x = 0; x < len; x += 1) {
                cur = this.eventListeners[x];
                $(view).off(cur.event, cur.selector, <any> cur.callback);
            }
        }

        /**
         * Destroy controller's resources
         * @return {void}
         */
        public destroy () : void {
            this.data = {};
            return;
        }
    }
}
