# cce-task-routing
[![npm package](https://nodei.co/npm/cce-task-routing.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cce-task-routing/)

[![Build Status](https://travis-ci.org/umnagendra/cce-task-routing.svg?branch=master)](https://travis-ci.org/umnagendra/cce-task-routing)
[![Dependency Status](https://david-dm.org/Askrround/cce-task-routing.svg?theme=shields.io)](https://david-dm.org/Askrround/cce-task-routing)
[![license](https://img.shields.io/npm/l/cce-task-routing.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/cce-task-routing.svg)](https://img.shields.io/npm/dm/cce-task-routing.svg)

A simple library (node module) for Cisco Unified CCE Task Routing

## What is Cisco Unified CCE Task Routing?
Read more here: https://developer.cisco.com/site/task-routing/

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
* `socialMinerHost` - Fully-qualified hostname, or IP address of Cisco SocialMiner
* `taskFeedID` - The numeric ID of the feed in Cisco SocialMiner configured for pushing Tasks
* `secure` - (Optional, Default = `true`) Boolean value indicating whether the module communicates securely (over TLS)

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

// The call to create a task returns a Promise, which when resolved
// provides the Ref URL of the newly created Task (in case of success)
var createRequest = cceTaskRouter.createTaskRequest('someName', 'someTitle',
                                                    'someDescription', 'someScriptSelector',
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
* `name` - Mandatory. The name of the task
* `title` - Mandatory. The title of the task
* `description` - Mandatory. A description for the task
* `scriptSelector` - Mandatory. A valid scriptSelector, or _dialedNumber_ configured in the Unified CCE inventory
* `callVarsArray` - Optional. An ordered array of variable values which will be mapped in order (from 1 through 10)
                  with call variable names
* `eccVarsArray` - Optional. An ordered array of variable values which will be mapped in order (from 1 through 10)
                 with _user_ (ECC) variable names
* `otherVarsMap` - Optional. An ES05 Map object representing key-value pairs that will be added to the task
* `requeueOnRecovery` - Optional. Default = `false`. Determines whether this task (if, not yet routed)
                      should be re-queued into the Unified CCE queue upon recovery from a crash

### Query status of created task
Once a task has been created, the __refURL__ of the task (returned from `createTaskRequest()`) can be used to query/poll the status of the task as it flows through the Unified CCE deployment. This function also provides the _Estimated Wait Time_ (EWT) for the created task to be assigned to an agent.

```javascript
// The call to query the status of a task returns a Promise, which when resolved
// provides an object that contains the `status` and `statusReason` of the task
var queryRequest = cceTaskRouter.getTaskStatus(taskRefURL);

// define behavior on how to resolve the Promise
queryRequest.then (function(response) {
    // the `response` is an object that contains the `status` and `statusReason` of the task
    console.log('Status of Task with RefURL \'' + taskRefURL + '\' is ' + JSON.stringify(response));
}).catch (function(error) {
    console.log('Oops! Something went wrong.');
});
```
#### Parameters
* `taskRefURL` - The RefURL of the created task (returned from `createTaskRequest()`)

### Cancel task
Once a task has been created, before it is routed to an agent, it is possible to __cancel__ the task.

```javascript
// The call to cancel a task returns a Promise, however there is no data
// in the response that is useful beyond the result of the request (success/failure)
var cancelRequest = cceTaskRouter.cancelTaskRequest(taskRefURL);

// define behavior on how to resolve the Promise
cancelRequest.then (function(response) {
    // the `response` does not really contain any data. Just indicates a successful cancellation.
    console.log('Task with RefURL \'' + taskRefURL + '\' cancelled successfully.');
}).catch (function(error) {
    console.log('Oops! Something went wrong.');
});
```
#### Parameters
* `taskRefURL` - The RefURL of the created task (returned from `createTaskRequest()`)

## Licenses
__MIT License__

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

__External Licenses__

Cisco®, Cisco SocialMiner® etc. are registered trademarks of [Cisco Systems, Inc.](http://www.cisco.com/web/siteassets/legal/trademark.html)
