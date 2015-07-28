/// <reference path="WebSQLDriver.ts" />
/**
 * Database table schema
 * @exports Caviar.DB.Schema
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
module Caviar.DB.Schema {

    class Schema {
         constructor (table?) {
            this.table = table || null;
            this.fields = [];
        }

        table = null;

        fields = null;

        /**
         * Add a autoincrement field to table
         * @param {String} name Field name
         */
        public increments (name) {
            this.fields.push(name + ' INTEGER PRIMARY KEY AUTOINCREMENT');
        }

        /**
         * Add a integer field to table
         * @param {String} name Field name
         */
        public integer (name) {
            this.fields.push(name + ' INT');
        }

        /**
         * Add a text field to table
         * @param {String} name Field name
         */
        public text (name) {
            this.fields.push(name + ' TEXT');
        }

        /**
         * Add a date field to table
         * @param {String} name Field name
         */
        public date (name) {
            this.fields.push(name + ' TEXT');
        }

        /**
         * Add a real field to table
         * @param {String} name Field name
         */
        public real (name) {
            this.fields.push(name + ' REAL');
        }

        /**
         * Add a numeric field to table
         * @param {String} name Field name
         */
        public numeric (name) {
            this.fields.push(name + ' NUMERIC');
        }

        /**
         * Render a sql string to create a table
         * @param   {String} name Table name
         * @returns {String}      Sql
         */
        public renderCreateTableQuery () {
            return 'CREATE TABLE IF NOT EXISTS ' + this.table + ' (' + this.fields.join(', ') + ');';
        }

        /**
         * Render a sql string to drop a table
         * @param   {String} name Table name
         * @returns {String}      Sql
         */
        public renderDropTableQuery () {
            return 'DROP TABLE ' + this.table + ';';
        }
    }

    /**
     * Create a table
     * @param {String}   name            Table name
     * @param {Object}   def             Schema definition
     * @param {Function} successCallback
     * @param {Function} errorCallback
     */
    export function create (name, def, successCallback, errorCallback) {
        var table = new Schema(name),
            field,
            type;

        for (field in def) {
            if (def.hasOwnProperty(field)) {
                type = def[field];
                table[type](field);
            }
        }

        Caviar.DB.WebSQLDriver.startTransaction(function (tx) {
            tx.executeSql(table.renderCreateTableQuery(), [], successCallback, errorCallback);
        });
    }

    /**
     * Drop a table
     * @param {String}   name            Table name
     * @param {Function} successCallback
     * @param {Function} errorCallback
     */
    export function drop (name, successCallback, errorCallback) {
        var table = new Schema(name);

        WebSQLDriver.startTransaction(function (tx) {
            tx.executeSql(table.renderDropTableQuery(), [], successCallback, errorCallback);
        });
    }
}
