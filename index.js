'use strict';

var json2xml = require('js2xmlparser');
var validator = require('validator');

// CONSTANTS
var SECURE_SCHEME       = "https";
var PLAIN_SCHEME        = "http";
var TASK_URI            = "%s://%s/ccp/task/feed/%d";
var CALL_VAR_PREFIX     = "cv_";
var ECC_VAR_PREFIX      = "user_";

var config = null;

function createVariable(name, value) {
    return { "name" : name, "value" : value};
}

function createCallVariables(variableArray) {
    var callVars = new Array();
    for (var i = 1; i <= variableArray.length; i++) {
        callVars.push(createVariable(CALL_VAR_PREFIX + i, variableArray[i-1]));
    }
    return callVars;
}

// TODO - Refactor `createCallVariables` and `createEccVariables` into a single function

function createEccVariables(variableArray) {
    var eccVars = new Array();
    for (var i = 1; i <= variableArray.length; i++) {
        eccVars.push(createVariable(ECC_VAR_PREFIX + i, variableArray[i-1]));
    }
    return eccVars;
}

function createOtherVariables(variableMap) {
    var otherVars = new Array();
    for (var [name, value] of variableMap) {
        otherVars.push(createVariable(name, value));
    }
    return otherVars;
}

function createVariables(callVariables, eccVariables, otherVariables) {
    var allVars = new Array();
    allVars = allVars.concat(createCallVariables(callVariables))
                        .concat(createEccVariables(eccVariables))
                        .concat(createOtherVariables(otherVariables));
    console.log("All Variables = " + JSON.stringify(allVars, null, 2));
    return allVars;
}

function constructTaskPayload(name, title, description, scriptSelector,
                                callVariables, eccVariables, otherVariables, requeueOnRecovery) {
    var taskJson = {};
    taskJson.name = name;
    taskJson.title = title;
    taskJson.description = description;
    taskJson.scriptSelector = scriptSelector;
    taskJson.requeueOnRecovery = requeueOnRecovery;
    taskJson.variables = {};
    taskJson.variables.variable = createVariables(callVariables, eccVariables, otherVariables);

    return json2xml.parse("Task", taskJson);
}

module.exports = {
        init : function(socialMinerHost, taskFeedID, secure=true) {
            if (!validator.isFQDN(socialMinerHost, {require_tld: false})) {
                throw new Error('Invalid input. \'' + socialMinerHost + '\' is not a valid FQDN');
            }

            if (!validator.isInt(taskFeedID.toString())) {
                throw new Error('Invalid input. \'' + taskFeedID + '\' is not a valid task feed ID');
            }

            config = new Object();
            config.socialMinerHost = socialMinerHost;
            config.taskFeedID = taskFeedID;
            config.secure = secure;
        },

        createTaskRequest : function(name, title, description, scriptSelector,
                                        callVariables, eccVariables, otherVariables,
                                        requeueOnRecovery=false) {
            if (name == undefined || title == undefined || description == undefined || scriptSelector == undefined) {
                throw new Error('One or more mandatory args are undefined or null');
            }

            // TODO - validate if callVariables, eccVariables and otherVariables is a Map

            var taskPayload = constructTaskPayload(name, title, description, scriptSelector,
                                                    callVariables, eccVariables, otherVariables, requeueOnRecovery);

            // TODO POST request to SocialMiner
        }
};
