/// <reference path="defs/handlebars/handlebars.d.ts" />

module Caviar {
    export class View {
        /**
         * Layout file content
         * @type {String}
         */
        rawTemplate: string = null;

        /**
         * Handlebars template from layout
         * @type {Object}
         */
        template: Function = null;

        /**
         * List of sections presents in layout
         * @type {Object}
         */
        sectionsTemplates: Object = null;

        /**
         * Constructor
         * @param {String} template Layout file content
         */
        constructor (template: string) {
            this.rawTemplate = template;
            this.parseTemplate();
        }

        /**
         * Convert layout to handlerbar template
         * @return {void}
         */
        parseTemplate () : void {
            // Skip sections parse if has not section in layout.
            if (this.rawTemplate.indexOf('@section') >= 0) {
                this.parseSections();
            }

            this.template = Handlebars.compile(this.rawTemplate, {noEscape: true});
        }

        /**
         * Find and parse section in layout
         * @return {void}
         */
        parseSections = function () {
            var matches,
                name,
                rawTemplate,
                html,
                output = {};

            rawTemplate = this.rawTemplate
                .replace(/@section\('(.*)'\)/g, '<code class="caviar-section $1">')
                .replace(/@endsection/g, '</code>');

            html = document.createElement('div');
            html.innerHTML = rawTemplate;

            matches = html.querySelectorAll('code');

            [].map.call(matches, function (i) {
                name = i.classList[1];
                output[name] = Handlebars.compile(i.innerHTML, {noEscape: true});

                i.insertBefore(document.createComment('caviar-section-' + name), i.firstChild);
                i.appendChild(document.createComment('end-caviar-section-' + name));
            });

            this.rawTemplate = html.innerHTML.replace(/<\/?!?(code)[^>]*>/g, '');
            this.sectionsTemplates = output;
        }
    }
}