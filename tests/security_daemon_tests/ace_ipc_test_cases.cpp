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

#include <dpl/assert.h>
#include <dpl/test/test_runner.h>
#include <ace/PolicyResult.h>
#include <ace-dao-ro/PromptModel.h>
#include <ace-dao-ro/PromptModel.h>
#include "SecurityCommunicationClient.h"
#include <widget_installer.h>

#include <vector>
#include <string>
#include <memory>

using namespace DPL;

namespace {

const std::string ACE_INTERFACE_NAME =
    "org.tizen.AceCheckAccessInterface";
const std::string ACE_CHECK_ACCESS_METHOD = "check_access";

const std::string POPUP_INTERFACE_NAME =
    "org.tizen.PopupResponse";
const std::string  VALIDATION_METHOD = "validate";

}

class AceClientStub
{
  public:

    PolicyResult callCheckAccess(int handle,
                                 const std::string& subjectId,
                                 const std::string& resourceId,
                                 const std::vector<std::string> keys,
                                 const std::vector<std::string> values)
    {
        Assert(!!m_aceCommunicationClient);
        int serialized = 0;
        std::string sessionId = "fakeSession";
        m_aceCommunicationClient->call(ACE_CHECK_ACCESS_METHOD,
                              handle,
                              subjectId,
                              resourceId,
                              keys,
                              values,
                              sessionId,
                              &serialized);
        PolicyResult policyResult = PolicyResult::deserialize(serialized);
        return policyResult;
    }

    bool callPopupAnswer(bool allowed,
                         int serializedValidity,
                         int handle,
                         const std::string& subjectId,
                         const std::string& resourceId,
                         const std::vector<std::string> keys,
                         const std::vector<std::string> values,
                         const std::string& session)
    {
        Assert(!!m_popupCommunicationClient);
        bool status = false;
        m_popupCommunicationClient->call(VALIDATION_METHOD,
                                allowed,
                                serializedValidity,
                                handle,
                                subjectId,
                                resourceId,
                                keys,
                                values,
                                session,
                                &status);
        return status;
    }

    static AceClientStub& getInstance();

  private:
    AceClientStub() :
        m_aceCommunicationClient(new WrtSecurity::Communication::Client(ACE_INTERFACE_NAME)),
        m_popupCommunicationClient(new WrtSecurity::Communication::Client(POPUP_INTERFACE_NAME))
    {
    }

    ~AceClientStub() { }

    std::unique_ptr<WrtSecurity::Communication::Client> m_aceCommunicationClient;
    std::unique_ptr<WrtSecurity::Communication::Client> m_popupCommunicationClient;
};

AceClientStub& AceClientStub::getInstance()
{
    static AceClientStub instance;
    return instance;
}

RUNNER_TEST_GROUP_INIT(ace)

/* 
 * author:      ---
 * test:        Policy evaluation by security server.
 * description: Prepared policy is passed to ACE and evaluation result is checked.
 * expect:      Evaluation effect match assumptions, result should be PolicyEffect::PROMPT_ONESHOT.
 */
RUNNER_TEST(policy1)
{
    std::vector<std::string> names;
    std::vector<std::string> values;
    std::string subjectId = "resource_id_prompt_oneshot";
    std::string resourceId = subjectId;
    WidgetHandle widgetHandle = InstallerMockup::registerWidget();
    auto policy = AceClientStub::getInstance().callCheckAccess(
        widgetHandle,
        subjectId,
        resourceId,
        names,
        values);
    RUNNER_ASSERT(!!policy.getEffect());
    RUNNER_ASSERT(*policy.getEffect() == PolicyEffect::PROMPT_ONESHOT);
}

/* 
 * author:      ---
 * test:        Policy evaluation by security server.
 * description: Prepared policy is passed to ACE and evaluation result is checked.
 * expect:      Evaluation effect match assumptions, result should be PolicyEffect::PROMPT_BLANKET.
 */
RUNNER_TEST(policy2)
{
    std::vector<std::string> names;
    std::vector<std::string> values;
    std::string subjectId = "resource_id_prompt_blanket";
    std::string resourceId = subjectId;
    WidgetHandle widgetHandle = InstallerMockup::registerWidget();
    auto policy = AceClientStub::getInstance().callCheckAccess(widgetHandle,
                                                               subjectId,
                                                               resourceId,
                                                               names,
                                                               values);
    RUNNER_ASSERT(!!policy.getEffect());
    RUNNER_ASSERT(*policy.getEffect() == PolicyEffect::PROMPT_BLANKET);
}

/* 
 * author:      ---
 * test:        Policy evaluation by security server.
 * description: Prepared policy is passed to ACE and evaluation result is checked.
 * expect:      Evaluation effect match assumptions, result should be PolicyEffect::PROMPT_SESSION.
 */
RUNNER_TEST(policy3)
{
    std::vector<std::string> names;
    std::vector<std::string> values;
    std::string subjectId = "resource_id_prompt_session";
    std::string resourceId = subjectId;
    WidgetHandle widgetHandle = InstallerMockup::registerWidget();
    auto policy = AceClientStub::getInstance().callCheckAccess(widgetHandle,
                                                               subjectId,
                                                               resourceId,
                                                               names,
                                                               values);
    RUNNER_ASSERT(!!policy.getEffect());
    RUNNER_ASSERT(*policy.getEffect() == PolicyEffect::PROMPT_SESSION);
}

/* 
 * author:      ---
 * test:        Policy evaluation by security server.
 * description: Prepared policy is passed to ACE and evaluation result is checked.
 * expect:      Evaluation effect match assumptions, result should be PolicyEffect::PERMIT.
 */
RUNNER_TEST(policy4)
{
    std::vector<std::string> names;
    std::vector<std::string> values;
    std::string subjectId = "resource_id_permit";
    std::string resourceId = subjectId;
    WidgetHandle widgetHandle = InstallerMockup::registerWidget();
    auto policy = AceClientStub::getInstance().callCheckAccess(widgetHandle,
                                                               subjectId,
                                                               resourceId,
                                                               names,
                                                               values);
    RUNNER_ASSERT(!!policy.getEffect());
    RUNNER_ASSERT(*policy.getEffect() == PolicyEffect::PERMIT);
}

/* 
 * author:      ---
 * test:        Policy evaluation by security server.
 * description: Prepared policy is passed to ACE and evaluation result is checked.
 * expect:      Evaluation effect match assumptions, result should be PolicyEffect::DENY.
 */
RUNNER_TEST(policy5)
{
    std::vector<std::string> names;
    std::vector<std::string> values;
    std::string subjectId = "resource_id_deny";
    std::string resourceId = subjectId;
    WidgetHandle widgetHandle = InstallerMockup::registerWidget();
    auto policy = AceClientStub::getInstance().callCheckAccess(widgetHandle,
                                                               subjectId,
                                                               resourceId,
                                                               names,
                                                               values);
    RUNNER_ASSERT(!!policy.getEffect());
    RUNNER_ASSERT(*policy.getEffect() == PolicyEffect::DENY);
}

/* 
 * author:      ---
 * test:        Policy evaluation by security server.
 * description: Prepared policy is passed to ACE and evaluation result is checked.
 *              Next popup asking about accesses is passed to user.
 * expect:      Evaluation effect match assumptions, result should be PolicyEffect::PROMPT_ONESHOT.
 *              Popup contains correct evaluation results.
 */
RUNNER_TEST(popup_test_after_policy1)
{
    std::vector<std::string> names;
    std::vector<std::string> values;
    std::string resourceId = "resource_id_prompt_oneshot";
    std::string subjectId = resourceId;
    WidgetHandle widgetHandle = InstallerMockup::registerWidget();
    auto policy = AceClientStub::getInstance().callCheckAccess(widgetHandle,
                                                               subjectId,
                                                               resourceId,
                                                               names,
                                                               values);
    RUNNER_ASSERT(!!policy.getEffect());
    RUNNER_ASSERT(*policy.getEffect() == PolicyEffect::PROMPT_ONESHOT);

    int validity = static_cast<int>(Prompt::Validity::ONCE);
    auto status = AceClientStub::getInstance().callPopupAnswer(true,
                                                               validity,
                                                               widgetHandle,
                                                               subjectId,
                                                               resourceId,
                                                               names,
                                                               values,
                                                               "");
    RUNNER_ASSERT(status);
    LogDebug("1: " << status);
    status = AceClientStub::getInstance().callPopupAnswer(false,
                                                          validity,
                                                          widgetHandle,
                                                          subjectId,
                                                          resourceId,
                                                          names,
                                                          values,
                                                          "");
    RUNNER_ASSERT(!status);
    status = AceClientStub::getInstance().callPopupAnswer(true,
                                                          validity,
                                                          widgetHandle,
                                                          subjectId,
                                                          resourceId,
                                                          names,
                                                          values,
                                                          "");
    RUNNER_ASSERT(status);
}

/* 
 * author:      ---
 * test:        Policy evaluation by security server.
 * description: Prepared policy is passed to ACE and evaluation result is checked.
 *              Next popup asking about accesses is passed to user.
 * expect:      Evaluation effect match assumptions, result should be PolicyEffect::PROMPT_BLANKET.
 *              Popup contains correct evaluation results.
 */
RUNNER_TEST(popup_test_after_policy2)
{
    std::vector<std::string> names;
    std::vector<std::string> values;
    std::string resourceId = "resource_id_prompt_blanket";
    std::string subjectId = resourceId;
    WidgetHandle widgetHandle = InstallerMockup::registerWidget();
    auto policy = AceClientStub::getInstance().callCheckAccess(widgetHandle,
                                                               subjectId,
                                                               resourceId,
                                                               names,
                                                               values);
    RUNNER_ASSERT(!!policy.getEffect());
    RUNNER_ASSERT(*policy.getEffect() == PolicyEffect::PROMPT_BLANKET);

    int validity = static_cast<int>(Prompt::Validity::ALWAYS);
    auto status = AceClientStub::getInstance().callPopupAnswer(true,
                                                               validity,
                                                               widgetHandle,
                                                               subjectId,
                                                               resourceId,
                                                               names,
                                                               values,
                                                               "");
    RUNNER_ASSERT(status);
    LogDebug("1: " << status);
    status = AceClientStub::getInstance().callPopupAnswer(false,
                                                          validity,
                                                          widgetHandle,
                                                          subjectId,
                                                          resourceId,
                                                          names,
                                                          values,
                                                          "");
    RUNNER_ASSERT(!status);
    status = AceClientStub::getInstance().callPopupAnswer(true,
                                                          validity,
                                                          widgetHandle,
                                                          subjectId,
                                                          resourceId,
                                                          names,
                                                          values,
                                                          "");
    RUNNER_ASSERT(status);
}

/* 
 * author:      ---
 * test:        Policy evaluation by security server.
 * description: Prepared policy is passed to ACE and evaluation result is checked.
 *              Next popup asking about accesses is passed to user.
 * expect:      Evaluation effect match assumptions, result should be Prompt::Validity::SESSION.
 *              Popup contains correct evaluation results.
 */
RUNNER_TEST(popup_test_after_policy3)
{
    std::vector<std::string> names;
    std::vector<std::string> values;
    std::string resourceId = "resource_id_prompt_session";
    std::string subjectId = resourceId;
    WidgetHandle widgetHandle = InstallerMockup::registerWidget();
    auto policy = AceClientStub::getInstance().callCheckAccess(widgetHandle,
                                                               subjectId,
                                                               resourceId,
                                                               names,
                                                               values);
    RUNNER_ASSERT(!!policy.getEffect());
    RUNNER_ASSERT(*policy.getEffect() == PolicyEffect::PROMPT_SESSION);

    int validity = static_cast<int>(Prompt::Validity::SESSION);
    auto status = AceClientStub::getInstance().callPopupAnswer(true,
                                                               validity,
                                                               widgetHandle,
                                                               subjectId,
                                                               resourceId,
                                                               names,
                                                               values,
                                                               "some_session");
    RUNNER_ASSERT(status);
    status = AceClientStub::getInstance().callPopupAnswer(false,
                                                          validity,
                                                          widgetHandle,
                                                          subjectId,
                                                          resourceId,
                                                          names,
                                                          values,
                                                          "some_session");
    RUNNER_ASSERT(!status);
    status = AceClientStub::getInstance().callPopupAnswer(true,
                                                          validity,
                                                          widgetHandle,
                                                          subjectId,
                                                          resourceId,
                                                          names,
                                                          values,
                                                          "some_session");
    RUNNER_ASSERT(status);
}

