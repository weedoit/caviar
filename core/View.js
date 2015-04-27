/*global define:true, Handlebars:true */
/**
 * View
 * @module Caviar.View
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('View', ['ViewHelpers', 'StagedView'], function (ViewHelpers, StagedView) {
    "use strict";
    var View, stage, UID;

    UID = 0;
    stage = document.querySelector('.caviar-stage-container');
    ViewHelpers.initialize();

    /**
     * Constructor
     * @param {String} template Layout file content
     */
    View = function (template) {
        this.rawTemplate = template;
        this.parseTemplate();
    };

    /**
     * Layout file content
     * @type {String}
     */
    View.prototype.rawTemplate = '';

    /**
     * Handlebars template from layout
     * @type {Object}
     */
    View.prototype.template = null;

    /**
     * List of sections presents in layout
     * @type {Object}
     */
    View.prototype.sectionsTemplates = null;

    /**
     * Convert layout to handlerbar template
     * @return {void}
     */
    View.prototype.parseTemplate = function () {
        // Skip sections parse if has not section in layout.
        if (this.rawTemplate.indexOf('@section') >= 0) {
            this.parseSections();
        }

        this.template = Handlebars.compile(this.rawTemplate, {noEscape: true});
    };

    /*jslint regexp: true*/
    /**
     * Find and parse section in layout
     * @return {void}
     */
    View.prototype.parseSections = function () {
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
    };
    /*jslint regexp: false*/

    /**
     * Insert view element into DOM
     * @param {Object} view View object
     * @param {Object} data Data sent by controller
     * @return {StagedView} StagedView instance
     * @static
     */
    View.addToStage = function (view, data) {
        var el, viewId;

        UID += 1;
        viewId = 'caviar_instance_view_' + UID;

        el = document.createElement('div');
        el.setAttribute('id', viewId);
        el.setAttribute('class', 'caviar-ui-controler-instance caviar-next');
        el.innerHTML = view.template(data);

        stage.appendChild(el);

        return new StagedView(view, el);
    };

    return View;
});