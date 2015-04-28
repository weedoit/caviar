/*global define:true*/
/**
 * Add "pressed" to buttons and intent elements when touch.
 * @module Caviar.Utils.TouchStatus
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('Utils/TouchStatus', function () {
    var targetClasses = '.intent, .btn, .intented',
        curTarget = null,
        $doc = $(document);

    $doc.on('touchstart', targetClasses, function () {
        if (curTarget !== null) {
            curTarget.removeAttribute('pressed');
        }

        this.setAttribute('pressed', '');
        curTarget = this;
    });

    $doc.on('touchend', targetClasses + ', body', function () {
        this.removeAttribute('pressed');
    });
});