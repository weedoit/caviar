/**
 * Manage and executes transitions between controllers
 * @module Caviar.UITransitions
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
define('UITransitions', function () {
	var RUNNING, STOPED, UITransitions, registeredAnimations, queue, addToQueue, processQueue, queueStatus;

	/**
	 * Constants
	 */
	RUNNING = 1;
	STOPED = 2;

	/**
	 * Transitions Queue
	 * @type {Array}
	 */
	queue = [];

	/**
	 * Queue status
	 * @type {Number}
	 */
	queueStatus = STOPED;

	/**
	 * Transitions effects colletion
	 * @type {Object}
	 */
	registeredAnimations = {

		// All animations should to have "transitionIn" and "transitionOut" methods. 
		//
		// The "transitionIn" method receive the view of the active controller as first 
		// argument and the view of next controller as second argument. 
		//
		// The "transitionOut" method too receive the view of active controller as first argument, 
		// but the second argument receive the view of previous controller instead of.
		//
		// Both methods should return a sequence from VelocityJS.
		// (More about VelocityJS's sequence at: http://julian.com/research/velocity/#uiPack)
		
		show: {
			transitionIn: function ($active, $next) {
				return [
					{e: $next, p: {opacity: 1}, options: {duration: 1, easing: 'ease'}}
				];
			},

			transitionOut: function ($active, $prev) {
				return [
					{e: $prev, p: {opacity: 1}, options: {duration: 1, easing: 'ease'}}
				];
			}
		},

		slideLeft: {
			transitionIn: function ($active, $next) {
				return [
					{e: $active, p: {scale: 0.9, opacity: 0.6}, options: {duration: 150, easing: 'ease'}},
					{e: $next, p: {translateX: [0, '100%']}, options: {duration: 300, easing: 'ease'}}
				];
			},

			transitionOut: function ($active, $prev) {
				return [
					{e: $active, p: {translateX: ['100%', 0]}, options: {duration: 300, easing: 'ease'}},
					{e: $prev, p: {scale: 1, opacity: 1}, options: {duration: 150, easing: 'ease'}}
				];
			}
		},

		slideUp: {
			transitionIn: function ($active, $next) {
				return [
					{e: $active, p: {scale: 0.9, opacity: 0.6}, options: {duration: 150, easing: 'ease'}},
					{e: $next, p: {translateY: [0, '100%']}, options: {duration: 300, easing: 'ease'}}
				];
			},

			transitionOut: function ($active, $prev) {
				return [
					{e: $active, p: {translateY: ['100%', 0]}, options: {duration: 300, easing: 'ease'}},
					{e: $prev, p: {scale: 1, opacity: 1}, options: {duration: 150, easing: 'ease'}}
				];
			}
		}
	};

	/**
	 * Add a transition animation to queue
	 * @param {Array} sequence A VelocityJS sequence.
	 */
	addToQueue = function (sequence) {
		queue.push(sequence);

		if (queue.length === 1 && queueStatus === STOPED) {
			processQueue();
		}
	}

	/**
	 * Run the next transition in queue
	 * @param {Function}
	 */
	processQueue = function () {
		var seq = queue.shift();
		
		if (seq) {
			queueStatus = RUNNING;
			Velocity.RunSequence(seq);
		} else {
			if (queueStatus === RUNNING) {
				queueStatus = STOPED;
			}
		}
	}

	UITransitions = {
		/**
		 * Register a new transition effect
		 * @param  {String} name          Effect name
		 * @param  {Array}  transitionIn  TransitionIn effect sequence
		 * @param  {Array}  transitionOut TransitionOut effect sequence
		 */
		register: function (name, transitionIn, transitionOut) {
			registeredAnimations[name] = {
				transitionIn: transitionIn,
				transitionOut: transitionOut
			};
		},

		/**
		 * Executes a transitionIn effect
		 * @param  {Object}   active   DOMElement of active controller.
		 * @param  {Object}   next     DOMElement of next controller.
		 * @param  {String}   effect   Effect name.
		 * @param  {Function} callback Callback called when all itens of sequence was done.
		 */
		transitionIn: function (active, next, effect, callback) {
			var $active, $next, animationSequence, lastAnimation, _cb;

			$active = $(active);
			$next = $(next);

			animationSequence = registeredAnimations[effect].transitionIn(active, next);
			lastAnimation = animationSequence[animationSequence.length - 1];

			_cb = (typeof lastAnimation.options.complete === 'function')
				? lastAnimation.options.complete
				: function () {};

			// The callback of the last item of sequence is overloaded to
			// process the rest of queue and toogle some CSS classes in views
			lastAnimation.options.complete = function () {
				$active.removeClass('caviar-active').addClass('caviar-backgrounded').addClass('caviar-hidden');
				$next.removeClass('caviar-next').addClass('caviar-active');
				callback();
				_cb();
				processQueue();
			};

			addToQueue(animationSequence);
		},

		/**
		 * Executes a transitionOut effect
		 * @param  {Object}   active   DOMElement of active controller.
		 * @param  {Object}   prev     DOMElement of prev controller.
		 * @param  {String}   effect   Effect name.
		 * @param  {Function} callback Callback called when all itens of sequence was done.
		 */
		transitionOut: function (active, prev, effect, callback) {
			var $active, $prev, $animationSequence, lastAnimation, firstAnimation, _cb;

			$active = $(active);
			$prev = $(prev);

			animationSequence = registeredAnimations[effect].transitionOut($active, $prev);
			lastAnimation = animationSequence[animationSequence.length - 1];
			firstAnimation = animationSequence[0];

			_cb = (typeof lastAnimation.options.complete === 'function')
				? lastAnimation.options.complete
				: function () {};


			firstAnimation.options.begin = function () {
				$prev.removeClass('caviar-hidden');
			};

			// The callback of the last item of sequence is overloaded to
			// process the rest of queue and toogle some CSS classes in views
			lastAnimation.options.complete = function () {
				$active.removeClass('caviar-active').addClass('caviar-dead');
				$prev.removeClass('caviar-backgrounded').addClass('caviar-active');
				callback();
				_cb();
				processQueue();
			};

			addToQueue(animationSequence);
		}
	};


	// Exports
	return UITransitions;
});