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
 * @brief   Implementation file for ACE settings test cases.
 */
#include <dpl/test/test_runner.h>

#include "ace_api_settings.h"

namespace {

static const char* resource1 = "resource1-name";
static const char* resource2 = "resource2-name";
static int handle1 = 0;
static int handle2 = 1;
static ace_preference_t preference1 = ACE_PREFERENCE_PERMIT;
static ace_preference_t preference2 = ACE_PREFERENCE_BLANKET_PROMPT;

} // namespace

RUNNER_TEST_GROUP_INIT(ACE_SETTINGS_TEST_SUITE)

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_settings_initialize(), ace_settings_shutdown()
 * purpose: New C-API tests. Tests proper initialization and deinitialization
 * of ace-settings library.
 */
RUNNER_TEST(ace_settings_test_01_initialization)
{
    RUNNER_ASSERT(ACE_OK == ace_settings_initialize());
    RUNNER_ASSERT(ACE_OK == ace_settings_shutdown());
    RUNNER_ASSERT(ACE_OK == ace_settings_initialize());
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_set_global_resource_preference(),
 * ace_get_global_resource_preference()
 * purpose: New C-API tests. Tests setting and getting global per resource
 * access preferences.
 */
RUNNER_TEST(ace_settings_test_02_global_preferences)
{
    RUNNER_ASSERT(ACE_OK == ace_set_global_resource_preference(
            const_cast<char*>(resource1), preference1));
    ace_preference_t pref;
    RUNNER_ASSERT(ACE_OK == ace_get_global_resource_preference(
            const_cast<char*>(resource1), &pref));
    RUNNER_ASSERT(preference1 == pref);

    RUNNER_ASSERT(ACE_OK == ace_set_global_resource_preference(
            const_cast<char*>(resource2), preference2));
    RUNNER_ASSERT(ACE_OK == ace_get_global_resource_preference(
            const_cast<char*>(resource2), &pref));
    RUNNER_ASSERT(preference2 == pref);
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_set_widget_resource_preference(),
 * ace_get_widget_resource_preference()
 * purpose: New C-API tests. Tests setting and getting per widget/resource
 * access preferences.
 */
RUNNER_TEST(ace_settings_test_03_widget_preferences)
{
    RUNNER_ASSERT(ACE_OK == ace_set_widget_resource_preference(handle1,
            const_cast<char*>(resource1),
            preference1));
    ace_preference_t pref;
    RUNNER_ASSERT(ACE_OK == ace_get_widget_resource_preference(handle1,
            const_cast<char*>(resource1),
            &pref));
    RUNNER_ASSERT(preference1 == pref);

    RUNNER_ASSERT(ACE_OK == ace_set_widget_resource_preference(handle2,
            const_cast<char*>(resource2),
            preference2));
    RUNNER_ASSERT(ACE_OK == ace_get_widget_resource_preference(handle2,
            const_cast<char*>(resource2),
            &pref));
    RUNNER_ASSERT(preference2 == pref);
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_get_widget_resource_preference(),
 * ace_get_global_resource_preference(),
 * ace_reset_widget_resource_settings(),
 * ace_reset_global_resource_settings()
 * purpose: New C-API tests. Tests proper resetting of settings database.
 */
RUNNER_TEST(ace_settings_test_04_database_reset)
{
    RUNNER_ASSERT(ACE_OK == ace_reset_widget_resource_settings());
    RUNNER_ASSERT(ACE_OK == ace_reset_global_resource_settings());
    ace_preference_t pref;
    RUNNER_ASSERT(ACE_OK == ace_get_widget_resource_preference(handle1,
            const_cast<char*>(resource1),
            &pref));
    RUNNER_ASSERT(ACE_PREFERENCE_DEFAULT == pref);
    RUNNER_ASSERT(ACE_OK == ace_get_widget_resource_preference(handle2,
            const_cast<char*>(resource2),
            &pref));
    RUNNER_ASSERT(ACE_PREFERENCE_DEFAULT == pref);
    RUNNER_ASSERT(ACE_OK == ace_get_global_resource_preference(
            const_cast<char*>(resource1),
            &pref));
    RUNNER_ASSERT(ACE_PREFERENCE_DEFAULT == pref);
    RUNNER_ASSERT(ACE_OK == ace_get_global_resource_preference(
            const_cast<char*>(resource2),
            &pref));
    RUNNER_ASSERT(ACE_PREFERENCE_DEFAULT == pref);
}

/*
 * test author: Bartlomiej Grzelewski (b.grzelewski@samsung.com)
 * tested functions: ace_is_private_api
 * purpose: This function should return true if device cap
 * belongs to private api.
 */
RUNNER_TEST(ace_settings_test_05_private_api_positive)
{
    static const char *api_private[] = {
        "bluetooth.admin",
        "contact.read",
        "nfc.tag",
        NULL
    };
    for (int i=0; api_private[i]; ++i) {
        ace_bool_t response = ACE_FALSE;
        RUNNER_ASSERT(ACE_OK == ace_is_private_api(
            const_cast<char*>(api_private[i]), &response));
        RUNNER_ASSERT(ACE_TRUE == response);
    }
}

/*
 * test author: Bartlomiej Grzelewski (b.grzelewski@samsung.com)
 * tested functions: ace_is_private_api
 * purpose: All calls should fail as non of the strings are connected with
 * private api.
 */
RUNNER_TEST(ace_settings_test_06_private_api_negative)
{
    static const char *api_private[] = {
        "bluetooth",
        "contact.reed",
        "nfc.tag.extended",
        "totaly.fake",
        NULL
    };

    for (int i=0; api_private[i]; ++i) {
        ace_bool_t response = ACE_TRUE;
        RUNNER_ASSERT(ACE_OK == ace_is_private_api(
            const_cast<char*>(api_private[i]), &response));
        RUNNER_ASSERT(ACE_FALSE == response);
    }
}

