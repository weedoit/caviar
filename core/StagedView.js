/*global define:true*/
/**
 * Represents a view on stage
 * @module Caviar.StagedView
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('StagedView', ['Section'], function (Section) {
    'use strict';

    var StagedView,
        findMarkupCommentsNodes;

    StagedView = function (viewObj, stagedElement) {
        this.view = viewObj;
        this.element = stagedElement;
        this.sections = {};
        this.attachSections();
    };

    StagedView.prototype.getElement = function () {
        return this.element;
    };

    StagedView.prototype.attachSections = function () {
        this.sections = this.parseSections();
    };

    findMarkupCommentsNodes = function (root) {
        var len = root.childNodes.length,
            comments = [],
            currentNode,
            currentNodeData,
            x;

        for (x = 0; x < len; x += 1) {
            currentNode = root.childNodes[x];
            currentNodeData = currentNode.data;

            if (currentNode.nodeType === 8) {
                if (currentNodeData.indexOf('caviar-section') >= 0) {
                    comments.push({
                        type: (currentNodeData.indexOf('end') === 0) ? 'closing' : 'opening',
                        data: currentNode.data,
                        node: currentNode
                    });
                }
            } else if (currentNode.childNodes.length > 0) {
                comments = comments.concat(findMarkupCommentsNodes(currentNode));
            }
        }

        return comments;
    };

    StagedView.prototype.parseSections = function () {
        var root = this.element,
            comments = findMarkupCommentsNodes(root),
            len = comments.length,
            openingNodes = [],
            commentsObj = {},
            sections = {},
            openingNodesLen,
            currentOpeningNode,
            current,
            closingNode,
            name,
            x,
            y;

        for (x = 0; x < len; x += 1) {
            current = comments[x];

            if (current.type === 'opening') {
                openingNodes.push(current);
            }

            commentsObj[current.data] = current;
        }

        openingNodesLen = openingNodes.length;

        for (y = 0; y < openingNodesLen; y += 1) {
            currentOpeningNode = openingNodes[y];
            name = currentOpeningNode.data.replace('caviar-section-', '');
            closingNode = commentsObj['end-' + currentOpeningNode.data];

            if (!closingNode) {
                throw new Error('Section "' + name + '" was\'nt closed');
            }

            sections[name] = new Section({
                opening: currentOpeningNode.node,
                closing: closingNode.node
            }, this.view.sectionsTemplates[name]);
        }

        return sections;
    };

    return StagedView;
});
