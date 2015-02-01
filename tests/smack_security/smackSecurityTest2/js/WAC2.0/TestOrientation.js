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
 * This file contains the implementation of test Orientation class.
 *
 * @author      xiangguo.qi (xiangguo.qi @samsung.com)
 * @version     0.1
 */


var OrientationObj = deviceapis.orientation;
var OrientationWatchID = "";

// Orientation001
function presenceTest()
{
    TestEngine.test("Checking checking", true);
    TestEngine.test("Checking deviceapis object", deviceapis);
    TestEngine.test("Checking Orientation object", OrientationObj);

    TestEngine.test("Checking type of getCurrentOrientation", isFunction(OrientationObj.getCurrentOrientation));
    TestEngine.test("Checking type of watchOrientation", isFunction(OrientationObj.watchOrientation));
    TestEngine.test("Checking type of clearWatch", isFunction(OrientationObj.clearWatch));
}

function getSuccess(orientation)
{
    TestEngine.test("get current orientation", true);
    TestEngine.test("orientation.alpha", isNumber(orientation.alpha));
    TestEngine.test("orientation.beta", isNumber(orientation.beta));
    TestEngine.test("orientation.gamma", isNumber(orientation.gamma));
}

function getFail()
{
    TestEngine.test("get current orientation", false);
}


function acceptError(){
    TestEngine.test("Error as exptected", true);
}

function rejectSuccess(){
    TestEngine.test("Success - error expected", false);
}

//Orientation002
function getCurrentOrientationValidParameters()
{
    var cbObj = TestEngine.registerCallback("getCurrentOrientation", rejectSuccess, acceptError, 3);
    try {
        OrientationObj.getCurrentOrientation(cbObj.successCallback, cbObj.errorCallback);
        TestEngine.test("exception not thrown", true);
    } catch(e) {
        TestEngine.logErr("Exception should not be thrown" + e);
    }
//    try {
//        OrientationObj.getCurrentOrientation(cbObj.successCallback);
//        TestEngine.test("exception not thrown", true);
//    } catch(e) {
//        TestEngine.logErr("Exception should not be thrown" + e);
//    }
//    try {
//        OrientationObj.getCurrentOrientation(cbObj.successCallback, undefined);
//        TestEngine.test("exception not thrown", true);
//    } catch(e) {
//        TestEngine.logErr("Exception should not be thrown" + e);
//    }
}

// Orientation003
function getCurrentOrientationInvalidParamsTest()
{
    TestEngine.catchErrorType("code",17, OrientationObj, "getCurrentOrientation", 1234, undefined);
    TestEngine.catchErrorType("code",17, OrientationObj, "getCurrentOrientation", "test");
    TestEngine.catchErrorType("code",17, OrientationObj, "getCurrentOrientation", new Date());
    TestEngine.catchErrorType("code",17, OrientationObj, "getCurrentOrientation", [6, 6, 6]);
}


function successFail()
{
    TestEngine.test("Correctly onError called", true);
}

// Orientation004
function getCurrentOrientationCheckErrorCallback()
{
    var failObj = TestEngine.registerCallback("getCurrentOrientation", getSuccess, successFail);
    try {
        OrientationObj.getCurrentOrientation(undefined, failObj.errorCallback);
    } catch(e) {
        TestEngine.logErr("Exception should not be thrown" + e);
    }
    try {
        OrientationObj.getCurrentOrientation(1234, failObj.errorCallback);
        TestEngine.logErr("Exception should be thrown");
    } catch(e) {
        TestEngine.logOK("Exception thrown" + e);
    }
}


// Orientation005
function watchOrientationInvalidParamsTest()
{
    TestEngine.catchErrorType("code",17, OrientationObj, "watchOrientation", "test");
    TestEngine.catchErrorType("code",17, OrientationObj, "watchOrientation", new Date());
    TestEngine.catchErrorType("code",17, OrientationObj, "watchOrientation", [6, 6, 6]);
}

// Orientation006
function watchOrientationCheck()
{
    function watchSuccess(orientation)
    {
        OrientationObj.clearWatch(OrientationWatchID);
        TestEngine.test("watch orientation",true);
        TestEngine.test("orientation.alpha", isNumber(orientation.alpha));
        TestEngine.test("orientation.beta", isNumber(orientation.beta));
        TestEngine.test("orientation.gamma", isNumber(orientation.gamma));
    }

    function watchFail()
    {
        TestEngine.test("watch orientation",false);
    }

    var cbObj = TestEngine.registerCallback("watchOrientation", watchSuccess, watchFail);
    try {
        OrientationWatchID = OrientationObj.watchOrientation(cbObj.successCallback, cbObj.errorCallback, {
            minNotificationInterval:20
            });
        TestEngine.logOK("No exception thrown");
    } catch (e) {
        TestEngine.logErr("Exception should not be thrown" + e.toString());
    }
}

// Orientation007
function clearWatchTest()
{
    try
    {
        OrientationObj.clearWatch(OrientationWatchID);
        TestEngine.logOK("clearWatch OK");
    }
    catch (error) {
        TestEngine.logErr("clearWatch Error");
    }
    try
    {
        OrientationObj.clearWatch(undefined);
        TestEngine.logOK("clearWatch OK");
    }
    catch (error) {
        TestEngine.logErr("clearWatch Error");
    }
    try
    {
        OrientationObj.clearWatch(null);
        TestEngine.logOK("clearWatch OK");
    }
    catch (error) {
        TestEngine.logErr("clearWatch Error");
    }
}


//=============================================================================
TestEngine.setTestSuiteName("[WAC2.0][Orientation]", 2*1000); //2sec time out for callbacks
//TestEngine.addTest(true, presenceTest, "[WAC2.0][Orientation] Orientation functions presence test");
TestEngine.addTest(true, getCurrentOrientationValidParameters, "[WAC2.0][Orientation] Valid parameters");
//TestEngine.addTest(true, getCurrentOrientationInvalidParamsTest, "[WAC2.0][Orientation] getCurrentOrientation invalid params  test");
//TestEngine.addTest(true, getCurrentOrientationCheckErrorCallback, "[WAC2.0][Orientation] getCurrentOrientation test");
//TestEngine.addTest(true, watchOrientationInvalidParamsTest, "[WAC2.0][Orientation] watchOrientation invalid params  test");
//TestEngine.addTest(true, watchOrientationCheck, "[WAC2.0][Orientation] watchtAcceleration test");
//TestEngine.addTest(true, clearWatchTest, "[WAC2.0][Orientation] clearWatch test");


