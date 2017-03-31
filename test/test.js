'use strict';

var expect = require('chai').expect;
var cceTaskRouter = require('../index');

describe('Boundary-value tests', function() {
    it('should throw error for invalid SocialMiner FQDN', function() {
        expect(cceTaskRouter.init.bind(cceTaskRouter, '.#$someRandomNonsense.#$', 12345)).to.throw(Error);
    });

    it('should throw error for invalid Task Feed ID', function() {
        expect(cceTaskRouter.init.bind(cceTaskRouter, 'socialminer.example.com', 12.234)).to.throw(Error);
    });
});

describe('Successful task flow tests', function() {
    it('should successfully initialize the module config', function() {
        cceTaskRouter.init('socialminer.example.com', 12345, true);
    });
});
