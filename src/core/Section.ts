/// <reference path="defs/SectionNodes.ts" />
module Caviar {
    var stringToFragment: Function;

    /**
     * A section is a area in the view that could be updated
     * @module Caviar
     * @class Section
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export class Section {
        /**
         * Object with reference nodes of opening and closing of section.
         * @type {SectionNodes}
         */
        refNodes: SectionNodes = null;

        /**
         * Handlebars instance of section template
         * @type {Function}
         */
        template: Function = null;

        /**
         * Constructor
         * @param {SectionNodes} refNodes Object with reference nodes of opening
         *                                 and closing of section.
         * @param {Function}      template Handlebars instance.
         */
        constructor (refNodes: SectionNodes, template: Function) {
            this.refNodes = refNodes;
            this.template = template;
        }

        /**
         * Add a content on end of section
         * @param {string} str HTML string with content
         * @return {void}
         */
        append (str: string) : void {
            var nodes = this.refNodes,
                fragment = stringToFragment(str);

            nodes.opening.parentNode.insertBefore(fragment, nodes.closing);
        }

        /**
         * Add a content on top of section
         * @param {string} str HTML string with content
         * @return {void}
         */
        prepend (str: string) : void {
            var nodes = this.refNodes,
                fragment = stringToFragment(str),
                next = nodes.opening.nextSibling,
                ref = (next !== nodes.closing) ? next : nodes.closing;

            nodes.opening.parentNode.insertBefore(fragment, ref);
        }

        /**
         * Update section content
         * @param {string} str HTML string with content or object with
         *                     data to render the original templare
         * @return {void}
         */
        update (data: any) : void {
            var nodes = this.refNodes,
                parent = nodes.opening.parentNode,
                current = nodes.opening,
                fragment = stringToFragment(
                    (typeof data === 'string') ? data : this.template(data)
                );

            while (current.nextSibling !== nodes.closing) {
                parent.removeChild(current.nextSibling);
            }

            parent.insertBefore(fragment, nodes.closing);
        }

        /**
         * Render the section template
         * @param  {Object} data Data to render the template
         * @return {string}      Rendered HTML string
         */
        render (data: Object) : string {
            return this.template(data);
        }
    }

    /**
     * Convert from string to DocumentFragment
     * @param {string} string HTML String
     */
    stringToFragment = function (str: string) {
        var el = document.createElement('body'),
            fragment = document.createDocumentFragment(),
            currentNode;

        el.innerHTML = str;

        while (currentNode = el.firstChild) {
            fragment.appendChild(currentNode);
        }

        return fragment;
    }
}