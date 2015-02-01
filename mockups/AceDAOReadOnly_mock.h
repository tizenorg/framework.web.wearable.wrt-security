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
 * @author     Tomasz Swierczek (t.swierczek@samsung.com)
 * @version    0.1
 * @brief      ACE DAO read only mockup class
 */

#ifndef WRT_MOCKUPS_ACE_DAO_READ_ONLY_MOCK_H_
#define WRT_MOCKUPS_ACE_DAO_READ_ONLY_MOCK_H_

#include <set>
#include <utility>
#include <string>

#include <openssl/md5.h>
#include <dpl/exception.h>
#include <dpl/string.h>

#include <PreferenceTypes.h>
#include <BaseAttribute.h>
#include <BasePermission.h>
#include <IRequest.h>
#include <PolicyEffect.h>
#include <PolicyResult.h>
#include <PromptDecision.h>
#include <dpl/foreach.h>

namespace AceDB {

typedef std::map<DPL::String, bool> RequestedDevCapsMap;
typedef DPL::String FeatureName;
typedef std::vector<FeatureName> FeatureNameVector;

class AceDAOReadOnly
{
  public:
    class Exception
    {
      public:
        DECLARE_EXCEPTION_TYPE(DPL::Exception, Base)
        DECLARE_EXCEPTION_TYPE(Base, DatabaseError)
    };

    AceDAOReadOnly() {}

    static void attachToThreadRO(){};
    static void attachToThreadRW(){};
    static void detachFromThread(){};

    // policy effect/decision
    static OptionalExtendedPolicyResult getPolicyResult(
            const BaseAttributeSet &/*attributes*/)
    {
        return m_policyResult;
    }

    // prompt decision
    static OptionalCachedPromptDecision getPromptDecision(
            WidgetHandle /*widgetHandle*/,
            int /*hash*/)
    {
        return m_promptDecision;
    }

    // resource settings
    static PreferenceTypes getDevCapSetting(const std::string &/*resource*/)
    {
        return m_devCapSetting;
    }
    static void getDevCapSettings(PreferenceTypesMap *preferences)
    {
        *preferences = m_devCapSettings;
    }

    // user settings
    static void getWidgetDevCapSettings(BasePermissionList *permissions)
    {
        *permissions = m_widgetDevCapSettings;
    }

    static PreferenceTypes getWidgetDevCapSetting(
            const std::string &/*resource*/,
            WidgetHandle /*handler*/)
    {
        return m_widgetDevCapSetting;
    }

    static void getAttributes(BaseAttributeSet *attributes)
    {
        *attributes = m_attributeSet;
    }

    static void getRequestedDevCaps(
        int /*widgetHandle*/,
        RequestedDevCapsMap *permissions)
    {
        *permissions = m_devCapPermissions;
    }

    // Setting return values for mockups
    static void setPolicyResult(OptionalExtendedPolicyResult value)
    {
        m_policyResult = value;
    }

    static void setPromptDecision(OptionalCachedPromptDecision value)
    {
        m_promptDecision = value;
    }

    static void setDevCapSetting(PreferenceTypes value)
    {
        m_devCapSetting = value;
    }

    static void setWidgetDevCapSetting(PreferenceTypes value)
    {
        m_widgetDevCapSetting = value;
    }

    static void setWidgetDevCapSettings(BasePermissionList value)
    {
        m_widgetDevCapSettings = value;
    }

    static void setDevCapSettings(PreferenceTypesMap value)
    {
        m_devCapSettings = value;
    }

    static void setAttributeSet(BaseAttributeSet value)
    {
        m_attributeSet = value;
    }

    static void setDevCapPermissions(RequestedDevCapsMap value)
    {
        m_devCapPermissions = value;
    }

    static void getAcceptedFeature(
        WidgetHandle /* widgetHandle */,
        FeatureNameVector *featureVector)
    {
        *featureVector = m_featureName;
    }

    static void setAcceptedFeature(const FeatureNameVector &fvector)
    {
        m_featureName = fvector;
    }

    static std::string getGUID(const WidgetHandle& handle)
    {
        return m_guid;
    }

  protected:
    static OptionalExtendedPolicyResult m_policyResult;
    static OptionalCachedPromptDecision m_promptDecision;
    static PreferenceTypes m_devCapSetting;
    static PreferenceTypes m_widgetDevCapSetting;
    static PreferenceTypesMap m_devCapSettings;
    static BaseAttributeSet m_attributeSet;
    static BasePermissionList m_widgetDevCapSettings;
    static RequestedDevCapsMap m_devCapPermissions;
    static FeatureNameVector m_featureName;
    static std::string m_guid;
};

}

#endif // WRT_MOCKUPS_ACE_DAO_READ_ONLY_MOCK_H_
