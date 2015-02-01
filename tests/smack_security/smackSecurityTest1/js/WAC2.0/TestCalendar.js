/*
 * Copyright (c) 2011 Samsung Electronics Co., Ltd All Rights Reserved
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
/**
 * This file contains the implementation of test calendar class.
 *
 * @author      Lukasz Marek (l.marek@samsung.com)
 * @version     0.1
 */

var TYPE_MISMATCH_ERR = 17;
var INVALID_VALUES_ERR = 22;
var NOT_FOUND_ERR = 8;

var TestCalendar = {
    calendar: null,
    event:null,
    old_event:null,
    num_events:null,
    found_events:null,
    all_events:null,
    expectedErrorCode: null,

    createTestEvent: function (response)
    {
        return TestCalendar.calendar.createEvent({description:'Test Event 1',
                summary:'Event created to test event creation',
                startTime: new Date(2009, 3, 30, 10, 0),
                duration : 60,
                location:'London',
                recurrence:0});
    },

    onSuccessNonExpected: function(response)
    {
        TestEngine.test("non expected successCallback invoked", false);
    },

    onErrorExpected: function(response)
    {
        TestEngine.test("expected errorCallback invoked", true);
        TestEngine.testPresence("error code", response.code);
        TestEngine.test("Error number", response.code == TestCalendar.expectedErrorCode);
    },

    onSuccess: function(response)
    {
        TestEngine.test("Callback success", true);
    },

    onErrorCb: function(response)
    {
        TestEngine.logErr("errorCallback invoked [" + response.code + ']');
    },

    //Cal001
    test_modulePresence: function()
    {
        TestEngine.test("Calendar manager presence", deviceapis.pim.calendar);
    },
    //Cal002
    test_calendarManagerConstants: function()
    {
        TestEngine.test("test property SIM_CALENDAR", deviceapis.pim.calendar.SIM_CALENDAR === 0);
        TestEngine.test("test property DEVICE_CALENDAR", deviceapis.pim.calendar.DEVICE_CALENDAR === 1);
        TestEngine.test("test property NO RECURRENCE", deviceapis.pim.calendar.NO_RECURRENCE === 0);
        TestEngine.test("test property DAILY RECURENCE", deviceapis.pim.calendar.DAILY_RECURRENCE === 1);
        TestEngine.test("test property WEEKLY RECURRENCE", deviceapis.pim.calendar.WEEKLY_RECURRENCE === 2);
        TestEngine.test("test property MONTHLY RECURRENCE", deviceapis.pim.calendar.MONTHLY_RECURRENCE === 3);
        TestEngine.test("test property YEARLY_RECURRENCE", deviceapis.pim.calendar.YEARLY_RECURRENCE === 4);
        TestEngine.test("test property TENTATIVE_STATUS", deviceapis.pim.calendar.TENTATIVE_STATUS === 0);
        TestEngine.test("test property CONFIRMED STATUS", deviceapis.pim.calendar.CONFIRMED_STATUS === 1);
        TestEngine.test("test property CANCELED STATUS", deviceapis.pim.calendar.CANCELLED_STATUS === 2);
        TestEngine.test("test property ALARM", deviceapis.pim.calendar.NO_ALARM === 0);
        TestEngine.test("test property SILENT_ALARM", deviceapis.pim.calendar.SILENT_ALARM === 1);
        TestEngine.test("test property SOUND_ALARM", deviceapis.pim.calendar.SOUND_ALARM === 2);
    },

    //Cal003
    test_getCalendar: function()
    {
        function onSuccessGetCalendar(response)
        {
            TestEngine.test("Found calendars", response.length > 0);
            TestCalendar.calendar=response[0];
        }
        function onErrorCb(response)
        {
            TestEngine.test("getCalendars error callback", false);
            TestEngine.log("error callback invoked with code " +response.code);
        }

        var cbObj = TestEngine.registerCallback("getCalendars",
            onSuccessGetCalendar,
            onErrorCb);
        deviceapis.pim.calendar.getCalendars(cbObj.successCallback, cbObj.errorCallback);
    },

    //Cal004
    test_getCalendarNoCallbacks: function()
    {
        testNoExceptionWithMessage("getCalendars() missing error callback",
            function()
            {
                deviceapis.pim.calendar.getCalendars(null);
            }
        );
        testNoExceptionWithMessage("getCalendars() missing error callback",
            function()
            {
                deviceapis.pim.calendar.getCalendars(undefined);
            }
        );
        testNoExceptionWithMessage("getCalendars() missing error callback",
            function()
            {
                deviceapis.pim.calendar.getCalendars(null, null);
            }
        );
        testNoExceptionWithMessage("getCalendars() missing error callback",
            function()
            {
                deviceapis.pim.calendar.getCalendars(undefined, undefined);
            }
        );
        testNoExceptionWithMessage("getCalendars() missing error callback",
            function()
            {
                deviceapis.pim.calendar.getCalendars(null, undefined);
            }
        );
        testNoExceptionWithMessage("getCalendars() missing error callback",
            function()
            {
                deviceapis.pim.calendar.getCalendars(undefined, null);
            }
        );
    },

    //Cal005
    test_getCalendarInvalidCallbacks: function()
    {
        function onError(error)
        {
            TestEngine.test("getCalendars()", (error.code == INVALID_VALUES_ERR));
        }
        function onUnexpectedCallback()
        {
            TestEngine.test("getCalendars() unexpected callback", false);
        }

        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, deviceapis.pim.calendar, "getCalendars");

        var cbObj = TestEngine.registerCallback("getCalendars", null, onError);
        deviceapis.pim.calendar.getCalendars(null, cbObj.errorCallback);

        cbObj = TestEngine.registerCallback("getCalendars", null, onError);
        deviceapis.pim.calendar.getCalendars(undefined, cbObj.errorCallback);

        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, deviceapis.pim.calendar, "getCalendars", onUnexpectedCallback, 2);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, deviceapis.pim.calendar, "getCalendars", onUnexpectedCallback, "test2");
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, deviceapis.pim.calendar, "getCalendars", 2, onUnexpectedCallback);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, deviceapis.pim.calendar, "getCalendars", "test2", onUnexpectedCallback);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, deviceapis.pim.calendar, "getCalendars", 2, null);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, deviceapis.pim.calendar, "getCalendars", "test2", undefined);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, deviceapis.pim.calendar, "getCalendars", 2);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, deviceapis.pim.calendar, "getCalendars", "test2");
    },

    //Cal006
    test_calendarMethodsPresence: function()
    {
        TestEngine.testPresence("calendar.createEvent presence", TestCalendar.calendar.createEvent);
        TestEngine.testPresence("calendar.addEvent presence", TestCalendar.calendar.addEvent);
        TestEngine.testPresence("calendar.updateEvent presence", TestCalendar.calendar.updateEvent);
        TestEngine.testPresence("calendar.deleteEvent presence", TestCalendar.calendar.deleteEvent);
        TestEngine.testPresence("calendar.findEvents presence", TestCalendar.calendar.findEvents);
    },

    //Cal007
    test_getCalendarName: function()
    {
        var cName = TestCalendar.calendar.name;
        TestEngine.test("test getName", isString(cName) && cName.length > 0);
        TestEngine.log("calendar name: " + cName);
    },

    //Cal008
    test_getCalendarType: function ()
    {
        var cType = TestCalendar.calendar.type;
        TestEngine.test("test getType", cType === deviceapis.pim.calendar.SIM_CALENDAR ||
                                        cType === deviceapis.pim.calendar.DEVICE_CALENDAR);
        TestEngine.log("calendar type: " + cType);

    },

    //Cal009
    test_createEmptyEvent: function()
    {
        var event = TestCalendar.calendar.createEvent();
        TestEngine.test("event created", isObject(event));
    },

    //Cal010
    test_eventAttributes: function()
    {
        var event = TestCalendar.calendar.createEvent();
        TestEngine.test("test attribute id", isString(event.id) || isNull(event.id) || isUndefineD(event.id));
        var oldId = event.id;
        event.id = "test" + oldId;
        TestEngine.test("attribute id is read only", event.id === oldId);
        TestEngine.test("test attribute description", isString(event.description));
        TestEngine.test("test attribute summary", isString(event.summary));
        TestEngine.test("test attribute startTime", isDate(event.startTime));
        TestEngine.test("test attribute duration", isNumber(event.duration));
        TestEngine.test("test attribute location", isString(event.location));
        TestEngine.test("test attribute categories", isObject(event.categories) && event.categories.length == 0);
        TestEngine.test("test attribute recurrence", isNumber(event.recurrence) && event.recurrence === deviceapis.pim.calendar.NO_RECURRENCE);
        TestEngine.test("test attribute expires", event.expires === null);
        TestEngine.test("test attribute interval", isNumber(event.interval));
        TestEngine.test("test attribute status", isNumber(event.status) && event.status === deviceapis.pim.calendar.CONFIRMED_STATUS);
        TestEngine.test("test attribute alarmTrigger", isNumber(event.alarmTrigger) && event.alarmTrigger === 0);
        TestEngine.test("test attribute alarmType", isNumber(event.alarmType) && event.alarmType === deviceapis.pim.calendar.NO_ALARM);
    },

    //Cal011
    test_createEvent: function()
    {
        var eventProp = {
                description: 'Event created to test event creation',
                summary: 'Test Event 1',
                startTime: new Date(2009, 3, 30, 10, 0),
                duration: 60,
                location: 'London',
                categories: ["SPRC"],
                recurrence: deviceapis.pim.calendar.DAILY_RECURRENCE,
                expires: new Date(2009, 4, 30, 10, 0),
                interval: 2,
                status: deviceapis.pim.calendar.CANCELLED_STATUS,
                alarmTrigger: -5,
                alarmType: deviceapis.pim.calendar.SILENT_ALARM
            };

        var newEvent = TestCalendar.calendar.createEvent(eventProp);

        TestEngine.test("event with param created ", newEvent);
        TestEngine.test("correct description", newEvent.description === eventProp.description);
        TestEngine.test("correct summary", newEvent.summary === eventProp.summary);
        TestEngine.test("correct startTime", newEvent.startTime.toString() === eventProp.startTime.toString());
        TestEngine.test("correct duration", newEvent.duration === eventProp.duration);
        TestEngine.test("correct location", newEvent.location === eventProp.location);
        TestEngine.test("correct categories", newEvent.categories.length === eventProp.categories.length &&
                                              newEvent.categories[0] === eventProp.categories[0]);
        TestEngine.test("correct recurrence", newEvent.recurrence === eventProp.recurrence);
        TestEngine.test("correct expires", newEvent.expires.toString() === eventProp.expires.toString());
        TestEngine.test("correct interval", newEvent.interval === eventProp.interval);
        TestEngine.test("correct status", newEvent.status === eventProp.status);
        TestEngine.test("correct alarmTrigger", newEvent.alarmTrigger === eventProp.alarmTrigger);
        TestEngine.test("correct alarmType", newEvent.alarmType === eventProp.alarmType);

    },

    //this function is called from test_addEvent1, test_addEvent2 ...
    addEvent: function(newEvent)
    {
        var event = newEvent;
        var num_events;

        function onErrorCb(response)
        {
            TestEngine.logErr("errorCallback invoked [" + response.code + ']');
            TestEngine.test("add event", false);
        }

        function onSuccessAddEventCountAfter(response)
        {
            TestEngine.log("There is " + response.length +" events");
            TestEngine.log("added event's id " + event.id);
            TestEngine.test("Number of events increased", num_events + 1 == response.length);
            var eventValidated = false;
            for (var i in response) {
                if (event.id != response[i].id) {
                    continue;
                }
                TestEngine.test("description the same", response[i].description === event.description);
                TestEngine.test("summary the same", response[i].summary === event.summary);
                TestEngine.test("startTime the same", response[i].startTime.toString() === event.startTime.toString());
                TestEngine.test("duration the same", response[i].duration === event.duration);
                TestEngine.test("location the same", response[i].location === event.location);
                TestEngine.test("categories the same", response[i].categories.length === event.categories.length);
                TestEngine.test("recurrence the same", response[i].recurrence === event.recurrence);
                TestEngine.test("expires the same", isNull(event.expires) ||
                                                    response[i].expires.toString() === event.expires.toString());
                TestEngine.test("interval the same", response[i].interval === event.interval);
                TestEngine.test("status the same", response[i].status === event.status);
                TestEngine.test("alarmTrigger the same, " + response[i].alarmTrigger, response[i].alarmTrigger === event.alarmTrigger);
                TestEngine.test("alarmType the same", response[i].alarmType === event.alarmType);
                eventValidated = true;
            }
            TestEngine.test("Event has been validated", eventValidated)
            num_events=null;
        }

        function onSuccessAddEventAdd(response)
        {
            TestEngine.log("event added");
            //count the number of events
            TestEngine.log("counting existing events");
            var objCb = TestEngine.registerCallback("onSuccessAddEventAdd",
                onSuccessAddEventCountAfter, onErrorCb);
            TestCalendar.calendar.findEvents(objCb.successCallback,
                objCb.errorCallback);
        }

        function onSuccessAddEventCountBefore(response)
        {
            TestEngine.log("events counted");
            //save current number of events
            num_events = response.length;
            TestEngine.log("There is " + num_events +" events");
            TestEngine.log("adding new event");
            //add new event
            var objCb = TestEngine.registerCallback("onSuccessAddEventCountBefore",
                onSuccessAddEventAdd, onErrorCb);
            TestCalendar.calendar.addEvent(objCb.successCallback,
                objCb.errorCallback,
                event);
        }

        //save current number of events
        TestEngine.log("counting existing events");
        var objCb = TestEngine.registerCallback("findEvents",
            onSuccessAddEventCountBefore,
            onErrorCb);
        TestCalendar.calendar.findEvents(objCb.successCallback, objCb.errorCallback);
        //rest of test in callbacks...
    },

    //Cal012
    test_addEvent1: function()
    {
        TestEngine.log("creating new event");
        var event = TestCalendar.calendar.createEvent();
        TestEngine.log("new event created");
        TestCalendar.addEvent(event);
    },

    //Cal013
    test_addEvent2: function()
    {
        TestEngine.log("creating new event");
        var event = TestCalendar.calendar.createEvent({
                description:'Event created to test event creation',
                summary:'Test Event 2',
                startTime: new Date(2010, 11, 30, 10, 0),
                duration: 15,
                location:'London',
                categories: ["SPRC"],
                recurrence: deviceapis.pim.calendar.DAILY_RECURRENCE,
                expires: null,
                interval: 1,
                status: deviceapis.pim.calendar.TENTATIVE_STATUS,
                alarmTrigger: 10,
                alarmType: deviceapis.pim.calendar.SILENT_ALARM
            });
        TestEngine.log("new event created");
        TestCalendar.addEvent(event);
    },

    //Cal014
    test_addEvent3: function()
    {
        TestEngine.log("creating new event");
        var event = TestCalendar.calendar.createEvent({
                description:'Event created to test event creation',
                summary:'Test Event 3',
                startTime: new Date(2010, 11, 30, 10, 0),
                duration: 2,
                location:'London',
                categories: ["SPRC"],
                recurrence: deviceapis.pim.calendar.WEEKLY_RECURRENCE,
                expires: new Date(2011, 11, 30, 10, 0),
                interval: 1,
                status: deviceapis.pim.calendar.CANCELLED_STATUS,
                alarmTrigger: 0,
                alarmType: deviceapis.pim.calendar.SOUND_ALARM
            });
        TestEngine.log("new event created");
        TestCalendar.addEvent(event);
    },

    //Cal015
    test_addEvent4: function()
    {
        var event = TestCalendar.calendar.createEvent({
                description:'Event created to test event creation',
                summary:'Test Event 4',
                startTime: new Date(2010, 11, 30, 10, 0),
                duration: 60,
                location:'London',
                categories: ["SPRC"],
                recurrence: deviceapis.pim.calendar.NO_RECURRENCE,
                expires: null,
                interval: 1,
                status: deviceapis.pim.calendar.CONFIRMED_STATUS,
                alarmTrigger: -15,
                alarmType: deviceapis.pim.calendar.NO_ALARM
            });
        TestCalendar.addEvent(event);
    },

    //Cal016
    test_addEvent5: function()
    {
        var event = TestCalendar.calendar.createEvent({
                description:'Event created to test event creation',
                summary:'Test Event 5',
                startTime: new Date(2010, 11, 30, 10, 0),
                duration: 60,
                location:'London',
                categories: ["SPRC"],
                recurrence: deviceapis.pim.calendar.MONTHLY_RECURRENCE,
                expires: null,
                interval: 1,
                status: deviceapis.pim.calendar.CONFIRMED_STATUS,
                alarmTrigger: -15,
                alarmType: deviceapis.pim.calendar.NO_ALARM
            });
        TestCalendar.addEvent(event);
    },

    //Cal017
    test_addEvent6: function()
    {
        var event = TestCalendar.calendar.createEvent({
                description:'Event created to test event creation',
                summary:'Test Event 6',
                startTime: new Date(2010, 11, 30, 10, 0),
                duration: 60,
                location:'London',
                categories: ["SPRC"],
                recurrence: deviceapis.pim.calendar.YEARLY_RECURRENCE,
                expires: null,
                interval: 1,
                status: deviceapis.pim.calendar.CONFIRMED_STATUS,
                alarmTrigger: -15,
                alarmType: deviceapis.pim.calendar.NO_ALARM
            });
        TestCalendar.addEvent(event);
    },

    //Cal019
    test_addEventNoParams: function()
    {
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent");
    },

    //Cal020
    test_addEventInvalidCallbacksParams: function()
    {
        function onError(error)
        {
            TestEngine.test("addEvent()", (error.code == INVALID_VALUES_ERR));
        }
        function onUnexpectedCallback()
        {
            TestEngine.test("addEvent() unexpected callback", false);
        }

        var event = TestCalendar.createTestEvent();

        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(undefined, undefined, event);
        });
        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(null, undefined, event);
        });
        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(undefined, null, event);
        });
        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(null, null, event);
        });

        var cbObj = TestEngine.registerCallback("addEvent()", null, onError);
        deviceapis.pim.calendar.getCalendars(null, cbObj.errorCallback, event);

        cbObj = TestEngine.registerCallback("addEvent()", null, onError);
        deviceapis.pim.calendar.getCalendars(undefined, cbObj.errorCallback, event);

        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(undefined, undefined, null);
        });
        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(undefined, undefined, undefined);
        });

        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(null, null, null);
        });
        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(null, null, undefined);
        });

        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(null, undefined, null);
        });
        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(null, undefined, undefined);
        });

        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(undefined, null, null);
        });
        testNoExceptionWithMessage("addEvent()", function() {
            TestCalendar.calendar.addEvent(undefined, null, undefined);
        });

        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent", 1, 1, null);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent", "test", "test", null);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent", 1, 1, undefined);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent", "test", "test", undefined);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent", 1, 1, event);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent", "test", "test", event);
    },

    //Cal021
    test_addEventWrongEventParam: function()
    {
        function onError(error)
        {
            TestEngine.test("addEvent()", (error.code == INVALID_VALUES_ERR));
        }

        function onSuccessNonExpected()
        {
            TestEngine.test("addEvent() non expected successCallback invoked", false);
        }

        function onUnexpectedCallback()
        {
            TestEngine.test("addEvent() unexpected callback", false);
        }

        var cbObj = TestEngine.registerCallback("addEvent()", onSuccessNonExpected, onError);
        TestCalendar.calendar.addEvent(cbObj.successCallback, cbObj.errorCallback, null);

        cbObj = TestEngine.registerCallback("addEvent()", onSuccessNonExpected, onError);
        TestCalendar.calendar.addEvent(cbObj.successCallback, cbObj.errorCallback, undefined);

        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent",
            onUnexpectedCallback, onUnexpectedCallback, 22);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent",
            onUnexpectedCallback, onUnexpectedCallback, "test");
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent",
            onUnexpectedCallback, onUnexpectedCallback);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "addEvent",
            onUnexpectedCallback, onUnexpectedCallback, new Date());
    },

    //Cal022
    test_findAllEvents: function()
    {
        function onSuccessFindAllEvents(response)
        {
            TestEngine.test("Find all events", response.length > 0);
        }

        function onErrorCb()
        {
            TestEngine.test("Find all events", false);
        }

        var objCb = TestEngine.registerCallback("findEvents",
            onSuccessFindAllEvents,
            onErrorCb);
        TestCalendar.calendar.findEvents(objCb.successCallback,
            objCb.errorCallback);
    },

    //function called by following tests
    test_FindEventsWithFilterSomeResults: function(filterEval)
    {
        function onSuccessFindAllEvents(response)
        {
            function onSuccessFindEventWithFilterSomeResults(response)
            {
                TestEngine.log("found events: " + response.length);
                TestEngine.test("FindEvents with filter found results", response.length > 0);
            }

            function onErrorCb()
            {
                TestEngine.test("FindEvents error callback", false);
            }

            TestEngine.test("Found any event for tests", response.length > 0);
            if (response.length > 0) {
                eval(filterEval);
                if (filter) {
                    for(var i in filter) {
                        TestEngine.log("  Filter: " + i + " : " + filter[i]);
                    }
                }
                var objCb = TestEngine.registerCallback("findEvents",
                    onSuccessFindEventWithFilterSomeResults,
                    onErrorCb);
                TestCalendar.calendar.findEvents(objCb.successCallback,
                    objCb.errorCallback,
                    filter);
            }
        }

        function onErrorCb()
        {
            TestEngine.test("Find all events", false);
        }

        var objCb = TestEngine.registerCallback("findEvents",
            onSuccessFindAllEvents,
            onErrorCb);
        TestCalendar.calendar.findEvents(objCb.successCallback,
            objCb.errorCallback);
        },

    //Cal023
    test_findEventsId: function()
    {
        TestCalendar.test_FindEventsWithFilterSomeResults(
            "var filter = {id: response[0].id}");
    },

    //Cal024
    test_findEventsSummary: function()
    {
        TestCalendar.test_FindEventsWithFilterSomeResults(
            "var filter = {summary: response[0].summary}");
    },

    //Cal025
    test_findEventsDescription: function()
    {
        TestCalendar.test_FindEventsWithFilterSomeResults(
            "var filter = {description: response[0].description}");
    },

    //Cal026
    test_findEventsLocation: function()
    {
        TestCalendar.test_FindEventsWithFilterSomeResults(
            "var filter = {location: response[0].location}");
    },

    //Cal027
    test_findEventsCategory: function()
    {
        TestCalendar.test_FindEventsWithFilterSomeResults(
            "var filter = {category: 'SPRC'}");
    },

    //Cal028
    test_findEventsStatus: function()
    {
        TestCalendar.test_FindEventsWithFilterSomeResults(
            "var filter = {status: [response[0].status]}");
    },

    //Cal029
    test_findEventsFullStartTime: function()
    {
        TestCalendar.test_FindEventsWithFilterSomeResults(
            "var filter = {initialStartDate: response[0].startTime, endStartDate: response[0].startTime}");
    },

    //Cal030
    test_findEventsInitialStartDate: function()
    {
        TestCalendar.test_FindEventsWithFilterSomeResults(
            "var filter = {initialStartDate: response[0].startTime, endStartDate: null}");
    },

    //Cal031
    test_findEventsEndStartDate: function()
    {
        TestCalendar.test_FindEventsWithFilterSomeResults(
            "var filter = {initialStartDate: null, endStartDate: response[0].startTime}");
    },

    //Cal032
    test_findEventsEmptyFilter: function()
    {
        TestCalendar.test_FindEventsWithFilterSomeResults("var filter = {}");
    },

    //function called by following tests
    test_FindEventsWithFilterNoResults: function(filter)
    {
        function onSuccessFindEventWithFilterNoResults(response)
        {
            TestEngine.test("FindEvents with filter not found results", response.length == 0);
        }

        function onErrorCb()
        {
            TestEngine.test("FindEvents error callback", false);
        }

        if(filter) {
            for(var i in filter) {
                TestEngine.log("  Filter: " + i + " : " + filter[i]);
            }
        }
        var objCb = TestEngine.registerCallback("findEvents",
            onSuccessFindEventWithFilterNoResults,
            onErrorCb);
        TestCalendar.calendar.findEvents(objCb.successCallback,
            objCb.errorCallback,
            filter);
    },

    //Cal033
    test_findEventsFullStartTimeNoResults: function()
    {
        TestCalendar.test_FindEventsWithFilterNoResults(
            {initialStartDate: new Date(1980, 11, 30, 1, 0),
             endStartDate: new Date(1980, 11, 30, 23, 0)});
    },

    //Cal034
    test_findEventsLocationNoResults: function()
    {
        TestCalendar.test_FindEventsWithFilterNoResults(
            {location:"non existing location"});
    },

    //Cal035
    test_findEventsSummaryNoResults: function()
    {
        TestCalendar.test_FindEventsWithFilterNoResults(
            {summary:'non existing summary'});
    },

    //Cal036
    test_findEventsDescriptionNoResults: function()
    {
        TestCalendar.test_FindEventsWithFilterNoResults(
            {description:'non existing description'});
    },

    //Cal037
    test_findEventsIdNoResults: function()
    {
        TestCalendar.test_FindEventsWithFilterNoResults(
            {id:"2000000"});
    },

    //Cal038
    test_findEventsCategoryNoResults: function()
    {
        TestCalendar.test_FindEventsWithFilterNoResults(
            {category:'non existing category'});
    },

    //Cal039
    test_findEventsNoParams: function()
    {
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "findEvents");
    },

    //Cal040
    test_findEventsNoCallbacksParams: function()
    {
        testNoExceptionWithMessage("findEvents() null callbacks",
            function()
            {
                TestCalendar.calendar.findEvents(null, null);
            }
        );
        testNoExceptionWithMessage("findEvents() undefined callbacks",
            function()
            {
                TestCalendar.calendar.findEvents(undefined, undefined);
            }
        );
        testNoExceptionWithMessage("findEvents() undefined success callback, null error callback",
            function()
            {
                TestCalendar.calendar.findEvents(undefined, null);
            }
        );
        testNoExceptionWithMessage("findEvents() null success callback, undefined error callback",
            function()
            {
                TestCalendar.calendar.findEvents(null, undefined);
            }
        );
        testNoExceptionWithMessage("findEvents() undefined success callback, missing error callback",
            function()
            {
                TestCalendar.calendar.findEvents(undefined);
            }
        );
        testNoExceptionWithMessage("findEvents() null success callback, missing error callback",
            function()
            {
                TestCalendar.calendar.findEvents(null);
            }
        );
        testNoExceptionWithMessage("findEvents() null callbacks, empty filter",
            function()
            {
                TestCalendar.calendar.findEvents(null, null, {});
            }
        );
        testNoExceptionWithMessage("findEvents() undefined callbacks, empty filter",
            function()
            {
                TestCalendar.calendar.findEvents(undefined, undefined, {});
            }
        );
    },

    //Cal041
    test_findEventsWrongFilterParam: function()
    {
        function onSuccess(response)
        {
            TestEngine.test("findEvents() success callback invoked", true);
        }

        function onError(response)
        {
            TestEngine.test("findEvents() error callback invoked", false);
        }

        var objCb = TestEngine.registerCallback("Find events with undefined filter param",
            onSuccess,
            onError);
        TestCalendar.calendar.findEvents(objCb.successCallback,
            objCb.errorCallback, null);

        objCb = TestEngine.registerCallback("Find events with undefined filter param",
            onSuccess,
            onError);
        TestCalendar.calendar.findEvents(objCb.successCallback,
            objCb.errorCallback, undefined);
    },

    //this function is called by following tests
    updateEvent: function(newValues)
    {
        function onErrorCb()
        {
            TestEngine.test("Find all events", false);
        }

        function onSuccessFindAllEvents(response)
        {
            TestEngine.test("Find all events", response.length > 0);
            if (response.length > 0) {
                var event = response[0];
                function onSuccessUpdateEvent1(response)
                {
                    TestEngine.log("updateEvent() success callback entered entered");

                    function onSuccessUpdateEvent2(response)
                    {
                        TestEngine.test("found updated event", response.length > 0);
                        if (response.length > 0) {
                            var f_flag = 0;
                            for (var i in response) {
                                f_flag = 1;
                                for (var j in newValues) {
                                    if (isDate(newValues[j])) {
                                        if (response[i][j].toString() != newValues[j].toString()) {
                                            f_flag = 0;
                                            break;
                                        }
                                    }
                                    else if (isArray(newValues[j]))
                                    {
                                        if (response[i][j].length != newValues[j].length ||
                                            response[i][j][0] != newValues[j][0]) {
                                            f_flag = 0;
                                            break;
                                        }
                                    }
                                    else {
                                        if (response[i][j] !== newValues[j]) {
                                            if (j == "expires" && newValues[j] == null) {
                                                //expires date with null should not be checked
                                                TestEngine.log("dupa " + j);
                                                continue;
                                            }
                                            f_flag = 0;
                                            break;
                                        }
                                    }
                                }
                                if (f_flag == 1) {
                                    break;
                                }
                            }
                            TestEngine.test("Updated event validated successfully", f_flag == 1);
                        }
                        else {
                            TestEngine.test("Updated events found", false);
                        }
                    }

                    //find updated event
                    var objCb = TestEngine.registerCallback("findEvents",
                        onSuccessUpdateEvent2,
                        onErrorCb);
                    TestCalendar.calendar.findEvents(objCb.successCallback,
                        objCb.errorCallback, {id: event.id});
                }
                for (var i in newValues) {
                    TestEngine.log("update property: " + i + ", new value: " + newValues[i]);
                    event[i] = newValues[i];
                }
                var objCb = TestEngine.registerCallback("updateEvent",
                    onSuccessUpdateEvent1,
                    onErrorCb);
                TestCalendar.calendar.updateEvent(objCb.successCallback,
                    objCb.errorCallback,
                    event);
            }
        }

        var objCb = TestEngine.registerCallback("findEvents",
            onSuccessFindAllEvents,
            onErrorCb);
        TestCalendar.calendar.findEvents(objCb.successCallback,
            objCb.errorCallback);
    },

    //Cal042
    test_updateEvent1: function()
    {
        var newValues = {
                description:'updated description 1',
                summary:'Updated Test Event 1',
                startTime: new Date(2011, 01, 01, 01, 01),
                duration: 11,
                location:'London 1',
                categories: ["SPRC 1"],
                recurrence: deviceapis.pim.calendar.NO_RECURRENCE,
                expires: null,
                interval: 1,
                status: deviceapis.pim.calendar.TENTATIVE_STATUS,
                alarmTrigger: 1,
                alarmType: deviceapis.pim.calendar.NO_ALARM
            };
        TestCalendar.updateEvent(newValues)
    },

    //Cal043
    test_updateEvent2: function()
    {
        var newValues = {
                description:'updated description 2',
                summary:'Updated Test Event 2',
                startTime: new Date(2012, 02, 02, 02, 02),
                duration: 22,
                location:'London 2',
                categories: ["SPRC 2"],
                recurrence: deviceapis.pim.calendar.DAILY_RECURRENCE,
                expires: null,
                interval: 2,
                status: deviceapis.pim.calendar.CONFIRMED_STATUS,
                alarmTrigger: 2,
                alarmType: deviceapis.pim.calendar.SILENT_ALARM
            };
        TestCalendar.updateEvent(newValues)
    },

    //Cal044
    test_updateEvent3: function()
    {
        var newValues = {
                description:'updated description 3',
                summary:'Updated Test Event 3',
                startTime: new Date(2013, 03, 03, 03, 03),
                duration: 33,
                location:'London 3',
                categories: [],
                recurrence: deviceapis.pim.calendar.WEEKLY_RECURRENCE,
                expires: null,
                interval: 3,
                status: deviceapis.pim.calendar.CANCELLED_STATUS,
                alarmTrigger: 3,
                alarmType: deviceapis.pim.calendar.SOUND_ALARM
            };
        TestCalendar.updateEvent(newValues)
    },

    //Cal045
    test_updateEvent4: function()
    {
        var newValues = {
                description:'updated description 4',
                summary:'Updated Test Event 4',
                startTime: new Date(2014, 04, 04, 04, 04),
                duration: 44,
                location:'London 4',
                categories: ["SPRC 4"],
                recurrence: deviceapis.pim.calendar.MONTHLY_RECURRENCE,
                expires: new Date(2015, 03, 03, 03, 03),
                interval: 4,
                status: deviceapis.pim.calendar.CANCELLED_STATUS,
                alarmTrigger: 4,
                alarmType: deviceapis.pim.calendar.SOUND_ALARM
            };
        TestCalendar.updateEvent(newValues)
    },

    //Cal046
    test_updateEvent5: function()
    {
        var newValues = {
                description:'updated description 5',
                summary:'Updated Test Event 5',
                startTime: new Date(2015, 05, 05, 05, 05),
                duration: 55,
                location:'London 5',
                categories: ["SPRC 5"],
                recurrence: deviceapis.pim.calendar.YEARLY_RECURRENCE,
                expires: new Date(2016, 03, 03, 03, 03),
                interval: 5,
                status: deviceapis.pim.calendar.CANCELLED_STATUS,
                alarmTrigger: -5,
                alarmType: deviceapis.pim.calendar.SOUND_ALARM
            };
        TestCalendar.updateEvent(newValues)
    },

    //Cal047
    test_updateEventNoParams: function()
    {
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "updateEvent");
    },

    //Cal048
    test_updateEventNullCallbacksParams: function()
    {
        var event = TestCalendar.createTestEvent();
        testNoExceptionWithMessage("updateEvent() null callbacks",
            function()
            {
                TestCalendar.calendar.updateEvent(null, null, event);
            }
        );
        testNoExceptionWithMessage("updateEvent() undefined callbacks",
            function()
            {
                TestCalendar.calendar.updateEvent(undefined, undefined, event);
            }
        );
        testNoExceptionWithMessage("updateEvent() undefined success callback, null error callback",
            function()
            {
                TestCalendar.calendar.updateEvent(undefined, null, event);
            }
        );
        testNoExceptionWithMessage("updateEvent() null success callback, undefined error callback",
            function()
            {
                TestCalendar.calendar.updateEvent(null, undefined, event);
            }
        );
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "updateEvent", 1, undefined, event);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "updateEvent", "test", undefined, event);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "updateEvent", undefined, 1, event);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "updateEvent", undefined, "test", event);
    },

    //Cal049
    test_updateEventWrongEventParam: function()
    {
        function onUnexpectedCallback()
        {
            TestEngine.test("updateEvent() unexpected callback", false);
        }
        function onSuccess()
        {
            TestEngine.test("updateEvent() unexpected success callback invoked", false);
        }

        function onError(response)
        {
            TestEngine.test("updateEvent() error callback invoked", response.code == INVALID_VALUES_ERR);
        }

        var objCb = TestEngine.registerCallback("Update event with undefined filter param",
            onSuccess,
            onError);
        TestCalendar.calendar.updateEvent(objCb.successCallback,
            objCb.errorCallback, null);

        objCb = TestEngine.registerCallback("Update event with undefined filter param",
            onSuccess,
            onError);
        TestCalendar.calendar.updateEvent(objCb.successCallback,
            objCb.errorCallback, undefined);

        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "updateEvent",
            onUnexpectedCallback, onUnexpectedCallback, 22);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "updateEvent",
            onUnexpectedCallback, onUnexpectedCallback, "test");
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "updateEvent",
            onUnexpectedCallback, onUnexpectedCallback);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "updateEvent",
            onUnexpectedCallback, onUnexpectedCallback, new Date());
    },

    //Cal050
    test_deleteEvent: function()
    {
        var foundEventsFlag = 0;

        function onError()
        {
            TestEngine.test("deleteEvent() error callback invoked", false);
        }

        function onSuccessDeleteEvent()
        {
            TestEngine.test("deleteEvent() success callback invoked", true);
            findEvents();
        }

        function onSuccessFindEvents(response)
        {
            TestEngine.log("deleteEvent() callback entered");
            if (foundEventsFlag == 0) {
                //this validation is only for the first call
                TestEngine.test("Events for delete found", response.length > 0);
            }
            foundEventsFlag = 1;
            if (response.length > 0) {
                var objCb = TestEngine.registerCallback("deleteEvents",
                    onSuccessDeleteEvent,
                    onError);
                TestCalendar.calendar.deleteEvent(objCb.successCallback,
                    objCb.errorCallback, response[0].id);
            }
            else {
                TestEngine.test("All events deleted", true);
            }
        }

        function findEvents()
        {
            //find all events
            var objCb = TestEngine.registerCallback("deleteEvent",
                onSuccessFindEvents,
                onError);
            TestCalendar.calendar.findEvents(objCb.successCallback,
                objCb.errorCallback);
        }
        //recursively delete all events
        findEvents();
    },

    //Cal051
    test_deleteEventNoParams: function()
    {
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "deleteEvent");
    },

    //Cal052
    test_deleteEventNullCallbacksParams: function()
    {
        testNoExceptionWithMessage("deleteEvent() null callbacks",
            function()
            {
                TestCalendar.calendar.deleteEvent(null, null, "1");
            }
        );
        testNoExceptionWithMessage("deleteEvent() undefined callbacks",
            function()
            {
                TestCalendar.calendar.deleteEvent(undefined, undefined, event);
            }
        );
        testNoExceptionWithMessage("deleteEvent() undefined success callback, null error callback",
            function()
            {
                TestCalendar.calendar.deleteEvent(undefined, null, event);
            }
        );
        testNoExceptionWithMessage("deleteEvent() null success callback, undefined error callback",
            function()
            {
                TestCalendar.calendar.deleteEvent(null, undefined, event);
            }
        );
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "deleteEvent", 1, undefined, "1");
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "deleteEvent", "test", undefined, "1");
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "deleteEvent", undefined, 1, "1");
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "deleteEvent", undefined, "test", "1");
    },

    //Cal053
    test_deleteEventWrongEventParam: function()
    {
        function onUnexpectedCallback()
        {
            TestEngine.test("deleteEvent() unexpected callback", false);
        }
        function onSuccess()
        {
            TestEngine.test("deleteEvent() unexpected success callback invoked", false);
        }

        function onError(response)
        {
            TestEngine.test("deleteEvent() error callback invoked", response.code == NOT_FOUND_ERR);
        }

        var objCb = TestEngine.registerCallback("Delete event with null filter param",
            onSuccess,
            onError);
        TestCalendar.calendar.deleteEvent(objCb.successCallback,
            objCb.errorCallback, null);

        objCb = TestEngine.registerCallback("Delete event with undefined filter param",
            onSuccess,
            onError);
        TestCalendar.calendar.deleteEvent(objCb.successCallback,
            objCb.errorCallback, undefined);

        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "deleteEvent",
                onUnexpectedCallback, onUnexpectedCallback, 22);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "deleteEvent",
                onUnexpectedCallback, onUnexpectedCallback);
        TestEngine.catchErrorType("code", TYPE_MISMATCH_ERR, TestCalendar.calendar, "deleteEvent",
                onUnexpectedCallback, onUnexpectedCallback, new Date());
    },

    test_concatCategoryArray: function()
    {
        var category1 = "SPRC category";
        var category2 = "test";
        var category3 = "test2";
        var category4 = "test aaa";
        var event = TestCalendar.createTestEvent();
        TestEngine.test("category array is empty", event.categories.length === 0);
        event.categories[0] = category1;
        TestEngine.test("category array has one element", event.categories.length === 1);
        TestEngine.test("category array has proper value", event.categories[0] === category1);
        var concatArray = event.categories.concat([category2, category3]);
        TestEngine.test("concatenated category array has three elements", concatArray.length === 3);
        TestEngine.test("concatenated category array has proper value [0]", concatArray[0] === category1);
        TestEngine.test("concatenated category array has proper value [1]", concatArray[1] === category2);
        TestEngine.test("concatenated category array has proper value [2]", concatArray[2] === category3);
        concatArray = event.categories.concat([category2, category3], [category4]);
        TestEngine.test("concatenated category array has four elements", concatArray.length === 4);
        TestEngine.test("concatenated category array has proper value [0]", concatArray[0] === category1);
        TestEngine.test("concatenated category array has proper value [1]", concatArray[1] === category2);
        TestEngine.test("concatenated category array has proper value [2]", concatArray[2] === category3);
        TestEngine.test("concatenated category array has proper value [3]", concatArray[3] === category4);
        TestEngine.test("category array still has one element", event.categories.length === 1);
    },

    test_joinCategoryArray: function()
    {
        var category1 = "category0";
        var category2 = "category1";
        var category3 = "category2";
        var event = TestCalendar.createTestEvent();
        TestEngine.test("category array is empty", event.categories.length === 0);
        event.categories[0] = category1;
        event.categories[1] = category2;
        event.categories[2] = category3;
        TestEngine.test("category array has three elements", event.categories.length === 3);
        TestEngine.test("joining with default separator", event.categories.join()  === category1 + "," + category2 + "," + category3);
        TestEngine.test("joining with space separator", event.categories.join(" ") === category1 + " " + category2 + " " + category3);
        TestEngine.test("joining with longer string separator", event.categories.join(" how about ") === category1 + " how about " + category2 + " how about " + category3);
        TestEngine.test("category array still has three elements", event.categories.length === 3);
    },

    test_popCategoryArray: function()
    {
        var category1 = "category0";
        var category2 = "category1";
        var category3 = "category2";
        var event = TestCalendar.createTestEvent();
        TestEngine.test("category array is empty", event.categories.length === 0);
        event.categories[0] = category1;
        event.categories[1] = category2;
        event.categories[2] = category3;
        TestEngine.test("category array has three elements", event.categories.length === 3);
        TestEngine.test("poped element has correct value", event.categories.pop() === category3);
        TestEngine.test("category array has three elements", event.categories.length === 2);
        TestEngine.test("poped element has correct value", event.categories.pop() === category2);
        TestEngine.test("category array has three elements", event.categories.length === 1);
        TestEngine.test("poped element has correct value", event.categories.pop() === category1);
        TestEngine.test("category array has three elements", event.categories.length === 0);
        TestEngine.test("poped element has correct value", event.categories.pop() === undefined);
        TestEngine.test("poped element has correct value", event.categories.pop() === undefined);
    },

    test_pushCategoryArray: function()
    {
        var category1 = "category0";
        var category2 = "category1";
        var category3 = "category2";
        var event = TestCalendar.createTestEvent();
        TestEngine.test("category array is empty", event.categories.length === 0);
        event.categories.push(category1);
        event.categories.push(category2);
        event.categories.push(category3);
        TestEngine.test("category array has three elements", event.categories.length === 3);
        TestEngine.test("array element [0] has correct value", event.categories[0] === category1);
        TestEngine.test("array element [1] has correct value", event.categories[1] === category2);
        TestEngine.test("array element [2] has correct value", event.categories[2] === category3);
    },

    test_reverseCategoryArray: function()
    {
        var category1 = "category0";
        var category2 = "category1";
        var category3 = "category2";
        var category4 = "category3";
        var event = TestCalendar.createTestEvent();
        TestEngine.test("category array is empty", event.categories.length === 0);
        event.categories.push(category1);
        event.categories.push(category2);
        event.categories.push(category3);
        event.categories.push(category4);
        event.categories.reverse();
        TestEngine.test("category array has four elements", event.categories.length === 4);
        TestEngine.test("array element [0] has correct value", event.categories[0] === category4);
        TestEngine.test("array element [1] has correct value", event.categories[1] === category3);
        TestEngine.test("array element [2] has correct value", event.categories[2] === category2);
        TestEngine.test("array element [3] has correct value", event.categories[3] === category1);
    },

    test_shiftCategoryArray: function()
    {
        var category1 = "category0";
        var category2 = "category1";
        var category3 = "category2";
        var event = TestCalendar.createTestEvent();
        TestEngine.test("category array is empty", event.categories.length === 0);
        event.categories[0] = category1;
        event.categories[1] = category2;
        event.categories[2] = category3;
        TestEngine.test("category array has three elements", event.categories.length === 3);
        TestEngine.test("shifted element has correct value", event.categories.shift() === category1);
        TestEngine.test("category array has three elements", event.categories.length === 2);
        TestEngine.test("shifted element has correct value", event.categories.shift() === category2);
        TestEngine.test("category array has three elements", event.categories.length === 1);
        TestEngine.test("shifted element has correct value", event.categories.shift() === category3);
        TestEngine.test("category array has three elements", event.categories.length === 0);
        TestEngine.test("shifted element has correct value", event.categories.shift() === undefined);
        TestEngine.test("shifted element has correct value", event.categories.shift() === undefined);
    },

    test_sliceCategoryArray: function()
    {
        var category1 = "category0";
        var category2 = "category1";
        var category3 = "category2";
        var event = TestCalendar.createTestEvent();
        TestEngine.test("category array is empty", event.categories.length === 0);
        event.categories[0] = category1;
        event.categories[1] = category2;
        event.categories[2] = category3;
        TestEngine.test("category array has three elements", event.categories.length === 3);
        var slice = event.categories.slice(0, 2);
        TestEngine.test("slice array has correct number of elements", slice.length === 3);
        slice = event.categories.slice(0, 1);
        TestEngine.test("slice array has correct number of elements", slice.length === 2);
        slice = event.categories.slice(0, 0);
        TestEngine.test("slice array has correct number of elements", slice.length === 1);
        slice = event.categories.slice(0);
        TestEngine.test("slice array has correct number of elements", slice.length === 3);
        slice = event.categories.slice(1);
        TestEngine.test("slice array has correct number of elements", slice.length === 2);
        slice = event.categories.slice(2);
        TestEngine.test("slice array has correct number of elements", slice.length === 1);
        slice = event.categories.slice(3);
        TestEngine.test("slice array has correct number of elements", slice.length === 0);
    },

    test_sortCategoryArray: function()
    {
        var category1 = "category0";
        var category2 = "category1";
        var category3 = "category2";
        var event = TestCalendar.createTestEvent();
        TestEngine.test("category array is empty", event.categories.length === 0);
        event.categories[0] = category3;
        event.categories[1] = category2;
        event.categories[2] = category1;
        TestEngine.test("category array has three elements", event.categories.length === 3);
        event.categories.sort();
        TestEngine.test("category array has three elements", event.categories.length === 3);
        TestEngine.test("array element [0] has correct value", event.categories[0] === category1);
        TestEngine.test("array element [1] has correct value", event.categories[1] === category2);
        TestEngine.test("array element [2] has correct value", event.categories[2] === category3);
    },

    test_toStringCategoryArray: function()
    {
        var category1 = "category0";
        var category2 = "category1";
        var category3 = "category2";
        var event = TestCalendar.createTestEvent();
        TestEngine.test("category array is empty", event.categories.length === 0);
        event.categories[0] = category1;
        event.categories[1] = category2;
        event.categories[2] = category3;
        TestEngine.test("category array has three elements", event.categories.length === 3);
        TestEngine.test("toString return correct value", event.categories.join() === category1 + "," + category2 + "," + category3);
    }
};
//=============================================================================
TestEngine.setTestSuiteName("[WAC2.0][Calendar]");
////Cal001
//TestEngine.addTest(true,TestCalendar.test_modulePresence, "[WAC2.0][Calendar] Test calendar module presence");
////Cal002
//TestEngine.addTest(true,TestCalendar.test_calendarManagerConstants, "[WAC2.0][Calendar] Calendar manager constants");
////Cal003
TestEngine.addTest(true,TestCalendar.test_getCalendar, "[WAC2.0][Calendar] Get calendar");
////Cal004
//TestEngine.addTest(true,TestCalendar.test_getCalendarNoCallbacks, "[WAC2.0][Calendar] Get calendar with no callbacks");
////Cal005
//TestEngine.addTest(true,TestCalendar.test_getCalendarInvalidCallbacks, "[WAC2.0][Calendar] Get calendar with invalid callbacks");
////Cal006
//TestEngine.addTest(true,TestCalendar.test_calendarMethodsPresence, "[WAC2.0][Calendar] Calendar methods presence");
////Cal007
//TestEngine.addTest(true,TestCalendar.test_getCalendarName, "[WAC2.0][Calendar] Get calendar name");
////Cal008
//TestEngine.addTest(true,TestCalendar.test_getCalendarType, "[WAC2.0][Calendar] Get calendar type");
////Cal009
//TestEngine.addTest(true,TestCalendar.test_createEmptyEvent, "[WAC2.0][Calendar] Create empty event");
////Cal010
//TestEngine.addTest(true,TestCalendar.test_eventAttributes, "[WAC2.0][Calendar] event attributes");
////Cal011
//TestEngine.addTest(true,TestCalendar.test_createEvent, "[WAC2.0][Calendar] Create event");
//
////Cal012
//TestEngine.addTest(true,TestCalendar.test_addEvent1, "[WAC2.0][Calendar] Add event 1");
////Cal013
//TestEngine.addTest(true,TestCalendar.test_addEvent2, "[WAC2.0][Calendar] Add event 2");
////Cal014
//TestEngine.addTest(true,TestCalendar.test_addEvent3, "[WAC2.0][Calendar] Add event 3");
////Cal015
//TestEngine.addTest(true,TestCalendar.test_addEvent4, "[WAC2.0][Calendar] Add event 4");
////Cal016
//TestEngine.addTest(true,TestCalendar.test_addEvent5, "[WAC2.0][Calendar] Add event 5");
////Cal017
//TestEngine.addTest(true,TestCalendar.test_addEvent6, "[WAC2.0][Calendar] Add event 6");
////Cal019
//TestEngine.addTest(true,TestCalendar.test_addEventNoParams, "[WAC2.0][Calendar] Add event with no params");
////Cal020
//TestEngine.addTest(true,TestCalendar.test_addEventInvalidCallbacksParams, "[WAC2.0][Calendar] Add event with wrong callbacks");
////Cal021
//TestEngine.addTest(true,TestCalendar.test_addEventWrongEventParam, "[WAC2.0][Calendar] Add event with wrong event param");
//
////Cal022
//TestEngine.addTest(true,TestCalendar.test_findAllEvents, "[WAC2.0][Calendar] Find all events");
////Cal023
//TestEngine.addTest(true,TestCalendar.test_findEventsId, "[WAC2.0][Calendar] Find events, filter: id");
////Cal024
//TestEngine.addTest(true,TestCalendar.test_findEventsSummary, "[WAC2.0][Calendar] Find events, filter: summary");
////Cal025
//TestEngine.addTest(true,TestCalendar.test_findEventsDescription, "[WAC2.0][Calendar] Find events, filter: description");
////Cal026
//TestEngine.addTest(true,TestCalendar.test_findEventsLocation, "[WAC2.0][Calendar] Find events, filter: location");
////Cal027
//TestEngine.addTest(true,TestCalendar.test_findEventsCategory, "[WAC2.0][Calendar] Find events, filter: category");
////Cal028
//TestEngine.addTest(true,TestCalendar.test_findEventsStatus, "[WAC2.0][Calendar] Find events, filter: status");
////Cal029
//TestEngine.addTest(true,TestCalendar.test_findEventsFullStartTime, "[WAC2.0][Calendar] Find events, filter: initialStartDate and endStartDate");
////Cal030
//TestEngine.addTest(true,TestCalendar.test_findEventsInitialStartDate, "[WAC2.0][Calendar] Find events, filter: initialStartDate");
////Cal031
//TestEngine.addTest(true,TestCalendar.test_findEventsEndStartDate, "[WAC2.0][Calendar] Find events, filter: endStartDate");
////Cal032
//TestEngine.addTest(true,TestCalendar.test_findEventsEmptyFilter, "[WAC2.0][Calendar] Find events, filter: empty filter");
////Cal033
//TestEngine.addTest(true,TestCalendar.test_findEventsFullStartTimeNoResults, "[WAC2.0][Calendar] Find events, no results, filter: initialStartDate and endStartDate");
////Cal034
//TestEngine.addTest(true,TestCalendar.test_findEventsLocationNoResults, "[WAC2.0][Calendar] Find events, no results, filter: location");
////Cal035
//TestEngine.addTest(true,TestCalendar.test_findEventsSummaryNoResults, "[WAC2.0][Calendar] Find events, no results, filter: summary");
////Cal036
//TestEngine.addTest(true,TestCalendar.test_findEventsDescriptionNoResults, "[WAC2.0][Calendar] Find events, no results, filter: description");
////Cal037
//TestEngine.addTest(true,TestCalendar.test_findEventsIdNoResults, "[WAC2.0][Calendar] Find events, no results, filter: id");
////Cal038
//TestEngine.addTest(true,TestCalendar.test_findEventsCategoryNoResults, "[WAC2.0][Calendar] Find events, no results, filter: category");
////Cal039
//TestEngine.addTest(true,TestCalendar.test_findEventsNoParams, "[WAC2.0][Calendar] Find events with no params");
////Cal040
//TestEngine.addTest(true,TestCalendar.test_findEventsNoCallbacksParams, "[WAC2.0][Calendar] Find events with no callbacks");
////Cal041
//TestEngine.addTest(true,TestCalendar.test_findEventsWrongFilterParam, "[WAC2.0][Calendar] Find events with wrong filter param");
//
////Cal042
//TestEngine.addTest(true,TestCalendar.test_updateEvent1, "[WAC2.0][Calendar] Update event 1");
////Cal043
//TestEngine.addTest(true,TestCalendar.test_updateEvent2, "[WAC2.0][Calendar] Update event 2");
////Cal044
//TestEngine.addTest(true,TestCalendar.test_updateEvent3, "[WAC2.0][Calendar] Update event 3");
////Cal045
//TestEngine.addTest(true,TestCalendar.test_updateEvent4, "[WAC2.0][Calendar] Update event 4");
////Cal046
//TestEngine.addTest(true,TestCalendar.test_updateEvent5, "[WAC2.0][Calendar] Update event 5");
////Cal047
//TestEngine.addTest(true,TestCalendar.test_updateEventNoParams, "[WAC2.0][Calendar] Update event with no params");
////Cal048
//TestEngine.addTest(true,TestCalendar.test_updateEventNullCallbacksParams, "[WAC2.0][Calendar] Update event with wrong callbacks");
////Cal049
//TestEngine.addTest(true,TestCalendar.test_updateEventWrongEventParam, "[WAC2.0][Calendar] Update event with wrong event param");
//
////Cal050
//TestEngine.addTest(true,TestCalendar.test_deleteEvent, "[WAC2.0][Calendar] Delete event");
////Cal051
//TestEngine.addTest(true,TestCalendar.test_deleteEventNoParams, "[WAC2.0][Calendar] Delete event with no params");
////Cal052
//TestEngine.addTest(true,TestCalendar.test_deleteEventNullCallbacksParams, "[WAC2.0][Calendar] Delete event with wrong callbacks");
////Cal053
//TestEngine.addTest(true,TestCalendar.test_deleteEventWrongEventParam, "[WAC2.0][Calendar] Delete event with wrong event param");
//
////Cal050
//TestEngine.addTest(true,TestCalendar.test_concatCategoryArray, "[WAC2.0][Calendar] Concat category array");
////Cal051
//TestEngine.addTest(true,TestCalendar.test_joinCategoryArray, "[WAC2.0][Calendar] Join category array");
////Cal052
//TestEngine.addTest(true,TestCalendar.test_popCategoryArray, "[WAC2.0][Calendar] Pop category array");
////Cal053
//TestEngine.addTest(true,TestCalendar.test_pushCategoryArray, "[WAC2.0][Calendar] Push category array");
////Cal054
//TestEngine.addTest(true,TestCalendar.test_reverseCategoryArray, "[WAC2.0][Calendar] Reverse category array");
////Cal055
//TestEngine.addTest(true,TestCalendar.test_shiftCategoryArray, "[WAC2.0][Calendar] Shift category array");
////Cal056
//TestEngine.addTest(true,TestCalendar.test_sliceCategoryArray, "[WAC2.0][Calendar] Slice category array");
////Cal057
//TestEngine.addTest(true,TestCalendar.test_sortCategoryArray, "[WAC2.0][Calendar] Sort category array");
////Cal058
//TestEngine.addTest(true,TestCalendar.test_toStringCategoryArray, "[WAC2.0][Calendar] toString category array");

//=============================================================================

function testNoExceptionWithMessage(message, fun) {
    var testResult = true;
    try
    {
        fun();
    }
    catch (e)
    {
        testResult = false;
    }
    TestEngine.test(message, testResult);
}
