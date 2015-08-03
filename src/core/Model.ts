/// <reference path="db/WebSQLDriver.ts" />
/// <reference path="db/Schema.ts" />
/// <reference path="db/QueryBuilder.ts" />
/// <reference path="defs/moment/moment.d.ts" />
/**
 * Model module
 * @exports Caviar.Model
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 */
module Caviar {
    var resultToObject, errorCallback, keysCache;

    keysCache = {};

    export class Model {
        /**
         * Table name
         * @type {String}
         */
        table : string = 'noticias';

        /**
         * Table schema definition
         * @type {Object}
         */
        schema : Object = null;

        /**
         * Define if schema was initialized
         * @type {Boolean}
         */
        initialized : boolean =  false;

        /**
         * Iniatalize database schema
         * @param {Function} successCallback
         * @param {Function} errorCallback
         */
        public initialize (successCallback, errorCallback) {
            var that = this;

            DB.Schema.create(this.table, this.schema, function () {
                that.initialized = true;
                successCallback();
            }, errorCallback);
        }

        /**
         * Create a new database transaction
         * @param {Function} callback( tx )       Transaction callback
         * @param {Function} callback@tx        SQLTransaction object
         * @param {Function} successCallback
         * @param {Function} errorCallback
         */
        public transaction (callback, successCallback?, errorCallback?) {
            if (this.initialized) {
                DB.WebSQLDriver.startTransaction(callback, successCallback, errorCallback);
            } else {
                this.initialize(function () {
                    DB.WebSQLDriver.startTransaction(callback, successCallback, errorCallback);
                }, errorCallback);
            }
        }

        /**
         * Convert SQLResultSetRowList to model object array
         * @param   {Object} results SQLResultSetRowList
         * @returns {Array}  Array with converted objects
         */
        public parseResultsToModelObject (results) {
            var output = [],
                len = results.rows.length,
                x;

            for (x = 0; x < len; x += 1) {
                output.push(this.fill(results.rows.item(x)));
            }

            return output;
        }

        /**
         * Get all changed attributes of a model object
         * @param   {Object} obj Model object
         * @returns {Mixed} Object with changes or null if nothing was changed
         */
        public getChangedAttrs (obj) {
            var original, attr, diff, hasChanges, curAttr;

            hasChanges = false;
            diff = {};

            if (!obj.originalAttributes) {
                return diff;
            }

            original = obj.originalAttributes;

            for (attr in original) {
                if (original.hasOwnProperty(attr)) {
                    curAttr = obj[attr];

                    if (typeof curAttr !== 'function' && curAttr !== original[attr]) {
                        diff[attr] = obj[attr];
                        hasChanges = true;
                    }
                }
            }

            return (hasChanges) ? diff : null;
        }


        public getForcedUpdateAttrs (obj) {
            var original, attr, diff, hasChanges, curAttr;

            hasChanges = false;
            diff = {};

            if (!obj.originalAttributes) {
                return diff;
            }

            original = obj.originalAttributes;

            for (attr in original) {
                if (original.hasOwnProperty(attr)) {
                    curAttr = obj[attr];

                    if (typeof curAttr !== 'function') {
                        diff[attr] = obj[attr];
                        hasChanges = true;
                    }
                }
            }

            return (hasChanges) ? diff : null;
        }

        /**
         * Get a new QueryBuilder instance
         * @returns {Object} QueryBuilder instance
         */
        public getNewQuery () {
            return new DB.QueryBuilder(this.table);
        }

        /**
         * Convert a field value to type defined in schema
         * @param   {String} field Field name
         * @param   {Mixed}  value Field value
         * @returns {Mixed}
         */
        public parseTypes (field, value) {
            switch (this.schema[field]) {
            case 'integer':
            case 'int':
            case 'numeric':
            case 'real':
            case 'increments':
                return Number(value);
            case 'text':
            case 'string':
                return (value !== null) ? value.toString() : '';
            case 'date':
                return moment(value);
            }
        }

        /**
         * Fill a model object
         * @param   {Object} data
         * @returns {Object} Model object
         */
        public fill (data) {
            var modelObj, attrs, key, len, x, curAttr;

            modelObj = {originalAttributes: {}};
            attrs = this.getSchemaKeys();
            len = attrs.length;

            // Initialize model attrs
            for (x = 0; x < len; x += 1) {
                curAttr = attrs[x];
                modelObj[curAttr] = modelObj.originalAttributes[curAttr] = '';
            }

            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    if (attrs.indexOf(key) !== -1) {
                        modelObj[key] = modelObj.originalAttributes[key] = this.parseTypes(key, data[key]);
                    }
                }
            }

            return modelObj;
        }

        /**
         * Get a list of fields of schema
         * @returns {Array}
         */
        public getSchemaKeys () {
            var schema = this.schema,
                keys = [],
                key;

            if (keysCache[this.table]) {
                return keysCache[this.table];
            }

            for (key in schema) {
                if (schema.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }

            keysCache[this.table] = keys;

            return keys;
        }

        /**
         * Find a register using id
         * @param {Number}   id
         * @param {Function} successCallback( result )
         * @param {Mixed}    successCallback@result Model object or null if register not found
         * @param {Function} errorCallback
         */
        public find (id, successCallback, errorCallback) {
            var queryBuilder;

            queryBuilder = this.getNewQuery().where('id', id);

            this.fetch(queryBuilder, function (res) {
                successCallback((res.length === 1) ? res[0] : null);
            }, errorCallback);
        }

        /**
         * Executes a select query using a QueryBuilder instance and returns the results
         * @param {Object}   queryBuilder
         * @param {Function} successCallback( results )
         * @param {Array}    successCallback@results Array of model objects
         * @param {Function} errorCallback
         */
        public fetch (queryBuilder, successCallback, errorCallback) {
            var that = this,
                query = queryBuilder.renderSelect();

            this.transaction(function (tx) {
                tx.executeSql(query.sql, query.values, function (tx, results) {
                    successCallback(that.parseResultsToModelObject(results));
                }, errorCallback);
            });
        }

        /**
         * Insert or update a object model into database
         * @param {Object}   data
         * @param {Function} successCallback( insertId )
         * @param {Number}   successCallback@insertId New register id
         * @param {Function} errorCallback
         */
        public save (data, successCallback, errorCallback) {
            var diff;

            if (data.id && data.id !== '' && data.id !== 0) {
                diff = this.getChangedAttrs(data);

                // Avoid database hit when there isn't changes
                if (diff !== null) {
                    this.update(data.id, this.getChangedAttrs(data), successCallback, errorCallback);
                } else {
                    successCallback();
                }
            } else {
                this.create.apply(this, arguments);
            }
        }

        /**
         * Save a object model collection
         * @param {Array}    data
         * @param {Function} successCallback
         * @param {Function} errorCallback
         */
        public saveAll (data, successCallback, errorCallback, forceInsert, forceUpdate) {
            var that = this;

            this.transaction(function (tx) {
                var len = data.length,
                    qb,
                    query,
                    x,
                    cur;

                for (x = 0; x < len; x += 1) {
                    cur = data[x];
                    qb = that.getNewQuery();

                    query = (cur.id && cur.id !== '' && cur.id !== 0 && !forceInsert)
                        ? qb.update((!forceUpdate) ? that.getChangedAttrs(cur) : that.getForcedUpdateAttrs(cur)).where('id', cur.id).renderUpdate()
                        : qb.insert(cur).renderInsert();

                    tx.executeSql(query.sql, query.values);
                }
            }, successCallback, errorCallback);
        }

        /**
         * Update a single register
         * @param {Number}   id              Register id
         * @param {Object}   data            Changed data
         * @param {Function} successCallback
         * @param {Function} errorCallback
         */
        public update (id, data, successCallback, errorCallback) {
            var queryBuilder = this.getNewQuery(),
                query = queryBuilder.where('id', id).update(data).renderUpdate();

            this.transaction(function (tx) {
                tx.executeSql(query.sql, query.values, function (tx, results) {
                    successCallback();
                }, errorCallback);
            });
        }

        public filterSchemaFields (obj) {
            var fields = this.getSchemaKeys(),
                output = {},
                attr;

            for (attr in obj) {
                if (obj.hasOwnProperty(attr) && fields.indexOf(attr) !== -1) {
                    output[attr] = obj[attr];
                }
            }

            return output;
        }

        public syncTable (data, successCallback, errorCallback) {
            var that, ids, qb, query;

            that = this;
            qb = this.getNewQuery();
            ids = data.map(function (row) {
                return row.id;
            });

            query = qb.select(['id']).where('id', 'IN', ids).renderSelect();

            this.transaction(function (tx) {
                tx.executeSql(query.sql, query.values, function (tx, results) {
                    var foundIds = [],
                        len = results.rows.length,
                        dataLen = data.length,
                        query,
                        row,
                        i,
                        x;

                    for (x = 0; x < len; x += 1) {
                        foundIds.push(Number(results.rows.item(x).id));
                    }

                    for (i = 0; i < dataLen; i += 1) {
                        row = that.filterSchemaFields(data[i]);

                        query = (foundIds.indexOf(Number(row.id)) === -1)
                            ? that.getNewQuery().insert(row).renderInsert()
                            : that.getNewQuery().update(row).where('id', row.id).renderUpdate();

                        tx.executeSql(query.sql, query.values, undefined, errorCallback);
                    }

                }, errorCallback);
            }, successCallback, errorCallback);
        }

        /**
         * Insert a new register
         * @param {Object}   data
         * @param {Function} successCallback( insertId )
         * @param {Number}   successCallback@insertId New register id
         * @param {Function} errorCallback
         */
        public create (data, successCallback, errorCallback) {
            var queryBuilder = this.getNewQuery(),
                query = queryBuilder.insert(data).renderInsert();

            this.transaction(function (tx) {
                tx.executeSql(query.sql, query.values, function (tx, result) {
                    successCallback(result.insertId);
                }, errorCallback);
            });
        }

        /**
         * Destroy a single register
         * @param {Number}   id              Register id
         * @param {Function} successCallback
         * @param {Function} errorCallback
         */
        public destroy (id,  successCallback, errorCallback) {
            var queryBuilder = this.getNewQuery(),
                query = queryBuilder.where('id', id).renderDelete();

            this.transaction(function (tx) {
                tx.executeSql(query.sql, query.values, function (tx, result) {
                    successCallback();
                }, errorCallback);
            });
        }

        /**
         * Destroy a single register
         * @param {Array}    ids              Register id array
         * @param {Function} successCallback
         * @param {Function} errorCallback
         */
        public destroyAll (ids,  successCallback, errorCallback) {
            var queryBuilder = this.getNewQuery(),
                query = queryBuilder.where('id', 'IN', ids).renderDelete();

            this.transaction(function (tx) {
                tx.executeSql(query.sql, query.values, function (tx, result) {
                    successCallback();
                }, errorCallback);
            });
        }
    }

}
