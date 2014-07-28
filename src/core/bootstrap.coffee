define 'Bootstrap', ['Caviar', 'IntentManager', 'Intent'], (Caviar, IntentManager, Intent) ->
    Bootstrap =
        ###
        Bootup application
        ###
        bootup: () ->
            this.initializeMenus();
            IntentManager.bindIntentElements();
            IntentManager.start(new Intent('main'));

        ###
        Setup sidebar menus
        ###
        initializeMenus: () ->
            options =
                element: document.getElementById('stage'),
                dragger: null,
                disable: 'none',
                addBodyClasses: true,
                hyperextensible: true,
                resistance: 0.5,
                flickThreshold: 20,
                transitionSpeed: 0.3,
                easing: 'ease',
                maxPosition: 266,
                minPosition: -266,
                tapToClose: true,
                touchToDrag: true,
                slideIntent: 40,
                minDragDistance: 5
            Caviar.globals.set 'snapper', new Snap(options)
