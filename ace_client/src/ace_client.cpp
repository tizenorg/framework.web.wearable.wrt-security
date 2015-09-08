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
 * @file        ace_client.cpp
 * @author      Tomasz Swierczek (t.swierczek@samsung.com)
 * @version     1.0
 * @brief       This file contains implementation of AceThinClient class
 */

#include <memory>
#include <set>
#include <map>

#include <dpl/string.h>
#include <dpl/optional_typedefs.h>
#include <boost/optional.hpp>
#include <dpl/log/log.h>
#include <dpl/singleton_safe_impl.h>
#include <ace-dao-ro/PromptModel.h>

#include <ace_popup_handler.h>

#include "ace_server_api.h"
#include "popup_response_server_api.h"
#include "ace-client/ace_client.h"
#include "ace-client/ace_client_helper.h"
#include <attribute_facade.h>
#include <ace/Request.h>

#include <app_manager.h>
#include <package_manager.h>
#include <privacy_checker_client.h>
#include <unistd.h>
#include <dpl/wrt-dao-ro/widget_dao_read_only.h>
// ACE tests need to use mock implementations
#ifdef ACE_CLIENT_TESTS

#include "AceDAOReadOnly_mock.h"
#include "communication_client_mock.h"
#include "PolicyInformationPoint_mock.h"

#else

#include <ace-dao-ro/AceDAOReadOnly.h>
#include "SecurityCommunicationClient.h"
#include <ace/PolicyInformationPoint.h>

#endif // ACE_CLIENT_TESTS

IMPLEMENT_SAFE_SINGLETON(AceClient::AceThinClient)

ace_popup_handler_func_t popup_func = NULL;

namespace AceClient {

namespace {
// These devcaps actually are not requested in config file, so should be treaded
// as if were requested (access tags/WARP will block request if desired)
const std::string DEVCAP_EXTERNAL_NETWORK_ACCESS = "externalNetworkAccess";
const std::string DEVCAP_XML_HTTP_REQUEST = "XMLHttpRequest";
} // anonymous


std::string AceFunctionParam::aceFunctionParamToken = "param:function";

// popup cache result

enum class AceCachedPromptResult {
    PERMIT,
    DENY,
    ASK_POPUP
};

// AceThinClient implementation singleton
class AceThinClientImpl {
  public:
    bool checkFunctionCall(const AceRequest& ace_request);
    AcePreference getWidgetResourcePreference(
            const AceResource& resource,
            const AceWidgetHandle& handle) const;
    bool checkPrivacy(const AceRequest& ace_request);
    AceResourcesPreferences* getGlobalResourcesPreferences() const;
    bool isInitialized() const;

    AceThinClientImpl();
    ~AceThinClientImpl();

  protected:
    bool containsNetworkDevCap(const AceRequest &ace_request);
    bool checkFeatureList(const AceRequest& ace_request);
    
  private:
    WebRuntimeImpl* m_wrt;
    ResourceInformationImpl* m_res;
    OperationSystemImpl* m_sys;
    WrtSecurity::Communication::Client *m_communicationClient, *m_popupValidationClient;

    AceSubject getSubjectForHandle(AceWidgetHandle handle) const;
    AceCachedPromptResult getCachedPromptResult(
            WidgetHandle widgetHandle,
            int ruleId,
            const AceSessionId& sessionId) const;
    bool askUser(PolicyEffect popupType,
                const AceRequest& ace_request,
                const AceBasicRequest& request);
    // Prompt validation
    bool validatePopupResponse(
                const AceRequest& ace_request,
                const AceBasicRequest& request,
                bool answer = true,
                Prompt::Validity validity = Prompt::Validity::ALWAYS);
    mutable PolicyInformationPoint m_pip;
    boost::optional<std::set<DPL::String>> m_grantedDevCaps;
    std::set<std::string> m_acceptedFeatures;
};

AceThinClientImpl::AceThinClientImpl()
  : m_wrt(new WebRuntimeImpl()),
    m_res(new ResourceInformationImpl()),
    m_sys(new OperationSystemImpl()),
    m_communicationClient(NULL),
    m_popupValidationClient(NULL),
    m_pip(m_wrt, m_res, m_sys)
{
    AceDB::AceDAOReadOnly::attachToThreadRO();
    Try {
        m_communicationClient = new WrtSecurity::Communication::Client(WrtSecurity::AceServerApi::INTERFACE_NAME());
        m_popupValidationClient = new WrtSecurity::Communication::Client(WrtSecurity::PopupServerApi::INTERFACE_NAME());
    } Catch (WrtSecurity::Communication::Client::Exception::SecurityCommunicationClientException) {
        if(m_communicationClient) delete m_communicationClient;
        if(m_popupValidationClient) delete m_popupValidationClient;
        delete m_wrt;
        delete m_res;
        delete m_sys;
        ReThrowMsg(AceThinClient::Exception::AceThinClientException,
                "Failed to call security daemon");
    }
}

AceThinClientImpl::~AceThinClientImpl()
{
    Assert(NULL != m_communicationClient);
    Assert(NULL != m_popupValidationClient);
    delete m_communicationClient;
    delete m_popupValidationClient;
    delete m_wrt;
    delete m_res;
    delete m_sys;
    m_communicationClient = NULL;
    m_popupValidationClient = NULL;
    AceDB::AceDAOReadOnly::detachFromThread();

}

bool AceThinClientImpl::isInitialized() const
{
    return NULL != m_communicationClient && NULL != m_popupValidationClient;
}

bool AceThinClientImpl::containsNetworkDevCap(const AceRequest &ace_request)
{
    AceDeviceCap deviceCap = ace_request.deviceCapabilities;
    for (size_t j=0; j<deviceCap.devcapsCount; ++j) {
        if (!deviceCap.devCapNames[j]) {
            continue;
        }
        if (DEVCAP_XML_HTTP_REQUEST == deviceCap.devCapNames[j]
            || DEVCAP_EXTERNAL_NETWORK_ACCESS == deviceCap.devCapNames[j])
        {
            return true;
        }
    }
    return false;
}

bool AceThinClientImpl::checkFeatureList(const AceRequest& ace_request)
{
    for (size_t i=0; i<ace_request.apiFeatures.count; ++i) {
        Assert(ace_request.apiFeatures.apiFeature[i]);
        std::string featureName(ace_request.apiFeatures.apiFeature[i]);
        LogInfo("Api feature: " << featureName);
        if (0 != m_acceptedFeatures.count(featureName)) {
            return true;
        }
        LogInfo("Api-feature was not requested in widget config: " <<
          featureName);
    }
    return false;
}

bool AceThinClientImpl::checkPrivacy(const AceRequest& ace_request)
{
    int res;

    WrtDB::WidgetDAOReadOnly dao(ace_request.widgetHandle);
    std::string tzPkgId = DPL::ToUTF8String(dao.getTizenPkgId());

    LogInfo("Checking pkg_id : " << tzPkgId.c_str());

    for (size_t i = 0; i < ace_request.apiFeatures.count; ++i) {
        res = privacy_checker_check_package_by_privilege(tzPkgId.c_str(), ace_request.apiFeatures.apiFeature[i]);
        LogInfo(" privilege : " << ace_request.apiFeatures.apiFeature[i] << " : " << ((res == PRIV_MGR_ERROR_SUCCESS) ? "true" : "false"));
        if (res != PRIV_MGR_ERROR_SUCCESS)
            return false;
    }

    return true;
}

bool AceThinClientImpl::checkFunctionCall(const AceRequest& ace_request)
{
    LogInfo("Enter");

    // fill the m_grantedDevCaps, if not yet initialized
    // TODO: This is not so pretty. AceThinClient is not explicitly
    // tied to a widget handle, yet we assume it is always used
    // with the same handle. This will be amended in a future
    // refactoring (already planned).
    if (!m_grantedDevCaps) {
        m_grantedDevCaps = std::set<DPL::String>();
        m_acceptedFeatures.clear();

        AceDB::FeatureNameVector fvector;
        Try {
            AceDB::AceDAOReadOnly::getAcceptedFeature(ace_request.widgetHandle, &fvector);
        } Catch (AceDB::AceDAOReadOnly::Exception::DatabaseError) {
            LogError("Failed to read DB");
            return false;
        }
        for(size_t i=0; i<fvector.size(); ++i) {
            m_acceptedFeatures.insert(DPL::ToUTF8String(fvector[i]));
         }
    }

    AceSubject subject = getSubjectForHandle(ace_request.widgetHandle);

    // Create function params
    const AceDeviceCap& devcaps = ace_request.deviceCapabilities;

    LogInfo("Checking against config requested api-features.");

    // Network device caps are not connected with api-features.
    // We must pass empty api-feature when network dev cap is set.
    if (!containsNetworkDevCap(ace_request) && !checkFeatureList(ace_request)) {
        return false;
    }

    AceFunctionParams functionParams(devcaps.devcapsCount);
    for (size_t i = 0; i < devcaps.devcapsCount; ++i) {
        AceFunctionParam functionParam;
        functionParam.addAttribute(AceFunctionParam::aceFunctionParamToken,
                                   NULL == ace_request.functionName ?
                                   "" : ace_request.functionName);
        if (devcaps.paramsCount) {
            Assert(devcaps.params);
            for (size_t j = 0; j < devcaps.params[i].count; ++j) {
                Assert(devcaps.params[i].param &&
                       devcaps.params[i].param[j].name &&
                       devcaps.params[i].param[j].value);
                functionParam.addAttribute(
                    std::string(devcaps.params[i].param[j].name),
                    std::string(devcaps.params[i].param[j].value));
            }
        }
        functionParams.push_back(functionParam);
    }

    // Convert AceRequest to array of AceBasicRequests
    AceBasicRequests requests;

    for (size_t i = 0; i < devcaps.devcapsCount; ++i) {
        // Adding dev cap name here as resource id
        Assert(devcaps.devCapNames[i]);
        LogInfo("Device cap: " << devcaps.devCapNames[i]);
        AceBasicRequest request(subject,
                                devcaps.devCapNames[i],
                                functionParams[i]);
        requests.push_back(request);
    }

    // true means access granted, false - denied
    bool result = true;

    FOREACH(it, requests){
        // Getting attributes from ACE DAO
        AceBasicRequest& request = *it;
        AceDB::BaseAttributeSet attributeSet;
        AceDB::AceDAOReadOnly::getAttributes(&attributeSet);

        // If true, we need to make popup IPC and ask user for decision
        bool askPopup = false;
        // If true, we need to make IPC to security daemon for policy
        // decision on granting access
        bool askServer = false;
        // If askPopup == true, this is the kind of popup to  be opened
        PolicyEffect popupType = PolicyEffect::PROMPT_ONESHOT;

        if (attributeSet.empty()) {
            // Treat this case as missed cache - ask security daemon
            LogInfo("Empty attribute set");
            askServer = true;
        } else {
            // Filling attributes with proper values
            FunctionParamImpl params;
            AceParamKeys keys = request.getFunctionParam().getKeys();
            AceParamValues values = request.getFunctionParam().getValues();
            for (size_t i = 0; i < keys.size(); ++i) {
                params.addAttribute(keys[i], values[i]);
            }
            Request req(ace_request.widgetHandle,
                        WidgetExecutionPhase_Invoke,
                        &params);
            req.addDeviceCapability(request.getResourceId());

            m_pip.getAttributesValues(&req, &attributeSet);

            // Getting cached policy result
            OptionalExtendedPolicyResult exPolicyResult =
                    AceDB::AceDAOReadOnly::getPolicyResult(attributeSet);

            if (!exPolicyResult) {
                // Missed cache - ask security daemon
                LogInfo("Missed policy result cache");
                askServer = true;
            } else {
                // Cached value found - now interpret it
                LogInfo("Result in cache");
                OptionalPolicyEffect effect = exPolicyResult->policyResult.getEffect();
                if (!effect) {
                    // PolicyDecision is UNDETERMINED or NOT_APPLICABLE
                    result = false;
                    break;
                } else if (*effect == PolicyEffect::DENY) {
                    // Access denied
                    result = false;
                    break;
                } else if (*effect == PolicyEffect::PERMIT) {
                    // Access granted
                    if (m_grantedDevCaps->find(
                           DPL::FromASCIIString(request.getResourceId()))
                        != m_grantedDevCaps->end())
                    {
                        continue;
                    } else
                        askServer = true;
                } else {
                    // Check for cached popup response
                    LogInfo("Checking cached popup response");
                    AceCachedPromptResult promptCached =
                     getCachedPromptResult(ace_request.widgetHandle,
                                           exPolicyResult->ruleId,
                                           ace_request.sessionId);
                    if (promptCached == AceCachedPromptResult::PERMIT) {
                        // Granted by previous popup
                        LogDebug("Cache found OK");
                        if (m_grantedDevCaps->find(
                               DPL::FromASCIIString(request.getResourceId()))
                            != m_grantedDevCaps->end())
                        {
                            LogDebug("SMACK given previously");
                            continue;
                        } else {
                            if (*effect != PolicyEffect::PROMPT_BLANKET) {
                                // This should not happen.
                                LogDebug("This should not happen.");
                                result = false;
                                break;
                            }
                            if (!validatePopupResponse(ace_request,
                                                             request)) {
                                LogDebug("Daemon has not validated response.");
                                result = false;
                                break;
                            } else {
                                // Access granted, move on to next request
                                LogDebug("SMACK granted, all OK");
                                m_grantedDevCaps->insert(
                                    DPL::FromASCIIString(
                                            request.getResourceId()));
                                continue;
                            }
                        }
                    }
                    if (promptCached == AceCachedPromptResult::DENY) {
                        // Access denied by earlier popup
                        result = false;
                        break;
                    }
                    if (promptCached == AceCachedPromptResult::ASK_POPUP) {
                        askPopup = true;
                        popupType = *effect;
                    }
                }
            }
        }

        if (askServer) {
            // IPC to security daemon
            // here we must check if we have a SMACK permission for
            // the device cap requested
            LogInfo("Asking security daemon");
            int serializedPolicyResult = 0;
            Try {
                m_communicationClient->call(WrtSecurity::AceServerApi::CHECK_ACCESS_METHOD(),
                                   ace_request.widgetHandle,
                                   request.getSubjectId(),
                                   request.getResourceId(),
                                   request.getFunctionParam().getKeys(),
                                   request.getFunctionParam().getValues(),
                                   ace_request.sessionId,
                                   &serializedPolicyResult);
            } Catch (WrtSecurity::Communication::Client::Exception::SecurityCommunicationClientException) {
                ReThrowMsg(AceThinClient::Exception::AceThinClientException,
                         "Failed to call security daemon");
            }
            PolicyResult policyResult = PolicyResult::
                    deserialize(serializedPolicyResult);
            OptionalPolicyEffect effect = policyResult.getEffect();
            if (!effect) {
                // PolicyDecision is UNDETERMINED or NOT_APPLICABLE
                result = false;
                break;
            }
            if (*effect == PolicyEffect::DENY) {
                // Access denied
                result = false;
                break;
            }
            if (*effect == PolicyEffect::PERMIT) {
                // Access granted, move on to next request
                m_grantedDevCaps->insert(
                    DPL::FromASCIIString(request.getResourceId()));

                continue;
            }
            // Policy says: ask user - setup popup kind
            popupType = *effect;
            askPopup = true;
        }

        if (askPopup) {
            result = askUser(popupType, ace_request, request);
        }
    }

    LogInfo("Result: " << (result ? "GRANTED" : "DENIED"));
    return result;
}

bool AceThinClientImpl::askUser(PolicyEffect popupType,
                                const AceRequest& ace_request,
                                const AceBasicRequest& request)
{
    LogInfo("Asking popup");
    Assert(NULL != popup_func);

    const AceFunctionParam& fParam = request.getFunctionParam();
    AceParamKeys keys = fParam.getKeys();
    AceParamValues values = fParam.getValues();

    ace_popup_t ace_popup_type;
    ace_resource_t resource = const_cast<ace_session_id_t>(
            request.getResourceId().c_str());
    ace_session_id_t session = const_cast<ace_session_id_t>(
            ace_request.sessionId.c_str());;
    ace_param_list_t parameters;
    ace_widget_handle_t handle = ace_request.widgetHandle;

    parameters.count = keys.size();
    parameters.items = new ace_param_t[parameters.count];
    unsigned int i;
    for (i = 0; i < parameters.count; ++i) {
        parameters.items[i].name =
                const_cast<ace_string_t>(keys[i].c_str());
        parameters.items[i].value =
                const_cast<ace_string_t>(values[i].c_str());
    }

    switch (popupType) {
    case PolicyEffect::PROMPT_ONESHOT: {
        ace_popup_type = ACE_ONESHOT;
        break; }
    case PolicyEffect::PROMPT_SESSION: {
        ace_popup_type = ACE_SESSION;
        break; }
    case PolicyEffect::PROMPT_BLANKET: {
        ace_popup_type = ACE_BLANKET;
        break; }
    default: {
        LogError("Unknown popup type passed!");
        LogError("Maybe effect isn't a popup?");
        LogError("Effect number is: " << static_cast<int>(popupType));
        Assert(0); }
    }

    ace_bool_t answer = ACE_FALSE;
    ace_return_t ret = popup_func(ace_popup_type,
                    resource,
                    session,
                    &parameters,
                    handle,
                    &answer);

    delete [] parameters.items;

    if (ACE_OK != ret) {
        LogError("Error in popup handler");
        return false;
    }

    if (ACE_TRUE == answer) {
        m_grantedDevCaps->insert(
            DPL::FromASCIIString(request.getResourceId()));
        return true;
    }

    return false;
}

bool AceThinClientImpl::validatePopupResponse(
        const AceRequest& ace_request,
        const AceBasicRequest& request,
        bool answer,
        Prompt::Validity validity
        )
{
    bool response = false;
    Try{
        m_popupValidationClient->call(
                           WrtSecurity::PopupServerApi::VALIDATION_METHOD(),
                           answer,
                           static_cast<int>(validity),
                           ace_request.widgetHandle,
                           request.getSubjectId(),
                           request.getResourceId(),
                           request.getFunctionParam().getKeys(),
                           request.getFunctionParam().getValues(),
                           ace_request.sessionId,
                           &response);
    } Catch (WrtSecurity::Communication::Client::Exception::SecurityCommunicationClientException) {
        ReThrowMsg(AceThinClient::Exception::AceThinClientException,
                 "Failed to call security daemon");
    }
    return response;
}

AcePreference AceThinClientImpl::getWidgetResourcePreference (
        const AceResource& resource,
        const AceWidgetHandle& handle) const
{
    return toAcePreference(
            AceDB::AceDAOReadOnly::getWidgetDevCapSetting(resource, handle));
}

AceResourcesPreferences* AceThinClientImpl::getGlobalResourcesPreferences()
const
{
    AceDB::PreferenceTypesMap globalSettingsMap;
    AceResourcesPreferences* acePreferences = new AceResourcesPreferences();
    AceDB::AceDAOReadOnly::getDevCapSettings(&globalSettingsMap);
    FOREACH(it, globalSettingsMap) {
        acePreferences->insert(
                AceResurcePreference((*it).first,
                        toAcePreference((*it).second)));
    }
    return acePreferences;
}

AceSubject AceThinClientImpl::getSubjectForHandle(AceWidgetHandle handle) const
{
    try
    {
        return AceDB::AceDAOReadOnly::getGUID(handle);
    }
    catch (AceDB::AceDAOReadOnly::Exception::DatabaseError& /*ex*/)
    {
        LogError("Couldn't find GIUD for handle " << handle);
        return "";
    }
}

AceCachedPromptResult AceThinClientImpl::getCachedPromptResult(
        WidgetHandle widgetHandle,
        int ruleId,
        const AceSessionId& sessionId) const
{
    OptionalCachedPromptDecision promptDecision =
    AceDB::AceDAOReadOnly::getPromptDecision(
            widgetHandle,
            ruleId);
    if (!promptDecision) {
        LogDebug("No cache");
        return AceCachedPromptResult::ASK_POPUP;
    } else {
        // These should not be stored in DB!
        Assert(PromptDecision::ALLOW_THIS_TIME
                != (*promptDecision).decision);
        Assert(PromptDecision::DENY_THIS_TIME
                != (*promptDecision).decision);
        if ((*promptDecision).decision ==
                PromptDecision::ALLOW_ALWAYS) {
            // Access granted via earlier popup
            LogDebug("ALLOW_ALWAYS");
            return AceCachedPromptResult::PERMIT;
        }
        if ((*promptDecision).decision ==
                PromptDecision::DENY_ALWAYS) {
            LogDebug("DENY_ALWAYS");
            // Access denied via earlier popup
            return AceCachedPromptResult::DENY;
        }
        // Only thing left is per session prompts
        if (!(*promptDecision).session) {
            LogDebug("NO SESSION");
            return AceCachedPromptResult::ASK_POPUP;
        }
        AceSessionId cachedSessionId = DPL::ToUTF8String(*((*promptDecision).session));
        if ((*promptDecision).decision ==
                PromptDecision::ALLOW_FOR_SESSION) {
            if (cachedSessionId == sessionId) {
                // Access granted for this session.
                LogDebug("SESSION OK, PERMIT");
                return AceCachedPromptResult::PERMIT;
            } else {
                LogDebug("SESSION NOT OK, ASKING");
                return AceCachedPromptResult::ASK_POPUP;
            }
        }
        if ((*promptDecision).decision ==
                PromptDecision::DENY_FOR_SESSION) {
            if (cachedSessionId == sessionId) {
                // Access denied for this session.
                LogDebug("SESSION OK, DENY");
                return AceCachedPromptResult::DENY;
            } else {
                LogDebug("SESSION NOT OK, ASKING");
                return AceCachedPromptResult::ASK_POPUP;
            }
        }
    }
    LogDebug("NO RESULT, ASKING");
    return AceCachedPromptResult::ASK_POPUP;
}

// AceThinClient

bool AceThinClient::checkFunctionCall(
        const AceRequest& ace_request) const
{
    return m_impl->checkFunctionCall(ace_request);
}

bool AceThinClient::checkPrivacy(
        const AceRequest& ace_request) const
{
    return m_impl->checkPrivacy(ace_request);
}

AcePreference AceThinClient::getWidgetResourcePreference(
        const AceResource& resource,
        const AceWidgetHandle& handle) const
{
    return m_impl->getWidgetResourcePreference(
            resource, handle);
}

AceResourcesPreferences* AceThinClient::getGlobalResourcesPreferences()
const
{
    return m_impl->getGlobalResourcesPreferences();
}

AceThinClient::AceThinClient()
{
    m_impl = new AceThinClientImpl();
}

AceThinClient::~AceThinClient()
{
    Assert(NULL != m_impl);
    delete m_impl;
}

bool AceThinClient::isInitialized() const
{
    return NULL != m_impl && m_impl->isInitialized();
}


} // namespace AceClient
