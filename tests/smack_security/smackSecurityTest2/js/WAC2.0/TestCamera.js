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
 * This file contains the implementation of test for camera module classes.
 *
 * @author      Wojciech Bielawski (w.bielawski@samsung.com)
 * @version     0.1
 */

var gcameras;
var mainCamera;
var callbackExecuted = false;
var previewId = "cameraPreview";

var VideoTime = 5000;

TestEngine.setErrorType(Object);
TestEngine.setErrorField('code');
var TYPE_MISMATCH_ERR = 17;
var INVALID_VALUES_ERR = 22;
var SECURITY_ERR = 18;
var NOT_FOUND_ERR = 8;


/*
 * Function to generate unique filename
 */
function GetFileName(prefix, suffix)
{
    var date = new Date();
    var name = prefix + date.getTime() + suffix;
    TestEngine.log(name);
    return name;
}

function waitMs(ms)
{
    ms += new Date().getTime();
    while (new Date() < ms){}
}


function acceptError()
{
    TestEngine.test("Error occure", true);
}

function rejectSuccess()
{
    TestEngine.test("Success - error expected", false);
}

/* Cam001 */
function TestGetCameras()
{
    var obj = TestEngine.registerCallback(
        "getCameras",
        rejectSuccess,
        acceptError);
//    var obj = TestEngine.registerCallback(
//        "getCameras",
//        function(cameras){
//            if (cameras.length > 0) {
//                gcameras = cameras;
//                mainCamera = cameras[0];
//                TestEngine.log("Cameras size: " + cameras.length);
//                TestEngine.test("Size of cameras array", cameras.length == 2);
//            } else {
//                TestEngine.logErr("No camera found");
//            }
//        },
//        function(err){
//            TestEngine.logErr("Get cameras failed. Exception code: " + err.code);
//        });
    try {
        deviceapis.camera.getCameras(obj.successCallback, obj.errorCallback);
    } catch(e) {
        TestEngine.logErr("Exception while getting cameras");
    }
}

/* Cam002 */
function TestCaseCameraArrayProperties()
{
    TestEngine.test("Camera array", isArray(gcameras));
    TestEngine.test("Camera array length", gcameras.length == 2);
}

function TestJavaScript()
{
    try
    {
        var divElement = document.getElementById("video");
        var para = document.createElement("p");
        para.setAttribute("style","color:blue;");
        var text = document.createTextNode("this is my text");
        para.appendChild(text);
        divElement.appendChild(para);
    }
    catch(e)
    {
        TestEngine.log("Exception: " + e);
    }
    TestEngine.log("Test finish");
}

/* Cam003 */
function TestCameraFunctionality_PreviewStart()
{
    TestEngine.log("Create Preview");

    function successCallback(obj)
    {
        try
        {
            TestEngine.test("Type of preview node", "object" === typeof(obj));
            var divElement = document.getElementById("video");
            TestEngine.test("Type of preview node parent", "object" === typeof(divElement));
            divElement.appendChild(obj);
            obj.id = previewId;
            TestEngine.test("preview node id", previewId === obj.id);
            obj.style.visibility = "visible";
            TestEngine.test("Preview created", true);
        }
        catch(e)
        {
            TestEngine.test("Preview created", false);
            TestEngine.logErr("exception: " + e);
        }
    }

    function errorCallback()
    {
        TestEngine.test("Preview created", false);
    }

    try
    {
        var obj = TestEngine.registerCallback(
                "createPreviewNode",
                successCallback,
                errorCallback);
                gcameras[0].createPreviewNode(obj.successCallback, obj.errorCallback);
    }
    catch(e)
    {
        TestEngine.test("Preview created", false);
        TestEngine.logErr("exception: " + e);
    }
}

function TestCameraFunctionality_PreviewStop()
{
    function stopFunction()
    {
        TestEngine.log("stopping");
        var divElement = document.getElementById("video");
        var previewNode = document.getElementById(previewId);

        TestEngine.test("Type of preview node parent", "object" === typeof(divElement));
        TestEngine.test("Type of preview node parent", "object" === typeof(previewNode));

        previewNode.style.visibility = "hidden";
        divElement.removeChild(previewNode);

        TestEngine.test("Preview removed", true);
    }

    var timeout = 5000;
    TestEngine.log("preview will end in " + timeout + " miliseconds");
    var obj = TestEngine.registerCallback(
            "createPreviewNode",
            stopFunction,
            undefined);
    setTimeout(obj.successCallback, timeout);
}

function TestCameraFunctionality_TakePicture()
{
    function success(filename)
    {
        TestEngine.log("filename = " + filename);
        TestEngine.test("image captured", true)
    }

    function error(e)
    {
        TestEngine.test("image captured", false)
    }

    TestEngine.log("Take picutre");
    var requestedFileName = GetFileName("images/test_photo_",".jpg");
    var obj = TestEngine.registerCallback("captureImage", success, error);
    gcameras[0].captureImage(obj.successCallback,
                             obj.errorCallback,
                             {destinationFilename:requestedFileName, highRes:false});
}

var callbackExecuted = false;
function TestCameraFunctionality_Video()
{
    //wait for stabilization
    waitMs(3000);

    function success(filename)
    {
        TestEngine.test("video capture", true);
        callbackExecuted = true;
    }

    function error(e)
    {
        TestEngine.test("video captured", false);
        callbackExecuted = true;
    }

    function checkCompletness()
    {
        if(!callbackExecuted)
        {
            TestEngine.test("Video capture time out", false);
        }
    }

    TestEngine.log("Video Recording");
    var requestedFileName = GetFileName("videos/test_video_",".mp4");
    var obj = TestEngine.registerCallback("captureVideo", success, error);
    gcameras[0].startVideoCapture(obj.successCallback,
                                  obj.errorCallback,
                                  {destinationFilename:requestedFileName, highRes:false});
    TestEngine.log("Start :" + Date());

    function stopVideo()
    {
        try{
            TestEngine.log("Stop :" + Date());
            gcameras[0].stopVideoCapture();

            TestEngine.log("Wait :" + Date());
            //check if allback has been executed
            setTimeout(checkCompletness, 10000);
        }
        catch(e)
        {
            TestEngine.log("Exception: " + e);
        }
    }

    setTimeout(stopVideo, VideoTime);
}

function TestCameraCancel()
{
    var number =5;

    var expectedPhotos = 4;

    var done = 0;



    function success(filename)
    {
        done = done +1;
        TestEngine.log("filename = " + filename);
        TestEngine.test("image captured", true)
        checkStatus();
    }

    function error(e)
    {
        done = done +1;
        checkStatus();
    }

    var obj = TestEngine.registerCallback("cancel test ", testPassed, testFail);

    function checkStatus()
    {
        if(done > expectedPhotos)
        {
            obj.errorCallback();
        }

        if(done == expectedPhotos)
        {
            obj.successCallback();
        }
    }

    function testFail()
    {
            TestEngine.test("Cancel take picture", false)
    }

    function testPassed()
    {
            TestEngine.test("Cancel take picture", true)
    }


    TestEngine.log("Take picutre");
    for (i=1;i<number+1;i++)
    {
        var requestedFileName = GetFileName("images/test_photo_"+i+"_",".jpg");

        var pending=gcameras[0].captureImage(success,
                                 error,
                                 {destinationFilename:requestedFileName, highRes:false});

        if(i==4){
            TestEngine.log("Operation will be canceled");
            pending.cancel();
            TestEngine.log("Operation should be canceled");
        }
  }


}

//******************************* new to review below *******************************

function parameterCorrectnessSuccessCallback(){
    TestEngine.logErr("SuccessCallback on invalid parameter");
}

function parameterCorrectnessErrorCallback(err){
    TestEngine.logErr("ErrorCallback invoked on invalid parameter (error should be thrown)");
}

// Cam0014
// Input: errorCallback = null, others = valid
// Result: Test passes.
function TestGetCamerasNullErrorCallback()
{
    function GetCamerasOnSuccess(cameras)
    {
        TestEngine.test("getCameras()", isArray(cameras));
    }

    var cb = TestEngine.registerCallback("getCameras", GetCamerasOnSuccess, null);
    deviceapis.camera.getCameras(cb.successCallback, null);
}

// Cam0015
// Input: successCallback = null, others = valid
// Result: Test fails with error callback called with INVALID_VALUES_ERR.
function TestGetCamerasNullSuccessCallback()
{
    function GetCamerasOnError(error)
    {
        TestEngine.test("getCameras()", (error.code == INVALID_VALUES_ERR));
    }

    var cb = TestEngine.registerCallback("getCameras", null, GetCamerasOnError);
    deviceapis.camera.getCameras(null, cb.errorCallback);
}

// Cam0016
// Input: successCallback = undefined, others = valid
// Result: Test fails with TYPE_MISMATCH_ERR thrown in place.
function TestGetCamerasUndefinedSuccessCallback()
{
    function GetCamerasOnError(error)
    {
        TestEngine.test("getCameras()", false);
    }

    TestEngine.testPresetError(
        "getCameras()",
        function() {
            deviceapis.camera.getCameras(undefined, GetCamerasOnError);
        },
        TYPE_MISMATCH_ERR
    );
}

// Cam0017
// Input: successCallback = null, errorCallback = null
// Result: Test fails silently.
function TestGetCamerasNullCallbacks()
{
    testNoExceptionWithMessage("getCameras()", function() {
        deviceapis.camera.getCameras(null, null);
    });
}

// Cam0018
// Input: errorCallback = not passed, others = valid
// Result: Test passes.
function TestGetCamerasNoErrorCallback()
{
    function GetCamerasOnSuccess(cameras)
    {
        TestEngine.test("getCameras()", isArray(cameras));
    }

    var cb = TestEngine.registerCallback("getCameras", GetCamerasOnSuccess, null);
    deviceapis.camera.getCameras(cb.successCallback);
}

// Cam0019
// Result: Test passes.
function TestCameraId()
{
    TestEngine.test("camaras available", isArray(gcameras) && gcameras.length > 0);
    for (var i = 0; i < gcameras.length; ++i) {
        TestEngine.test("id", gcameras[i].id === "front" || gcameras[i].id === "rear");
    }
}

// Cam0020
// Input: options = null, others = valid
// Result: Test passes.
function TestCaptureImageNullOptions()
{
    function CaptureImageOnSuccess(filename)
    {
        TestEngine.test("captureImage()", true);
    }
    function CaptureImageOnError(error)
    {
        TestEngine.test("captureImage()", false)
    }

    var cb = TestEngine.registerCallback("captureImage", CaptureImageOnSuccess, CaptureImageOnError);
    gcameras[0].captureImage(cb.successCallback, cb.errorCallback, null);
}

// Cam0021
// Input: options = undefined, others = valid
// Result: Test passes.
function TestCaptureImageUndefinedOptions()
{
    function CaptureImageOnSuccess(filename)
    {
        TestEngine.test("captureImage()", true);
    }
    function CaptureImageOnError(error)
    {
        TestEngine.test("captureImage()", false)
    }

    var cb = TestEngine.registerCallback("captureImage", CaptureImageOnSuccess, CaptureImageOnError);
    gcameras[0].captureImage(cb.successCallback, cb.errorCallback, undefined);
}

// Cam0022
// Input: errorCallback = null, others = valid
// Result: Test passes.
function TestCaptureImageNullErrorCallback()
{
    var options = {
        destinationFilename: 'images/TestCaptureImageNullErrorCallback.jpg'
    };
    function CaptureImageOnSuccess(filename)
    {
        // Don't compare paths if 'images' is passed as virtual root since Tizen
        // points 'images' to the same location as 'videos' and returns filename
        // with 'videos' virtual root instead of 'images'.
        // TestEngine.test("captureImage()", (options.destinationFilename == filename));
        TestEngine.test("captureImage()", true);
    }

    var cb = TestEngine.registerCallback("captureImage", CaptureImageOnSuccess, null);
    gcameras[0].captureImage(cb.successCallback, null, options);
}

// Cam0023
// Input: successCallback = null, options = omitted, others = valid
// Result: Test fails with error callback called with INVALID_VALUES_ERR.
function TestCaptureImageNullSuccessCallback()
{
    function CaptureImageOnError(error)
    {
        TestEngine.test("captureImage()", (error.code == INVALID_VALUES_ERR));
    }

    var cb = TestEngine.registerCallback("captureImage", null, CaptureImageOnError);
    gcameras[0].captureImage(null, cb.errorCallback);
}

// Cam0024
// Input: successCallback = undefined, options = omitted, others = valid
// Result: Test fails with TYPE_MISMATCH_ERR thrown in place.
function TestCaptureImageUndefinedSuccessCallback()
{
    function CaptureImageOnError(error)
    {
        TestEngine.test("captureImage()", false);
    }

    TestEngine.testPresetError(
        "captureImage()",
        function() {
            gcameras[0].captureImage(undefined, CaptureImageOnError);
        },
        TYPE_MISMATCH_ERR
    );
}

// Cam0025
// Input: successCallback = null, errorCallback = null, options = omitted
// Result: Test fails silently.
function TestCaptureImageNullCallbacks()
{
    testNoExceptionWithMessage("captureImage()", function() {
        gcameras[0].captureImage(null, null);
    });
}

// Cam0026
// Input: errorCallback = omitted, options = omitted, others = valid
// Result: Test passes.
function TestCaptureImageNoErrorCallback()
{
    function CaptureImageOnSuccess(filename)
    {
        TestEngine.test("captureImage()", true);
    }

    var cb = TestEngine.registerCallback("captureImage", CaptureImageOnSuccess, null);
    gcameras[0].captureImage(cb.successCallback);
}

// Cam0027
// Input: options = invalid filename, others = valid
// Result: Test passes.
function TestCaptureImageInvalidFilename()
{
    var options = {
        destinationFilename: {}
    };
    function CaptureImageOnError(error)
    {
        TestEngine.test("captureImage()", false);
    }
    function CaptureImageOnSuccess(filename)
    {
        TestEngine.test("captureImage()", true);
    }

    var cb = TestEngine.registerCallback("captureImage", CaptureImageOnSuccess, CaptureImageOnError);
    gcameras[0].captureImage(cb.successCallback, cb.errorCallback, options);
}

// Cam0028
// Input: options = invalid highRes, others = valid
// Result: Test passes.
function TestCaptureImageInvalidHighRes()
{
    var options = {
        highRes: {}
    };
    function CaptureImageOnError(error)
    {
        TestEngine.test("captureImage()", false);
    }
    function CaptureImageOnSuccess(filename)
    {
        TestEngine.test("captureImage()", true);
    }

    var cb = TestEngine.registerCallback("captureImage", CaptureImageOnSuccess, CaptureImageOnError);
    gcameras[0].captureImage(cb.successCallback, cb.errorCallback, options);
}

// Cam0029
// Input: options = null, others = valid
// Result: Test passes.
function TestStartVideoCaptureNullOptions()
{
    function Step1()
    {
        function StartVideoCaptureOnSuccess(filename)
        {
            TestEngine.test("startVideoCapture()", true);
        }
        function StartVideoCaptureOnError(error)
        {
            TestEngine.test("startVideoCapture()", false)
        }
        var cb = TestEngine.registerCallback("startVideoCapture", StartVideoCaptureOnSuccess, StartVideoCaptureOnError);
        gcameras[0].startVideoCapture(cb.successCallback, cb.errorCallback, null);
    }

    function Step2()
    {
        gcameras[0].stopVideoCapture();
    }

    var steps = new Array(Step1, Step2);
    TestEngine.executeSteps(steps, 4000);
}

// Cam0030
// Input: options = undefined, others = valid
// Result: Test passes.
function TestStartVideoCaptureUndefinedOptions()
{
    function Step1()
    {
        function StartVideoCaptureOnSuccess(filename)
        {
            TestEngine.test("startVideoCapture()", true);
        }
        function StartVideoCaptureOnError(error)
        {
            TestEngine.test("startVideoCapture()", false)
        }

        var cb = TestEngine.registerCallback("startVideoCapture", StartVideoCaptureOnSuccess, StartVideoCaptureOnError);
        gcameras[0].startVideoCapture(cb.successCallback, cb.errorCallback, undefined);
    }

    function Step2()
    {
        gcameras[0].stopVideoCapture();
    }

    var steps = new Array(Step1, Step2);
    TestEngine.executeSteps(steps, 4000);
}

// Cam0031
// Input: errorCallback = null, others = valid
// Result: Test passes.
function TestStartVideoCaptureNullErrorCallback()
{
    function Step1()
    {
        var options = {
            destinationFilename: 'images/TestStartVideoCaptureNullErrorCallback.3gp'
        };
        function StartVideoCaptureOnSuccess(filename)
        {
            // Don't compare paths if 'images' is passed as virtual root since Tizen
            // points 'images' to the same location as 'videos' and returns filename
            // with 'videos' virtual root instead of 'images'.
            // TestEngine.test("StartVideoCapture()", (options.destinationFilename == filename));
            TestEngine.test("startVideoCapture()", true);
        }

        var cb = TestEngine.registerCallback("startVideoCapture", StartVideoCaptureOnSuccess, null);
        gcameras[0].startVideoCapture(cb.successCallback, null, options);
    }

    function Step2()
    {
        gcameras[0].stopVideoCapture();
    }

    var steps = new Array(Step1, Step2);
    TestEngine.executeSteps(steps, 4000);
}

// Cam0032
// Input: successCallback = null, options = omitted, others = valid
// Result: Test fails with error callback called with INVALID_VALUES_ERR.
function TestStartVideoCaptureNullSuccessCallback()
{
    function StartVideoCaptureOnError(error)
    {
        TestEngine.test("startVideoCapture()", (error.code == INVALID_VALUES_ERR));
    }

    var cb = TestEngine.registerCallback("startVideoCapture", null, StartVideoCaptureOnError);
    gcameras[0].startVideoCapture(null, cb.errorCallback);
}

// Cam0033
// Input: successCallback = undefined, options = omitted, others = valid
// Result: Test fails with TYPE_MISMATCH_ERR thrown in place.
function TestStartVideoCaptureUndefinedSuccessCallback()
{
    function StartVideoCaptureOnError(error)
    {
        TestEngine.test("startVideoCapture()", false);
    }

    TestEngine.testPresetError(
        "startVideoCapture()",
        function() {
            gcameras[0].startVideoCapture(undefined, StartVideoCaptureOnError);
        },
        TYPE_MISMATCH_ERR
    );
}

// Cam0034
// Input: successCallback = null, errorCallback = null, options = omitted
// Result: Test fails silently.
function TestStartVideoCaptureNullCallbacks()
{
    testNoExceptionWithMessage("startVideoCapture()", function() {
        gcameras[0].startVideoCapture(null, null);
    });
}

// Cam0035
// Input: errorCallback = omitted, options = omitted, others = valid
// Result: Test passes.
function TestStartVideoCaptureNoErrorCallback()
{
    function Step1()
    {
        function StartVideoCaptureOnSuccess(filename)
        {
            TestEngine.test("startVideoCapture()", true);
        }

        var cb = TestEngine.registerCallback("startVideoCapture", StartVideoCaptureOnSuccess, null);
        gcameras[0].startVideoCapture(cb.successCallback);
    }

    function Step2()
    {
        gcameras[0].stopVideoCapture();
    }

    var steps = new Array(Step1, Step2);
    TestEngine.executeSteps(steps, 4000);
}

// Cam0036
// Input: options = invalid filename, others = valid
// Result: Test passes.
function TestStartVideoCaptureInvalidFilename()
{
    function Step1()
    {
        var options = {
            destinationFilename: {}
        };
        function StartVideoCaptureOnError(error)
        {
            TestEngine.test("startVideoCapture()", false);
        }
        function StartVideoCaptureOnSuccess(filename)
        {
            TestEngine.test("startVideoCapture()", true);
        }

        var cb = TestEngine.registerCallback("startVideoCapture", StartVideoCaptureOnSuccess, StartVideoCaptureOnError);
        gcameras[0].startVideoCapture(cb.successCallback, cb.errorCallback, options);
    }

    function Step2()
    {
        gcameras[0].stopVideoCapture();
    }

    var steps = new Array(Step1, Step2);
    TestEngine.executeSteps(steps, 4000);
}

// Cam0037
// Input: options = invalid highRes, others = valid
// Result: Test passes.
function TestStartVideoCaptureInvalidHighRes()
{
    function Step1()
    {
        var options = {
            highRes: {}
        };
        function StartVideoCaptureOnError(error)
        {
            TestEngine.test("startVideoCapture()", false);
        }
        function StartVideoCaptureOnSuccess(filename)
        {
            TestEngine.test("startVideoCapture()", true);
        }

        var cb = TestEngine.registerCallback("startVideoCapture", StartVideoCaptureOnSuccess, StartVideoCaptureOnError);
        gcameras[0].startVideoCapture(cb.successCallback, cb.errorCallback, options);
    }

    function Step2()
    {
        gcameras[0].stopVideoCapture();
    }

    var steps = new Array(Step1, Step2);
    TestEngine.executeSteps(steps, 4000);
}

// Cam0038
// Input: errorCallback = null, others = valid
// Result: Test passes.
function TestCreatePreviewNodeNullErrorCallback()
{
    function CreatePreviewNodeOnSuccess(domObj)
    {
        TestEngine.test("createPreviewNode()", true);
    }

    var cb = TestEngine.registerCallback("createPreviewNode", CreatePreviewNodeOnSuccess, null);
    gcameras[0].createPreviewNode(cb.successCallback, null);
}

// Cam0039
// Input: successCallback = null, others = valid
// Result: Test fails with error callback called with INVALID_VALUES_ERR.
function TestCreatePreviewNodeNullSuccessCallback()
{
    function CreatePreviewNodeOnError(error)
    {
        TestEngine.test("createPreviewNode()", (error.code == INVALID_VALUES_ERR));
    }

    var cb = TestEngine.registerCallback("createPreviewNode", null, CreatePreviewNodeOnError);
    gcameras[0].createPreviewNode(null, cb.errorCallback);
}

// Cam0040
// Input: successCallback = undefined, others = valid
// Result: Test fails with TYPE_MISMATCH_ERR thrown in place.
function TestCreatePreviewNodeUndefinedSuccessCallback()
{
    function CreatePreviewNodeOnError(error)
    {
        TestEngine.test("createPreviewNode()", false);
    }

    TestEngine.testPresetError(
        "createPreviewNode()",
        function() {
            gcameras[0].createPreviewNode(undefined, CreatePreviewNodeOnError);
        },
        TYPE_MISMATCH_ERR
    );
}

// Cam0041
// Input: successCallback = null, errorCallback = null
// Result: Test fails silently.
function TestCreatePreviewNodeNullCallbacks()
{
    testNoExceptionWithMessage("createPreviewNode()", function() {
        gcameras[0].createPreviewNode(null, null);
    });
}

// Cam0042
// Input: errorCallback = not passed, others = valid
// Result: Test passes.
function TestCreatePreviewNodeNoErrorCallback()
{
    function CreatePreviewNodeOnSuccess(domObj)
    {
        TestEngine.test("createPreviewNode()", true);
    }

    var cb = TestEngine.registerCallback("createPreviewNode", CreatePreviewNodeOnSuccess, null);
    gcameras[0].createPreviewNode(cb.successCallback);
}

//=============================================================================
//TestJavaScript();

function SimpleVideoTest()
{
    TestEngine.log ("START")

    function Succ(cameras){
        gcameras = cameras;
        Record();
    }

    function Errr(err){
        TestEngine.logErr("Get cameras failed. Exception code: " + err.code);
    }

    deviceapis.camera.getCameras(Succ, Errr);
}

function Record()
{

    function success(filename)
    {
        TestEngine.log("video capture success");
        callbackExecuted = true;
    }

    function errorCb(e)
    {
        TestEngine.log("video captured errro");
        callbackExecuted = true;
    }

    var requestedFileName = GetFileName("videos/test_video_",".mp4");
    TestEngine.log("Start 1:" + Date());
    gcameras[0].startVideoCapture(success,
                                  errorCb,
                                  {destinationFilename:requestedFileName, highRes:false});
    TestEngine.log("Start 2:" + Date());

//    waitMs(7000);
//    gcameras[0].stopVideoCapture();
//    TestEngine.log("Stop :" + Date());

    function stopVideo()
    {
        try{
            TestEngine.log("Stop :" + Date());
            gcameras[0].stopVideoCapture();

            TestEngine.log("Wait :" + Date());
            //time for invoke callback
            waitMs(3000);
            TestEngine.log("After Wait :" + Date());

            if(!callbackExecuted)
            {
                TestEngine.test("Video capture time out", false);
            }
        }
        catch(e)
        {
            TestEngine.log("Exception: " + e);
        }
    }
    TestEngine.log("Before timeout")
    setTimeout(stopVideo, VideoTime);
}

function onCameraError(err)
{
    TestEngine.test("Camera error: " + err.code, false);
}

function TestGetImageOK()
{
    var testObj = TestEngine.registerCallback(
        "capture image1.jpg",
        function(fileName) {
            TestEngine.test("Take picture image1.jpg : " + fileName,
                            fileName === "images/image1.jpg");
        },
        onCameraError
    );

    try {
        mainCamera.captureImage(
            testObj.successCallback,
            testObj.errorCallback,
            {
                destinationFilename:"images/image1.jpg",
                highRes: false
            }
        );
    } catch(e) {
        TestEngine.test("Exception while capturing image", false);
    }
}
function TestGetImageOK2()
{
    var testObj = TestEngine.registerCallback(
        "capture image2.jpeg",
        function(fileName) {
            TestEngine.test("Take picture image2.jpeg : " + fileName,
                            fileName === "images/image2.jpeg");
        },
        onCameraError
    );

    try {
        mainCamera.captureImage(
            testObj.successCallback,
            testObj.errorCallback,
            {
                destinationFilename:"images/image2.jpeg",
                highRes: false
            }
        );
    } catch(e) {
        TestEngine.test("Exception while capturing image", false);
    }
}

function TestGetImagePnG()
{
    var testObj = TestEngine.registerCallback(
        "capture image3.PnG",
        function(fileName) {
            TestEngine.test("Take picture image3.PnG : " + fileName,
                            fileName === "images/image3.PnG" || fileName === "images/image3.jpg");
        },
        onCameraError
    );

    try {
        mainCamera.captureImage(
            testObj.successCallback,
            testObj.errorCallback,
            {
                destinationFilename:"images/image3.PnG",
                highRes: false
            }
        );
    } catch(e) {
        TestEngine.test("Exception while capturing image", false);
    }
}

function TestGetImageNoExt()
{
    var testObj = TestEngine.registerCallback(
        "capture image4",
        function(fileName) {
            TestEngine.test("Take picture image4 : " + fileName,
                            fileName === "images/image4.jpg");
        },
        onCameraError
    );

    try {
        mainCamera.captureImage(
            testObj.successCallback,
            testObj.errorCallback,
            {
                destinationFilename:"images/image4",
                highRes: false
            }
        );
    } catch(e) {
        TestEngine.test("Exception while capturing image", false);
    }
}
function TestGetImageTiff()
{
    var testObj = TestEngine.registerCallback(
        "capture image1.tiff",
        function(fileName) {
            TestEngine.test("Take picture image1.tiff : " + fileName,
                            fileName === "images/image1.tiff" || fileName === "images/image1.jpg");
        },
        onCameraError
    );

    try {
        mainCamera.captureImage(
            testObj.successCallback,
            testObj.errorCallback,
            {
                destinationFilename:"images/image1.tiff",
                highRes: false
            }
        );
    } catch(e) {
        TestEngine.test("Exception while capturing image", false);
    }
}
function TestGetImageBMP()
{
    var testObj = TestEngine.registerCallback(
        "capture image2.BMP",
        function(fileName) {
            TestEngine.test("Take picture image2.BMP : " + fileName,
                            fileName === "images/image2.BMP" || fileName === "images/image2.jpg");
        },
        onCameraError
    );

    try {
        mainCamera.captureImage(
            testObj.successCallback,
            testObj.errorCallback,
            {
                destinationFilename:"images/image2.BMP",
                highRes: false
            }
        );
    } catch(e) {
        TestEngine.test("Exception while capturing image", false);
    }
}
function TestGetImageWrong()
{
    var testObj = TestEngine.registerCallback(
        "capture image3.wrong",
        function(fileName) {
            TestEngine.test("Take picture image3.wrong : " + fileName,
                            fileName === "images/image3.jpg");
        },
        onCameraError
    );

    try {
        mainCamera.captureImage(
            testObj.successCallback,
            testObj.errorCallback,
            {
                destinationFilename:"images/image3.wrong",
                highRes: false
            }
        );
    } catch(e) {
        TestEngine.test("Exception while capturing image", false);
    }
}
function TestGetImageXbm()
{
    var testObj = TestEngine.registerCallback(
        "capture image4.xbm",
        function(fileName) {
            TestEngine.test("Take picture image4.xbm : " + fileName,
                            fileName === "images/image4.xbm" || fileName === "images/image4.jpg");
        },
        onCameraError
    );

    try {
        mainCamera.captureImage(
            testObj.successCallback,
            testObj.errorCallback,
            {
                destinationFilename:"images/image4.xbm",
                highRes: false
            }
        );
    } catch(e) {
        TestEngine.test("Exception while capturing image", false);
    }
}

//SimpleVideoTest();
TestEngine.setTestSuiteName("Camera", 60000); // test suite timeout 60sec.

TestEngine.addTest(true, TestGetCameras, "[Camera] Get cameras");
//TestEngine.addTest(false, TestCaseCameraArrayProperties, "[Camera] Camera array properties");
//TestEngine.addTest(false, TestJavaScript, "[Camera] JavaScript");
//
//TestEngine.addTest(false, TestCameraFunctionality_PreviewStart, "[Camera] Camrea preview start");
//TestEngine.addTest(false, TestCameraFunctionality_TakePicture, "[Camera] Camrea picture");
//TestEngine.addTest(false, TestCameraFunctionality_Video, "[Camera] Camrea video");
//TestEngine.addTest(false, TestCameraFunctionality_PreviewStop, "[Camera] Camrea preview stop");
//TestEngine.addTest(false, TestCameraCancel, "[Camera] Cancel take picture");
//
//TestEngine.addTest(false,TestGetCamerasNullErrorCallback, "Cam0014");
//TestEngine.addTest(false,TestGetCamerasNullSuccessCallback, "Cam0015");
//TestEngine.addTest(false,TestGetCamerasUndefinedSuccessCallback, "Cam0016");
//TestEngine.addTest(false,TestGetCamerasNullCallbacks, "Cam0017");
//TestEngine.addTest(false,TestGetCamerasNoErrorCallback, "Cam0018");
//TestEngine.addTest(false,TestCameraId, "Cam0019");
//TestEngine.addTest(false,TestCaptureImageNullOptions, "Cam0020");
//TestEngine.addTest(false,TestCaptureImageUndefinedOptions, "Cam0021");
//TestEngine.addTest(false,TestCaptureImageNullErrorCallback, "Cam0022");
//TestEngine.addTest(false,TestCaptureImageNullSuccessCallback, "Cam0023");
//TestEngine.addTest(false,TestCaptureImageUndefinedSuccessCallback, "Cam0024");
//TestEngine.addTest(false,TestCaptureImageNullCallbacks, "Cam0025");
//TestEngine.addTest(false,TestCaptureImageNoErrorCallback, "Cam0026");
//TestEngine.addTest(false,TestCaptureImageInvalidFilename, "Cam0027");
//TestEngine.addTest(false,TestCaptureImageInvalidHighRes, "Cam0028");
//TestEngine.addTest(false,TestStartVideoCaptureNullOptions, "Cam0029");
//TestEngine.addTest(false,TestStartVideoCaptureUndefinedOptions, "Cam0030");
//TestEngine.addTest(false,TestStartVideoCaptureNullErrorCallback, "Cam0031");
//TestEngine.addTest(false,TestStartVideoCaptureNullSuccessCallback, "Cam0032");
//TestEngine.addTest(false,TestStartVideoCaptureUndefinedSuccessCallback, "Cam0033");
//TestEngine.addTest(false,TestStartVideoCaptureNullCallbacks, "Cam0034");
//TestEngine.addTest(false,TestStartVideoCaptureNoErrorCallback, "Cam0035");
//TestEngine.addTest(false,TestStartVideoCaptureInvalidFilename, "Cam0036");
//TestEngine.addTest(false,TestStartVideoCaptureInvalidHighRes, "Cam0037");
//TestEngine.addTest(false,TestCreatePreviewNodeNullErrorCallback, "Cam0038");
//TestEngine.addTest(false,TestCreatePreviewNodeNullSuccessCallback, "Cam0039");
//TestEngine.addTest(false,TestCreatePreviewNodeUndefinedSuccessCallback, "Cam0040");
//TestEngine.addTest(false,TestCreatePreviewNodeNullCallbacks, "Cam0041");
//TestEngine.addTest(false,TestCreatePreviewNodeNoErrorCallback, "Cam0042");
//
//TestEngine.addTest(true, TestGetImageOK, "[CameraFileFormat] get image : image1.jpg");
//TestEngine.addTest(true, TestGetImageOK2, "[CameraFileFormat] get image : image2.jpeg");
//TestEngine.addTest(true, TestGetImagePnG, "[CameraFileFormat] get image : image3.PnG");
//TestEngine.addTest(true, TestGetImageNoExt, "[CameraFileFormat] get image : image4");
//TestEngine.addTest(true, TestGetImageTiff, "[CameraFileFormat] get image : image1.tiff");
//TestEngine.addTest(true, TestGetImageBMP, "[CameraFileFormat] get image : image2.MBP");
//TestEngine.addTest(true, TestGetImageWrong, "[CameraFileFormat] get image : image3.wrong");
//TestEngine.addTest(true, TestGetImageXbm, "[CameraFileFormat] get image : image4.xbm");
//=============================================================================

function testNoExceptionWithMessage(message, fun) {
  var testResult = true;
  try {
    fun();
  }
  catch (e) {
    testResult = false;
  }
  TestEngine.test(message, testResult);
}
