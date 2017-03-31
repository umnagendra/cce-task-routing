# cce-task-routing
A small library (node module) for Cisco Unified CCE Task Routing

## System Requirements
* nodejs >= 6.0.0

## Installation
`npm install cce-task-routing`

## Usage

### Initialize the module
Provide details of your Unified CCE deployment, specifically:

```javascript
var taskRouter = require('cce-task-routing')

taskRouter.init('socialminer.example.com', 100001, true);
```
#### Parameters
`socialMinerHost` - Fully-qualified hostname, or IP address of Cisco SocialMiner

`taskFeedID` - The numeric ID of the feed in Cisco SocialMiner configured for pushing Tasks

`secure` - (Optional, Default = `true`) Boolean value indicating whether the module communicates securely (over TLS)

### Create a task request
Every task contains a `name`, a `title`, a `description` and identifies a `scriptSelector` which basically maps to the right Media Routing Domain (MRD) in Unified CCE so that the task can be placed in the right queue, and the right agent from the right skill group can be assigned to work on it.

Also, there is a large variable space of 10 __Call Variables__ and 10 __ECC Variables__ which can be populated in the task which could describe routing attributes, media properties etc.

```javascript
// create an ordered array of call variables
var callVarsArray = ["callVar_value_1", "callVar_value_2", "callVar_value_3",
                     "callVar_value_4", "callVar_value_5", "callVar_value_6"];

// create an ordered array of ECC variables
var eccVarsArray = ["eccVar_value_1", "eccVar_value_2", "eccVar_value_3",
                    "eccVar_value_4", "eccVar_value_5", "eccVar_value_6"];

// for `other` variables, create a javascript Map (ES05 spec.)
var otherVarsMap = new Map();
otherVarsMap.set("podRefURL", "https://cs.com/context/pod/v1/podId/b066c3c0-c346-11e5-b3dd-3f1450b33459");
otherVarsMap.set("Social_Security_No", "876587357461");

// The call to create a task returns a Promise, which when resolved provides the Ref URL of the newly created Task (in case of success)
var createRequest = cceTaskRouter.createTaskRequest('someName', 'someTitle', 'someDescription', 'someScriptSelector',
                                  callVarsArray, eccVarsArray, otherVarsMap, true);

// define behavior on how to resolve the Promise
createRequest.then (function(response) {
    // the `response` is a String that contains the refURL of the newly created task.
    console.log('Task created successfully. RefURL of created task = ' + response);
    // Preserve this and use it for all further operations on the same task.
}).catch (function(error) {
    console.log('Oops! Something went wrong.');
});
```
#### Parameters
