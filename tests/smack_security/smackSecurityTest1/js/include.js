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
function IncludeJavaScript(jsFile)
{
    document.write('<script type="text/javascript" src="' + jsFile + '"></script>');
}

var VERBOSE = 1;

IncludeJavaScript("js/TestEngine.js")
IncludeJavaScript("js/WAC2.0/TestFilesystem.js")
IncludeJavaScript("js/WAC2.0/TestCalendar.js")
IncludeJavaScript("js/WAC2.0/TestContact.js")
IncludeJavaScript("js/WAC2.0/TestAccelerometer.js")
IncludeJavaScript("js/WAC2.0/TestOrientation.js")
IncludeJavaScript("js/WAC2.0/TestTask.js")
IncludeJavaScript("js/WAC2.0/TestCamera.js")
IncludeJavaScript("js/WAC2.0/TestDeviceInteraction.js")
IncludeJavaScript("js/WAC2.0/TestMessaging.js")
IncludeJavaScript("js/WAC2.0/TestDevicestatus.js")

IncludeJavaScript("js/WAC2.0/CloseCallback.js")
