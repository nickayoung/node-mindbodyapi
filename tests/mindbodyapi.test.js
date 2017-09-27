'use strict';

let MB = require('../lib/mindbodyapi');

let user = process.env.mbuser;
let pass = process.env.mbpass;
let siteid = process.env.mbsiteid;

let key = {
  user: process.env.mbapibasicuser,
  pass: process.env.mbapibasicpass
}

describe("mindbodyapi", () => {
  let mb;
  beforeEach(() => {
    mb = new MB(user, pass, key);
  });

  describe('basic tests', () => {

    test('login', () => {
      return mb.ready
        .then(() => {
          expect(mb.token).not.toBeUndefined();
        });
    });

    test('get user', () => {
      return mb.get('rest/user')
        .then(res => {
          expect(res.Id).toBeDefined();
        });
    });

    test('get class', () => {
      let startRange = new Date();
      let endRange = new Date();
      endRange.setDate(startRange.getDate() + 1);

      return mb.get('rest/class', {
          startRange: startRange.toLocaleDateString(),
          endRange: endRange.toLocaleDateString(),
          count: 1000
        }, {
          siteID: siteid
        })
        .then(res => {
          expect(res[0].Name).toBeDefined();
        });
    })

  });

  describe('logging', () => {
    let origCLog, origCError;
    let myCLog, myCError;

    beforeEach(() => {
      origCLog = console.log;
      origCError = console.error;

      myCLog = jest.fn();
      myCError = jest.fn();

      console.log = myCLog;
      console.error = myCError;
    });

    test('log to console', () => {
      mb = new MB(user, pass, key, {
        logRequests: true
      });

      return mb.get('rest/user')
        .then(res => {
          expect(myCLog.mock.calls.length).toBe(1);
        });
    });

    test('log to custom', () => {
      let logger = {
        one: jest.fn(),
        two: jest.fn()
      };

      mb = new MB(user, pass, key, {
        logRequests: true,
        logFn: logger.one.bind(logger),
        errorFn: logger.two.bind(logger)
      });

      return mb.get('rest/user')
        .then(res => {
          expect(myCLog.mock.calls.length).toBe(0);
          expect(logger.one.mock.calls.length).toBe(1);
        });
    });

    afterEach(() => {
      console.log = origCLog;
      console.error = origCError;
    });
  });
});