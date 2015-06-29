/// <reference path="Section.ts" />
/// <reference path="View.ts" />
/// <reference path="defs/SectionCommentNode.ts" />
module Caviar {
    var findMarkupCommentsNodes : Function;

    /**
     * Represents a view on stage
     * @module Caviar
     * @class StagedView
     * @author Bruno Ziiê <http://github.com/brunoziie/>
     */
    export class StagedView {
        static COMMENT_NODE : number = 8;

        /**
         * View object
         * @type {View}
         */
        view : View = null;

        /**
         * View element on stage
         * @type {Element}
         */
        element: Element = null;

        /**
         * Object with list of sections presents in the view
         * @type {Object}
         */
        sections: Object = null;

        /**
         * Constructor
         * @param {View}    viewObj       View object instance
         * @param {Element} stagedElement View element on stage
         */
        constructor (viewObj: View, stagedElement: Element) {
            this.view = viewObj;
            this.element = stagedElement;
            this.sections = {};
            this.attachSections();
        }

        /**
         * Returns view element
         * @return {Element}
         */
        getElement () : Element {
            return this.element;
        }

        /**
         * Find all sections in view element
         */
        attachSections () : void {
            this.sections = this.parseSections();
        }

        /**
         * Parse sections in view
         * @return {Object} Object with list of sections presents in the view
         */
        parseSections () : Object {
            var root : Node = this.element,
                comments : Array<SectionCommentNode> = findMarkupCommentsNodes(root),
                len : number = comments.length,
                openingNodes : Array<SectionCommentNode> = [],
                commentsObj : Object = {},
                sections : Object = {},
                openingNodesLen : number,
                currentOpeningNode : SectionCommentNode,
                current : SectionCommentNode,
                closingNode : SectionCommentNode,
                name : string,
                x : number,
                y : number;

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
        }
    }

    /**
     * Find section markup nodes
     * @param  {Node} root Root node
     * @return {Array<SectionCommentNode>}
     */
    findMarkupCommentsNodes = function (root: Node) : Array<SectionCommentNode> {
        var len = root.childNodes.length,
            comments : Array<SectionCommentNode> = [],
            currentNode : any,
            currentNodeData : string,
            x : number;

        for (x = 0; x < len; x += 1) {
            currentNode = root.childNodes[x];
            currentNodeData = currentNode.data;

            if (currentNode.nodeType === StagedView.COMMENT_NODE) {
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
}