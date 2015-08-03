/**
 * Query Builder
 * @module Caviar.DB.QueryBuilder
 * @author Bruno Ziiê <http://github.com/brunoziie/>
 * @todo: Add types
 */
module Caviar.DB {

    var escapeString = function (val) {
        val = ((val.toString) ? val.toString() : '').replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
            switch (s) {
            case "\0":
                return "\\0";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\b":
                return "\\b";
            case "\t":
                return "\\t";
            case "\x1a":
                return "\\Z";
            case "'":
                return "''";
            case '"':
                return '""';
            default:
                return "\\" + s;
            }
        });

        return '"' + val + '"';
    };


    export class QueryBuilder {

        constructor (table?) {
            this.tableName = table || null;

            // Set attributes value when creating to avoid references
            this.selectedFields = [];
            this.conditions = [];
            this.conditionsValue = [];
            this.fields = {};
            this.orders = [];
        }


        public table (name) {
            this.tableName = name;
            return this;
        }

        tableName = null;

        selectedFields = null;

        conditions = null;

        conditionsValue = null;

        fields = null;

        orders = null;

        limitValue = -1;

        offsetValue = 0;

        public parseOperator (field, operator, value) {
            var escapedValues,
                op = operator.trim().toUpperCase();

            switch (op) {
            case 'LIKE':
            case 'NOT LIKE':
            case '>':
            case '<':
            case '>=':
            case '<=':
            case '<>':
                this.conditions.push(field + ' ' + op + ' ?');
                this.conditionsValue.push(value);
                break;
            case 'IN':
            case 'NOT IN':
                escapedValues = value.map(function (val) {
                    return escapeString(val);
                });

                this.conditions.push(field + ' ' + op + '(' + escapedValues.join(',') + ')');
                break;
            }

        }

        public parseConditions (field, operator, value) {
            switch (arguments.length) {
            case 3:
                this.parseOperator(field, operator, value);
                break;
            case 2:
                this.conditions.push(field + ' = ?');
                this.conditionsValue.push(operator);
                break;
            case 1:
                if (field instanceof Array) {
                    var len = field.length, cur, x;

                    for (x = 0; x < len; x += 1) {
                        cur = field[x];

                        if (cur instanceof Array) {
                            this.parseConditions.apply(this, cur);
                        }
                    }
                } else if (typeof field === 'string') {
                    this.conditions.push(field);
                }

                break;
            }
        }

        public select (field) {
            if (field instanceof Array) {
                this.selectedFields = this.selectedFields.concat(field);
            } else if (typeof field === 'string') {
                this.selectedFields.push(field);
            }

            return this;
        }

        public limit (limit, offset?) {
            this.limitValue = limit;
            this.offsetValue = offset || 0;

            return this;
        }

        public orderBy (field, order?) {
            if (typeof field === 'string' && typeof order === 'string') {
                this.orders.push(field + ' ' + order);
            } else if (field.toLowerCase().match(/^([a-z]*)\s(desc|asc)/)) {
                this.orders.push(field);
            }

            return this;
        }

        public where (field, operator?, value?) {
            this.parseConditions.apply(this, arguments);
            return this;
        }

        public update (fields) {
            return this.insert(fields);
        }

        public insert (fields) {
            var item;

            for (item in fields) {
                if (fields.hasOwnProperty(item)) {
                    this.fields[item] = fields[item];
                }
            }

            return this;
        }

        public renderSelect () {
            var query, output;

            query = [
                'SELECT ',
                (this.selectedFields.length > 0) ? this.selectedFields.join(', ') : '*',
                ' FROM ',
                this.tableName,
                (this.conditions.length > 0) ? ' WHERE ' + this.conditions.join(' AND ') : '',
                (this.orders.length > 0) ? ' ORDER BY ' + this.orders.join(', ') : '',
                (this.limitValue > 0) ? ' LIMIT ' + this.limitValue : '',
                (this.offsetValue > 0) ? ' OFFSET ' + this.offsetValue : '',
                ';'
            ].join('');

            output = {
                sql: query,
                values: this.conditionsValue
            };

            return output;
        }

        public renderInsert () {
            var query, output, field,
                list =  this.fields,
                names = [],
                values = [],
                escapes = [];

            for (field in list) {
                if (list.hasOwnProperty(field)) {
                    try {
                        names.push(field);
                        values.push((list[field].toString) ? list[field].toString() : list[field]);
                        escapes.push('?');
                    } catch (e) {
                        console.log(field, list[field]);
                    }
                }
            }

            query = [
                'INSERT INTO ',
                this.tableName,
                ' (',
                names.join(', '),
                ') VALUES (',
                escapes.join(', '),
                ');'
            ].join('');

            output = {
                sql: query,
                values: values
            };

            return output;
        }

        public renderUpdate () {
            var query, output, field,
                list =  this.fields,
                names = [],
                values = [],
                escapes = [];

            for (field in list) {
                if (list.hasOwnProperty(field)) {
                    names.push(field + ' = ?');
                    values.push(list[field]);
                }
            }

            query = [
                'UPDATE ',
                this.tableName,
                ' SET ',
                names.join(', '),
                (this.conditions.length > 0) ? ' WHERE ' + this.conditions.join(' AND ') : '',
                (this.limitValue > 0) ? ' LIMIT ' + this.limitValue : '',
                (this.offsetValue > 0) ? ' OFFSET ' + this.offsetValue : '',
                ';'
            ].join('');


            values = values.concat(this.conditionsValue);

            output = {
                sql: query,
                values: values
            };

            return output;
        }

        public renderDelete () {
            var query, output;

            query = [
                'DELETE FROM ',
                this.tableName,
                (this.conditions.length > 0) ? ' WHERE ' + this.conditions.join(' AND ') : '',
                (this.limitValue > 0) ? ' LIMIT ' + this.limitValue : '',
                (this.offsetValue > 0) ? ' OFFSET ' + this.offsetValue : '',
                ';'
            ].join('');

            output = {
                sql: query,
                values: this.conditionsValue
            };

            return output;
        }

    }
}
