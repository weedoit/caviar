/*global define:true*/
/*jslint ass: true */
/**
 * A section is a zone of a view layout that should be update
 * @module Caviar.Section
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Section', function () {
    'use strict';

    var Section,
        stringToFragment;

    Section = function (refNodes, template) {
        this.refNodes = refNodes;
        this.template = template;
    };

    Section.prototype.refNodes = null;

    Section.prototype.template = null;

    Section.prototype.append = function (string) {
        var nodes = this.refNodes,
            fragment = stringToFragment(string);

        nodes.opening.parentNode.insertBefore(fragment, nodes.closing);
    };

    Section.prototype.prepend = function (string) {
        var nodes = this.refNodes,
            fragment = stringToFragment(string),
            ref = (nodes.opening.nextSibling !== nodes.closing) ? nodes.opening.nextSibling : nodes.closing;

        nodes.opening.parentNode.insertBefore(fragment, ref);
    };

    Section.prototype.update = function (data) {
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
    };

    Section.prototype.render = function (data) {
        return this.template(data);
    };

    // Utils
    stringToFragment = function (string) {
        var el = document.createElement('body'),
            fragment = document.createDocumentFragment(),
            currentNode;

        el.innerHTML = string;

        while (currentNode = el.firstChild) {
            fragment.appendChild(currentNode);
        }

        return fragment;
    };

    return Section;
});
