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
/*
 * @file    test_cases.cpp
 * @author  Tonasz Swierczek (t.swierczek@samsung.com)
 * @version 1.0
 * @brief   Implementation file for ACE client test cases.
 */
#include <dpl/test/test_runner.h>
#include <memory>

#include "ace_client.h"
#include "ace_api_client.h"
#include "AceDAOReadOnly_mock.h"
#include "communication_client_mock.h"
#include "PolicyInformationPoint_mock.h"

namespace {

const char* featureName1 = "feature-1";
const char* featureName2 = "feature-2";
const char* devCapName1 = "devCap-1";
const char* devCapName2 = "devCap-2";
const char* devCapName3noSmack = "devCap-3-no-smack";
const char* devCapName4noSmack = "devCap-4-no-smack";
const char* devCapName5notRequested = "devCap-5-not-requested";
const char* devCapName6notRequested = "devCap-6-not-requested";
const char* devCap_EXTERNAL_NETWORK_ACCESS_DEV_CAP = "externalNetworkAccess";
const char* devCap_XML_HTTP_REQUEST_ACCESS_DEV_CAP = "XMLHttpRequest";

// UI callback function used for popups

static ace_bool_t validation_result = ACE_TRUE;

ace_return_t ace_popup_handler_func(ace_popup_t,
                                    const ace_resource_t,
                                    const ace_session_id_t,
                                    const ace_param_list_t*,
                                    ace_widget_handle_t,
                                    ace_bool_t* validation)
{
    *validation = validation_result;
    return ACE_OK;
}

enum class DevCapsToUse {
    RequestedSmack,
    RequestedNoSmack,
    HTTP_XML_Requests,
    NotRequested
};

enum class AceTestOptionalCachedPolicyResult {
    UNDETERMINED,
    NOT_APPLICABLE,
    PROMPT_BLANKET,
    PROMPT_SESSION,
    PROMPT_ONESHOT,
    PERMIT,
    DENY,
    NULL_VALUE
};

enum class AceTestPolicyResult {
    UNDETERMINED,
    NOT_APPLICABLE,
    PROMPT_BLANKET,
    PROMPT_SESSION,
    PROMPT_ONESHOT,
    PERMIT,
    DENY
};

enum class AceTestOptionalCachedPromptDecision {
    ALLOW_ALWAYS,
    DENY_ALWAYS,
    ALLOW_THIS_TIME,
    DENY_THIS_TIME,
    ALLOW_FOR_SESSION,
    DENY_FOR_SESSION,
    NULL_VALUE
};

static void configureTest(
    AceTestOptionalCachedPolicyResult cachedPolicyResult,
    AceTestOptionalCachedPromptDecision cachedPromptDecision,
    const std::string& cachedPromptSession,
    AceTestPolicyResult securityDaemonPolicyResult,
    bool popupResponse)
{
    // Cached decision from popups
    switch (cachedPromptDecision) {
    case AceTestOptionalCachedPromptDecision::ALLOW_ALWAYS: {
        CachedPromptDecision decision;
        decision.decision = PromptDecision::ALLOW_ALWAYS;
        decision.session = DPL::FromUTF8String(cachedPromptSession);
        AceDB::AceDAOReadOnly::setPromptDecision(
                OptionalCachedPromptDecision(decision));
        break; }
    case AceTestOptionalCachedPromptDecision::DENY_ALWAYS: {
        CachedPromptDecision decision;
        decision.decision = PromptDecision::DENY_ALWAYS;
        decision.session = DPL::FromUTF8String(cachedPromptSession);
        AceDB::AceDAOReadOnly::setPromptDecision(
                        OptionalCachedPromptDecision(decision));
        break; }
    case AceTestOptionalCachedPromptDecision::ALLOW_THIS_TIME: {
        CachedPromptDecision decision;
        decision.decision = PromptDecision::ALLOW_THIS_TIME;
        decision.session = DPL::FromUTF8String(cachedPromptSession);
        AceDB::AceDAOReadOnly::setPromptDecision(
                        OptionalCachedPromptDecision(decision));
        break; }
    case AceTestOptionalCachedPromptDecision::DENY_THIS_TIME: {
        CachedPromptDecision decision;
        decision.decision = PromptDecision::DENY_THIS_TIME;
        decision.session = DPL::FromUTF8String(cachedPromptSession);
        AceDB::AceDAOReadOnly::setPromptDecision(
                        OptionalCachedPromptDecision(decision));
        break; }
    case AceTestOptionalCachedPromptDecision::ALLOW_FOR_SESSION: {
        CachedPromptDecision decision;
        decision.decision = PromptDecision::ALLOW_FOR_SESSION;
        decision.session = DPL::FromUTF8String(cachedPromptSession);
        AceDB::AceDAOReadOnly::setPromptDecision(
                        OptionalCachedPromptDecision(decision));
        break; }
    case AceTestOptionalCachedPromptDecision::DENY_FOR_SESSION: {
        CachedPromptDecision decision;
        decision.decision = PromptDecision::DENY_FOR_SESSION;
        decision.session = DPL::FromUTF8String(cachedPromptSession);
        AceDB::AceDAOReadOnly::setPromptDecision(
                        OptionalCachedPromptDecision(decision));
        break; }
    case AceTestOptionalCachedPromptDecision::NULL_VALUE:
    default : {
        AceDB::AceDAOReadOnly::setPromptDecision(
                OptionalCachedPromptDecision());
        break; }
    }

    // Daemon response
    switch (securityDaemonPolicyResult) {
    case AceTestPolicyResult::UNDETERMINED: {
        WrtSecurity::Communication::Client::setCheckAccessResult(PolicyResult::serialize(
                PolicyResult(PolicyResult::Value::UNDETERMINED)));
        break; }
    case AceTestPolicyResult::NOT_APPLICABLE: {
        WrtSecurity::Communication::Client::setCheckAccessResult(PolicyResult::serialize(
                PolicyResult()));
        break; }
    case AceTestPolicyResult::PROMPT_BLANKET: {
        WrtSecurity::Communication::Client::setCheckAccessResult(PolicyResult::serialize(
                PolicyResult(PolicyEffect::PROMPT_BLANKET)));
        break; }
    case AceTestPolicyResult::PROMPT_SESSION: {
        WrtSecurity::Communication::Client::setCheckAccessResult(PolicyResult::serialize(
                PolicyResult(PolicyEffect::PROMPT_SESSION)));
        break; }
    case AceTestPolicyResult::PROMPT_ONESHOT: {
        WrtSecurity::Communication::Client::setCheckAccessResult(PolicyResult::serialize(
                PolicyResult(PolicyEffect::PROMPT_ONESHOT)));
        break; }
    case AceTestPolicyResult::PERMIT: {
        WrtSecurity::Communication::Client::setCheckAccessResult(PolicyResult::serialize(
                PolicyResult(PolicyEffect::PERMIT)));
        break; }
    case AceTestPolicyResult::DENY: {
        WrtSecurity::Communication::Client::setCheckAccessResult(PolicyResult::serialize(
                PolicyResult(PolicyEffect::DENY)));
        break; }
    default: {
        WrtSecurity::Communication::Client::setCheckAccessResult(PolicyResult::serialize(
                PolicyResult()));
        break; }
    }

    // Not empty attribute set to be returned
    AceDB::BaseAttributeSet attributeSet;
    AceDB::BaseAttributePtr attribute(new AceDB::BaseAttribute());
    std::string aname = "attribute-subject-name1";
    attribute->setName(&aname);
    attribute->setType(AceDB::BaseAttribute::Type::Subject);
    attributeSet.insert(attribute);
    AceDB::AceDAOReadOnly::setAttributeSet(attributeSet);

    // Cached response
    switch (cachedPolicyResult) {
    case AceTestOptionalCachedPolicyResult::UNDETERMINED: {
        AceDB::AceDAOReadOnly::setPolicyResult(
                ExtendedPolicyResult(PolicyResult::Value::UNDETERMINED));
        break; }
    case AceTestOptionalCachedPolicyResult::NOT_APPLICABLE: {
        AceDB::AceDAOReadOnly::setPolicyResult(
                ExtendedPolicyResult(PolicyResult()));
        break; }
    case AceTestOptionalCachedPolicyResult::PROMPT_BLANKET: {
        AceDB::AceDAOReadOnly::setPolicyResult(
                ExtendedPolicyResult(PolicyEffect::PROMPT_BLANKET));
        break; }
    case AceTestOptionalCachedPolicyResult::PROMPT_SESSION: {
        AceDB::AceDAOReadOnly::setPolicyResult(
                ExtendedPolicyResult(PolicyEffect::PROMPT_SESSION));
        break; }
    case AceTestOptionalCachedPolicyResult::PROMPT_ONESHOT: {
        AceDB::AceDAOReadOnly::setPolicyResult(
                ExtendedPolicyResult(PolicyEffect::PROMPT_ONESHOT));
        break; }
    case AceTestOptionalCachedPolicyResult::PERMIT: {
        AceDB::AceDAOReadOnly::setPolicyResult(
                ExtendedPolicyResult(PolicyEffect::PERMIT));
        break; }
    case AceTestOptionalCachedPolicyResult::DENY: {
        AceDB::AceDAOReadOnly::setPolicyResult(
                ExtendedPolicyResult(PolicyEffect::DENY));
        break; }
    case AceTestOptionalCachedPolicyResult::NULL_VALUE:
    default: {
        AceDB::AceDAOReadOnly::setPolicyResult(OptionalExtendedPolicyResult());
        break;
        }
    }

    // Prompt decision/validation from UI handler function
    validation_result = popupResponse ? ACE_TRUE : ACE_FALSE;

    // Setting requested dev capps (for SMACK)
    AceDB::RequestedDevCapsMap devCapPermissions;
    devCapPermissions.insert(std::make_pair(DPL::FromASCIIString(devCapName1),true));
    devCapPermissions.insert(std::make_pair(DPL::FromASCIIString(devCapName2),true));
    devCapPermissions.insert(std::make_pair(DPL::FromASCIIString(devCapName3noSmack),false));
    devCapPermissions.insert(std::make_pair(DPL::FromASCIIString(devCapName4noSmack),false));
    AceDB::AceDAOReadOnly::setDevCapPermissions(devCapPermissions);

    AceDB::FeatureNameVector fvector;
    fvector.push_back(DPL::FromASCIIString(featureName1));
    fvector.push_back(DPL::FromASCIIString(featureName2));
    AceDB::AceDAOReadOnly::setAcceptedFeature(fvector);
}

static void fillRequest(AceClient::AceRequest &aceRequest,
                        AceClient::AceSessionId sessionId,
                        DevCapsToUse caps = DevCapsToUse::RequestedSmack)
{
    static const char* apiFeature[] = {featureName1, featureName2};
    static const char* devCapNames[] = {devCapName2, devCapName1};
    static const char* devCapNamesNoSmack[] = {devCapName3noSmack,
                                              devCapName4noSmack};
    static const char* devCapNamesNotReq[] = {devCapName5notRequested,
                                              devCapName6notRequested};
    static const char* devCapNamesHTTPXML[] =
            {devCap_EXTERNAL_NETWORK_ACCESS_DEV_CAP,
             devCap_XML_HTTP_REQUEST_ACCESS_DEV_CAP};

    static AceClient::AceParamList paramList[2];
    static AceClient::AceParam param("param1-name", "param1-value");

    paramList[0].count = 1;
    paramList[0].param = &param;
    paramList[1].count = 1;
    paramList[1].param = &param;

    aceRequest.sessionId = sessionId;
    aceRequest.widgetHandle = 0;
    aceRequest.apiFeatures.count = 2;
    aceRequest.apiFeatures.apiFeature = apiFeature;
    aceRequest.functionName = "test-function-name";
    aceRequest.deviceCapabilities.devcapsCount = 2;
    switch(caps) {
    case DevCapsToUse::RequestedSmack: {
        aceRequest.deviceCapabilities.devCapNames = devCapNames;
        break; }
    case DevCapsToUse::RequestedNoSmack: {
        aceRequest.deviceCapabilities.devCapNames = devCapNamesNoSmack;
        break; }
    case DevCapsToUse::NotRequested: {
        aceRequest.deviceCapabilities.devCapNames = devCapNamesNotReq;
        break; }
    case DevCapsToUse::HTTP_XML_Requests: {
        aceRequest.deviceCapabilities.devCapNames = devCapNamesHTTPXML;
        break; }
    }
    aceRequest.deviceCapabilities.paramsCount = 2;
    aceRequest.deviceCapabilities.params = paramList;
}

// New C API version of request setup
static void fillCAPIRequest(ace_request_t &aceRequest,
                            AceClient::AceSessionId sessionId,
                            DevCapsToUse caps = DevCapsToUse::RequestedSmack)
{
    static const char* apiFeature[] = {featureName1, featureName2};
    static const char* devCapNames[] = {devCapName2, devCapName1};
    static const char* devCapNamesNoSmack[] = {devCapName3noSmack,
                                              devCapName4noSmack};
    static const char* devCapNamesNotReq[] = {devCapName5notRequested,
                                              devCapName6notRequested};
    static const char* devCapNamesHTTPXML[] =
            {devCap_EXTERNAL_NETWORK_ACCESS_DEV_CAP,
             devCap_XML_HTTP_REQUEST_ACCESS_DEV_CAP};

    static std::string session = sessionId;

    aceRequest.session_id = const_cast<char*>(session.c_str());
    aceRequest.widget_handle = 0;
    aceRequest.feature_list.count = 2;
    aceRequest.feature_list.items = const_cast<char**>(apiFeature);

    static ace_param_t param;
    param.name = const_cast<char*>("param1-name");
    param.value = const_cast<char*>("param1-value");

    static ace_dev_cap_t devCapList[2];
    devCapList[0].param_list.count = 1;
    devCapList[1].param_list.count = 1;
    devCapList[0].param_list.items = &param;
    devCapList[1].param_list.items = &param;

    aceRequest.dev_cap_list.count = 2;
    aceRequest.dev_cap_list.items = devCapList;

    switch(caps) {
    case DevCapsToUse::RequestedSmack: {
        aceRequest.dev_cap_list.items[0].name = const_cast<char*>(devCapNames[0]);
        aceRequest.dev_cap_list.items[1].name = const_cast<char*>(devCapNames[1]);
        break; }
    case DevCapsToUse::RequestedNoSmack: {
        aceRequest.dev_cap_list.items[0].name = const_cast<char*>(devCapNamesNoSmack[0]);
        aceRequest.dev_cap_list.items[1].name = const_cast<char*>(devCapNamesNoSmack[1]);
        break; }
    case DevCapsToUse::NotRequested: {
        aceRequest.dev_cap_list.items[0].name = const_cast<char*>(devCapNamesNotReq[0]);
        aceRequest.dev_cap_list.items[1].name = const_cast<char*>(devCapNamesNotReq[1]);
        break; }
    case DevCapsToUse::HTTP_XML_Requests: {
        aceRequest.dev_cap_list.items[0].name = const_cast<char*>(devCapNamesHTTPXML[0]);
        aceRequest.dev_cap_list.items[1].name = const_cast<char*>(devCapNamesHTTPXML[1]);
        break; }
    }
}

// A macro for doing ACE check with new C API
#define ACE_CHECK(req, exp_result)  {\
    ace_bool_t ret = ACE_FALSE;\
    RUNNER_ASSERT(ACE_OK == ace_check_access(&req, &ret));\
    RUNNER_ASSERT(ret == exp_result);\
}

} // namespace

RUNNER_TEST_GROUP_INIT(ACE_CLINET_TEST_SUITE)

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::isInitialized()
 * purpose: tests proper initialization of singleton on first usage
 */
RUNNER_TEST(ace_client_test_01_initialization)
{
    AceClient::AceThinClient &client =
                AceClient::AceThinClientSingleton::Instance();
    RUNNER_ASSERT(client.isInitialized());
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests proper policy and prompt results given by ace client
 * function should deny access to requested dev caps, even though there is
 * cached PERMIT result, there is no smack rule given - security daemon should
 * be called again and answer DENY
 */
RUNNER_TEST(ace_client_test_02_no_smack_rules)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session", DevCapsToUse::RequestedNoSmack);

    configureTest(
            AceTestOptionalCachedPolicyResult::PERMIT,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::DENY,
            false);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests proper behaviour for dev caps that are not directly
 * mentioned in widgets confing like HTTP_XML_Requests. Two times function
 * should check access, once with DENY (false) result, then with PERMIT (true)
 */
RUNNER_TEST(ace_client_test_03_xml_http_requests_dev_caps)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session", DevCapsToUse::HTTP_XML_Requests);

    configureTest(
            AceTestOptionalCachedPolicyResult::PERMIT,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::PERMIT,
            false);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::DENY,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::DENY,
            false);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests proper behaviour for dev caps that are not directly
 * mentioned in widgets confing, but that are not HTTP_XML_Requests.
 * Function should check access and return with DENY (false).
 */
// Thin client no longer checks device-caps.
// It will check only feature list.

//RUNNER_TEST(ace_client_test_04_not_requested_dev_caps)
//{
//    AceClient::AceThinClient &client =
//            AceClient::AceThinClientSingleton::Instance();
//    AceClient::AceRequest aceRequest;
//
//    fillRequest(aceRequest, "this-session", DevCapsToUse::NotRequested);
//
//    configureTest(
//            AceTestOptionalCachedPolicyResult::PERMIT,
//            AceTestOptionalCachedPromptDecision::NULL_VALUE,
//            "this-session",
//            AceTestPolicyResult::PERMIT,
//            true);
//    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
//}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when here are no cached values for policy
 * results and for prompt answers. The security daemon should be asked and
 * it should return PERMIT for first time, then DENY.
 */
RUNNER_TEST(ace_client_test_05_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::ALLOW_ALWAYS,
            "this-session",
            AceTestPolicyResult::PERMIT,
            true);

    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::ALLOW_ALWAYS,
            "this-session",
            AceTestPolicyResult::DENY,
            true);

    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when here are cached values for policy
 * results (PERMIT and DENY case, no prompts).
 */
RUNNER_TEST(ace_client_test_06_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PERMIT,
            AceTestOptionalCachedPromptDecision::ALLOW_ALWAYS,
            "this-session",
            AceTestPolicyResult::DENY,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::DENY,
            AceTestOptionalCachedPromptDecision::ALLOW_ALWAYS,
            "this-session",
            AceTestPolicyResult::DENY,
            true);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when here are cached values for policy
 * results (PROMPT_BLANKET), but there is no cached value for prompt, so prompt
 * should be opened, once returning DENY (false), second time PERMIT (true).
 */
RUNNER_TEST(ace_client_test_07_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    RUNNER_ASSERT(ACE_OK == ace_client_initialize(ace_popup_handler_func));

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_BLANKET,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::DENY,
            false);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_BLANKET,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::DENY,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when here are cached values for both: policy
 * results (PROMPT_BLANKET) and for prompt. Ace client should deny access for
 * cached prompt DENY_FOR_SESSION answer and allow access for ALLOW_FOR_SESSION,
 * given that session id ("this-session") is the same in cache as in request.
 */
RUNNER_TEST(ace_client_test_08_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    RUNNER_ASSERT(ACE_OK == ace_client_initialize(ace_popup_handler_func));

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_BLANKET,
            AceTestOptionalCachedPromptDecision::DENY_FOR_SESSION,
            "this-session",
            AceTestPolicyResult::DENY,
            true);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_BLANKET,
            AceTestOptionalCachedPromptDecision::ALLOW_FOR_SESSION,
            "this-session",
            AceTestPolicyResult::DENY,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when here are cached values for both: policy
 * results (PROMPT_BLANKET) and for prompt. Cached prompt decisions are remembered
 * with another session id, but are *ALWAYS versions, so those are valid for
 * incoming request. Ace client should first deny access (as there is
 * DENY_ALWAYS in cache), and then allow (because of ALLOW_ALWAYS).
 */
RUNNER_TEST(ace_client_test_09_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    RUNNER_ASSERT(ACE_OK == ace_client_initialize(ace_popup_handler_func));

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_BLANKET,
            AceTestOptionalCachedPromptDecision::DENY_ALWAYS,
            "another-session",
            AceTestPolicyResult::DENY,
            true);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_BLANKET,
            AceTestOptionalCachedPromptDecision::ALLOW_ALWAYS,
            "another-session",
            AceTestPolicyResult::DENY,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when here are cached values for both: policy
 * results (PROMPT_SESSION and PROMPT_BLANKET) and for prompt.
 * Cached prompt decisions are remembered with another session id and are
 * *FOR_SESSION versions, meaning that there is efectively
 * no prompt cache - popup needs to be called once again, and ace client
 * needs to answer accordingly (first true (PERMIT), then false (DENY)).
 */
RUNNER_TEST(ace_client_test_10_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    RUNNER_ASSERT(ACE_OK == ace_client_initialize(ace_popup_handler_func));

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_SESSION,
            AceTestOptionalCachedPromptDecision::DENY_FOR_SESSION,
            "another-session",
            AceTestPolicyResult::DENY,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_BLANKET,
            AceTestOptionalCachedPromptDecision::ALLOW_FOR_SESSION,
            "another-session",
            AceTestPolicyResult::PERMIT,
            false);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when here are cached values for both: policy
 * results (PROMPT_SESSION) and for prompt. Cached prompt decisions are remembered
 * with another session id and are *FOR_SESSION versions, meaning that there is
 * efectively no prompt cache - popup needs to be called once again, and ace client
 * needs to answer accordingly (first true (PERMIT), then false (DENY)).
 */
RUNNER_TEST(ace_client_test_11_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    RUNNER_ASSERT(ACE_OK == ace_client_initialize(ace_popup_handler_func));

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_SESSION,
            AceTestOptionalCachedPromptDecision::DENY_FOR_SESSION,
            "another-session",
            AceTestPolicyResult::DENY,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_SESSION,
            AceTestOptionalCachedPromptDecision::ALLOW_FOR_SESSION,
            "another-session",
            AceTestPolicyResult::PERMIT,
            false);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}


/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when here are cached values for policy
 * results (PROMPT_ONCE) and there is no cache (there should not be any).
 * Ace client needs to return true/false based entirely on prompt result
 * (first false, then true).
 */
RUNNER_TEST(ace_client_test_12_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    RUNNER_ASSERT(ACE_OK == ace_client_initialize(ace_popup_handler_func));

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_ONESHOT,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::PERMIT,
            false);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_ONESHOT,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::DENY,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when here are not cached values for policy
 * results, but security daemon responds with  PROMPT_ONCE policy result.
 * There is alsi no prompt cache (there should not be any).
 * Ace client needs to return true/false based entirely on prompt result
 * (first false, then true).
 */
RUNNER_TEST(ace_client_test_13_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::PROMPT_ONESHOT,
            false);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::PROMPT_ONESHOT,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when there is no policy cache and security
 * daemon responds win undetermined/not applicable results - those should be
 * treated as false (deny access).
 */
RUNNER_TEST(ace_client_test_14_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::UNDETERMINED,
            true);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::NOT_APPLICABLE,
            true);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when there is policy cache for
 * PROMPT_BLANKET and no prompt cache present. Ace client should deny access
 * because prompt is returning false.
 */
RUNNER_TEST(ace_client_test_15_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_BLANKET,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::UNDETERMINED,
            false);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: tests how class behaves when there is not policy cache and
 * no prompt cache present. Ace client should allow access
 * because security daemon returns PROMPT_BLANKET, and prompt is returning true.
 */
RUNNER_TEST(ace_client_test_16_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::PROMPT_BLANKET,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::checkFunctionCall()
 * purpose: Mixed tests for:
 * 1) cached prompt and policy result (DENY_FOR_SESSION) with matching
 * session id (should disallow access)
 * 2) cached undetermined policy result (should disallow access)
 * 3) cached not applicable policy result (should disallow access)
 */
RUNNER_TEST(ace_client_test_17_check_access)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_SESSION,
            AceTestOptionalCachedPromptDecision::DENY_FOR_SESSION,
            "this-session",
            AceTestPolicyResult::PERMIT,
            true);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::UNDETERMINED,
            AceTestOptionalCachedPromptDecision::ALLOW_FOR_SESSION,
            "another-session",
            AceTestPolicyResult::PERMIT,
            true);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));

    configureTest(
            AceTestOptionalCachedPolicyResult::NOT_APPLICABLE,
            AceTestOptionalCachedPromptDecision::ALLOW_FOR_SESSION,
            "another-session",
            AceTestPolicyResult::PERMIT,
            true);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: AceClient::AceThinClient::getWidgetResourcePreference(),
 * AceClient::AceThinClient::getGlobalResourcesPreferences()
 * purpose: Tests mapping between AceDB::PreferenceTypes and
 * AceClient::AcePreference.
 */
RUNNER_TEST(ace_client_test_18_resource_preferences)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceWidgetHandle handle = 0;
    AceClient::AceResource resource = "resource";
    AceClient::AceResource resource2 = "resource2";

    AceDB::AceDAOReadOnly::setWidgetDevCapSetting(
            AceDB::PreferenceTypes::PREFERENCE_BLANKET_PROMPT);
    RUNNER_ASSERT(client.getWidgetResourcePreference(resource,handle) ==
            AceClient::AcePreference::PREFERENCE_BLANKET_PROMPT);
    AceDB::AceDAOReadOnly::setWidgetDevCapSetting(
            AceDB::PreferenceTypes::PREFERENCE_DEFAULT);
    RUNNER_ASSERT(client.getWidgetResourcePreference(resource,handle) ==
            AceClient::AcePreference::PREFERENCE_DEFAULT);
    AceDB::AceDAOReadOnly::setWidgetDevCapSetting(
            AceDB::PreferenceTypes::PREFERENCE_DENY);
        RUNNER_ASSERT(client.getWidgetResourcePreference(resource,handle) ==
            AceClient::AcePreference::PREFERENCE_DENY);
    AceDB::AceDAOReadOnly::setWidgetDevCapSetting(
            AceDB::PreferenceTypes::PREFERENCE_ONE_SHOT_PROMPT);
    RUNNER_ASSERT(client.getWidgetResourcePreference(resource,handle) ==
            AceClient::AcePreference::PREFERENCE_ONE_SHOT_PROMPT);
    AceDB::AceDAOReadOnly::setWidgetDevCapSetting(
            AceDB::PreferenceTypes::PREFERENCE_PERMIT);
    RUNNER_ASSERT(client.getWidgetResourcePreference(resource,handle) ==
            AceClient::AcePreference::PREFERENCE_PERMIT);
    AceDB::AceDAOReadOnly::setWidgetDevCapSetting(
            AceDB::PreferenceTypes::PREFERENCE_SESSION_PROMPT);
    RUNNER_ASSERT(client.getWidgetResourcePreference(resource,handle) ==
            AceClient::AcePreference::PREFERENCE_SESSION_PROMPT);

    AceDB::PreferenceTypesMap map;

    AceDB::AceDAOReadOnly::setDevCapSettings(map);
    std::unique_ptr<AceClient::AceResourcesPreferences> ret(client.getGlobalResourcesPreferences());

    RUNNER_ASSERT(ret->empty());

    map.insert(make_pair(resource, AceDB::PreferenceTypes::PREFERENCE_PERMIT));
    map.insert(make_pair(resource2, AceDB::PreferenceTypes::PREFERENCE_DENY));

    AceDB::AceDAOReadOnly::setDevCapSettings(map);
    ret.reset(client.getGlobalResourcesPreferences());
    RUNNER_ASSERT(2 == ret->size());
    AceClient::AceResourcesPreferences::iterator it;
    it = ret->find(resource);
    RUNNER_ASSERT((it->second) == AceClient::AcePreference::PREFERENCE_PERMIT);
    it = ret->find(resource2);
    RUNNER_ASSERT((it->second) == AceClient::AcePreference::PREFERENCE_DENY);

}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_client_initialize(),
 * ace_check_access(), ace_client_shutdown()
 * purpose: New C-API tests. Two ACE checks for prompt one shot. One should
 * deny access as prompt is returning ACE_FALSE, second should pass because
 * of ACE_TRUE returned from prompt function. Also, Ace check library should
 * properly initialize and deinitialize itself.
 */
RUNNER_TEST(ace_client_test_19_check_access)
{

    RUNNER_ASSERT(ACE_OK == ace_client_initialize(ace_popup_handler_func));

    ace_request_t aceRequest;

    fillCAPIRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_ONESHOT,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::PERMIT,
            false);

    ACE_CHECK(aceRequest, ACE_FALSE);

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_ONESHOT,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::DENY,
            true);

    ACE_CHECK(aceRequest, ACE_TRUE);

    RUNNER_ASSERT(ACE_OK == ace_client_shutdown());
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_client_initialize(),
 * ace_check_access(), ace_client_shutdown()
 * purpose: New C-API tests. Two ACE checks for prompt one shot with policy
 * result directly from daemon (no cache). One should
 * deny access as prompt is returning ACE_FALSE, second should pass because
 * of ACE_TRUE returned from prompt function. Also, Ace check library should
 * properly initialize and deinitialize itself.
 */
RUNNER_TEST(ace_client_test_20_check_access)
{
    RUNNER_ASSERT(ACE_OK == ace_client_initialize(ace_popup_handler_func));

    ace_request_t aceRequest;

    fillCAPIRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::PROMPT_ONESHOT,
            false);

    ACE_CHECK(aceRequest, ACE_FALSE);

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "another-session",
            AceTestPolicyResult::PROMPT_ONESHOT,
            true);\

    ACE_CHECK(aceRequest, ACE_TRUE);

    RUNNER_ASSERT(ACE_OK == ace_client_shutdown());
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_client_initialize(),
 * ace_check_access(), ace_client_shutdown()
 * purpose: New C-API tests. Two ACE checks for prompt blanket with policy
 * result taken from cache. There is no prompt cache. One should
 * deny access as prompt is returning ACE_FALSE, second should pass because
 * of ACE_TRUE returned from prompt function. Also, Ace check library should
 * properly initialize and deinitialize itself.
 */
RUNNER_TEST(ace_client_test_21_check_access)
{
    RUNNER_ASSERT(ACE_OK == ace_client_initialize(ace_popup_handler_func));

    ace_request_t aceRequest;

    fillCAPIRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_BLANKET,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::DENY,
            false);
    ACE_CHECK(aceRequest, ACE_FALSE);

    configureTest(
            AceTestOptionalCachedPolicyResult::PROMPT_BLANKET,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::DENY,
            true);
    ACE_CHECK(aceRequest, ACE_TRUE);

    RUNNER_ASSERT(ACE_OK == ace_client_shutdown());
}

/*
 * test author: Bartlomiej Grzelewski (b.grzelewski@samsung.com)
 * tested functions: checkFunctionCall(), checkFeatureList()
 * purpose: We need to check list of api-feature connected with function.
 * If non of the api-feature was requested by widget we should deny access.
 * This call should success as both of the api-feature were reqested
 * by widget.
 */
RUNNER_TEST(ace_client_test_22_checkFeatureList)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::PERMIT,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));
}

/*
 * test author: Bartlomiej Grzelewski (b.grzelewski@samsung.com)
 * tested functions: checkFunctionCall(), checkFeatureList()
 * purpose: We need to check list of api-feature connected with function.
 * If non of the api-feature was requested by widget we should deny access.
 * This call should success as one of the api-feature required by function
 * was reqested by widget.
 */
RUNNER_TEST(ace_client_test_23_checkFeatureList)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    const char* apiFeature[] = {"fake-feature-3", featureName2};

    aceRequest.apiFeatures.apiFeature = apiFeature;

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::PERMIT,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));
}

/*
 * test author: Bartlomiej Grzelewski (b.grzelewski@samsung.com)
 * tested functions: checkFunctionCall(), checkFeatureList()
 * purpose: We need to check list of api-feature connected with function.
 * If non of the api-feature was requested by widget we should deny access.
 * This call should success as one of the api-feature required by function
 * was reqested by widget.
 */
RUNNER_TEST(ace_client_test_24_checkFeatureList)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    const char* apiFeature[] = {featureName1, "fake-feature-3"};

    aceRequest.apiFeatures.apiFeature = apiFeature;

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::PERMIT,
            true);
    RUNNER_ASSERT(client.checkFunctionCall(aceRequest));

}

/*
 * test author: Bartlomiej Grzelewski (b.grzelewski@samsung.com)
 * tested functions: checkFunctionCall(), checkFeatureList()
 * purpose: We need to check list of api-feature connected with function.
 * If non of the api-feature was requested by widget we should deny access.
 * This call should fail as non of the api-feature required by function
 * was reqested by widget.
 */
RUNNER_TEST(ace_client_test_25_checkFeatureList)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    const char* apiFeature[] = {"fake-feature-3", "fake-feature-4"};

    aceRequest.apiFeatures.apiFeature = apiFeature;

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::PERMIT,
            true);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}

/*
 * test author: Bartlomiej Grzelewski (b.grzelewski@samsung.com)
 * tested functions: checkFunctionCall(), checkFeatureList()
 * purpose: We need to check list of api-feature connected with function.
 * If non of the api-feature was requested by widget we should deny access.
 * This call should fail as api-feature required by function
 * wasn't reqested by widget.
 */
RUNNER_TEST(ace_client_test_26_checkFeatureList)
{
    AceClient::AceThinClient &client =
            AceClient::AceThinClientSingleton::Instance();
    AceClient::AceRequest aceRequest;

    fillRequest(aceRequest, "this-session");

    const char* apiFeature[] = {"fake-feature-3"};

    aceRequest.apiFeatures.count = 1;
    aceRequest.apiFeatures.apiFeature = apiFeature;

    configureTest(
            AceTestOptionalCachedPolicyResult::NULL_VALUE,
            AceTestOptionalCachedPromptDecision::NULL_VALUE,
            "this-session",
            AceTestPolicyResult::PERMIT,
            true);
    RUNNER_ASSERT(!client.checkFunctionCall(aceRequest));
}

