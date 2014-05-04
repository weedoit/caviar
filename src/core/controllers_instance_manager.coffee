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
            sequence = getSequence()

            require [controllerName], (ControllerClass) ->
                instance = new ControllerClass()
                instance.name = controllerName;

                instance.loadResources (layoutData) ->
                    view = UIManager.createViewElement(sequence, layoutData)
                    UIManager.initializeLayout(view);

                    instance.view = view
                    instance.initialize()
                    colletion[sequence] = instance
                    callback sequence

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
            colletion[key].unloadResources()
            delete colletion[key]
