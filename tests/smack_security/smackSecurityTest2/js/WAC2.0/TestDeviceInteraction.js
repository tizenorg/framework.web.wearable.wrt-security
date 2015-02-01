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
 * This file contains the implementation of deviceinteraction plugin tests.
 *
 * @author      Krzysztof Jackiewicz (k.jackiewicz@samsung.com)
 * @version     0.1
 */

var di = deviceapis.deviceinteraction;
var filename = "wgt-package/icon.png"
var filename2 = "wgt-package/attachments/attach1.jpg"
var badFilename1 = "config.xml"
var badFilename2 = ""
var badFilename3 = "/opt/media/Sounds and music/Music/Because of you.mp3"

// callbacks

function expectedSuccess()
{
    TestEngine.test("expectedSuccess callback",true);
    di.stopNotify();
    di.stopVibrate();
};

function expectedFailure()
{
    TestEngine.test("expectedFailure callback",true);
};

function unexpectedSuccess()
{
    TestEngine.test("unexpectedSuccess callback",false);
};

function unexpectedFailure()
{
    TestEngine.test("unexpectedFailure callback",false);
};

// tests

function test_deviceinteraction_presence_001()
{
    TestEngine.testPresence("Checking deviceapis presence", deviceapis);
    TestEngine.testPresence2(deviceapis, 'deviceinteraction');
}

function test_deviceinteraction_functions_002()
{
    var props = new Array();
    props.push(new Array('startNotify', null, null, false, TestEngine.FUNCTION));
    props.push(new Array('stopNotify', null, null, false, TestEngine.FUNCTION));
    props.push(new Array('startVibrate', null, null, false, TestEngine.FUNCTION));
    props.push(new Array('stopVibrate', null, null, false, TestEngine.FUNCTION));
    props.push(new Array('lightOn', null, null, false, TestEngine.FUNCTION));
    props.push(new Array('lightOff', null, null, false, TestEngine.FUNCTION));
    props.push(new Array('setWallpaper', null, null, false, TestEngine.FUNCTION));
    TestEngine.testProperties(di, props);
}

function test_deviceinteraction_startNotify_003()
{
    check_ulong("startNotify");
    di.stopNotify();

    try
    {
        var cbObj = TestEngine.registerCallback("test", expectedSuccess, unexpectedFailure);
        di.startNotify(cbObj.successCallback, cbObj.errorCallback, 2000);
        TestEngine.test("No error thrown from startNotify", true);
    }
    catch(err)
    {
        TestEngine.logException(err.message);
    }
}

function test_deviceinteraction_stopNotify_004()
{
    try
    {
        di.stopNotify();
        TestEngine.test("No error thrown from stopNotify", true);
    }
    catch(err)
    {
        TestEngine.logException(err.message);
    }
}

function test_deviceinteraction_startVibrate_005()
{
    check_ulong("startVibrate");
    di.stopVibrate();

    try
    {
//        var cbObj = TestEngine.registerCallback("test", expectedSuccess, unexpectedFailure);
        var cbObj = TestEngine.registerCallback("test", unexpectedFailure, expectedSuccess);
        di.startVibrate(cbObj.successCallback, cbObj.errorCallback, 2000);
        TestEngine.test("No error thrown from startVibrate", true);
    }
    catch(err)
    {
        TestEngine.logException(err.message);
    }
}

function test_deviceinteraction_stopVibrate_006()
{
    try
    {
        di.stopVibrate();
        TestEngine.test("No error thrown from stopVibrate", true);
    }
    catch(err)
    {
        TestEngine.logException(err.message);
    }
}

function test_deviceinteraction_lightOn_008()
{
    check_ulong("lightOn", 2000);
    di.lightOff();
    try
    {
        var cbObj = TestEngine.registerCallback("test", expectedSuccess, unexpectedFailure);
        di.lightOn(cbObj.successCallback, cbObj.errorCallback, 2000);
        TestEngine.test("No error thrown from lightOn", true);
    }
    catch(err)
    {
        TestEngine.logException(err.message);
    }
}

function test_deviceinteraction_lightOff_009()
{
    try
    {
        di.lightOff();
        TestEngine.test("No error thrown from lightOff", true);
    }
    catch(err)
    {
        TestEngine.logException(err.message);
    }
}

function test_deviceinteraction_setWallpaper_010()
{
    TestEngine.log("Checking function: deviceinteaction.setWallpaper(cb, cb, string)");

    var cbObj1 = TestEngine.registerCallback("setWallpaper", expectedSuccess, unexpectedFailure);
    di.setWallpaper(cbObj1.successCallback, cbObj1.errorCallback, filename);

    var cbObj2 = TestEngine.registerCallback("setWallpaper", unexpectedSuccess, expectedFailure);
    di.setWallpaper(undefined, cbObj2.errorCallback, filename);

    TestEngine.catchErrorType("code", 17, di, "setWallpaper", 1234, unexpectedFailure, filename);

    var cbObj3 = TestEngine.registerCallback("setWallpaper", expectedSuccess, unexpectedFailure);
    di.setWallpaper(cbObj3.successCallback, undefined, filename);

    TestEngine.catchErrorType("code", 17, di, "setWallpaper", unexpectedSuccess, 1234, filename);

    var cbObj4 = TestEngine.registerCallback("setWallpaper", unexpectedSuccess, expectedFailure);
    di.setWallpaper(cbObj4.successCallback, cbObj4.errorCallback, undefined);

    var cbObj5 = TestEngine.registerCallback("setWallpaper", unexpectedSuccess, expectedFailure);
    di.setWallpaper(cbObj5.successCallback, cbObj5.errorCallback, 1234);

    var cbObj6 = TestEngine.registerCallback("setWallpaper", unexpectedSuccess, expectedFailure);
    di.setWallpaper(null, cbObj6.errorCallback, filename);

    var cbObj7 = TestEngine.registerCallback("setWallpaper", expectedSuccess, unexpectedFailure);
    di.setWallpaper(cbObj7.successCallback, null, filename2);

    var cbObj8 = TestEngine.registerCallback("setWallpaper", unexpectedSuccess, expectedFailure);
    di.setWallpaper(cbObj8.successCallback, cbObj8.errorCallback, null);
}

function check_ulong(func)
{
    TestEngine.log("Checking function: deviceinteaction." + func + "(unsigned long)");

    TestEngine.catchErrorType("code", 17, di, func, expectedSuccess, unexpectedFailure);

    var cbObj1 = TestEngine.registerCallback("null param", expectedSuccess, unexpectedFailure);
    di[func](cbObj1.successCallback, cbObj1.errorCallback, null);

    var cbObj2 = TestEngine.registerCallback("undefined param", expectedSuccess, unexpectedFailure);
    di[func](cbObj2.successCallback, cbObj2.errorCallback, undefined);

    var cbObj3 = TestEngine.registerCallback("undefined param", unexpectedSuccess, expectedFailure);
    di[func](cbObj3.successCallback, cbObj3.errorCallback, -666);

    var cbObj4 = TestEngine.registerCallback("undefined param", expectedSuccess, unexpectedFailure);
    di[func](cbObj4.successCallback, cbObj4.errorCallback, "test");

    var cbObj5 = TestEngine.registerCallback("undefined param", expectedSuccess, unexpectedFailure);
    di[func](cbObj5.successCallback, cbObj5.errorCallback, new Date());

    var cbObj6 = TestEngine.registerCallback("undefined param", expectedSuccess, unexpectedFailure);
    di[func](cbObj6.successCallback, cbObj6.errorCallback, [6, 6, 6]);
}

//=============================================================================
TestEngine.setTestSuiteName('[WAC2.0][DeviceInteractionManager]', 10*1000);
//TestEngine.addTest(true,test_deviceinteraction_presence_001, "[WAC2.0][DeviceInteractionManager]test_deviceinteraction_presence_001");
//TestEngine.addTest(true,test_deviceinteraction_functions_002, "[WAC2.0][DeviceInteractionManager]test_deviceinteraction_functions_002");
//TestEngine.addTest(true,test_deviceinteraction_startNotify_003, "[WAC2.0][DeviceInteractionManager]test_deviceinteraction_startNotify_003");
//TestEngine.addTest(true,test_deviceinteraction_stopNotify_004, "[WAC2.0][DeviceInteractionManager]test_deviceinteraction_stopNotify_004");
TestEngine.addTest(true,test_deviceinteraction_startVibrate_005, "[WAC2.0][DeviceInteractionManager]test_deviceinteraction_startVibrate_005");
//TestEngine.addTest(true,test_deviceinteraction_stopVibrate_006, "[WAC2.0][DeviceInteractionManager]test_deviceinteraction_stopVibrate_006");
//TestEngine.addTest(true,test_deviceinteraction_lightOn_008, "[WAC2.0][DeviceInteractionManager]test_deviceinteraction_lightOn_008");
//TestEngine.addTest(true,test_deviceinteraction_lightOff_009, "[WAC2.0][DeviceInteractionManager]test_deviceinteraction_lightOff_009");
//TestEngine.addTest(true,test_deviceinteraction_setWallpaper_010, "[WAC2.0][DeviceInteractionManager]test_deviceinteraction_setWallpaper_010");
//=============================================================================
