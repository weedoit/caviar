/// <reference path="../Config.ts" />
/// <reference path="../defs/sqlite/sqlite.d.ts" />
/**
 * Web SQL driver
 * @exports Caviar.DB.WebSQLDriver
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
module Caviar.DB.WebSQLDriver {
    var databaseInstance = null;

    /**
     * Get database instance
     * @returns {Object}
     */
    export function getDatabaseInstance () {
        var configs = Caviar.Config.get('database');

        if (databaseInstance === null) {
            databaseInstance = openDatabase(
                configs.name,
                configs.version,
                configs.displayName,
                configs.estimatedSize
            );
        }

        return databaseInstance;
    }

    /**
     * Start a database transaction
     * @param {Function} transactionCallback
     * @param {Function} successCallback
     * @param {Function} errorCallback
     */
    export function startTransaction (transactionCallback, successCallback?, errorCallback?) {
        this.getDatabaseInstance()
            .transaction(transactionCallback, successCallback, errorCallback);
    }
}
