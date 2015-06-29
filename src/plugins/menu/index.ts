/// <reference path="../../core/Config.ts" />
/// <reference path="../../core/Bootstrap.ts" />
/// <reference path="../../core/defs/jquery/jquery.d.ts" />
/// <reference path="snap.d.ts" />
module Caviar {
    /**
     * Manages application side menu
     * @module Caviar.Menu
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export module Menu {
        var $doc: JQuery = $(document),
            snapper;

        /**
         * Create a menu instance
         * @param  {Object} options Snap.js options
         * @return {void}
         */
        export function create (options: Object) {
            var opt = options || {
                    element: document.querySelector('.snap-content'),
                    disable: 'right',
                    transitionSpeed: 0.19
                };

            snapper = new Snap(opt);
            return this.bindElements();
        }

        /**
         * Bind controls menu elements
         * @return {void}
         */
        export function bindElements () {
            var self = this;

            $doc.on('tap', '.caviar-open-menu-left', function (e) {
                self.show('left');
                e.preventDefault();
            });

            $doc.on('tap', '.caviar-open-menu-right', function (e) {
                self.show('right');
                e.preventDefault();
            });

            $doc.on('tap', '.caviar-toggle-menu-left', function (e) {
                self.toggle('left');
                e.preventDefault();
            });

            $doc.on('tap', '.caviar-toggle-menu-right', function (e) {
                self.toggle('right');
                e.preventDefault();
            });

            $doc.on('tap', '.caviar-menu-close', function (e) {
                self.hide();
                e.preventDefault();
            });

            $doc.on('tap', '.intent', function (e) {
                self.hide();
                e.preventDefault();
            });

            document.addEventListener('backbutton', function () {
                self.hide();
            }, false);

            return;
        }

        /**
         * Hide sidebar menu
         * @return {void}
         */
        export function hide () {
            if (snapper !== undefined) {
                return snapper.close();
            }
        }

        /**
         * Show sidebar menu
         * @param  {String} side Side of menu (left, right)
         * @return {void}
         */
        export function show (side: string) {
            if (snapper !== undefined) {
                return snapper.open(side);
            }
        }

        /**
         * Toggle sidebar menu
         * @param  {String} side Side of menu (left, right)
         * @return {void}
         */
        export function toggle (side: string) : void {
            if (snapper !== undefined) {
                (snapper.state().state === 'closed')
                    ? this.show(side)
                    : this.hide();
            }
        }

        /**
         * Check if sidebar menu is opened
         * @return {Boolean}
         */
        export function isOpened () : boolean {
            if (snapper !== undefined) {
                return snapper.state().state !== 'closed';
            }

            return false;
        }
    }
}

Caviar.Bootstrap.onApplicationStart(function () {
    if (Caviar.Config.get('hasSidebarMenu')) {
        return Caviar.Menu.create({
            element: $('.snap-content')[0],
            disable: 'right',
            transitionSpeed: 0.2
        });
    }
});