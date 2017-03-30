'use strict';

var validator = require('validator');
var config = null;

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
        }
};
