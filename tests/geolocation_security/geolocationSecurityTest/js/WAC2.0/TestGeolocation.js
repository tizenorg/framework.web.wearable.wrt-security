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

function presenceTest()
{
    TestEngine.test("Checking checking", true);
    TestEngine.test("Checking Geolocation object", navigator.geolocation);

    TestEngine.test("Checking function getCurrentPosition",
        isFunction(navigator.geolocation.getCurrentPosition));
}

function accessTest()
{
    try {
        jsPrint("DEBUG POINT 0");
        var callbackObject = TestEngine.registerCallback("getCurrentPositionCallback",
                                                         localSuccessCallback,
                                                         localErrorCallback);
        jsPrint("DEBUG POINT 1");
        navigator.geolocation.getCurrentPosition(
            callbackObject.successCallback,
            callbackObject.errorCallback);
        jsPrint("DEBUG POINT 2");
    } catch (error) {
        jsPrint("DEBUG POINT 3");
        TestEngine.logErr("Error in: navigator.geolocation.getCurrentPosition");
    }
    jsPrint("DEBUG POINT 4");
}

TestEngine.setTestSuiteName("[WAC2.0][Geolocation]", 30*1000); // 30 seconds
TestEngine.addTest(true, presenceTest, "[WAC2.0][Geolocation] Geolocation prenence test");
TestEngine.addTest(true, accessTest, "[WAC2.0][Geolocation] Access test");
TestEngine.setFinalCallback(function(){ jsPrint("closing window"); window.close(); });
