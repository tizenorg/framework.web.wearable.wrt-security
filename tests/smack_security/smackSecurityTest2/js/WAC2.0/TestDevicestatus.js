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
 * This file contains the implementation of test contact class.
 *
 * @author      Pawel Misiak (p.misiak@samsung.com)
 * @author      Shi Hezhang (hezhang.shi@samsung.com)
 * @version     0.1
 */

var DevStatusObj = deviceapis.devicestatus;

var aspectsProperty=Object();
aspectsProperty['Battery']=['batteryLevel', 'batteryBeingCharged'];
aspectsProperty['CellularHardware']=['status'];
aspectsProperty['CellularNetwork']=['isInRoaming', 'signalStrength', 'operatorName'];
aspectsProperty['Device']=['imei', 'model', 'version', 'vendor'];
aspectsProperty['Display']=['resolutionHeight', 'pixelAspectRatio', 'dpiY', 'resolutionWidth', 'dpiX', 'colorDepth'];
aspectsProperty['MemoryUnit']=['size', 'removable', 'availableSize'];
aspectsProperty['OperatingSystem']=['language', 'version', 'name', 'vendor'];
aspectsProperty['WebRuntime']=['wacVersion', 'supportedImageFormats', 'version', 'name', 'vendor'];
aspectsProperty['WiFiHardware']=['status'];
aspectsProperty['WiFiNetwork']=['ssid', 'signalStrength', 'networkStatus'];

var wrongProperty=['', 'abc'];

var aspectsComponent=Object();
aspectsComponent['Battery']=['_default'];
aspectsComponent['CellularHardware']=['_default'];
aspectsComponent['CellularNetwork']=['_default'];
aspectsComponent['Device']=['_default'];
aspectsComponent['Display']=['_default', '_active'];
aspectsComponent['MemoryUnit']=['_default'];
aspectsComponent['OperatingSystem']=['_active', '_default'];
aspectsComponent['WebRuntime']=['_active', '_default'];
aspectsComponent['WiFiHardware']=['_default'];
aspectsComponent['WiFiNetwork']=['_default'];

//callbacks;
function emptyCallback() {
    jsPrint("empty callback");
}

function onValueRetrieved(value) {
    jsPrint("!!!!! value=" + value);
    TestEngine.test("return value is valid", (value != null));
}

function onError (error) {
    TestEngine.test("onError", false);
}

//DevStatus001;
function presenceTest()
{
    TestEngine.test("Checking deviceapis object", deviceapis);
    TestEngine.test("Checking Devicestatus object", DevStatusObj);

    TestEngine.test("Checking type of getComponents", isFunction(DevStatusObj.getComponents));
    TestEngine.test("Checking type of isSupported", isFunction(DevStatusObj.isSupported));
    TestEngine.test("Checking type of getPropertyValue", isFunction(DevStatusObj.getPropertyValue));
    TestEngine.test("Checking type of watchPropertyChange", isFunction(DevStatusObj.watchPropertyChange));
    TestEngine.test("Checking type of clearPropertyChange", isFunction(DevStatusObj.clearPropertyChange));
}

//DevStatus002;
function getCompomentInvalidParametersTest() {
    TestEngine.catchErrorType("code", 17, DevStatusObj, "getComponents");

    try {
        DevStatusObj.getComponents(undefined);
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        jsPrint("e.code=" + e.code);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.getComponents(null);
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        jsPrint("e.code=" + e.code);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.getComponents(1234);
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        jsPrint("e.code=" + e.code);
        TestEngine.test("exception catched", false);
    }
}

//DevStatus003;
function isSupportedInvalidParametersTest() {
    TestEngine.catchErrorType("code", 17, DevStatusObj, "isSupported");
    try {
        var stat = DevStatusObj.isSupported(undefined);
        TestEngine.test("exception should not be thrown", stat == false);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        jsPrint("e.code=" + e.code);
        TestEngine.test("exception catched", false);
    }

    try {
        var stat = DevStatusObj.isSupported(null);
        TestEngine.test("exception should not be thrown", stat == false);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        jsPrint("e.code=" + e.code);
        TestEngine.test("exception catched", false);
    }

    try {
        var stat = DevStatusObj.isSupported(1234);
        TestEngine.test("exception should not be thrown", stat == false);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        jsPrint("e.code=" + e.code);
        TestEngine.test("exception catched", false);
    }
}

//DevStatus004;
function getPropertyValueInvalidArgumentsTest() {
    var onInvalidValueError = function (error) {
        TestEngine.test("INVALID_VALUES_ERR", error.code == error.INVALID_VALUES_ERR);
    }
    var failedSuccess = function (value) {
        TestEngine.logErr("Success should not be called");
    }
    var cbObjInvalidErr = TestEngine.registerCallback("BatterybatteryLeveltest",
        failedSuccess,
        onInvalidValueError,
        6);

    try {
        DevStatusObj.getPropertyValue(null, null,{
            property:"batteryLevel",
            aspect:"Battery"
        });
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.getPropertyValue(null, cbObjInvalidErr.errorCallback,{
            property:"batteryLevel",
            aspect:"Battery"
        });
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.getPropertyValue(cbObjInvalidErr.successCallback, cbObjInvalidErr.errorCallback, 1);
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.getPropertyValue(cbObjInvalidErr.successCallback, cbObjInvalidErr.errorCallback, {
            property:"batteryLevel"
        });
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.getPropertyValue(cbObjInvalidErr.successCallback, cbObjInvalidErr.errorCallback, {
            property:"batteryLevel",
            aspect:"invalid"
        });
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.getPropertyValue(cbObjInvalidErr.successCallback, cbObjInvalidErr.errorCallback, {
            aspect:"invalid"
        });
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.getPropertyValue(cbObjInvalidErr.successCallback, cbObjInvalidErr.errorCallback, {
            invalid1:"",
            invalid2:""
        });
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }
}

//DevStatus005;
function watchPropertyChangeInvalidParametersTest() {

    var callbackFunction = function (value) {
        TestEngine.test("SuccessCallback should not be thrown", false);
    }
    var onSuccessError = function(err) {
        TestEngine.logOK("Error: " + err.code);
        TestEngine.test("Error callback called as expected", true);
    }

    try {
        DevStatusObj.watchPropertyChange(callbackFunction, onSuccessError, 1);
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.watchPropertyChange(null, null, 1);
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.watchPropertyChange(callbackFunction, onSuccessError, {
            property:"batteryLevel"
        });
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.watchPropertyChange(callbackFunction, onSuccessError, {
            property:"batteryLevel",
            aspect:"invalid"
        });
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.watchPropertyChange(callbackFunction, onSuccessError, {
            invalid:"batteryLevel",
            invalid:"Battery"
        });
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.watchPropertyChange(callbackFunction, onSuccessError, {
            property:"invalid",
            aspect:"invalid"
        });
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

}

//DevStatus006;
function clearPropertyChangeInvalidParametersTest() {
    var callbackFunction = function (value) {
        TestEngine.logErr("Function called as watch id ???", false);
    }

    try {
        DevStatusObj.clearPropertyChange("invalid int value");
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }

    try {
        DevStatusObj.clearPropertyChange(callbackFunction);
        TestEngine.test("exception should be thrown", false);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", e.code==e.TYPE_MISMATCH_ERR);
    }

    try {
        DevStatusObj.clearPropertyChange(11111111);
        TestEngine.test("exception should not be thrown", true);
    } catch(e) {
        jsPrint("e.message=" + e.message);
        TestEngine.test("exception catched", false);
    }
}

//DevStatus007;
function getComponentsTest() {
    for (var aspect in aspectsComponent) {
        var retComponent = DevStatusObj.getComponents(aspect);
        aspectsComponent[aspect].sort();
        retComponent.sort();
        jsPrint("retComponent=" + retComponent);
        jsPrint("aspectsComponent[aspect]="+aspectsComponent[aspect]);
        TestEngine.test("length of component for aspect = " + aspect + "is proper", retComponent.length == aspectsComponent[aspect].length);

        for (var i =0; i<retComponent.length; i++) {
            TestEngine.test("component for aspect " + aspect + " table is equal", retComponent[i] == aspectsComponent[aspect][i]);
        }
    }
}

//DevStatus008;
function isSupportedTest() {
    //aspect check;
    for (var aspect in aspectsProperty) {
        TestEngine.test("Aspect " + aspect + " check", DevStatusObj.isSupported(aspect));
    }
    TestEngine.test("Aspect empty check", !DevStatusObj.isSupported(""));
    TestEngine.test("Aspect random abc check", !DevStatusObj.isSupported("abc"));

    //aspect and property check;
    for (var aspect in aspectsProperty) {
        for (var property in aspectsProperty[aspect]) {
            var propertyName = aspectsProperty[aspect][property];
            TestEngine.test("Aspect " + aspect + "/" + propertyName + " check", DevStatusObj.isSupported(aspect, propertyName));
        }
        TestEngine.test("Aspect " + aspect + "/null check", DevStatusObj.isSupported(aspect, null));
    }

    //aspect and wrong property check;
    for (var aspect in aspectsProperty) {
        for (var property in wrongProperty) {
            var propertyName = wrongProperty[property];
            TestEngine.test("Wrong aspect " + aspect + "/" + propertyName  + " check", !DevStatusObj.isSupported(aspect, propertyName ));
        }
    }
}

//DevStatus009-1;
function getPropertyValueTest1a() {
    var cbObj = TestEngine.registerCallback("BatterybatteryLeveltest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"batteryLevel",
            aspect:"Battery"
        }
        );
}

//DevStatus009-1;
function getPropertyValueTest1b() {
    var cbObj = TestEngine.registerCallback("BatterybatteryBeingChargedtest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"batteryBeingCharged",
            aspect:"Battery"
        }
        );
}

//DevStatus009-2;
function getPropertyValueTest2a() {
    var cbObj = TestEngine.registerCallback("CellularHardwarestatustest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"status",
            aspect:"CellularHardware"
        }
        );
}

//DevStatus009-3;
function getPropertyValueTest3a() {
    var cbObj = TestEngine.registerCallback("CellularNetworkisInRoamingtest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"isInRoaming",
            aspect:"CellularNetwork"
        }
        );
}

//DevStatus009-2;
function getPropertyValueTest3b() {
    var cbObj = TestEngine.registerCallback("CellularNetworksignalStrengthtest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"signalStrength",
            aspect:"CellularNetwork"
        }
        );
}

//DevStatus009-2;
function getPropertyValueTest3c() {
    var cbObj = TestEngine.registerCallback("CellularNetworkoperatorNametest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"operatorName",
            aspect:"CellularNetwork"
        }
        );
}

//DevStatus009-4;
function getPropertyValueTest4a() {
    var cbObj = TestEngine.registerCallback("Deviceimeitest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"imei",
            aspect:"Device"
        }
        );
}

//DevStatus009-4;
function getPropertyValueTest4b() {
    var cbObj = TestEngine.registerCallback("Devicemodeltest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"model",
            aspect:"Device"
        }
        );
}

//DevStatus009-4;
function getPropertyValueTest4c() {
    var cbObj = TestEngine.registerCallback("Deviceversiontest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"version",
            aspect:"Device"
        }
        );
}

//DevStatus009-4;
function getPropertyValueTest4d() {
    var cbObj = TestEngine.registerCallback("Devicevendortest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"vendor",
            aspect:"Device"
        }
        );
}

//DevStatus009-5;
function getPropertyValueTest5a() {
    var cbObj = TestEngine.registerCallback("DisplayresolutionHeighttest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"resolutionHeight",
            aspect:"Display"
        }
        );
}

//DevStatus009-5;
function getPropertyValueTest5b() {
    var cbObj = TestEngine.registerCallback("DisplaypixelAspectRatiotest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"pixelAspectRatio",
            aspect:"Display"
        }
        );
}

//DevStatus009-5;
function getPropertyValueTest5c() {
    var cbObj = TestEngine.registerCallback("DisplaydpiYtest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"dpiY",
            aspect:"Display"
        }
        );
}

//DevStatus009-5;
function getPropertyValueTest5d() {
    var cbObj = TestEngine.registerCallback("DisplayresolutionWidthtest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"resolutionWidth",
            aspect:"Display"
        }
        );
}

//DevStatus009-5;
function getPropertyValueTest5e() {
    var cbObj = TestEngine.registerCallback("DisplaydpiXtest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"dpiX",
            aspect:"Display"
        }
        );
}

//DevStatus009-5;
function getPropertyValueTest5f() {
    var cbObj = TestEngine.registerCallback("DisplaycolorDepthtest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"colorDepth",
            aspect:"Display"
        }
        );
}

//DevStatus009-6;
function getPropertyValueTest6a() {
    var cbObj = TestEngine.registerCallback("MemoryUnitsizetest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"size",
            aspect:"MemoryUnit"
        }
        );
}

//DevStatus009-6;
function getPropertyValueTest6b() {
    var cbObj = TestEngine.registerCallback("MemoryUnitremovabletest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"removable",
            aspect:"MemoryUnit"
        }
        );
}

//DevStatus009-6;
function getPropertyValueTest6c() {
    var cbObj = TestEngine.registerCallback("MemoryUnitavailableSizetest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"availableSize",
            aspect:"MemoryUnit"
        }
        );
}

//DevStatus009-7;
function getPropertyValueTest7a() {
    var cbObj = TestEngine.registerCallback("OperatingSystemlanguagetest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"language",
            aspect:"OperatingSystem"
        }
        );
}

//DevStatus009-7;
function getPropertyValueTest7b() {
    var cbObj = TestEngine.registerCallback("OperatingSystemversiontest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"version",
            aspect:"OperatingSystem"
        }
        );
}

//DevStatus009-7;
function getPropertyValueTest7c() {
    var cbObj = TestEngine.registerCallback("OperatingSystemnametest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"name",
            aspect:"OperatingSystem"
        }
        );
}

//DevStatus009-7;
function getPropertyValueTest7d() {
    var cbObj = TestEngine.registerCallback("OperatingSystemvendortest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"vendor",
            aspect:"OperatingSystem"
        }
        );
}

//DevStatus009-8;
function getPropertyValueTest8a() {
    var cbObj = TestEngine.registerCallback("WebRuntimeversiontest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"version",
            aspect:"WebRuntime"
        }
        );
}

//DevStatus009-8;
function getPropertyValueTest8b() {
    var cbObj = TestEngine.registerCallback("WebRuntimenametest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"name",
            aspect:"WebRuntime"
        }
        );
}

//DevStatus009-8;
function getPropertyValueTest8c() {
    var cbObj = TestEngine.registerCallback("WebRuntimevendortest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"vendor",
            aspect:"WebRuntime"
        }
        );
}

//DevStatus009-8;
function getPropertyValueTest8d() {
    var cbObj = TestEngine.registerCallback("WebRuntimewacVersiontest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"wacVersion",
            aspect:"WebRuntime"
        }
        );
}

//DevStatus009-8;
function getPropertyValueTest8e() {
    var cbObj = TestEngine.registerCallback("WebRuntimesupportedImageFormatstest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"supportedImageFormats",
            aspect:"WebRuntime"
        }
        );
}

//DevStatus009-9;
function getPropertyValueTest9a() {
    var cbObj = TestEngine.registerCallback("WiFiHardwarestatustest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"status",
            aspect:"WiFiHardware"
        }
        );
}

//DevStatus009-10;
function getPropertyValueTest10a() {
    var cbObj = TestEngine.registerCallback("WiFiNetworkssidtest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"ssid",
            aspect:"WiFiNetwork"
        }
        );
}

//DevStatus009-10;
function getPropertyValueTest10b() {
    var cbObj = TestEngine.registerCallback("WiFiNetworksignalStrengthtest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"signalStrength",
            aspect:"WiFiNetwork"
        }
        );
}

//DevStatus009-10;
function getPropertyValueTest10c() {
    var cbObj = TestEngine.registerCallback("WiFiNetworknetworkStatustest",
        onValueRetrieved,
        onError
        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"networkStatus",
            aspect:"WiFiNetwork"
        }
        );
}

function onCellidRetrieved(value) {
    jsPrint("!!!!! mcc=" + value.mcc);
    jsPrint("!!!!! mnc=" + value.mnc);
    jsPrint("!!!!! cellid=" + value.cellid);
    jsPrint("!!!!! lac=" + value.lac);
    jsPrint("!!!!! rat=" + value.rat);
    TestEngine.test("success callback executed", (value != null));
}

function acceptError(){
    TestEngine.test("Error occure as expected", true);
}

function rejectSuccess(){
    TestEngine.test("Success - error expected", false);
}

//DevStatus-extra;
function getPropertyValueTestCellid() {
    var cbObj = TestEngine.registerCallback("CellularNetworkcellidtest",
        rejectSuccess,
        acceptError);
//    var cbObj = TestEngine.registerCallback("CellularNetworkcellidtest",
//        onCellidRetrieved,
//        onError
//        );

    DevStatusObj.getPropertyValue(
        cbObj.successCallback, cbObj.errorCallback,
        {
            property:"cellid",
            aspect:"CellularNetwork"
        }
        );
}

//DevStatus010;
function watchClearPropertyChangeTest() {
    var watcherId1 = 0;
    var watcherId2 = 0;
    var watcherId3 = 0;

    var callbackFunction1 = function (value) {
        TestEngine.test("Callback 1 called: " +value, true);
        DevStatusObj.clearPropertyChange(watcherId1);

    }
    var callbackFunction2 = function (value) {
        TestEngine.test("Callback 2 called: " +value, true);
        DevStatusObj.clearPropertyChange(watcherId2);

    }
    var callbackFunction3 = function (value) {
        TestEngine.test("Callback 3 called: " +value, true);
        DevStatusObj.clearPropertyChange(watcherId3);
    }

    var call1 = TestEngine.registerCallback("watchPropertyCallback1", callbackFunction1, onError);
    var call2 = TestEngine.registerCallback("watchPropertyCallback2", callbackFunction2, onError);
    var call3 = TestEngine.registerCallback("watchPropertyCallback3", callbackFunction3, onError);

    watcherId1 = DevStatusObj.watchPropertyChange(
        call1.successCallback,
        call1.errorCallback,
        {
            property:"batteryLevel",
            aspect:"Battery"
        },

        {
            maxNotificationInterval:2000 //every 2 second;
        }
        );

    watcherId2 = DevStatusObj.watchPropertyChange(
        call2.successCallback,
        call2.errorCallback,
        {
            property:"availableSize",
            aspect:"MemoryUnit"
        },

        {
            maxNotificationInterval:1000 //every 1 second;
        }
        );

    watcherId3 = DevStatusObj.watchPropertyChange(
        call3.successCallback,
        call3.errorCallback,
        {
            aspect:"Battery",
            property:"batteryLevel"
        },

        {
            maxNotificationInterval:2000 //every 2 second;
        }
        );
}

function watchClearPropertyChangeTest1() {
    var watchId = 0;
    var callbackFunction1 = function (value) {
        TestEngine.test("Callback called: " + value, true);
        DevStatusObj.clearPropertyChange(watchId);
    }
    var callObj = TestEngine.registerCallback("watchPropertyCallback", callbackFunction1, onError);

    watchId = DevStatusObj.watchPropertyChange(
        callObj.successCallback,
        callObj.errorCallback,
        {
            property:"version",
            aspect:"WebRuntime"
        },

        {
            maxNotificationInterval:2000 //every 2 second;
        }
        );
}

function watchClearPropertyChangeTest2() {
    var watchId = 0;
    var callbackFunction1 = function (value) {
        TestEngine.test("Callback called: " + value, true);
        DevStatusObj.clearPropertyChange(watchId);
    }
    var callObj = TestEngine.registerCallback("watchPropertyCallback", callbackFunction1, onError);

    watchId = DevStatusObj.watchPropertyChange(
        callObj.successCallback,
        callObj.errorCallback,
        {
            property:"version",
            aspect:"WebRuntime"
        },

        {
            minNotificationInterval:2000 //every 2 second;
        }
        );
}

function watchClearPropertyChangeTest3() {
    var watchId = 0;
    var callbackFunction1 = function (value) {
        TestEngine.test("Callback called: " + value, true);
        DevStatusObj.clearPropertyChange(watchId);
    }
    var callObj = TestEngine.registerCallback("watchPropertyCallback", callbackFunction1, onError);

    watchId = DevStatusObj.watchPropertyChange(
        callObj.successCallback,
        callObj.errorCallback,
        {
            property:"version",
            aspect:"WebRuntime"
        }
        );
}

function watchClearPropertyChangeTest4() {
    var callbackCnt1 = 0;

    var callbackFunction1 = function (value) {
        jsPrint("callbackFunction1, value = " + value);
        if (callbackCnt1 == 0) {
            TestEngine.test("Callback called once", true);
        } else {
            TestEngine.test("Callback called more", false);
        }
        callbackCnt1++;
    }

    var callObj = TestEngine.registerCallback("callback counter check",
        callbackFunction1, onError);

    var watcherId1 = DevStatusObj.watchPropertyChange(
        callObj.successCallback,
        callObj.errorCallback,
        {
            property:"batteryLevel",
            aspect:"Battery"
        },

        {
            minChangePercent:50
        }
        );

    var finalCallback = TestEngine.registerCallback("callback counter check",
        function() {
            jsPrint("TimeOut executed, trying to clear watch, id=" + watcherId1);

            DevStatusObj.clearPropertyChange(watcherId1);

            TestEngine.test("there should be invoked callback", callbackCnt1 == 1);
        }
        );

    setTimeout(finalCallback.successCallback,
        2500); //wait before continuing;
}

function cleaning() {
    DevStatusObj = null;
    aspectsProperty = null;
    wrongProperty = null;
    aspectsComponent = null;
    TestEngine.test("null==DevStatusObj", null==DevStatusObj);
    TestEngine.test("null==aspectsProperty", null==aspectsProperty);
    TestEngine.test("null==wrongProperty", null==wrongProperty);
    TestEngine.test("null==aspectsComponent", null==aspectsComponent);
}

//=============================================================================;

TestEngine.setTestSuiteName("[WAC2.0][Devicestatus]", 10*1000); //5sec time out for callbacks;
//TestEngine.addTest(true, presenceTest, "[WAC2.0][Devicestatus] Devicestatus functions presence test");
TestEngine.addTest(true, getPropertyValueTestCellid, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTestCellid");
//
//TestEngine.addTest(true, getPropertyValueInvalidArgumentsTest, "[WAC2.0][Devicestatus] Devicestatus invalid argument test (getPropertyValue)");
//TestEngine.addTest(true, watchPropertyChangeInvalidParametersTest, "[WAC2.0][Devicestatus] Devicestatus invalid argument test (watchPropertyChange)");
//TestEngine.addTest(true, clearPropertyChangeInvalidParametersTest, "[WAC2.0][Devicestatus] Devicestatus invalid argument test (clearPropertyChange)");
//TestEngine.addTest(true, getCompomentInvalidParametersTest, "[WAC2.0][Devicestatus] Devicestatus invalid argument test (getCompoment)");
//TestEngine.addTest(true, isSupportedInvalidParametersTest, "[WAC2.0][Devicestatus] Devicestatus invalid argument test (isSupported)");
//
//TestEngine.addTest(true, getComponentsTest, "[WAC2.0][Devicestatus] Devicestatus getComponents");
//
//TestEngine.addTest(true, isSupportedTest, "[WAC2.0][Devicestatus] Devicestatus isSupported");
//
//TestEngine.addTest(true, getPropertyValueTest1a, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest1a");
//TestEngine.addTest(true, getPropertyValueTest1b, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest1b");
//TestEngine.addTest(true, getPropertyValueTest2a, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest2a");
//TestEngine.addTest(true, getPropertyValueTest3a, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest3a");
//TestEngine.addTest(true, getPropertyValueTest3b, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest3b");
//TestEngine.addTest(true, getPropertyValueTest3c, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest3c");
//TestEngine.addTest(true, getPropertyValueTest4a, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest4a");
//TestEngine.addTest(true, getPropertyValueTest4b, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest4b");
//TestEngine.addTest(true, getPropertyValueTest4c, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest4c");
//TestEngine.addTest(true, getPropertyValueTest4d, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest4d");
//TestEngine.addTest(true, getPropertyValueTest5a, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest5a");
//TestEngine.addTest(true, getPropertyValueTest5b, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest5b");
//TestEngine.addTest(true, getPropertyValueTest5c, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest5c");
//TestEngine.addTest(true, getPropertyValueTest5d, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest5d");
//TestEngine.addTest(true, getPropertyValueTest5e, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest5e");
//TestEngine.addTest(true, getPropertyValueTest5f, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest5f");
//TestEngine.addTest(true, getPropertyValueTest6a, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest6a");
//TestEngine.addTest(true, getPropertyValueTest6b, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest6b");
//TestEngine.addTest(true, getPropertyValueTest6c, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest6c");
//TestEngine.addTest(true, getPropertyValueTest7a, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest7a");
//TestEngine.addTest(true, getPropertyValueTest7b, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest7b");
//TestEngine.addTest(true, getPropertyValueTest7c, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest7c");
//TestEngine.addTest(true, getPropertyValueTest7d, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest7d");
//TestEngine.addTest(true, getPropertyValueTest8a, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest8a");
//TestEngine.addTest(true, getPropertyValueTest8b, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest8b");
//TestEngine.addTest(true, getPropertyValueTest8c, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest8c");
//TestEngine.addTest(true, getPropertyValueTest8d, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest8d");
//TestEngine.addTest(true, getPropertyValueTest8e, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest8e");
//TestEngine.addTest(true, getPropertyValueTest9a, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest9a");
//TestEngine.addTest(true, getPropertyValueTest10a, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest10a");
//TestEngine.addTest(true, getPropertyValueTest10b, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest10b");
//TestEngine.addTest(true, getPropertyValueTest10c, "[WAC2.0][Devicestatus] Devicestatus getPropertyValueTest10c");
//
//TestEngine.addTest(true, watchClearPropertyChangeTest, "[WAC2.0][Devicestatus] Devicestatus watchClearPropertyChangeTest");
//TestEngine.addTest(true, watchClearPropertyChangeTest1, "[WAC2.0][Devicestatus] Devicestatus watchClearPropertyChangeTest1");
//TestEngine.addTest(true, watchClearPropertyChangeTest2, "[WAC2.0][Devicestatus] Devicestatus watchClearPropertyChangeTest2");
//TestEngine.addTest(true, watchClearPropertyChangeTest3, "[WAC2.0][Devicestatus] Devicestatus watchClearPropertyChangeTest3");
//TestEngine.addTest(true, watchClearPropertyChangeTest4, "[WAC2.0][Devicestatus] Devicestatus watchClearPropertyChangeTest4");

TestEngine.addTest(true, cleaning, "[WAC2.0][Devicestatus] Cleaning data");

