define 'ControllersInstanceManager', ['SFG', 'UIManager'], (SFG, UIManager) ->
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

        create: (controllerName, callback) ->
            that = this;
            sequence = getSequence()

            require [controllerName], (ControllerClass) ->
                instance = new ControllerClass()
                instance.name = controllerName;

                that.loadResources (layoutData) ->
                    viewElement = UIManager.createViewElement(sequence, layoutData)
    
                    instance.vue = new Vue {
                        el: viewElement
                        methods: instance
                        data: instance.data
                    }

                    instance.initialize()

                    colletion[sequence] = instance
                    callback sequence

        ###*
         * Load controller resources
         * @param {Function} callback
         * @return {void}
         *###
        loadResources: (callback) ->
            LayoutLoader.load(@name, callback)

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
