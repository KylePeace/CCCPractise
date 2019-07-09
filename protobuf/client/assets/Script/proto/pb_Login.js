/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

//var $protobuf = require("protobufjs/minimal");
var $protobuf = protobuf

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.pb_Loginpackage = (function() {

    /**
     * Namespace pb_Loginpackage.
     * @exports pb_Loginpackage
     * @namespace
     */
    var pb_Loginpackage = {};

    /**
     * Country enum.
     * @name pb_Loginpackage.Country
     * @enum {string}
     * @property {number} china=0 china value
     * @property {number} other=1 other value
     */
    pb_Loginpackage.Country = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "china"] = 0;
        values[valuesById[1] = "other"] = 1;
        return values;
    })();

    /**
     * ErrCode enum.
     * @name pb_Loginpackage.ErrCode
     * @enum {string}
     * @property {number} success=0 success value
     * @property {number} fail=1 fail value
     */
    pb_Loginpackage.ErrCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "success"] = 0;
        values[valuesById[1] = "fail"] = 1;
        return values;
    })();

    /**
     * msgType enum.
     * @name pb_Loginpackage.msgType
     * @enum {string}
     * @property {number} LoginRequest=100001 LoginRequest value
     * @property {number} LoginResponse=100002 LoginResponse value
     */
    pb_Loginpackage.msgType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[100001] = "LoginRequest"] = 100001;
        values[valuesById[100002] = "LoginResponse"] = 100002;
        return values;
    })();

    pb_Loginpackage.LoginRequest = (function() {

        /**
         * Properties of a LoginRequest.
         * @memberof pb_Loginpackage
         * @interface ILoginRequest
         */

        /**
         * Constructs a new LoginRequest.
         * @memberof pb_Loginpackage
         * @classdesc Represents a LoginRequest.
         * @implements ILoginRequest
         * @constructor
         * @param {pb_Loginpackage.ILoginRequest=} [properties] Properties to set
         */
        function LoginRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new LoginRequest instance using the specified properties.
         * @function create
         * @memberof pb_Loginpackage.LoginRequest
         * @static
         * @param {pb_Loginpackage.ILoginRequest=} [properties] Properties to set
         * @returns {pb_Loginpackage.LoginRequest} LoginRequest instance
         */
        LoginRequest.create = function create(properties) {
            return new LoginRequest(properties);
        };

        /**
         * Encodes the specified LoginRequest message. Does not implicitly {@link pb_Loginpackage.LoginRequest.verify|verify} messages.
         * @function encode
         * @memberof pb_Loginpackage.LoginRequest
         * @static
         * @param {pb_Loginpackage.ILoginRequest} message LoginRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified LoginRequest message, length delimited. Does not implicitly {@link pb_Loginpackage.LoginRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb_Loginpackage.LoginRequest
         * @static
         * @param {pb_Loginpackage.ILoginRequest} message LoginRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginRequest message from the specified reader or buffer.
         * @function decode
         * @memberof pb_Loginpackage.LoginRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb_Loginpackage.LoginRequest} LoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb_Loginpackage.LoginRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb_Loginpackage.LoginRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb_Loginpackage.LoginRequest} LoginRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginRequest message.
         * @function verify
         * @memberof pb_Loginpackage.LoginRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a LoginRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb_Loginpackage.LoginRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb_Loginpackage.LoginRequest} LoginRequest
         */
        LoginRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.pb_Loginpackage.LoginRequest)
                return object;
            return new $root.pb_Loginpackage.LoginRequest();
        };

        /**
         * Creates a plain object from a LoginRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb_Loginpackage.LoginRequest
         * @static
         * @param {pb_Loginpackage.LoginRequest} message LoginRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginRequest.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this LoginRequest to JSON.
         * @function toJSON
         * @memberof pb_Loginpackage.LoginRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LoginRequest;
    })();

    pb_Loginpackage.LoginResponse = (function() {

        /**
         * Properties of a LoginResponse.
         * @memberof pb_Loginpackage
         * @interface ILoginResponse
         * @property {pb_Loginpackage.ErrCode|null} [code] LoginResponse code
         * @property {string|null} [name] LoginResponse name
         * @property {string|null} [avatar] LoginResponse avatar
         * @property {pb_Loginpackage.Country|null} [country] LoginResponse country
         */

        /**
         * Constructs a new LoginResponse.
         * @memberof pb_Loginpackage
         * @classdesc Represents a LoginResponse.
         * @implements ILoginResponse
         * @constructor
         * @param {pb_Loginpackage.ILoginResponse=} [properties] Properties to set
         */
        function LoginResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginResponse code.
         * @member {pb_Loginpackage.ErrCode} code
         * @memberof pb_Loginpackage.LoginResponse
         * @instance
         */
        LoginResponse.prototype.code = 0;

        /**
         * LoginResponse name.
         * @member {string} name
         * @memberof pb_Loginpackage.LoginResponse
         * @instance
         */
        LoginResponse.prototype.name = "";

        /**
         * LoginResponse avatar.
         * @member {string} avatar
         * @memberof pb_Loginpackage.LoginResponse
         * @instance
         */
        LoginResponse.prototype.avatar = "";

        /**
         * LoginResponse country.
         * @member {pb_Loginpackage.Country} country
         * @memberof pb_Loginpackage.LoginResponse
         * @instance
         */
        LoginResponse.prototype.country = 0;

        /**
         * Creates a new LoginResponse instance using the specified properties.
         * @function create
         * @memberof pb_Loginpackage.LoginResponse
         * @static
         * @param {pb_Loginpackage.ILoginResponse=} [properties] Properties to set
         * @returns {pb_Loginpackage.LoginResponse} LoginResponse instance
         */
        LoginResponse.create = function create(properties) {
            return new LoginResponse(properties);
        };

        /**
         * Encodes the specified LoginResponse message. Does not implicitly {@link pb_Loginpackage.LoginResponse.verify|verify} messages.
         * @function encode
         * @memberof pb_Loginpackage.LoginResponse
         * @static
         * @param {pb_Loginpackage.ILoginResponse} message LoginResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && message.hasOwnProperty("code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.avatar != null && message.hasOwnProperty("avatar"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.avatar);
            if (message.country != null && message.hasOwnProperty("country"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.country);
            return writer;
        };

        /**
         * Encodes the specified LoginResponse message, length delimited. Does not implicitly {@link pb_Loginpackage.LoginResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb_Loginpackage.LoginResponse
         * @static
         * @param {pb_Loginpackage.ILoginResponse} message LoginResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginResponse message from the specified reader or buffer.
         * @function decode
         * @memberof pb_Loginpackage.LoginResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb_Loginpackage.LoginResponse} LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb_Loginpackage.LoginResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.code = reader.int32();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.avatar = reader.string();
                    break;
                case 4:
                    message.country = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb_Loginpackage.LoginResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb_Loginpackage.LoginResponse} LoginResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginResponse message.
         * @function verify
         * @memberof pb_Loginpackage.LoginResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                switch (message.code) {
                default:
                    return "code: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.avatar != null && message.hasOwnProperty("avatar"))
                if (!$util.isString(message.avatar))
                    return "avatar: string expected";
            if (message.country != null && message.hasOwnProperty("country"))
                switch (message.country) {
                default:
                    return "country: enum value expected";
                case 0:
                case 1:
                    break;
                }
            return null;
        };

        /**
         * Creates a LoginResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb_Loginpackage.LoginResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb_Loginpackage.LoginResponse} LoginResponse
         */
        LoginResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.pb_Loginpackage.LoginResponse)
                return object;
            var message = new $root.pb_Loginpackage.LoginResponse();
            switch (object.code) {
            case "success":
            case 0:
                message.code = 0;
                break;
            case "fail":
            case 1:
                message.code = 1;
                break;
            }
            if (object.name != null)
                message.name = String(object.name);
            if (object.avatar != null)
                message.avatar = String(object.avatar);
            switch (object.country) {
            case "china":
            case 0:
                message.country = 0;
                break;
            case "other":
            case 1:
                message.country = 1;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a LoginResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb_Loginpackage.LoginResponse
         * @static
         * @param {pb_Loginpackage.LoginResponse} message LoginResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.code = options.enums === String ? "success" : 0;
                object.name = "";
                object.avatar = "";
                object.country = options.enums === String ? "china" : 0;
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = options.enums === String ? $root.pb_Loginpackage.ErrCode[message.code] : message.code;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.avatar != null && message.hasOwnProperty("avatar"))
                object.avatar = message.avatar;
            if (message.country != null && message.hasOwnProperty("country"))
                object.country = options.enums === String ? $root.pb_Loginpackage.Country[message.country] : message.country;
            return object;
        };

        /**
         * Converts this LoginResponse to JSON.
         * @function toJSON
         * @memberof pb_Loginpackage.LoginResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LoginResponse;
    })();

    return pb_Loginpackage;
})();

module.exports = $root;
