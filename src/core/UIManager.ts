/// <reference path="Caviar.ts" />
/// <reference path="UITransitions.ts" />
/// <reference path="View.ts" />
/// <reference path="StagedView.ts" />
/// <reference path="Intent.ts" />

module Caviar {
    /**
     * Manage transitions and view elements
     * @module Caviar.UIManager
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export module UIManager {
        var UID : number = 0;

        /**
         * Render a view template and insert it into DOM
         * @param  {View}       uid        View object of layout
         * @param  {Object}     layoutData Data to render layout template
         * @return {StagedView}            StagedView object
         */
        export function addViewToStage (view: View, data: any) : StagedView {
            var el : HTMLDivElement, viewId;
            viewId = (UID += 1) + '_ci';

            el = document.createElement('div');
            el.setAttribute('id', viewId);
            el.setAttribute('class', 'caviar-ui-controler-instance caviar-next');
            el.innerHTML = view.template(data);

            Caviar.contentBox.appendChild(el);

            return new StagedView(view, el);
        }

        /**
         * Transition in between controllers
         * @param  {Function} callback Transition end callback
         * @return {void}
         */
        export function transitionIn (activeIntent: Intent, nextIntent: Intent, callback: Function) {
            var cb: Function = callback || function () {},
                currentView: View,
                nextView: View;

            currentView = ControllersInstanceManager
                .get(activeIntent.controllerInstanceId)
                .getViewElement();

            nextView = ControllersInstanceManager
                .get(nextIntent.controllerInstanceId)
                .getViewElement();

            UITransitions.transitionIn(
                currentView,
                nextView,
                nextIntent.transition,
                cb
            );
        }

        /**
         * Transition out between controllers
         * @param  {Function} callback Transition end callback
         * @return {void}
         */
        export function transitionOut (activeIntent: Intent, prevIntent: Intent, callback: Function) {
            var cb: Function = callback || function () {},
                currentView: View,
                prevView: View;

            currentView = ControllersInstanceManager
                .get(activeIntent.controllerInstanceId)
                .getViewElement();

            prevView = ControllersInstanceManager
                .get(prevIntent.controllerInstanceId)
                .getViewElement();

            UITransitions.transitionOut(
                currentView,
                prevView,
                activeIntent.transition,
                cb
            );
        }

        /**
         * Change controller without transition
         * @param  {Function} callback
         * @return {void}
         */
        export function transitionNone (activeIntent: Intent, nextIntent: Intent, callback: Function) {
            var currentViewClassList: DOMTokenList,
                nextViewClassList: DOMTokenList;

            if (activeIntent) {
                currentViewClassList = ControllersInstanceManager
                    .get(activeIntent.controllerInstanceId)
                    .getViewElement()
                    .classList;

                currentViewClassList.remove('caviar-active');
                currentViewClassList.add('caviar-backgrounded');
                currentViewClassList.add('caviar-hidden');
            }

            nextViewClassList = ControllersInstanceManager
                .get(nextIntent.controllerInstanceId)
                .getViewElement()
                .classList;

            nextViewClassList.remove('caviar-next');
            nextViewClassList.add('caviar-active');

            if (Caviar.isFunction(callback)) {
                callback();
            }
        }
    }

}