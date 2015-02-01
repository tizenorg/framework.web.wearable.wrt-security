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
#include "AceDAOReadOnly_mock.h"

namespace AceDB {
OptionalExtendedPolicyResult AceDAOReadOnly::m_policyResult = ExtendedPolicyResult();
OptionalCachedPromptDecision AceDAOReadOnly::m_promptDecision =
        OptionalCachedPromptDecision();
PreferenceTypes AceDAOReadOnly::m_devCapSetting =
        PreferenceTypes::PREFERENCE_DEFAULT;
PreferenceTypes AceDAOReadOnly::m_widgetDevCapSetting =
        PreferenceTypes::PREFERENCE_DEFAULT;
PreferenceTypesMap AceDAOReadOnly::m_devCapSettings = PreferenceTypesMap();
BaseAttributeSet AceDAOReadOnly::m_attributeSet = BaseAttributeSet();
BasePermissionList AceDAOReadOnly::m_widgetDevCapSettings = BasePermissionList();
RequestedDevCapsMap AceDAOReadOnly::m_devCapPermissions =
        RequestedDevCapsMap();
FeatureNameVector AceDAOReadOnly::m_featureName;
std::string AceDAOReadOnly::m_guid = std::string();
};
