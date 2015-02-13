define('Plugins/PullToRefresh', function () {
    return function (element, opts) {
        var onDragStart, onDragDown, onDragEnd, setElementTransform, getElementOffset, ANIMATIONS_EVENTS,
            translateYValue, $h, options, enabled, element;

        opts = opts || {};
        options = {
            callback: (typeof opts === 'function') ? opts :opts.onDragEnd,
            distanceToRefresh: opts.distanceToRefresh || 80
        };

        element = wrapper.querySelector('.surface');

        $h = new Hammer(wrapper);
        ANIMATIONS_EVENTS = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
        translateYValue = 0;
        startedAt = 0;
      
        getElementOffset = function () {
            return translateYValue;
        };

        setElementTransform = function (value) {
            translateYValue = value;
            element.style.transform = element.style.webkitTransform = 'translate3d( 0, ' + value + 'px, 0 )';
        };

        onDragStart = function () {
            wrapper.classList.remove('loading');
            enabled = (translateYValue === 0 && wrapper.scrollTop === 0)
        };

        onDragDown = function (e) {
            if (!enabled) return;
            var distance = (e.gesture.distance / 2.5).toFixed();
            e.gesture.preventDefault();
            setElementTransform(distance);
        };

        onDragEnd = function (e) {
            var cb;
            if (!enabled) return;

            e.gesture.preventDefault();
            wrapper.classList.add('loading');

            cb = function () {
                wrapper.classList.remove('loading');
                wrapper.removeEventListener(ANIMATIONS_EVENTS, cb, false);
            };

            if (getElementOffset() >= options.distanceToRefresh) {
                setElementTransform(options.distanceToRefresh);
                options.callback({
                    element: element,
                    close: function () {
                        wrapper.addEventListener(ANIMATIONS_EVENTS, cb, false);
                        setElementTransform(0);
                    }
                });
            } else {
                setElementTransform(0);
            }
        };

        $h.on('dragstart', onDragStart);
        $h.on('dragdown', onDragDown);
        $h.on('dragend', onDragEnd);
    };
});