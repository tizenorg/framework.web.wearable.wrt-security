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
function test_Contact_Presence() {
    TestEngine.testPresence("Checking contact presence", deviceapis.pim.contact);
}

function test_Create_Contact_001() {
    function AddressBooksCB001(addressbooks)
    {
        TestEngine.test("getAddressBooks success - fail expected", false);
//        if(addressbooks.length > 0)
//        {
//            var addressbook = addressbooks[0];
//            try{
//                var contact = addressbook.createContact(
//                                                        {
//                                                        firstName:'Brad',
//                                                        lastName:'Pitt'
//                                                        });
//
//                TestEngine.test("check firstName", contact.firstName =="Brad");
//                TestEngine.test("check lastName", contact.lastName =="Pitt");
//            }
//            catch(error)
//            {
//                TestEngine.logErr("createContact,error.code="+error.code);
//            }
//        }
    }

    function failCallback() {
        TestEngine.test("getAddressBooks failed - as expected", true);
    }
    var callback=TestEngine.registerCallback("getAddressBooks",AddressBooksCB001,failCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_Create_Contact_002() {
    function AddressBooksCB002(addressbooks)
    {
        if(addressbooks.length > 0)
        {
            var addressbook = addressbooks[0];
            try{
                var contact = addressbook.createContact(
                                                        {
                                                        addresses:[{types:['WORK'],country:"China",region:"Jiangsu",city:"Nanjing",county:"None",streetAddress:"Lushanlu, 1", postalCode:"210012", additionalInformation:"addinfo1"},
                                                                        {types:['HOME'],country:"China",region:"Jiangsu",city:"Nanjing",county:"None",streetAddress:"Sanshanjie, 99", postalCode:"210009", additionalInformation:"addinfo2"}]
                                                        });
                TestEngine.test("check addresses length", contact.addresses.length == 2);
            }
            catch(error)
            {
                TestEngine.logErr("createContact, error="+error);
            }
        }
    }

    var callback=TestEngine.registerCallback("getAddressBooks",AddressBooksCB002,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_Create_Contact_003() {
    function AddressBooksCB003(addressbooks)
    {
        if(addressbooks.length > 0)
        {
            var addressbook = addressbooks[0];
            try{
                var contact = addressbook.createContact(
                                                        {
                                                        phoneNumbers:[{number:'111111',types:['WORK']},
                                                                    {number:'222222',types:['HOME']},
                                                                    {number:'333333',types:['CAR']},
                                                                    {number:'444444',types:['CELL']},
                                                                    {number:'555555',types:['FAX']},
                                                                    {number:'666666',types:['PAGER']},
                                                                    {number:'7777777',types:['PREF']}]
                                                                    });
                TestEngine.test("check phoneNumbers length", contact.phoneNumbers.length == 7);
            }
            catch(error)
            {
                TestEngine.logErr("createContact,error.code="+error.code);
            }
        }
    }
    var callback=TestEngine.registerCallback("getAddressBooks",AddressBooksCB003,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_Create_Contact_004() {
    function AddressBooksCB004(addressbooks)
    {
        if(addressbooks.length > 0)
        {
            var addressbook = addressbooks[0];
            try{
                var contact = addressbook.createContact(
                                                        {
                                                        emails:[{email:"work@domain.com",types:['WORK']},
                                                                {email:"home@domain.com",types:['HOME']},
                                                                {email:"pref@domain.com",types:['PREF']}]
                                                        });
                TestEngine.test("check emails length", contact.emails.length == 3);
            }
            catch(error)
            {
                TestEngine.logErr("createContact,error.code="+error.code);
            }

        }
    }
    var callback=TestEngine.registerCallback("getAddressBooks",AddressBooksCB004,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_Create_Contact_005() {
    function AddressBooksCB005(addressbooks)
    {
        if(addressbooks.length > 0)
        {
            var addressbook = addressbooks[0];
            try{
                var contact = addressbook.createContact(
                                                        {
                                                        nicknames:['nickname1','nickname2','nickname3','nickname4']
                                                        });
                TestEngine.test("check nicknames length", contact.nicknames.length == 4);
            }
            catch(error)
            {
                TestEngine.logErr("createContact,error.code="+error.code);
            }

        }
    }
    var callback=TestEngine.registerCallback("getAddressBooks",AddressBooksCB005,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_Create_Contact_006() {
    function AddressBooksCB006(addressbooks)
    {
        if(addressbooks.length > 0)
        {
            var addressbook = addressbooks[0];
            try{
                var contact = addressbook.createContact(
                                                        {
                                                        photoURI:'/opt/apps/widget/tests/attachments/attach1.jpg'
                                                        });
                TestEngine.test("check photoURI", contact.photoURI == "/opt/apps/widget/tests/attachments/attach1.jpg");
            }
            catch(error)
            {
                TestEngine.logErr("createContact,error.code="+error.code);
            }

        }
    }
    var callback=TestEngine.registerCallback("getAddressBooks",AddressBooksCB006,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_Create_Contact_007() {
    function AddressBooksCB007(addressbooks)
    {
        if(addressbooks.length > 0)
        {
            var addressbook = addressbooks[0];
            try{
                var contact = addressbook.createContact(
                                                        {
                                                        firstName:'Brad',
                                                        lastName:'Pitt',
                                                        addresses:[{types:['WORK'],country:"China",region:"Jiangsu",city:"Nanjing",county:"None",streetAddress:"Lushanlu, 1", postalCode:"210012", additionalInformation:"addinfo1"},
                                                                        {types:['HOME'],country:"China",region:"Jiangsu",city:"Nanjing",county:"None",streetAddress:"Sanshanjie, 99", postalCode:"210009", additionalInformation:"addinfo2"}],
                                                        phoneNumbers:[{number:'111111',types:['WORK']},
                                                                    {number:'222222',types:['HOME']},
                                                                    {number:'333333',types:['CAR']},
                                                                    {number:'444444',types:['CELL']},
                                                                    {number:'555555',types:['FAX']},
                                                                    {number:'666666',types:['PAGER']},
                                                                    {number:'7777777',types:['PREF']}],
                                                        emails:[{email:"work@domain.com",types:['WORK']},
                                                                {email:"home@domain.com",types:['HOME']},
                                                                {email:"pref@domain.com",types:['PREF']}],
                                                        nicknames:['nickname1','nickname2','nickname3','nickname4']
                                                        });
                TestEngine.test("check firstName", contact.firstName =="Brad");
                TestEngine.test("check lastName", contact.lastName =="Pitt");
                TestEngine.test("check addresses length", contact.addresses.length == 2);
                TestEngine.test("check phoneNumbers length", contact.phoneNumbers.length == 7);
                TestEngine.test("check emails length", contact.emails.length == 3);
                TestEngine.test("check nicknames length", contact.nicknames.length == 4);
            }
            catch(error)
            {
                TestEngine.logErr("createContact,error.code="+error.code);
            }

        }
    }
    var callback=TestEngine.registerCallback("getAddressBooks",AddressBooksCB007,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_Get_AddressBooks_001() {
    function getAddressBooksCB(addressbooks)
    {
        TestEngine.logOK("getAddressBooksCB");
        TestEngine.log("addressbooks length = " + addressbooks.length);

        for(var i=0;i<addressbooks.length;i++)
        {
            TestEngine.log(addressbooks[i].name);
            TestEngine.log(addressbooks[i].type);
        }
    }

    var callback=TestEngine.registerCallback("getAddressBooks",getAddressBooksCB,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_Add_Contact_006() {
    function AddressBooksCB013(addressbooks)
    {
        var contact;
        TestEngine.log("AddressBooksCB");

        if(addressbooks.length > 0)
        {
            var addressbook = addressbooks[0];
            TestEngine.log("The addressbook type is " + addressbook.type +  " and name " + addressbook.name);

            try{
                var contact = addressbook.createContact(
                                                        {
                                                        firstName:'Brad',
                                                        lastName:'Pitt',
                                                        addresses:[{types:['PREF'],country:"Finland",region:"Jiangsu",city:"Nanjing",county:"None",streetAddress:"Sanshanjie, 99", postalCode:"210009", additionalInformation:"Other"},
                                                                        {types:['HOME'],country:"China",region:"Jiangsu",city:"Nanjing",county:"None",streetAddress:"Sanshanjie, 99", postalCode:"210009", additionalInformation:"Home"},
                                                                        {types:['WORK'],country:"China",region:"Jiangsu",city:"Nanjing",county:"None",streetAddress:"Lushanlu, 1", postalCode:"210012", additionalInformation:"Work"}],
                                                        phoneNumbers:[{number:'111111',types:['WORK']},
                                                                    {number:'222222',types:['HOME']},
                                                                    {number:'333333',types:['CAR']},
                                                                    {number:'444444',types:['CELL']},
                                                                    {number:'555555',types:['FAX']},
                                                                    {number:'666666',types:['PAGER']},
                                                                    {number:'7777777',types:['PREF']}],
                                                        emails:[{email:"work@domain.com",types:['WORK']},
                                                                {email:"home@domain.com",types:['HOME']},
                                                                {email:"pref@domain.com",types:['PREF']}],
                                                        nicknames:['nickname1','nickname2','nickname3','nickname4'],
                                                        photoURI:'/opt/apps/widget/tests/attachments/attach1.jpg'
                                                        });
                var callback=TestEngine.registerCallback("addContact",contactAddedCB,addContactErrorCallback);
                addressbook.addContact(callback.successCallback, callback.errorCallback, contact);
            }
            catch(error)
            {
                TestEngine.logErr("createContact,error.code="+error.code);
            }
        }
    }
    deviceapis.pim.contact.getAddressBooks(AddressBooksCB013,  getAddressBooksErrorCallback);
}


function test_findContacts_001() {
    function getAddressBooksCB(addressbooks)
    {
        TestEngine.log("getAddressBooksCB");
        //var addressbook = addressbooks[0];

        try{
            var callback2=TestEngine.registerCallback("findContacts",contactSearchSuccessCallback,findContactErrorCallback);
            addressbooks[0].findContacts(callback2.successCallback, callback2.errorCallback);
        }
        catch(error)
        {
            TestEngine.logErr("createContact,error.code="+error.code);
        }
    }

    var callback=TestEngine.registerCallback("getAddressBooks",getAddressBooksCB,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_findContacts_002() {
    function getAddressBooksCB(addressbooks)
    {
        TestEngine.log("getAddressBooksCB");
        //var addressbook = addressbooks[0];

        try{
            var callback2=TestEngine.registerCallback("findContacts",contactSearchSuccessCallback,findContactErrorCallback);
            addressbooks[0].findContacts(callback2.successCallback, callback2.errorCallback,{firstName:'%ra%'});
        }
        catch(error)
        {
            TestEngine.logErr("createContact,error.code="+error.code);
        }
    }

    var callback=TestEngine.registerCallback("getAddressBooks",getAddressBooksCB,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_findContacts_003() {
    function getAddressBooksCB(addressbooks)
    {
        TestEngine.log("getAddressBooksCB");
        //var addressbook = addressbooks[0];

        try{
            var callback2=TestEngine.registerCallback("findContacts",contactSearchSuccessCallback,findContactErrorCallback);
            addressbooks[0].findContacts(callback2.successCallback, callback2.errorCallback,{lastName:'%itt%'});
        }
        catch(error)
        {
            TestEngine.logErr("createContact,error.code="+error.code);
        }
    }

    var callback=TestEngine.registerCallback("getAddressBooks",getAddressBooksCB,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_findContacts_004() {
    function getAddressBooksCB(addressbooks)
    {
        TestEngine.log("getAddressBooksCB");
        //var addressbook = addressbooks[0];

        try{
            var callback2=TestEngine.registerCallback("findContacts",contactSearchSuccessCallback,findContactErrorCallback);
            addressbooks[0].findContacts(callback2.successCallback, callback2.errorCallback,{phoneNumbers:[{number:'111111',types:['WORK']}]});
        }
        catch(error)
        {
            TestEngine.logErr("createContact,error.code="+error.code);
        }
    }

    var callback=TestEngine.registerCallback("getAddressBooks",getAddressBooksCB,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_findContacts_005() {
    function getAddressBooksCB(addressbooks)
    {
        TestEngine.log("getAddressBooksCB");
        //var addressbook = addressbooks[0];

        try{
            var callback2=TestEngine.registerCallback("findContacts",contactSearchSuccessCallback,findContactErrorCallback);
            addressbooks[0].findContacts(callback2.successCallback, callback2.errorCallback,{addresses:[{types:['WORK'],country:"China"}]});
        }
        catch(error)
        {
            TestEngine.logErr("createContact,error.code="+error.code);
        }
    }

    var callback=TestEngine.registerCallback("getAddressBooks",getAddressBooksCB,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_findContacts_006() {
    function getAddressBooksCB(addressbooks)
    {
        TestEngine.log("getAddressBooksCB");
        //var addressbook = addressbooks[0];

        try{
            var callback2=TestEngine.registerCallback("findContacts",contactSearchSuccessCallback,findContactErrorCallback);
            addressbooks[0].findContacts(callback2.successCallback, callback2.errorCallback,{emails:[{email:"work@domain.com%",types:['WORK']}]});
        }
        catch(error)
        {
            TestEngine.logErr("createContact,error.code="+error.code);
        }
    }
    var callback=TestEngine.registerCallback("getAddressBooks",getAddressBooksCB,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_deleteContacts_001() {
    function getAddressBooksCB(addressbooks)
    {
        TestEngine.log("getAddressBooksCB");
        //var addressbook = addressbooks[0];

        function findContactSuccessCallback(contacts)
        {
            TestEngine.log("findContactSuccessCallback");
            TestEngine.test("Contact list not empty", contacts.length > 0);
            function contactDeleteSuccessCallback()
            {
                TestEngine.logOK("contactDeleteSuccessCallback Callback");
            }

            var callback3=TestEngine.registerCallback("deleteContacts",contactDeleteSuccessCallback,deleteContactErrorCallback);
            addressbooks[0].deleteContact(callback3.successCallback, callback3.errorCallback, contacts[0].id);
        }

        try{
            var callback2=TestEngine.registerCallback("findContacts",findContactSuccessCallback,findContactErrorCallback);
            addressbooks[0].findContacts(callback2.successCallback, callback2.errorCallback);
        }
        catch(error)
        {
            TestEngine.logErr("createContact,error.code="+error.code);
        }
    }

    var callback=TestEngine.registerCallback("getAddressBooks",getAddressBooksCB,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function test_updateContacts_001() {
    function getAddressBooksCB(addressbooks)
    {
        TestEngine.log("getAddressBooksCB");
        //var addressbook = addressbooks[0];

        function findContactSuccessCallback(contacts)
        {
            TestEngine.log("findContactSuccessCallback");
            function contactUpdateSuccessCallback()
            {
                TestEngine.logOK("contactUpdateSuccessCallback Callback");
            }
            TestEngine.test("Contact list not empty", contacts.length > 0);
            TestEngine.log("contacts[0] id ="+contacts[0].id );
            contacts[0].firstName = "Asuka3";
            contacts[0].lastName = "Langley3";
            contacts[0].photoURI= "/opt/apps/widget/tests/attachments/attach1.jpg";
            var phoneNumber ={number:'999999',types:['WORK']};
            var address = {types:['HOME'],country:"Test",region:"Test",city:"Test",county:"Test",streetAddress:"Test", postalCode:"Test", additionalInformation:"Test"};
            var email={email:"test@domain.com",types:['WORK']};

            TestEngine.log("photoURI =" + contacts[0].photoURI);
            if(contacts[0].phoneNumbers.length>0)
            {
                contacts[0].phoneNumbers[0]=phoneNumber;
            }

            if(contacts[0].addresses.length>0)
            {
                contacts[0].addresses[0]=address;
            }

            if(contacts[0].emails.length>0)
            {
                contacts[0].emails[0]=email;
            }

            var callback3=TestEngine.registerCallback("updateContact",contactUpdateSuccessCallback,updateContactErrorCallback);
            addressbooks[0].updateContact(callback3.successCallback, callback3.errorCallback, contacts[0]);
        }

        try{
            var callback2=TestEngine.registerCallback("findContacts",findContactSuccessCallback,findContactErrorCallback);
            addressbooks[0].findContacts(callback2.successCallback, callback2.errorCallback);
        }
        catch(error)
        {
            TestEngine.logErr("createContact,error.code="+error.code);
        }
    }

    var callback=TestEngine.registerCallback("getAddressBooks",getAddressBooksCB,getAddressBooksErrorCallback);
    deviceapis.pim.contact.getAddressBooks(callback.successCallback, callback.errorCallback);
}

function contactAddedCB(contact)
{
    TestEngine.log("typeof(contact) =" + typeof(contact));
    TestEngine.testPresence("Checking contact presence", contact);
    TestEngine.test("check firstName", contact.firstName =="Brad");
    TestEngine.test("check lastName", contact.lastName =="Pitt");
    TestEngine.test("check addresses length", contact.addresses.length == 3);
    TestEngine.test("check phoneNumbers length", contact.phoneNumbers.length == 7);
    TestEngine.test("check emails length", contact.emails.length == 3);
    //TestEngine.test("check nicknames length", contact.nicknames.length == 4);
    TestEngine.test("check photoURI", contact.photoURI == "/opt/apps/widget/tests/attachments/attach1.jpg");
    TestEngine.logOK("contactAddedCB Callback");
}

function contactSearchSuccessCallback(contacts)
{
    TestEngine.log(""+contacts.length + " results found.");
    for(var i=0;i<contacts.length;i++)
    {
        TestEngine.log("contacts["+i+"] id=" + contacts[i].id);
        TestEngine.log("contacts["+i+"] firstName=" + contacts[i].firstName);
        TestEngine.log("contacts["+i+"] lastName=" + contacts[i].lastName);
        TestEngine.log("contacts["+i+"] addresses length=" + contacts[i].addresses.length);
        TestEngine.log("contacts["+i+"] phoneNumbers length=" + contacts[i].phoneNumbers.length);
        TestEngine.log("contacts["+i+"] emails length =" + contacts[i].emails.length );
        TestEngine.log("contacts["+i+"] nicknames length=" + contacts[i].nicknames.length);
    }
    TestEngine.logOK("contactAddedCB Callback");

}

function getAddressBooksErrorCallback(response)
{
    TestEngine.logErr("getAddressBooks Error Callback");
}

function addContactErrorCallback(response)
{
    TestEngine.logErr("contactAddedCB Callback");
}

function findContactErrorCallback(response)
{
    TestEngine.logErr("find contact error Callback");
}

function deleteContactErrorCallback(response)
{
    TestEngine.logErr("Delete contact error Callback");
}

function updateContactErrorCallback(response)
{
    TestEngine.logErr("Update contact error Callback");
}

TestEngine.setTestSuiteName('[WAC2.0][Contact]',60*1000);
//TestEngine.addTest(true,test_Contact_Presence,"[WAC2.0][Contact]test_Contact");
TestEngine.addTest(true,test_Create_Contact_001,"[WAC2.0][Contact]test_Create_Contact_001");
//TestEngine.addTest(true,test_Create_Contact_002,"[WAC2.0][Contact]test_Create_Contact_002");
//TestEngine.addTest(true,test_Create_Contact_003,"[WAC2.0][Contact]test_Create_Contact_003");
//TestEngine.addTest(true,test_Create_Contact_004,"[WAC2.0][Contact]test_Create_Contact_004");
//TestEngine.addTest(true,test_Create_Contact_005,"[WAC2.0][Contact]test_Create_Contact_005");
//TestEngine.addTest(true,test_Create_Contact_006,"[WAC2.0][Contact]test_Create_Contact_006");
//TestEngine.addTest(true,test_Create_Contact_007,"[WAC2.0][Contact]test_Create_Contact_007");
//
//TestEngine.addTest(true,test_Add_Contact_006,"[WAC2.0][Contact]test_Add_Contact_006");
//TestEngine.addTest(true,test_Get_AddressBooks_001,"[WAC2.0][Contact]test_Get_AddressBooks_001");
//TestEngine.addTest(true,test_findContacts_001,"[WAC2.0][Contact]test_Find_findContacts_001");
//TestEngine.addTest(true,test_findContacts_002,"[WAC2.0][Contact]test_Find_findContacts_002");
//TestEngine.addTest(true,test_findContacts_003,"[WAC2.0][Contact]test_Find_findContacts_003");
//TestEngine.addTest(true,test_findContacts_004,"[WAC2.0][Contact]test_Find_findContacts_004");
//TestEngine.addTest(true,test_findContacts_005,"[WAC2.0][Contact]test_Find_findContacts_005");
//TestEngine.addTest(true,test_findContacts_006,"[WAC2.0][Contact]test_Find_findContacts_006");
//TestEngine.addTest(true,test_updateContacts_001,"[WAC2.0][Contact]test_Find_updateContacts_001");
//TestEngine.addTest(true,test_deleteContacts_001,"[WAC2.0][Contact]test_Find_deleteContacts_001");

