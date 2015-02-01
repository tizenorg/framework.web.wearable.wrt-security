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
 * This file contains the implementation of test Accelerometer class.
 *
 * @author      xiangguo.qi (xiangguo.qi @samsung.com)
 * @version     0.1
 */


var AccelerometerObj = deviceapis.accelerometer;
var WatchID = "";
// Accelerometer001
function presenceTest()
{
    TestEngine.test("Checking checking", true);
    TestEngine.test("Checking deviceapis object", deviceapis);
    TestEngine.test("Checking Accelerometer object", AccelerometerObj);

    TestEngine.test("Checking type of getCurrentAcceleration", isFunction(AccelerometerObj.getCurrentAcceleration));
    TestEngine.test("Checking type of watchAcceleration", isFunction(AccelerometerObj.watchAcceleration));
    TestEngine.test("Checking type of clearWatch", isFunction(AccelerometerObj.clearWatch));
}

// Accelerometer002
function getCurrentAccelerationInvalidParamsTest()
{
    // Following two tests should silently fail according to WAC 2.0
    TestEngine.test("getCurrentAcceleration undefined callback", isUndefined(AccelerometerObj.getCurrentAcceleration(undefined)));
    TestEngine.test("getCurrentAcceleration null callback", isUndefined(AccelerometerObj.getCurrentAcceleration(null)));
    // Following tests should throw errors according to WAC 2.0
    TestEngine.catchErrorType("code",17, AccelerometerObj, "getCurrentAcceleration", "test");
    TestEngine.catchErrorType("code",17, AccelerometerObj, "getCurrentAcceleration", new Date());
    TestEngine.catchErrorType("code",17, AccelerometerObj, "getCurrentAcceleration", [6, 6, 6]);
}


// Accelerometer003
function getCurrentAccelerationTest()
{
    getCurrentAccelerationCheck();
}

function getCurrentAccelerationCheck()
{
	function getSuccess(acceleration) {
        TestEngine.test("getCurrentAccleration success - error expected", false);
//      TestEngine.test("get current acceleration",true);
//      TestEngine.test("acceleration.xAxis", isNumber(acceleration.xAxis));
//      TestEngine.test("acceleration.yAxis", isNumber(acceleration.yAxis));
//	    TestEngine.test("acceleration.zAxis", isNumber(acceleration.zAxis));
    }

    function getFail() {
        TestEngine.test("getCurrentAcceleration failed as expected", true);
//        TestEngine.test("get current acceleration",false);
    }

    var cbObj = TestEngine.registerCallback("getCurrentAcceleration", getSuccess, getFail);
    AccelerometerObj.getCurrentAcceleration(cbObj.successCallback, cbObj.errorCallback);

}

// Accelerometer004
function watchAccelerationInvalidParamsTest()
{
    // Following two tests should silently fail according to WAC 2.0
    TestEngine.test("watchAcceleration undefined callback", isUndefined(AccelerometerObj.watchAcceleration(undefined)));
    TestEngine.test("watchAcceleration null callback", isUndefined(AccelerometerObj.watchAcceleration(null)));
    // Following tests should throw errors according to WAC 2.0
    TestEngine.catchErrorType("code",17, AccelerometerObj, "watchAcceleration", "test");
    TestEngine.catchErrorType("code",17, AccelerometerObj, "watchAcceleration", new Date());
    TestEngine.catchErrorType("code",17, AccelerometerObj, "watchAcceleration", [6, 6, 6]);
    // Following tests should ignore optional parameter if it is of invalid type, according to WAC 2.0
    TestEngine.test("watchAcceleration ignore invalid params", isNumber(AccelerometerObj.watchAcceleration(function(){}, function(){}, "test")));
    TestEngine.test("watchAcceleration ignore invalid params", isNumber(AccelerometerObj.watchAcceleration(function(){}, function(){}, {minNotificationInterval:"test"})));
    TestEngine.test("watchAcceleration ignore invalid params", isNumber(AccelerometerObj.watchAcceleration(function(){}, function(){}, {minNotificationInterval:true})));
}


// Accelerometer005
function watchAccelerationTest()
{
    watchAccelerationCheck();
}

function watchAccelerationCheck()
{
	function watchSuccess(acceleration) {
        TestEngine.test("watch acceleration",true);
		TestEngine.test("acceleration.xAxis", isNumber(acceleration.xAxis));
		TestEngine.test("acceleration.yAxis", isNumber(acceleration.yAxis));
		TestEngine.test("acceleration.zAxis", isNumber(acceleration.zAxis));

    }

    function watchFail() {
        TestEngine.test("watch acceleration",false);
    }

    var cbObj = TestEngine.registerCallback("watchAcceleration", watchSuccess, watchFail);
    WatchID = AccelerometerObj.watchAcceleration(cbObj.successCallback, cbObj.errorCallback, {minNotificationInterval:2000});

}

// Accelerometer006
function clearWatchTest()
{
    var ids = [WatchID, null, new Date(), true, undefined, "test", [6, 6, 6]];
    for (var i =0; i < ids.length; ++i) {
        try
        {
            AccelerometerObj.clearWatch(ids[i]);
            TestEngine.logOK("clearWatch OK");
        }
        catch (error) {
            TestEngine.logErr("clearWatch Error");
        }
    }

    try
    {
        AccelerometerObj.clearWatch();
        TestEngine.logOK("clearWatch OK");
    }
    catch (error) {
        TestEngine.logErr("clearWatch Error");
    }
}


//=============================================================================

TestEngine.setTestSuiteName("[WAC2.0][Accelerometer]", 60*1000); //2min time out for callbacks
//TestEngine.addTest(true, presenceTest, "[WAC2.0][Accelerometer] Accelerometer functions presence test");
//TestEngine.addTest(true, getCurrentAccelerationInvalidParamsTest, "[WAC2.0][Accelerometer] getCurrentAcceleration invalid params  test");
TestEngine.addTest(true, getCurrentAccelerationTest, "[WAC2.0][Accelerometer] getCurrentAcceleration test");
//TestEngine.addTest(true, watchAccelerationInvalidParamsTest, "[WAC2.0][Accelerometer] watchAcceleration invalid params  test");
//TestEngine.addTest(true, watchAccelerationTest, "[WAC2.0][Accelerometer] watchtAcceleration test");
//TestEngine.addTest(true, clearWatchTest, "[WAC2.0][Accelerometer] clearWatch test");

