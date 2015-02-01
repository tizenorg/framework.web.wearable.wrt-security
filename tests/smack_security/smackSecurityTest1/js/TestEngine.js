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
 * This file contains the implementation of test engine class.
 *
 * @author      Wojciech Bielawski(w.bielawski@samsung.com)
 * @author      Pawel Misiak (p.misiak@samsung.com)
 * @version     0.1
 */

var TestEngine = {
    logText: "",
    testCaseTimeout: 5 * 1000, //in miliseconds
    currentCaseTimeout: 5 * 1000,
    timer: null,
    countOK: 0,
    countErr: 0,
    countException: 0,
    countIgnored: 0,
    currentFailings: [],
    currentTestSuiteName: null,
    callbackMutex: 0,
    callbackMethodName: "",
    currentTestCase: 0,
    countAllPassed: 0,
    countAllFailed: 0,
    testCasesFailedCount: 0,
    testCasesPassedCount: 0,
    testCasesFailed: [],
    testList: [],
    finalLog: "\n",
    testSuccessCallback: null,
    testErrorCallback: null,
    testSuiteName: null,
    testSuiteStats: [],
    resultLogger: new HTMLTestResultLogger('log'),
    summaryRenderer: new HTMLTestSummaryRenderer('summary'),
    finalCallback: null,

    stepsArray: null,
    stepTimeout: null,
    currentStep: null,
    errorType: null,
    errorField: null,

    /*
     * Values used only as types representations.
     */
    STRING: '',
    NUMBER: 0,
    OBJECT: {},
    ARRAY: [],
    DATE: new Date(),
    BOOL: false,
    FUNCTION: function() {},

    /*
     * Error test possible results.
     */
    ERROR_TEST_RESULT: {
      NOT_RUN: -4,
      NOT_THROWN: -3,
      BAD_TYPE: -2,
      BAD_VALUE: -1,
      OK: 0
    },

    /**
     * Prints specified object in a TreeView like structure.
     * @param obj Object to print.
     * @param indent Must be undefined (don't pass anything).
     */
    dumpObject: function(obj, indent) {
        if (indent === undefined) indent = '';
        else indent += '   ';
        var prefix = (indent.length == 0 ? indent : indent + '|--');
        for (var i in obj) {
            if (typeof(obj[i]) == "object") {
                TestEngine.log(prefix + i + ":");
                TestEngine.dumpObject(obj[i], indent);
            }
            else
                TestEngine.log(prefix + i + ": " + obj[i]);
        }
    },

    addTest: function(enabled, testFunc, testName, testPrereq)
    {
        if (null==testName) {
            testName="unnamed test"
        }
        jsPrint("Add test: " + testName)
        var data = new Object();
        data.enabled = enabled;
        data.testFunc = testFunc;
        data.testName = testName;
        data.testPrereq = testPrereq;
        data.testSuite = TestEngine.testSuiteName;
        // this.testList.push(testFunc)
        this.testList.push(data);
    },

    setTestSuiteName: function(name, timeout)
    {
        this.testSuiteName = name;
        this.testSuiteStats[name] = new Object();
        this.testSuiteStats[name].passed = 0;
        this.testSuiteStats[name].failed = 0;
        this.testSuiteStats[name].assertsOK = 0;
        this.testSuiteStats[name].assertsErr = 0;
        TestEngine.currentCaseTimeout =
            (timeout === undefined) ? TestEngine.testCaseTimeout : timeout;
    },

    setFinalCallback: function(finalCallbackParam)
    {
        this.finalCallback = finalCallbackParam;
    },

    log: function(text)
    {
        try
        {
            jsPrint(text);
            this.logText += text + "<br/>";
            this.finalLog += text + "\n";
            // document.getElementById(TestEngine.currentTestSuite).innerHTML += text + "<br/>";
            //document.getElementById('log').innerHTML += text + "<br/>";
        }
        catch(err)
        {
            this.countException++;
            jsPrint("   TestEngine.log failure: " + err.message);
        }
    },

    logException: function(text)
    {
        try
        {
            TestEngine.countException++;
            TestEngine.log("[EXCEPTION] " + text);
            TestEngine.currentFailings.push(text);
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.logErr failure: " + err.message);
        }
    },

    logErr: function(text)
    {
        try
        {
            TestEngine.countErr++;
            TestEngine.log("[FAILED] " + text);
            TestEngine.currentFailings.push(text);
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.logErr failure: " + err.message);
        }
    },

    logIgnored: function(text)
    {
        try
        {
            TestEngine.countIgnored++;
            TestEngine.log("[IGNORED] " + text);
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.logErr failure: " + err.message);
        }
    },

    logOK: function(text)
    {
        try
        {
            TestEngine.countOK++;
            TestEngine.log("[OK] " + text);
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.logOK failure: " + err.message);
        }
    },

    test: function(text, value)
    {
        try
        {
            if(typeof(value) == "undefined")
            {
                TestEngine.logErr("value not defined for test: '" + text + "'");
            }
            else if(!value)
            {
                TestEngine.logErr(text);
            }
            else
            {
                TestEngine.logOK(text);
                return true;
            }
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.test failure: " + err.message);
        }
        return false;
    },

    /**
     * Sets error type used in every typePresetError check.
     * @param type Type of an error/exception.
     */
    setErrorType: function(type)
    {
        TestEngine.errorType = type;
    },

    /**
     * Sets error field used in every typePresetError check.
     * @param field Name of the field in error structure to check its value.
     */
    setErrorField: function(field)
    {
        TestEngine.errorField = field;
    },

    /**
     * Checks if specified expression throws a specified error.
     * Expression must be enclosed in a function. Use setErrorType and
     * setErrorField to set what error to look for.
     * Error type must be set but if error field is left unset (i.e. null)
     * then whole exception object is compared to specified value.
     * @param msg Text to display for this test.
     * @param fn Function eclosing the expression one wants to verify.
     * @param value Value of an error/exception one looks for.
     */
    testPresetError: function(msg, fn, value)
    {
        if (TestEngine.errorType === null) {
            TestEngine.logException("testPresetError skipped. Set error type first.");
            return;
        }

        return TestEngine.testError(msg, fn, TestEngine.errorType,
            TestEngine.errorField, value);
    },

    /**
     * Checks if specified expression throws a specified error.
     * This is a more general version of testPresetError function.
     * Expression must be enclosed in a function.
     * Error type must be set but if error field is left unset (i.e. null)
     * then whole exception object is compared to specified value.
     * @param msg Text to display for this test.
     * @param fn Function eclosing the expression one wants to verify.
     * @param errType Type of desired error/exception.
     * @param errField Property from exception structure to look for exception
     * value.
     * @param errValue Value of an error/exception one looks for.
     */
    testError: function(msg, fn, errType, errField, errValue)
    {
        if (errType === null) {
            TestEngine.logException("testError skipped. Error type can't be null.");
            return TestEngine.ERROR_TEST_RESULT.NOT_RUN;
        }

        try {
            fn();
            TestEngine.logErr(msg + ' Exception has not been thrown.');
            return TestEngine.ERROR_TEST_RESULT.NOT_THROWN;
        }
        catch (ex) {
            if (ex instanceof errType) {
                var exValue = (errField !== null ? ex[errField] : ex);
                if (exValue === errValue) {
                    TestEngine.logOK(msg + ' [' + errValue + ']');
                    return TestEngine.ERROR_TEST_RESULT.OK;
                }
                else {
                    TestEngine.logErr(msg + ' Exception is not of value ' + errValue);
                    return TestEngine.ERROR_TEST_RESULT.BAD_VALUE;
                }
            }
            else {
                TestEngine.logErr(msg + ' Exception is of wrong type.');
                return TestEngine.ERROR_TEST_RESULT.BAD_TYPE;
            }
        }
    },

    testPresence: function(text, object)
    {
        try
        {
            if(object === undefined)
            {
                TestEngine.logErr("value not defined. Name: " + text);
            }
            else
            {
                TestEngine.logOK("object " + text + " present");
            }
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.testPresence failure: " + err.message);
        }
    },

    /**
     * Checks whether object implements given property.
     * In addition it also checks whether any exception (e.g. "Not Supported")
     * is thrown.
     * @param object Object to check property for.
     * @param property Property to look for.
     * @return True if object implements such property, false otherwise.
     */
    testPresence2: function(object, property)
    {
        var result = property in object;
        if (result)
        {
            TestEngine.logOK("property " + property + " present");
        }
        else
        {
            TestEngine.logErr("property " + property + " absent");
        }
        return result;
    },


    /**
     * Checks whether mainObj object equals templateObj object, property by
     * property.
     * Runs recursively through all the properties of templateObj object and
     * checks if they exist and are equal to those in mainObj object.
     * mainObj has to implement no less properties than templateObj.
     * @param mainObj Object to check for properties implementation.
     * @param templateObj Object to verify properties against.
     * @return True if mainObj has at least the same properties as templateObj,
     *         false otherwise.
     */
    checkObjectsEqual: function(mainObj, templateObj)
    {
        try
        {
            if ((!mainObj && templateObj) || (typeof(mainObj) != typeof(templateObj))) {
                return false;
            }
            else if (isNumber(templateObj) || isString(templateObj) || isBoolean(templateObj)) {
                return (mainObj === templateObj);
            }
            else if (isDate(templateObj)) {
                return (mainObj.valueOf() === templateObj.valueOf());
            }
            else {
                for (var i in templateObj) {
                    if (!TestEngine.checkObjectsEqual(mainObj[i], templateObj[i])) {
                        return false;
                    }
                }
            }
        }
        catch(err)
        {
            TestEngine.logException("TestEngine.checkObjectsEqual failure: " + err.message);
            return false;
        }
        return true;
    },

    // test properties of given object. Steps:
    // - check name presence
    // - check default value (if not null value passed)
    // - check if name is writable
    //
    // description of properties array:
    // [0] - property name
    // [1] - default value - check if property equals given value
    //          undefined or null - disable check
    // [2] - value to do writability test - try to write given value
    //          undefined or null - don't check writability
    // [3] - indicates if property should be read-only
    // [4] - assumed type, undefined value skips this check
    testProperties: function(object, props)
    {
        var result = new Object();
        try
        {
            for(var i in props)
            {
                var name = props[i][0];
                var defaultVal = props[i][1];
                var setVal = props[i][2];
                var isReadonly = props[i][3];
                var type = props[i][4];
                var errors = TestEngine.countErr + TestEngine.countException;

                if ((typeof(name) != "string") || (name == ""))
                {
                    TestEngine.logException("Property name not defined, skipping it.");
                    continue;
                }

                result[name] = false;
                if (TestEngine.testPresence2(object, name)) {
                    if ((defaultVal != null) && (defaultVal !== undefined))
                    {
                        var isObjectEqual = TestEngine.checkObjectsEqual(object[name], defaultVal);
                        TestEngine.test(name + " default value", isObjectEqual);
                    }

                    if ((setVal != null) && (setVal !== undefined))
                    {
                        // try-catch is needed when SetProperty returns 'false'
                        if(setVal === defaultVal)
                        {
                            TestEngine.logException("Default value and set value are equal");
                            continue;
                        }
                        try { object[name] = setVal; }
                        catch (e) { }
                        if (typeof(isReadonly) == "undefined")
                        {
                            TestEngine.test(name + " writability, reason: isReadonly not specified", false);
                        }
                        if (isReadonly)
                        {
                            TestEngine.test(name + " writability", object[name] != setVal);
                        }
                        else
                        {
                            var isObjectEqual = TestEngine.checkObjectsEqual(object[name], setVal);
                            TestEngine.test(name + " writability", isObjectEqual);
                        }
                    }

                    if (type !== undefined) {
                        var isType = (typeof(object[name]) == typeof(type));
                        if (typeof(type) == 'object') {
                            if (isArray(type)) {
                                isType = isArray(object[name]);
                            }
                            else if (isDate(type)) {
                                isType = isDate(object[name]);
                            }
                        }
                        TestEngine.test(name + " type check.", isType);
                    }
                }
                if (errors == TestEngine.countErr + TestEngine.countException) {
                    result[name] = true;
                }
            }
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.testProperties failure: " + err.message);
        }
        return result;
    },

    startTestCase: function()
    {
        try
        {
            TestEngine.countOK = 0;
            TestEngine.countErr = 0;
            TestEngine.countException = 0;
            TestEngine.countIgnored = 0;
            TestEngine.currentFailings = [];
            TestEngine.timer = setTimeout(TestEngine.timeout, TestEngine.currentCaseTimeout);
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.startTestCase failure: " + err.message);
        }

    },

    endTestCase: function(testCase)
    {
        try
        {
            if(this.timer === null)
            {
                return;
            }

            clearTimeout(this.timer);
            this.log("");
            var ignored = this.countIgnored > 0;
            var failed = this.countErr || ((this.countOK+this.countErr)<1) || this.countException || ignored;

            if (widget.__test) {
                if (ignored) {
                    widget.__test.collectIgnored(testCase.testName);
                } else if (failed) {
                    widget.__test.collectFail(testCase.testName, TestEngine.currentFailings.join('; '));
                } else {
                    widget.__test.collectPass(testCase.testName);
                }
            }
            this.log("Test case " + (failed ? "FAILED" : "PASSED"));
            this.log("Passed: " + this.countOK);
            this.log("Failed: " + this.countErr);
            if(this.countException)
            {
                this.log("Exception occured!");
            }

            this.countAllPassed += this.countOK;
            this.countAllFailed += this.countErr;
            this.testSuiteStats[testCase.testSuite].assertsOK += this.countOK;
            this.testSuiteStats[testCase.testSuite].assertsErr += this.countErr;

            if(failed)
            {
                TestEngine.testCasesFailedCount++;
                this.testSuiteStats[testCase.testSuite].failed++;
                if (isVerbose()) {
                    TestEngine.testCasesFailed.push(testCase.testName);
                }
                TestEngine.resultLogger.logFail(testCase.testName);
            }
            else
            {
                TestEngine.testCasesPassedCount++;
                this.testSuiteStats[testCase.testSuite].passed++;
                TestEngine.resultLogger.logPass(testCase.testName);
            }
            TestEngine.summaryRenderer.render(TestEngine);
        }
        catch(err)
        {
            this.countException++;
            jsPrint("   TestEngine.endTestCase failure:" + err.message);
        }
    },

    timeout: function()
    {
        try
        {
            TestEngine.callbackMutex = 0;
            TestEngine.logErr("Widget run timeout.", false);
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.timeout failure:" + err.message);
        }
    },

    /**
     * Registers callbacks for asynchronous function.
     *
     * To avoid finish test case before callbacks will execute it's necessary
     * to register callbacks in the engine.
     *
     * @param methodName Testcase name, suggested asynchronous function name.
     * @param testSuccessCallback Callback that will be executed on success.
     * @param testErrorCallback Callback that will be executed on failure.
     * @param callbacksCount number of callbacks to register.
     * @return An object with defined functions "successCallback" and "errorCallback" you
     *          need to pass as arguments to asynchronous function  e.g.
     *
     * function success() {  }
     * function failure() {  }
     *
     * {
         *      var obj = TestEngine.registerCallback("myAsyncFunc", success, failure);
         *      myAsyncFunc(obj.successCallback, obj.errorCallback);
         * }
     */
    registerCallback: function(methodName, testSuccessCallback, testErrorCallback, callbacksCount)
    {
        try
        {
            if(callbacksCount !== undefined && callbacksCount > 0){
                TestEngine.callbackMutex += callbacksCount;
            }
            else {
                TestEngine.callbackMutex++;
            }
            TestEngine.callbackMethodName = methodName;
            TestEngine.testSuccessCallback = testSuccessCallback;
            TestEngine.testErrorCallback = testErrorCallback;

            var retObj = new Object();
            retObj.callbackMethodName = methodName;
            retObj.testSuccessCallback = testSuccessCallback;
            retObj.successCallback = function(param){
                try
                {
                    if((typeof retObj.testSuccessCallback != "undefined") && (retObj.testSuccessCallback !== null))
                    {
                        retObj.testSuccessCallback(param);
                    }
                    else
                    {
                        TestEngine.logOK(retObj.callbackMethodName + " succeed");
                    }
                }
                catch(err)
                {
                    TestEngine.countException++;
                    jsPrint("   TestEngine.this.successCallback failure:" + err.message);
                }
                TestEngine.callbackMutex--;
            };

            retObj.testErrorCallback = testErrorCallback;
            retObj.errorCallback = function(param){
                try
                {
                    if((typeof retObj.testErrorCallback != "undefined") && (retObj.testErrorCallback !== null))
                    {
                        retObj.testErrorCallback(param);
                    }
                    else
                    {
                        TestEngine.logErr(retObj.callbackMethodName + " failed");
                    }
                }
                catch(err)
                {
                    TestEngine.countException++;
                    jsPrint("   TestEngine.retObj.errorCallback failure:" + err.message);
                }
                TestEngine.callbackMutex--;
            };

            return retObj;
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.registerCallback failure:" + err.message);
        }
    },

    successCallback: function(params)
    {
        TestEngine.log("[Warning] Function TestEngine.successCallback deprecated");
        try
        {
            TestEngine.callbackMutex--;
            if(typeof TestEngine.testSuccessCallback != "undefined")
            {
                TestEngine.testSuccessCallback(params);
            }
            else
            {
                TestEngine.logOK(TestEngine.callbackMethodName + " succeed");
            }
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.successCallback failure:" + err.message);
        }
    },

    errorCallback: function(params)
    {
        TestEngine.log("[Warning] Function TestEngine.errorCallback deprecated");
        try
        {
            TestEngine.callbackMutex--;
            if(typeof TestEngine.testErrorCallback != "undefined")
            {
                TestEngine.testErrorCallback(params);
            }
            else
            {
                TestEngine.logErr(TestEngine.callbackMethodName + " failed");
            }
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.errorCallback failure:" + err.message);
        }
    },

    waitForCallback: function()
    {
        try
        {
            //    while( TestEngine.callbackMutex )
            {
            }
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.waitForCallback failure:" + err.message);
        }
    },

    /*
     * code - error code which is expected
     * object - object which will be used to call method
     * functionName - method name to call
     * restArguments - rest arguments which will be passed to callback
     *
     * example:
     * TestEngine.catchError(10001, bondi.messaging, findSMSs, succCallback, null, filter)
     */
    catchError: function(code, object, functionName, restArguments /* , ... */ )
    {
        try
        {
            TestEngine.log("TestEngine.catchError is DEPRECATED. Please use TestEngine.catchErrorType.");
            var error;
            try
            {
                var newArgs = []
                for (var i=3;i<arguments.length;i++) {
                    newArgs.push(arguments[i])
                }
                var retVal = null;
                retVal = object[functionName].apply(object, newArgs);
                TestEngine.logErr(functionName + " no error thrown");
                return retVal;
            }
            catch(error)
            {
                TestEngine.testPresence("<error code from: " + functionName + ">", error.code);
                TestEngine.test("Error number", error.code == code);
                return;
            }
            TestEngine.logErr("Function " + functionName + " desn't throw");
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.testError failure:" + err.message);
        }
    },

    /*
     * errorTypeName - attribute name of catched exception to compare with code
     * code - error code which is expected
     * object - object which will be used to call method
     * functionName - method name to call
     * restArguments - rest arguments which will be passed to callback
     *
     * example:
     * TestEngine.catchErrorType("code", 10001, bondi.messaging, findSMSs, succCallback, null, filter)
     */
    catchErrorType: function(errorTypeName, code, object, functionName, restArguments /* , ... */ )
    {
        try
        {
            var error;
            try
            {
                var newArgs = []
                for (var i=4;i<arguments.length;i++) {
                    newArgs.push(arguments[i])
                }
                var retVal = null;
                if (arguments.length < 4) {
                    TestEngine.logErr("Wrong catchErrorType usage.");
                    return retVal;
                }
                retVal = object[functionName].apply(object, newArgs);
                TestEngine.logErr(functionName + " no error thrown");
                return retVal;
            }
            catch(error)
            {
                TestEngine.testPresence("<error code from: " + functionName + ">", error[errorTypeName]);
                TestEngine.test("Error number", error[errorTypeName] == code);
                return;
            }
            TestEngine.logErr("Function " + functionName + " desn't throw");
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.testError failure:" + err.message);
        }
    },

    // Executes step by step functions passed in steps array
    // and waits after every execution time defined in timeInterval
    executeSteps: function(steps, timeInterval)
    {
        try
        {
            if(typeof(timeInterval) == "undefined")
            {
                timeInterval = 100; //default value
            }

            TestEngine.stepsArray = steps;
            TestEngine.stepTimeout = timeInterval;
            TestEngine.currentStep = 0;
            TestEngine.executeNextStep();
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.executeSteps failure:" + err.message);
        }
    },

    executeNextStep: function()
    {
        try
        {
            if( TestEngine.stepsArray && (TestEngine.currentStep < TestEngine.stepsArray.length) )
            {
                if( isArray( TestEngine.stepsArray[ TestEngine.currentStep ] ) )
                {
                    TestEngine.stepsArray[ TestEngine.currentStep ][0]();
                    setTimeout( TestEngine.executeNextStep, TestEngine.stepsArray[ TestEngine.currentStep ][1] );

                }
                else
                {
                    TestEngine.stepsArray[ TestEngine.currentStep ]();
                    setTimeout( TestEngine.executeNextStep, TestEngine.stepTimeout );
                }
                TestEngine.currentStep++;
            }
            else
            {
                TestEngine.currentStep = null;
                TestEngine.stepTimeout = null;
                TestEngine.stepsArray = null;
            }
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.executeNextStep failure:" + err.message);
            jsPrint("   Current step:" + TestEngine.currentStep);

            TestEngine.currentStep = null;
            TestEngine.stepTimeout = null;
            TestEngine.stepsArray = null;
        }
    },

    enumerate: function(obj, level)
    {
        try
        {
            if(typeof level == "undefined")
            {
                TestEngine.log(obj + ":");
                level = "";
            }
            for(i in obj)
            {
                if(!(typeof obj[i] == "object" || typeof obj[i] == "array"))
                {
                    TestEngine.log(level + i + " =  " + obj[i]);
                }
                else
                {
                    TestEngine.log(level + i + " =  ");
                    TestEngine.enumerate(obj[i], level + "----");
                }
            }
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.enumerate failure:" + err.message);
        }
    },

    doTests: function()
    {
        try
        {
            TestEngine.testCasesFailed = [];
            TestEngine.test("jsPrint presence", jsPrint);
            TestEngine.test("Widget presence", window.widget);
            TestEngine.doNextTestCase();
        }
        catch(err)
        {
            TestEngine.countException++;
            jsPrint("   TestEngine.doTests failure:" + err.message);
        }
    },

    showSuitesStats: function()
    {
        try
        {
            jsPrint("============ Test suites:");
            for(var i in this.testSuiteStats)
            {
                jsPrint(i + " - " + this.testSuiteStats[i].passed + " passed, " + this.testSuiteStats[i].failed + " failed," + "   asserts: " + this.testSuiteStats[i].assertsOK + " passed, " + this.testSuiteStats[i].assertsErr + " failed"); }
        }
        catch(err)
        {
            jsPrint("   TestEngine.showSuitesStats failure:" + err.message);
        }
    },

    doNextTestCase: function()
    {
        try
        {
            if( TestEngine.stepsArray !== null || (TestEngine.callbackMutex > 0))
            {
                setTimeout( TestEngine.doNextTestCase, 100 );
                return;
            }

            if(TestEngine.currentTestCase)
            {
                TestEngine.endTestCase(TestEngine.testList[TestEngine.currentTestCase-1]);
            }

            if( TestEngine.testList.length == TestEngine.currentTestCase )
            {
                if (widget.__test) {
                    widget.__test.outputResults();
                }
                jsPrint("============");
                jsPrint(TestEngine.finalLog);
                TestEngine.showSuitesStats();
                jsPrint("============ Summary:");
                jsPrint("Test cases all: " + TestEngine.testList.length);
                jsPrint("Test cases passed: " + TestEngine.testCasesPassedCount);
                jsPrint("Test cases failed: " + TestEngine.testCasesFailedCount);
                jsPrint("Asserts passed: " + TestEngine.countAllPassed);
                jsPrint("Asserts failed: " + TestEngine.countAllFailed);
                if (isVerbose()) {
                    jsPrint("============ Failing test cases:");
                    for (i = 0; i < TestEngine.testCasesFailed.length; ++i) {
                        jsPrint(TestEngine.testCasesFailed[i]);
                    }
                }
                TestEngine.summaryRenderer.render(TestEngine);

                if(typeof TestEngine.finalCallback != "undefined")
                {
                    jsPrint("Registering final callback");
                    TestEngine.summaryRenderer.render(TestEngine);
                    setTimeout(TestEngine.finalCallback, 4000);
                } else {
                    jsPrint("Final callback was not registered.");
                }
                return;
            }

            var i = TestEngine.currentTestCase++;
            try
            {
                if (widget.__test) {
                    if (TestEngine.currentTestSuiteName != TestEngine.testList[i].testSuite) {
                        TestEngine.currentTestSuiteName = TestEngine.testList[i].testSuite;
                        widget.__test.collectGroup(TestEngine.testList[i].testSuite);
                    }
                }
                TestEngine.log("");
                TestEngine.log("==== Test case: " + TestEngine.testList[i].testName);
                TestEngine.startTestCase();
                var testPrereq = true;
                if (TestEngine.testList[i].testPrereq !== undefined)
                {
                    testPrereq = TestEngine.testList[i].testPrereq();
                }
                if (testPrereq)
                {
                    if(TestEngine.testList[i].enabled)
                    {
                        TestEngine.testList[i].testFunc();
                    }
                    else
                    {
                        TestEngine.logIgnored("Test disabled");
                    }

                }
                else {
                    TestEngine.logException
                    ("Test case prerequisites unfulfilled.  Skipping it.");
                }
            }
            catch(err)
            {
                TestEngine.countException++;
                TestEngine.log("   Test case '" + TestEngine.testList[i].testName + "' failed:" + err.message);
            }
            setTimeout( TestEngine.doNextTestCase, 100 );
        }
        catch(err)
        {
            jsPrint("   TestEngine.doNextTestCase failure:" + err.message);
        }
    }
};

function isUndefined(val)
{
    if (typeof val == "undefined") {
        return true;
    }
    return false;
}
function isNull(val)
{
    return val === null;
}
function isString(val) {
    if (typeof val == typeof "") {
        return true;
    }
    return false;
}
function isNumber(val) {
    if (typeof val == typeof 0) {
        return true
    }
    return false;
}
function isDate(val) {
    return (val instanceof Date);
}
function isFunction(val) {
    return (typeof(val) == 'function');
}
function isBoolean(val) {
    if (typeof val == typeof true) {
        return true
    }
    return false;
}
function isArray(val) {
    return (val instanceof Array);
}
function isObject(val) {
    return (val instanceof Object);
}

function isVerbose() {
    return ((typeof(VERBOSE) != "undefined") && (VERBOSE === 1));
}

/**
 * Tests results logger.
 */
function HTMLTestResultLogger(sinkId) {

  /**
   * Logs a message.
   * @param message Message to log.
   * @param status Status of the message (PASSED, FAILED, EXCEPTION).
   *               By default status is set to PASSED.
   */
  this.log = function(message, status) {
    if (arguments.length < 2) throw "Not enough number of arguments.";
    $(sink).append(createLogEntry(message, status));
  }

  /**
   * Helper functions.
   */
  this.logPass = function(message) {
    if (arguments.length < 1) throw "Not enough number of arguments.";
    this.log(message, HTMLTestResultLogger.PASSED);
  }

  this.logFail = function(message) {
    if (arguments.length < 1) throw "Not enough number of arguments.";
    this.log(message, HTMLTestResultLogger.FAILED);
  }

  $(document).ready(function() {
    sink = document.getElementById(sinkId);
    if (null === sink) throw "Summary element unavailable.";
  });

  var createLogEntry = function(message, status) {
    var entry = '<div class="entry ' + status + '">';
    entry +=    message.toString();
    entry +=    '</div>';
    return entry;
  }

  var id = sinkId;
  var sink = null;
}

HTMLTestResultLogger.PASSED = "passed";
HTMLTestResultLogger.FAILED = "failed";
HTMLTestResultLogger.EXCEPTION = "exception";


/**
 * Tests summary renderer.
 */
function HTMLTestSummaryRenderer(summaryId) {

  this.render = function(engine) {
    if (arguments.length < 1) throw "Not enough arguments.";

    $('#_summary_numberOfRunTests').text(engine.currentTestCase);
    $('#_summary_numberOfAllTests').text(engine.testList.length);
    $('#_summary_numberOfPassedTests').text(engine.testCasesPassedCount);
    $('#_summary_numberOfPassedAsserts').text(engine.countAllPassed);
    $('#_summary_numberOfFailedTests').text(engine.testCasesFailedCount);
    $('#_summary_numberOfFailedAsserts').text(engine.countAllFailed);
    for(var suiteName in engine.testSuiteStats) {
      if (!isSuiteStarted(engine.testSuiteStats[suiteName])) continue;
      renderSuite(suiteName, engine.testSuiteStats[suiteName]);
    }
  }

  $(document).ready(function() {
    summary = document.getElementById(summaryId);
    if (null === summary) {
      throw "Summary element unavailable.";
    }
    setupSummary(summary);
  });

  var isSuiteStarted = function(stats) {
    return (stats.passed + stats.failed != 0);
  }

  var renderSuite = function(name, stats) {
    var elementId = '_summary_suite_' + name;
    var element = document.getElementById(elementId);
    if (null === element) {
      element = $('<div id="' + elementId + '">' + name + ': '+ '<span name="stats"></span></div>');
      $(summary).append(element);
    }
    var elementStats = $(element).children('span[name="stats"]');
    elementStats.text(stats.passed + '(' + stats.assertsOK + ')' + ' passed, ' +
                      stats.failed + '(' + stats.assertsErr + ')' + ' failed');
  }

  var setupSummary = function(summary) {
    var run  = '<div>Run: <span id="_summary_numberOfRunTests">0</span>';
        run += ' of <span id="_summary_numberOfAllTests">0</span></div>';
    var current = '<div>Current: <span id="_summary_currentTest">0</span></div>';
    var passed  = '<div>Passed: <span id="_summary_numberOfPassedTests">0</span>';
        passed += '(<span id="_summary_numberOfPassedAsserts">0</span>)</div>';
    var failed  = '<div>Failed: <span id="_summary_numberOfFailedTests">0</span>';
        failed += '(<span id="_summary_numberOfFailedAsserts">0</span>)</div>';
    $(summary).append(run).append(passed).append(failed);
  }

  var id = summaryId;
  var summary = null;
}

