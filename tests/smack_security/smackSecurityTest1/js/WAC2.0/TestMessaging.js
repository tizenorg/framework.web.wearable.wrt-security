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
 * @author      Lukasz Marek (l.marek@samsung.com)
 * @version     0.1
 */


var MsgObj = deviceapis.messaging;
var FsObj = deviceapis.filesystem;
var destinationPhoneNumbers = ["+48784619935", "+48784619935"];
var destinationEmails = ["ibisz.krzys@gmail.com"];
var filename1 = "Attachment1.txt"
var filename2 = "Attachment2.txt"
var filename3 = "Attachment3.txt"
var file1 = null
var file2 = null
var file3 = null
var imageDir = null;
var currentDate = new Date();
var defaultBody = "first message%\\ " + currentDate;
var changedBody = "changed body";
var INVALID_VALUES_ERR = 22;
var TYPE_MISMATCH_ERR = 17;

// msg001
function presenceTest()
{
    TestEngine.test("Checking checking", true);
    TestEngine.test("Checking deviceapis object", deviceapis);
    TestEngine.test("Checking messaging object", MsgObj);
    TestEngine.test("Checking filesystem object", FsObj);

    TestEngine.test("Checking type of createMessage", isFunction(MsgObj.createMessage));
    TestEngine.test("Checking type of sendMessage", isFunction(MsgObj.sendMessage));
    TestEngine.test("Checking type of findMessages", isFunction(MsgObj.findMessages));
    TestEngine.test("Checking type of onSMS", isFunction(MsgObj.onSMS));
    TestEngine.test("Checking type of onMMS", isFunction(MsgObj.onMMS));
    TestEngine.test("Checking type of onEmail", isFunction(MsgObj.onEmail));
    TestEngine.test("Checking type of unsubscribe", isFunction(MsgObj.unsubscribe));

    TestEngine.test("Checking type and value of TYPE_SMS", MsgObj.TYPE_SMS === 1);
    TestEngine.test("Checking type and value of TYPE_MMS", MsgObj.TYPE_MMS === 2);
    TestEngine.test("Checking type and value of TYPE_EMAIL", MsgObj.TYPE_EMAIL === 3);
    MsgObj.TYPE_SMS = 66;
    MsgObj.TYPE_MMS = 66;
    MsgObj.TYPE_EMAIL = 66;
    TestEngine.test("Checking read only of TYPE_SMS", MsgObj.TYPE_SMS === 1);
    TestEngine.test("Checking read only of TYPE_MMS", MsgObj.TYPE_MMS === 2);
    TestEngine.test("Checking read only of TYPE_EMAIL", MsgObj.TYPE_EMAIL === 3);

    TestEngine.test("Checking type and value of FOLDER_INBOX", MsgObj.FOLDER_INBOX === 1);
    TestEngine.test("Checking type and value of FOLDER_OUTBOX", MsgObj.FOLDER_OUTBOX === 2);
    TestEngine.test("Checking type and value of FOLDER_DRAFTS", MsgObj.FOLDER_DRAFTS === 3);
    TestEngine.test("Checking type and value of FOLDER_SENTBOX", MsgObj.FOLDER_SENTBOX === 4);
    MsgObj.FOLDER_INBOX = 66;
    MsgObj.FOLDER_OUTBOX = 66;
    MsgObj.FOLDER_DRAFTS = 66;
    MsgObj.FOLDER_SENTBOX = 66;
    TestEngine.test("Checking type and value of FOLDER_INBOX", MsgObj.FOLDER_INBOX === 1);
    TestEngine.test("Checking type and value of FOLDER_OUTBOX", MsgObj.FOLDER_OUTBOX === 2);
    TestEngine.test("Checking type and value of FOLDER_DRAFTS", MsgObj.FOLDER_DRAFTS === 3);
    TestEngine.test("Checking type and value of FOLDER_SENTBOX", MsgObj.FOLDER_SENTBOX === 4);
}

// msg002
function createMessageInvalidParamsTest()
{
    TestEngine.catchErrorType("code", INVALID_VALUES_ERR, MsgObj, "createMessage", undefined);
    TestEngine.catchErrorType("code", INVALID_VALUES_ERR, MsgObj, "createMessage", null);
    TestEngine.catchErrorType("code", INVALID_VALUES_ERR, MsgObj, "createMessage", "test");
    TestEngine.catchErrorType("code", INVALID_VALUES_ERR, MsgObj, "createMessage", new Date());
    TestEngine.catchErrorType("code", INVALID_VALUES_ERR, MsgObj, "createMessage", [6, 6, 6]);
}

// msg003
function createMMSTest()
{
    createMessageCheck(MsgObj.TYPE_MMS);
}

// msg004
function createSMSTest()
{
    createMessageCheck(MsgObj.TYPE_SMS);
}

// msg005
function createEmailTest()
{
    createMessageCheck(MsgObj.TYPE_EMAIL);
}

function createMessageCheck(type)
{
    var msg = MsgObj.createMessage(type);
    TestEngine.test("message object created", typeof(msg) == 'object');
    if (typeof(msg) == 'object') {

        var props = new Array();
        props.push(new Array('id',null,"999",true,TestEngine.STRING));
        props.push(new Array('type',MsgObj.type,999,false,TestEngine.NUMBER));
        props.push(new Array('folder',undefined,999,false,undefined));
        props.push(new Array('timestamp',null,new Date(2010,12,17),true,TestEngine.DATE));

        // email only
        if(type === MsgObj.TYPE_EMAIL) {
            props.push(new Array('from',null,"maupa@samsung.com",true,TestEngine.STRING));
            props.push(new Array('cc',null,null,false));
            TestEngine.test("length of cc attribute", msg.cc.length === 0);
            props.push(new Array('bcc',null,null,false));
            TestEngine.test("length of bcc attribute", msg.bcc.length === 0);
            props.push(new Array('priority',null,true,false,TestEngine.BOOL));
        }

        props.push(new Array('to',null,null,false));
        props.push(new Array('body',null,"test",false,TestEngine.STRING));
        props.push(new Array('isRead',null,true,false,TestEngine.BOOL));

        // MMS and email only
        if(type === MsgObj.TYPE_EMAIL || type == MsgObj.TYPE_MMS) {
            props.push(new Array('subject',null,"subject",false,TestEngine.STRING));
            props.push(new Array('attachments'));
            TestEngine.test("length of attachments attribute", msg.attachments.length === 0);
        }

        props.push(new Array('update',null,null,false,TestEngine.FUNCTION));
        TestEngine.testProperties(msg, props);

        TestEngine.test("length of to attribute", msg.to.length === 0);
    }
}

// msg006
function sendMessageInvalidParamsTest()
{
    function messageSent() {
        TestEngine.test("The SMS has been sent", false);
    }
    function messageFailed(error) {
        TestEngine.test("The SMS could not be sent " + error.message, true);
    }
    TestEngine.catchErrorType("code",17, MsgObj, "sendMessage");
    TestEngine.catchErrorType("code",17, MsgObj, "sendMessage", messageSent);
    TestEngine.catchErrorType("code",17, MsgObj, "sendMessage", messageSent, messageFailed);
    TestEngine.catchErrorType("code",17, MsgObj, "sendMessage", messageSent, messageFailed, undefined);
    TestEngine.catchErrorType("code",17, MsgObj, "sendMessage", messageSent, messageFailed, null);
    TestEngine.catchErrorType("code",17, MsgObj, "sendMessage", messageSent, messageFailed, 66);
    TestEngine.catchErrorType("code",17, MsgObj, "sendMessage", messageSent, messageFailed, "test");
    TestEngine.catchErrorType("code",17, MsgObj, "sendMessage", messageSent, messageFailed, new Date());
    TestEngine.catchErrorType("code",17, MsgObj, "sendMessage", messageSent, messageFailed, [6, 6, 6]);

    var msg = MsgObj.createMessage(MsgObj.TYPE_SMS);
    msg.body = "Message sent by test unit sendMessageInvalidParamsTest()";
    msg.subject = "Subject of message";
    msg.to = destinationPhoneNumbers;
    var cbObj = TestEngine.registerCallback("sendMessage", null, messageFailed);
    MsgObj.sendMessage(null, cbObj.errorCallback, msg);
}

function sendMMSTestSuccess()
{
    TestEngine.test("callback: MMS is sent", true);
}

function sendMMSTestFail()
{
    TestEngine.test("callback: MMS is sent", false);
}

// msg007
function sendMMSTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_MMS);
    if (typeof(msg) == 'object') {
        TestEngine.test("MMS is created", true);
        msg.body = "Message sent by test unit sendMMSTest()";
        msg.subject = "Subject of message";
        msg.to = destinationPhoneNumbers;
        //some attachments?
        var cbObj = TestEngine.registerCallback("sendMMSTest", sendMMSTestSuccess, sendMMSTestFail);
        MsgObj.sendMessage(cbObj.successCallback, cbObj.errorCallback, msg);
    }
    else {
        TestEngine.test("MMS is created", false);
    }
}

function sendSMSTestSuccess()
{
    TestEngine.test("callback: SMS is sent", true);
}

function sendSMSTestFail()
{
    TestEngine.test("callback: SMS is sent", false);
}

// msg008
function sendSMSTest()
{
    var msg1 = MsgObj.createMessage(MsgObj.TYPE_SMS);
    if (typeof(msg1) == 'object') {
        TestEngine.test("SMS is created", true);

        msg1.body = "Message 1 sent by test unit sendSMSTest()";
        msg1.to = destinationPhoneNumbers;
        var cbObj1 = TestEngine.registerCallback("sendSMSTest1", sendSMSTestSuccess, sendSMSTestFail);
        MsgObj.sendMessage(cbObj1.successCallback, cbObj1.errorCallback, msg1);
    }
    else {
        TestEngine.test("SMS is created", false);
    }
}

function sendEmailTestSuccess()
{
    TestEngine.test("callback: Email is sent", true);
}

function sendEmailTestFail()
{
    TestEngine.test("callback: Email is not sent", false);
}

// msg009
function sendEmailTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);
    if (typeof(msg) == 'object') {
        TestEngine.test("Email is created", true);
        msg.body = "Message sent by test unit sendEmailTest()";
        msg.subject = "[WIDGET SPAM]Subject of message";
        msg.to = destinationEmails;
        //some attachments?
        var cbObj = TestEngine.registerCallback("sendEmailTest", sendEmailTestSuccess, sendEmailTestFail);
        MsgObj.sendMessage(cbObj.successCallback, cbObj.errorCallback, msg);
    }
    else {
        TestEngine.test("Email is not created", false);
    }
}

function findMessageTest(type)
{
    var addr1 = "+48123456789";
    var addr2 = "+48607880564";
    var addr3 = "+48111111111";
    var addr4 = "+48999999999";
    if(type === MsgObj.TYPE_EMAIL) {
        addr1 = "aaa@bbb.com";
        addr2 = "bbb@bbb.com";
        addr3 = "ccc@bbb.com";
        addr4 = "ddd@bbb.com";
    }

    var cases = new Array();
    var currentCase = 0;
    var newmsg;

    // success callback
    function successCallback_findMessages(messages)
    {
        TestEngine.logOK("SuccessCallback_findMessages enter, messages=" +messages+ ", msg count=" + messages.length);
        TestEngine.test("Found more than 0 messages", messages.length > 0);

        var matchFound = false;

        // check results
        for(var i in messages)
        {
            // compare types
            if(messages[i].type === type) {
                TestEngine.log("Comparing message (" + messages[i].id + ") type " + messages[i].type + " :OK");

                // compare bodies
                if(messages[i].body.indexOf(defaultBody) === 0) {
                    TestEngine.log("Comparing message (" + messages[i].id + ") body " + messages[i].body + " :OK");
                    matchFound = true;
                    break;
                }
                else {
                    TestEngine.log("Comparing message (" + messages[i].id + ") body " + messages[i].body + " :failed" );
                }
            }
            else {
                TestEngine.log("Comparing message (" + messages[i].id + ") type " + messages[i].type + " :failed" );
            }
        }

        TestEngine.test("Match found" , matchFound);

        currentCase++;
        processNextCase();
    }

    // error callback
    function errorCallback_findMessages(result)
    {
        TestEngine.test("errorCallback_findMessages enter, result.code=" + result.code, false);

        currentCase++;
        processNextCase();
    }

    // send success callback
    function sendSucceeded() {
        TestEngine.test("Test message successfully sent", true);

        var msg;

        //set up body filter
        msg = { body:"first messa%", description:"Filter by body" };
        cases.push(msg);

        //set up subject filter
        if(type != MsgObj.TYPE_SMS) {
            msg = { subject:"%meaningless%", description:"Filter by subject" };
            cases.push(msg);
        }

        //set up destination address filter
        msg = { to:[addr1], description:"Filter by to" };
        cases.push(msg);

        //set up isRead filter
        msg = { isRead:false, description:"Filter by isRead" };
        cases.push(msg);

        if (type === MsgObj.TYPE_EMAIL) {
            //set up messagePriority filter
            msg = { messagePriority:true, description:"Filter by messagePriority" };
            cases.push(msg);

            //set up cc filter
            msg = { cc:[addr3], description:"Filter by cc" };
            cases.push(msg);

            //set up bcc filter
            msg = { bcc:[addr4], description:"Filter by bcc" };
            cases.push(msg);

            //set up id filter
            msg = { id:newmsg.id, description:"Filter by id" };
            cases.push(msg);
        }

        //set up time filter
        var start = new Date(2009,01);
        var end = new Date(2015,01);
        msg = { startTimestamp:start, endTimestamp:end, description:"Filter by dates" };
        cases.push(msg);

        //set up folder filter
        msg = { folder:[MsgObj.FOLDER_SENTBOX], description:"Filter by folder" };
        cases.push(msg);

        //set up from filter
        msg = { from:newmsg.from, description:"Filter by from" };
        cases.push(msg);

        //set up complex filter
        msg = { body:"first messa%",
                to:[addr1],
                id:newmsg.id,
                startTimestamp:start,
                endTimestamp:end,
                folder:[MsgObj.FOLDER_SENTBOX],
                type:[type],
                from:newmsg.from,
                description:"complex filter"
                };
        if (type != MsgObj.TYPE_EMAIL) {
            delete msg.id;
        }

        cases.push(msg);

        // % (0 or more) and escape character. \\% - escaped '%', \\ - '\'
        msg = { body:"%first %sage\\%\\ %", description:"Filter by body (% and escapes)" }
        cases.push(msg);

        // % (0 or more) in string array
        if(type === MsgObj.TYPE_EMAIL) {
            msg = { to:["%@bbb.%","%aa%"], description:"Filter by to (using %)" }     // EMAIL
        }
        else {
            msg = { to:["%1234%","%45678%"], description:"Filter by to (using %)" }   // MMS & MMS
        }
        cases.push(msg);

        processNextCase();
    }

    // send failure callback
    function sendFailed() {
        TestEngine.test("Test message sending failed", false);
    }

    // helper function
    function processNextCase() {
        if(currentCase < cases.length) {
            TestEngine.log("");
            TestEngine.log("Processing case " + currentCase);
            TestEngine.log(cases[currentCase].description);
            delete cases[currentCase].description;
            var cObj = TestEngine.registerCallback("findMessages", successCallback_findMessages, errorCallback_findMessages)
            MsgObj.findMessages(cObj.successCallback, cObj.errorCallback, cases[currentCase])
        }
    }

    try {
        //create message to be found
        newmsg = MsgObj.createMessage(type);
        newmsg.body = defaultBody;
        newmsg.to = [addr1,addr2];
        if(type === MsgObj.TYPE_EMAIL) {
            newmsg.cc = [addr3];
            newmsg.bcc = [addr4];
            newmsg.priority = true;
        }
        if(type != MsgObj.SMS) {
            newmsg.subject = "some meaningless subject";
        }
        var cb = TestEngine.registerCallback("sendMessage",sendSucceeded,sendFailed);
        MsgObj.sendMessage(cb.successCallback,cb.errorCallback,newmsg);

    } catch(e) {
        TestEngine.logErr("findMessages exception: " + e.message);
    }
}

function findNoMessageTest(type)
{
    var addr1 = "+48123456789";
    var addr2 = "+48607880564";
    var addr3 = "+48111111111";
    var addr4 = "+48999999999";
    if(type === MsgObj.TYPE_EMAIL)
    {
        addr1 = "aaa@bbb.com";
        addr2 = "bbb@bbb.com";
        addr3 = "ccc@bbb.com";
        addr4 = "ddd@bbb.com";
    }

    var cases = new Array();
    var currentCase = 0;
    var newmsg;

    // success callback
    function successCallback_findMessages(messages)
    {
        TestEngine.logOK("successCallback_findMessages enter, messages=" +messages+ ", msg count=" + messages.length);
        TestEngine.test("No messages should be found", messages.length == 0);

        currentCase++;
        processNextCase();
    }

    // error callback
    function errorCallback_findMessages(result)
    {
        TestEngine.test("errorCallback_findMessages enter, result.code=" + result.code, false);

        currentCase++;
        processNextCase();
    }

    // send success callback
    function sendSucceeded() {
        TestEngine.test("Test message successfully sent", true);

        //set up body filter
        msg = { body:"first messaa%", id:newmsg.id };
        cases.push(msg);

        //set up subject filter
        msg = { subject:"%meaningleess%", id:newmsg.id };
        cases.push(msg);

        //set up destination address filter
        msg = { to:[addr3], id:newmsg.id };
        cases.push(msg);

        //set up isRead filter
        msg = { isRead:true, id:newmsg.id };
        cases.push(msg);

        //set up messagePriority filter
        msg = { messagePriority:false, id:newmsg.id };
        cases.push(msg);

        //set up id filter
        msg = { id:newmsg.id + "0000" };
        cases.push(msg);

        //set up time filter
        var start = new Date(2008,01);
        var end = new Date(2010,01);
        msg = { endTimestamp:end, id:newmsg.id };
        cases.push(msg);

        //set up folder filter
        msg = { folder:[MsgObj.FOLDER_INBOX], id:newmsg.id };
        cases.push(msg);

        //set up from filter
        msg = { from:"aaa@aaa.com", id:newmsg.id };
        cases.push(msg);

        //set up cc filter
        msg = { cc:[addr1], id:newmsg.id };
        cases.push(msg);

        //set up bcc filter
        msg = { bcc:[addr1], id:newmsg.id };
        cases.push(msg);

        // % (0 or more) and escape character
        msg = { body:"%first mess%sage\%", id:newmsg.id }
        cases.push(msg);

        // % (0 or more) in string array
        if(type === MsgObj.TYPE_EMAIL) {
            msg = { to:["%c@bbb.%","%aa%"], id:newmsg.id }     // EMAIL
        }
        else {
            msg = { to:["%12354%","%45678%"], id:newmsg.id }   // MMS & SMS
        }
        cases.push(msg);

        processNextCase();
    }

    // send failure callback
    function sendFailed() {
        TestEngine.test("Test message sending failed", false);
    }

    // helper function
    function processNextCase() {
        if(currentCase < cases.length) {
            TestEngine.log("");
            TestEngine.log("Processing case " + currentCase);
            var cObj = TestEngine.registerCallback("findMessages", successCallback_findMessages, errorCallback_findMessages)
            MsgObj.findMessages(cObj.successCallback, cObj.errorCallback, cases[currentCase])
        }
    }

    try {
        //create message not to be found
        newmsg = MsgObj.createMessage(type);
        newmsg.body = "first message"
        newmsg.to = [addr1,addr2];
        if(type === MsgObj.TYPE_EMAIL) {
            newmsg.cc = [addr3];
            newmsg.bcc = [addr4];
            newmsg.priority = true;
        }
        if(type != MsgObj.SMS) {
            newmsg.subject = "some meaningless subject";
        }
        var cb = TestEngine.registerCallback("sendMessage",sendSucceeded,sendFailed);
        MsgObj.sendMessage(cb.successCallback,cb.errorCallback,newmsg);

    } catch(e) {
        TestEngine.logErr("findMessages exception: " + e.message);
    }
}

// msg013
function findEmailTest()
{
    findMessageTest(MsgObj.TYPE_EMAIL)
}

// msg014
function findSMSTest()
{
    findMessageTest(MsgObj.TYPE_SMS)
}

// msg015
function findMMSTest()
{
    findMessageTest(MsgObj.TYPE_MMS)
}

// msg016
function findNoEmailTest()
{
    findNoMessageTest(MsgObj.TYPE_EMAIL)
}

// msg017
function findNoSMSTest()
{
    findNoMessageTest(MsgObj.TYPE_SMS)
}

// msg018
function findNoMMSTest()
{
    findNoMessageTest(MsgObj.TYPE_MMS)
}

// msg019
function findMessageInvalidParamsTest()
{
    function messageFound() {
        TestEngine.test("The message has been found", false);
    }
    function messageFailed(error) {
        TestEngine.test("The message could not be found " + error.message, true);
    }

    var cb = TestEngine.registerCallback("findMessages", null, messageFailed);
    MsgObj.findMessages(null, cb.errorCallback);

    var filter = { type:[MsgObj.TYPE_SMS], body:"aaa" };
    var cb = TestEngine.registerCallback("findMessages", null, messageFailed);
    MsgObj.findMessages(null, cb.errorCallback, filter);
}

// msg020
function unsubscribeInvalidTest()
{
    invalidUnsubscribeCheck();

    // If the subscriptionHandler argument does not correspond to a valid subscription, the method should return without any further action.
    try
    {
        MsgObj.unsubscribe(123);
        TestEngine.test("No error thrown from: messaging.unsubscribe", true);
    }
    catch(err)
    {
        TestEngine.logException(err.message);
    }
}

function invalidUnsubscribeCheck()
{
    TestEngine.catchErrorType("code",17, MsgObj, "unsubscribe");
}

// msg021
function onSMSInvalidTest()
{
    onIncomingMessageInvalidCheck("onSMS");
}

// msg022
function onMMSInvalidTest()
{
    onIncomingMessageInvalidCheck("onMMS");
}

// msg023
function onEmailInvalidTest()
{
    onIncomingMessageInvalidCheck("onEmail");
}

function onIncomingMessageInvalidCheck(func)
{
    // bad values
    TestEngine.catchErrorType("code",17, MsgObj, func);
    TestEngine.catchErrorType("code",17, MsgObj, func, null);
    TestEngine.catchErrorType("code",17, MsgObj, func, undefined);
    TestEngine.catchErrorType("code",17, MsgObj, func, -666);
    TestEngine.catchErrorType("code",17, MsgObj, func, new Date());
    TestEngine.catchErrorType("code",17, MsgObj, func, [6, 6, 6]);
}

// msg024
function onSMSTest()
{
    onIncomingMessageCheck("onSMS");
}

// msg025
function onMMSTest()
{
    onIncomingMessageCheck("onMMS");
}

// msg026
function onEmailTest()
{
    onIncomingMessageCheck("onEmail");
}

function incomingMsgCb(msg)
{
    // empty
}

function onIncomingMessageCheck(func)
{
    try
    {
        var handler = MsgObj[func](incomingMsgCb);
        TestEngine.test("No error thrown from: messaging." + func + " (1)", true);
        var handler2 = MsgObj[func](incomingMsgCb);
        TestEngine.test("No error thrown from: messaging." + func + " (2)", true);

        // is still should be impossible to unsubscribe with invalid args
        invalidUnsubscribeCheck();

        TestEngine.test("Checking type of returned handle (1)", isNumber(handler));
        TestEngine.test("Checking value of returned handle (1)", handler >= 0);
        TestEngine.test("Checking type of returned handle (2)", isNumber(handler2));
        TestEngine.test("Checking value of returned handle (2)", handler2 >= 0);
        TestEngine.test("Comparing values of returned handles", handler != handler2);

        MsgObj.unsubscribe(handler);
        TestEngine.test("No error thrown from: messaging.unsubscribe (1)", true);
        MsgObj.unsubscribe(handler2);
        TestEngine.test("No error thrown from: messaging.unsubscribe (2)", true);
        MsgObj.unsubscribe(handler);
        TestEngine.test("No error thrown from: messaging.unsubscribe after unsubscribing (1)", true);
        MsgObj.unsubscribe(handler2);
        TestEngine.test("No error thrown from: messaging.unsubscribe after unsubscribing (2)", true);
    }
    catch(err)
    {
        TestEngine.logException(err.message);
    }
}

// msg027
function attachmentPrecondition()
{
    // resolve image directory
    function on_resolve_success(dir) {
        imageDir = dir;
        TestEngine.test("Attachment precondition passed",true);

        // create attachment file
        try {
            imageDir.createFile(filename1);
            imageDir.createFile(filename2);
            imageDir.createFile(filename3);
        }
        catch (error) {
            TestEngine.test("File already exists. Ignoring",error.code == 100); // IO_ERR
        }

        file1 = imageDir.resolve(filename1);
        TestEngine.test("checking file1", file1 != null && file1 != undefined)

        file2 = imageDir.resolve(filename2);
        TestEngine.test("checking file2", file2 != null && file2 != undefined)

        file3 = imageDir.resolve(filename3);
        TestEngine.test("checking file3", file3 != null && file3 != undefined)
    }
    function on_resolve_error() {
        TestEngine.test("Attachment precondition failed",false);
    }
    var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
	FsObj.resolve(cb.successCallback, cb.errorCallback, "music");
}

// msg028
function attachmentSMSTest()
{
    // for sms attachments MUST be ignored
    var msg = MsgObj.createMessage(MsgObj.TYPE_SMS);
    msg.body = "body";
    msg.to = destinationPhoneNumbers;

    // check attachments array
    var att = new Array();
    att[0] = file1;
    msg.attachments = att;

    // check sending attachments
    function sendSuccess() {
        TestEngine.test("Message sent successfully",true);
    }

    function sendFail() {
        TestEngine.test("Message sending failed",false);
    }

    var cbObj = TestEngine.registerCallback("sendMessage", sendSuccess, sendFail);
    MsgObj.sendMessage(cbObj.successCallback, cbObj.errorCallback, msg);
}

// msg029
function attachmentMMSTest()
{
    attachmentCheck(MsgObj.TYPE_MMS);
}

// msg030
function attachmentEmailTest()
{
    attachmentCheck(MsgObj.TYPE_EMAIL);
}

function attachmentCheck(type)
{
    var msg = MsgObj.createMessage(type);
    msg.subject = "subject";
    msg.body = "body";
    msg.to = destinationPhoneNumbers;
    if(type === MsgObj.TYPE_EMAIL) {
        msg.to = destinationEmails;
    }

    msg.attachments = new Array(file1,file2,file3);

    // check sending attachments
    function sendSuccess() {
        TestEngine.test("Message sent successfully",true);
    }

    function sendFail() {
        TestEngine.test("Message sending failed",false);
    }

    var cbObj = TestEngine.registerCallback("sendMessage", sendSuccess, sendFail);
    MsgObj.sendMessage(cbObj.successCallback, cbObj.errorCallback, msg);
}

// msg031
function updateTestSMS()
{
    updateCheck(MsgObj.TYPE_SMS);
}

// msg032
function updateTestMMS()
{
    updateCheck(MsgObj.TYPE_MMS);
}

// msg033
function updateTestEmail()
{
    updateCheck(MsgObj.TYPE_EMAIL);
}

function updateCheck(type)
{
    TestEngine.log("Checking update function for message type: " + type);
    var read;
    var body;
    var msg;

    var addr1 = "+48123456789";
    if(type === MsgObj.TYPE_EMAIL) {
        addr1 = "aaa@bbb.com";
    }

    ///////////////  3   //////////////////
    function updateSuccess2(msg) {
        TestEngine.test("updateSuccess (2)" , true);

        ///////////////  4   //////////////////
        function findChangedSuccess(messages) {
            TestEngine.test("findChangedSuccess",true);

            // and compare it
            TestEngine.test("Comparing 'body' attribute", changedBody != messages[0].body); // should not be changed

            // invalid arguments
            TestEngine.catchErrorType("code",17, messages[0], "update");
            TestEngine.catchErrorType("code",17, messages[0], "update", 666, updateFailure);
        }

        function findChangesFailure() {
            TestEngine.test("findChangesFailure",false);
        }

        var filter = { id:msg.id };
        var cb6 = TestEngine.registerCallback("findMessages2", findChangedSuccess, findChangesFailure)
        MsgObj.findMessages(cb6.successCallback, cb6.errorCallback, filter)
    }

    ///////////////  2   //////////////////
    // find callbacks
    function findSuccess(messages) {
        TestEngine.logOK("findSuccess, messages=" +messages+ ", msg count=" + messages.length);
        TestEngine.test("found messages", messages.length > 0);

        // update isRead attribute (should pass)
        read = messages[0].isRead;
        messages[0].isRead = !read;
        messages[0].body = changedBody;
        var cb4 = TestEngine.registerCallback("update2", updateSuccess2, updateFailure);
        messages[0].update(cb4.successCallback, cb4.errorCallback);
    }

    function findFailure(result) {
        TestEngine.test("findFailure, result.code=" + result.code, false);
    }

    function updateFailure() {
        TestEngine.test("updateFailure",false);
    }


    ///////////////  1   //////////////////
    // send callbacks
    function sendSuccess() {
        TestEngine.test("sendSuccess" , true);

        var filter = { body:"first message%",folder:[MsgObj.FOLDER_OUTBOX,MsgObj.FOLDER_SENTBOX]  };

        var cb3 = TestEngine.registerCallback("findMessages", findSuccess, findFailure)
        MsgObj.findMessages(cb3.successCallback, cb3.errorCallback, filter)
    }

    function sendFailure() {
        TestEngine.test("sendFailure" , false);
    }

    // update created message
    msg = MsgObj.createMessage(type);
    msg.body = "first message"
    msg.to = [addr1];
    msg.isRead = true;
    var cb = TestEngine.registerCallback("sendMessage", sendSuccess, sendFailure);
    MsgObj.sendMessage(cb.successCallback, cb.errorCallback, msg);
}

// msg034
function cancelingSendingTest()
{
    var canceled = false;
    function errorCallback() {
        TestEngine.test("sending error callback", false);
    }
    function successCallback() {
        TestEngine.test("sending success callback", !canceled);
    }

    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);

    TestEngine.test("Checking message ",msg != undefined);

    if(msg != undefined) {
        msg.to = destinationEmails;
        msg.body = "body";

        var cObj = TestEngine.registerCallback("send", successCallback, errorCallback)
        var pendingOperation = MsgObj.sendMessage(cObj.successCallback, cObj.errorCallback, msg);

        canceled = pendingOperation.cancel();
        TestEngine.test("Canceling MsgObj.sendMessage. Cancelled: " + canceled, true);
        if (canceled) {
            TestEngine.callbackMutex--;
        }
    }
}

// msg035
function cancelingFindingTest()
{
    var canceled = false;
    function errorCallback() {
        TestEngine.test("find error callback", false);
    }
    function successCallback() {
        TestEngine.test("find success callback", !canceled);
    }
    var cObj = TestEngine.registerCallback("find", successCallback, errorCallback)

    var msg = { body:"body" };
    var pendingOperation = MsgObj.findMessages(cObj.successCallback, cObj.errorCallback, msg);

    canceled = pendingOperation.cancel();
    TestEngine.test("Canceling MsgObj.findMessage. Cancelled: " + canceled, true);
    if (canceled) {
        TestEngine.callbackMutex--;
    }
}

// msg036
function cancelingUpdateTest()
{
    function errorCallback(err) {
        TestEngine.test("sending error callback [" + err.code + "]", false);
    }

    function successCallback() {
        TestEngine.test("sending success callback", true);

        var canceled = false;

        function updateSuccess(msg)
        {
            TestEngine.test("update() canceled = " + canceled, !canceled);
        }

        function updateError(err)
        {
            TestEngine.test("update() [" + err.code + "]", false);
        }

        var cObj = TestEngine.registerCallback("update", updateSuccess, updateError);
        var pendingOperation = msg.update(cObj.successCallback, cObj.errorCallback);
        if (pendingOperation != null)
        {
            canceled = pendingOperation.cancel();
            TestEngine.test("Canceling Message.update. Cancelled: " + canceled, true);
            if (canceled) {
                TestEngine.callbackMutex--;
            }
        }
    }

    // create message
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);
    TestEngine.test("Checking message ", msg != undefined);

    if (msg != undefined) {
        msg.body = "first message"
        msg.to = ["wrt.spam@samsung.com"];
        msg.isRead = true;

        var cObj = TestEngine.registerCallback("send", successCallback, errorCallback);
        MsgObj.sendMessage(cObj.successCallback, cObj.errorCallback, msg);
    }
}

function compareAttachments(att1,att2)
{
    if(att1 === undefined && att2 === undefined) {
        TestEngine.test("Both attachments are undefined", true);
        return;
    }
    if(att1 === undefined || att2 === undefined) {
        TestEngine.test("Attachment is undefined", false);
        return;
    }
    TestEngine.test("Comparing attachments " + att1.fullPath + " with " + att2.fullPath, att1.fullPath == att2.fullPath);
}

function checkAttachmentsLength(att,len)
{
    TestEngine.test("Checking attachments length. Expected:" + len + " supplied:" + att.length, len === att.length);
}

// msg037
function attachmentsIndexTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);

    // check indexes
    msg.attachments[0] = file1;
    checkAttachmentsLength(msg.attachments,1);
    compareAttachments(msg.attachments[0],file1);
    try
    {
        msg.attachments[2] = file2;
    }
    catch (e)
    {
        TestEngine.test("ERR: Injecting sparse (undefined) items.", (e.code == TYPE_MISMATCH_ERR));
    }
}

// msg038
function attachmentsConcatTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);

    // check concat
    msg.attachments = new Array(file1);
    var att = new Array(file2,file1);
    var att2 = msg.attachments.concat(att);
    checkAttachmentsLength(msg.attachments,1);
    checkAttachmentsLength(att2,3);
    compareAttachments(att2[0],file1);
    compareAttachments(att2[1],file2);
    compareAttachments(att2[2],file1);
}

// msg039
function attachmentsPopTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);

    // check pop
    msg.attachments = new Array(file1,file2);
    var last = msg.attachments.pop();
    checkAttachmentsLength(msg.attachments,1);
    compareAttachments(last,file2);
    compareAttachments(msg.attachments[0],file1);
}

// msg040
function attachmentsPushTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);

    // check push
    msg.attachments = new Array(file1);
    var len = msg.attachments.push(file2);
    checkAttachmentsLength(msg.attachments,2);
    checkAttachmentsLength(msg.attachments,len);
    compareAttachments(msg.attachments[1],file2);
}

// msg041
function attachmentsReverseTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);

    // check reverse
    msg.attachments = new Array(file1,file2);
    msg.attachments.reverse();
    compareAttachments(msg.attachments[1],file1);
    compareAttachments(msg.attachments[0],file2);
    checkAttachmentsLength(msg.attachments,2);
}

// msg042
function attachmentsShiftTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);

    // check shift
    msg.attachments = new Array(file1,file2);
    var first = msg.attachments.shift();
    checkAttachmentsLength(msg.attachments,1);
    compareAttachments(first,file1);
    compareAttachments(msg.attachments[0],file2);
}

// msg043
function attachmentsSliceTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);

    // check slice
    msg.attachments = new Array(file1,file2,file3,file1);
    var sliced = msg.attachments.slice(1,3);
    checkAttachmentsLength(sliced,2);
    compareAttachments(sliced[0],file2);
    compareAttachments(sliced[1],file3);
}

// msg044
function attachmentsSpliceTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);

    //check splice
    msg.attachments = new Array(file1,file2,file3,file2);
    var spliced = msg.attachments.splice(1,10,file3,file2);
    checkAttachmentsLength(spliced,3);
    compareAttachments(spliced[0],file2);
    compareAttachments(spliced[1],file3);
    compareAttachments(spliced[2],file2);
    checkAttachmentsLength(msg.attachments,3);
    compareAttachments(msg.attachments[0],file1);
    compareAttachments(msg.attachments[1],file3);
    compareAttachments(msg.attachments[2],file2);
}

// msg045
function attachmentsUnshiftTest()
{
    var msg = MsgObj.createMessage(MsgObj.TYPE_EMAIL);

    // check unshift
    msg.attachments = new Array(file1,file2,file3);
    var len = msg.attachments.unshift(file2);
    checkAttachmentsLength(msg.attachments,4);
    checkAttachmentsLength(msg.attachments,len);
    compareAttachments(msg.attachments[0],file2);
    compareAttachments(msg.attachments[1],file1);
}


//=============================================================================

TestEngine.setTestSuiteName("[WAC2.0][Messaging]", 2*60*1000); //2min time out for callbacks
//TestEngine.addTest(true, presenceTest, "[WAC2.0][Messaging] messaging functions presence test");
//TestEngine.addTest(true, createMMSTest, "[WAC2.0][Messaging] create MMS test");
TestEngine.addTest(true, createSMSTest, "[WAC2.0][Messaging] create SMS test");
//TestEngine.addTest(true, createEmailTest, "[WAC2.0][Messaging] create email test");
//TestEngine.addTest(true, createMessageInvalidParamsTest, "[WAC2.0][Messaging] create message function with invalid params test");
//TestEngine.addTest(true, sendMMSTest, "[WAC2.0][Messaging] send MMS test");
//TestEngine.addTest(true, sendSMSTest, "[WAC2.0][Messaging] send SMS test");
//TestEngine.addTest(true, sendEmailTest, "[WAC2.0][Messaging] send Email test");
//TestEngine.addTest(true, sendMessageInvalidParamsTest, "[WAC2.0][Messaging] send message function with invalid params test");
//TestEngine.addTest(true, findNoEmailTest, "[WAC2.0][Messaging] find no EMail test");
//TestEngine.addTest(true, findNoSMSTest, "[WAC2.0][Messaging] find no SMS test");
//TestEngine.addTest(true, findNoMMSTest, "[WAC2.0][Messaging] find no MMS test");
//TestEngine.addTest(true, findEmailTest, "[WAC2.0][Messaging] find EMail test");
//TestEngine.addTest(true, findSMSTest, "[WAC2.0][Messaging] find SMS test");
//TestEngine.addTest(true, findMMSTest, "[WAC2.0][Messaging] find MMS test");
//TestEngine.addTest(true, findMessageInvalidParamsTest, "[WAC2.0][Messaging] find message function invalid params test");
//TestEngine.addTest(true, unsubscribeInvalidTest, "[WAC2.0][Messaging] unsubscribe function with invalid args test");
//TestEngine.addTest(true, onSMSInvalidTest, "[WAC2.0][Messaging] onSMS function test with invalid values");
//TestEngine.addTest(true, onMMSInvalidTest, "[WAC2.0][Messaging] onMMS function test with invalid values");
//TestEngine.addTest(true, onEmailInvalidTest, "[WAC2.0][Messaging] onEmail function test with invalid values");
//TestEngine.addTest(true, onSMSTest, "[WAC2.0][Messaging] onSMS function test");
//TestEngine.addTest(true, onMMSTest, "[WAC2.0][Messaging] onMMS function test");
//TestEngine.addTest(true, onEmailTest, "[WAC2.0][Messaging] onEmail function test");
//TestEngine.addTest(true, attachmentPrecondition, "[WAC2.0][Messaging] attachment tests precondition");
//TestEngine.addTest(true, attachmentsIndexTest, "[WAC2.0][Messaging] attachment index tests");
//TestEngine.addTest(true, attachmentsConcatTest, "[WAC2.0][Messaging] attachment concat tests");
//TestEngine.addTest(true, attachmentsPopTest, "[WAC2.0][Messaging] attachment pop tests");
//TestEngine.addTest(true, attachmentsPushTest, "[WAC2.0][Messaging] attachment push tests");
//TestEngine.addTest(true, attachmentsReverseTest, "[WAC2.0][Messaging] attachment reverse tests");
//TestEngine.addTest(true, attachmentsShiftTest, "[WAC2.0][Messaging] attachment shift tests");
//TestEngine.addTest(true, attachmentsSliceTest, "[WAC2.0][Messaging] attachment slice tests");
//TestEngine.addTest(true, attachmentsSpliceTest, "[WAC2.0][Messaging] attachment splice tests");
//TestEngine.addTest(true, attachmentsUnshiftTest, "[WAC2.0][Messaging] attachment unshift tests");
//TestEngine.addTest(true, attachmentSMSTest, "[WAC2.0][Messaging] SMS attachment test");
//TestEngine.addTest(true, attachmentMMSTest, "[WAC2.0][Messaging] MMS attachment test");
//TestEngine.addTest(true, attachmentEmailTest, "[WAC2.0][Messaging] Email attachment test");
//TestEngine.addTest(true, updateTestSMS, "[WAC2.0][Messaging] Sms update test");
//TestEngine.addTest(true, updateTestMMS, "[WAC2.0][Messaging] Mms update test");
//TestEngine.addTest(true, updateTestEmail, "[WAC2.0][Messaging] Email update test");
//TestEngine.addTest(true, cancelingSendingTest, "[WAC2.0][Messaging] Canceling sendMessage test");
//TestEngine.addTest(true, cancelingFindingTest, "[WAC2.0][Messaging] Canceling findMessage test");
//TestEngine.addTest(true, cancelingUpdateTest, "[WAC2.0][Messaging] Canceling message update test");
