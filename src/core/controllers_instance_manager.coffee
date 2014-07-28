define 'ControllersInstanceManager', ['Caviar', 'UIManager', 'LayoutLoader'], (Caviar, UIManager, LayoutLoader) ->
    seq = 0
    colletion = {}

    getSequence = () ->
        seq += 1
        "uid#{seq}"

    ControllersInstanceManager =
        exists: (key) ->
            (typeof colletion[key] != 'undefined')

        get: (key) ->
            colletion[key] || null

        create: (intent, callback) ->
            that = this;
            sequence = getSequence()
            controller = intent.controller

            require [controller], (ControllerClass) ->
                instance = new ControllerClass()
                instance.name = controller;

                that.loadResources(instance, (layoutData) ->
                    viewElement = UIManager.createViewElement(sequence, layoutData)
    
                    instance.vue = new Vue {
                        el: "##{viewElement}"
                        methods: instance.publicMethods
                        data: instance.data
                    }

                    instance.initialize(intent)
                    colletion[sequence] = instance
                    callback sequence
                )

        ###*
         * Load controller resources
         * @param {Object} Controller instance
         * @param {Function} callback
         * @return {void}
         *###
        loadResources: (instance, callback) ->
            LayoutLoader.load(instance.name, callback)

        ###*
         * Destroy data and resources created by controller
         * @return {void}
         *###
        unloadResources: () ->
            #unless @view == null
             #   @view.remove();
              #  @data = null;


        restore: (controllerInstance, callback) ->
            sequence = getSequence()

            controllerInstance.loadResources (layoutData) ->
                view = UIManager.createViewElement(sequence, layoutData)
                UIManager.initializeLayout view
                controllerInstance.view = view;
                callback

        destroy: (key) ->
            controllerInstance = this.get(key);
            controllerInstance.destroy()
            delete colletion[key]
