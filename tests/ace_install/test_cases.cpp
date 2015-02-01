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
 * @brief   Implementation file for ACE install test cases.
 */
#include <string.h>
#include <cstring>

#include <dpl/test/test_runner.h>
#include <dpl/log/log.h>

#include "ace_api_install.h"
#include "widget_installer.h"
#include <ace-dao-ro/AceDAOReadOnly.h>

RUNNER_TEST_GROUP_INIT(ACE_INSTALL_TEST_SUITE)

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_install_initialize(),
 * ace_install_shutdown()
 * purpose: New C-API tests. Tests proper initialization and deinitialization
 * of ace-install library.
 */
RUNNER_TEST(ace_install_test_01_initialization)
{
    RUNNER_ASSERT(ACE_OK == ace_install_initialize());
    RUNNER_ASSERT(ACE_OK == ace_install_shutdown());
    RUNNER_ASSERT(ACE_OK == ace_install_initialize());
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_update_policy()
 * purpose: New C-API tests. Tests proper policy re-parsing many times in a row.
 */
RUNNER_TEST(ace_install_test_02_policy_update)
{
    RUNNER_ASSERT(ACE_OK == ace_update_policy());
    RUNNER_ASSERT(ACE_OK == ace_update_policy());
    RUNNER_ASSERT(ACE_OK == ace_update_policy());
}


/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_set_requested_dev_caps(),
 * ace_get_requested_dev_caps(), ace_free_requested_dev_caps()
 * purpose: New C-API tests. Tests proper setting and getting widget dev caps
 * upon installation.
 */
RUNNER_TEST(ace_install_test_03_requested_dev_caps)
{
    ace_widget_handle_t handle = InstallerMockup::registerWidget();
    ace_requested_dev_cap_t reqDevCaps[2];
    reqDevCaps[0].device_capability = "dev-cap1";
    reqDevCaps[0].smack_granted = ACE_TRUE;
    reqDevCaps[1].device_capability = "dev-cap2";
    reqDevCaps[1].smack_granted = ACE_FALSE;
    ace_requested_dev_cap_list_t caps;
    caps.count = 2;
    caps.items = reqDevCaps;
    RUNNER_ASSERT(ACE_OK == ace_set_requested_dev_caps(handle, &caps));
    ace_requested_dev_cap_list_t capsGotFromDB;
    RUNNER_ASSERT(ACE_OK == ace_get_requested_dev_caps(handle, &capsGotFromDB));
    RUNNER_ASSERT(capsGotFromDB.count == caps.count);
    unsigned int i;
    bool one = false, two = false;
    for (i = 0; i < capsGotFromDB.count; ++i) {
        if (0 == strcmp(capsGotFromDB.items[i].device_capability,
                                 caps.items[0].device_capability)) {
            RUNNER_ASSERT(capsGotFromDB.items[i].smack_granted ==
                        caps.items[0].smack_granted);
            one = true;
        } else {
            RUNNER_ASSERT(capsGotFromDB.items[i].smack_granted ==
                                    caps.items[1].smack_granted);
            RUNNER_ASSERT(0 == strcmp(capsGotFromDB.items[i].device_capability,
                                 caps.items[1].device_capability));
            two = true;
        }
    }
    RUNNER_ASSERT(one && two);
    RUNNER_ASSERT(ACE_OK == ace_free_requested_dev_caps(&capsGotFromDB));
}

/*
 * test author: Andrzej Surdej (a.surdej@gmail.com)
 * tested functions: ace_register_widget(),
 * ace_unregister_widget()
 * purpose: New C-API tests. Tests proper setting and getting widget info.
 */
namespace {
    int widgetHandle = 1000;
    std::string testAuthor = "someAwesomeProgrammer;)";
    std::string testVersion = "1.1.1R";
    std::string widgetGuid = "http://widgets.org/myTestWidget";
    std::string widgetShareHref = "http://shareWithOtherNiggers.ny.wrong";
}

/*
 * author:
 * test: ace_register_widget(), ace_unregister_widget()
 * description: Try to install and uninstall widget with all correct info.
 * expect: widget should be installed and uninstalled correctly.
 */
RUNNER_TEST(ace_install_test_04_correct_widget_info)
{
    struct widget_info info;
    info.author = strdup(testAuthor.c_str());
    info.id = strdup(widgetGuid.c_str());
    info.type = WAC20;
    info.version = strdup(testVersion.c_str());
    info.shareHerf = strdup(widgetShareHref.c_str());

    ace_return_t retValue = ace_register_widget(widgetHandle, &info, NULL);

    //clean up before asserts
    free(info.author);
    free(info.id);
    free(info.version);
    free(info.shareHerf);

    RUNNER_ASSERT(ACE_OK == retValue);
    RUNNER_ASSERT(AceDB::AceDAOReadOnly::isWidgetInstalled(widgetHandle));

    std::string gotVersion = AceDB::AceDAOReadOnly::getVersion(widgetHandle);
    RUNNER_ASSERT(gotVersion == testVersion);

    std::string gotGuid = AceDB::AceDAOReadOnly::getGUID(widgetHandle);
    RUNNER_ASSERT(gotGuid == widgetGuid);

    std::string gotShareHref = AceDB::AceDAOReadOnly::getShareHref(widgetHandle);
    RUNNER_ASSERT(gotShareHref == widgetShareHref);

    RUNNER_ASSERT(AceDB::AceDAOReadOnly::getWidgetType(widgetHandle) == AppTypes::WAC20);
    RUNNER_ASSERT(AceDB::AceDAOReadOnly::getAuthorName(widgetHandle) == testAuthor);

    RUNNER_ASSERT(ACE_OK == ace_unregister_widget(widgetHandle));
    RUNNER_ASSERT(!AceDB::AceDAOReadOnly::isWidgetInstalled(widgetHandle));
}

/*
 * author:
 * test: ace_register_widget(), ace_unregister_widget()
 * description: Negative test. NULL widget data passed.
 * expect: Widget should not be installed.
 */
RUNNER_TEST(ace_install_test_06_wrong_widget_info)
{
    ace_return_t retVal = ace_register_widget(widgetHandle, NULL, NULL);
    RUNNER_ASSERT(retVal != ACE_OK);
    RUNNER_ASSERT(!AceDB::AceDAOReadOnly::isWidgetInstalled(widgetHandle));
    //just to be sure
    ace_unregister_widget(widgetHandle);
}

/*
 * author:
 * test: ace_register_widget(), ace_unregister_widget()
 * description: Check if the same widget can be installed twice.
 * expect: First widget should be installed, second widget should NOT be installed.
 */
RUNNER_TEST(ace_install_test_07_twins)
{
    struct widget_info info;
    info.author = strdup(testAuthor.c_str());
    info.id = strdup(widgetGuid.c_str());
    info.type = WAC20;
    info.version = strdup(testVersion.c_str());
    info.shareHerf = strdup(widgetShareHref.c_str());

    ace_return_t retValue = ace_register_widget(widgetHandle, &info, NULL);

    //clean up before asserts
    free(info.author);
    free(info.id);
    free(info.version);
    free(info.shareHerf);

    RUNNER_ASSERT(ACE_OK == retValue);
    RUNNER_ASSERT(AceDB::AceDAOReadOnly::isWidgetInstalled(widgetHandle));

    retValue = ace_register_widget(widgetHandle, &info, NULL);
    RUNNER_ASSERT(ACE_OK != retValue);

    RUNNER_ASSERT(AceDB::AceDAOReadOnly::isWidgetInstalled(widgetHandle));
    ace_unregister_widget(widgetHandle);
}

/*
 * author:
 * test: ace_register_widget(), got***.empty(), getWidgetType(), ace_unregister_widget()
 * description: Installing Widget with NULL info
 * expect: Widget should be installed, all data about widget should be empty.
 */
RUNNER_TEST(ace_install_test_08_empty_values)
{
    struct widget_info info;
    info.author = NULL;
    info.id = NULL;
    info.type = Tizen;
    info.version = NULL;
    info.shareHerf = NULL;

    ace_return_t retValue = ace_register_widget(widgetHandle, &info, NULL);

    //clean up before asserts
    free(info.author);
    free(info.id);
    free(info.version);
    free(info.shareHerf);

    RUNNER_ASSERT(ACE_OK == retValue);
    RUNNER_ASSERT(AceDB::AceDAOReadOnly::isWidgetInstalled(widgetHandle));

    std::string gotAuthor = AceDB::AceDAOReadOnly::getAuthorName(widgetHandle);
    RUNNER_ASSERT(gotAuthor.empty());

    std::string gotVersion = AceDB::AceDAOReadOnly::getVersion(widgetHandle);
    RUNNER_ASSERT(gotVersion.empty());

    std::string gotGuid = AceDB::AceDAOReadOnly::getGUID(widgetHandle);
    RUNNER_ASSERT(gotGuid.empty());

    std::string gotShareHref = AceDB::AceDAOReadOnly::getShareHref(widgetHandle);
    RUNNER_ASSERT(gotShareHref.empty());

    RUNNER_ASSERT(AceDB::AceDAOReadOnly::getWidgetType(widgetHandle) == AppTypes::Tizen);

    RUNNER_ASSERT(ACE_OK == ace_unregister_widget(widgetHandle));
    RUNNER_ASSERT(!AceDB::AceDAOReadOnly::isWidgetInstalled(widgetHandle));
}

namespace {
    int chaniId0 = 1;
    std::string commonName0 = "commonNameForZeroElement";
    std::string md50 = "md5CertificateForZeroElement";
    std::string sha0 = "shaCertificateForZeroElement";
    ace_cert_owner_t owner0 = AUTHOR;
    ace_cert_type_t type0 = ENDENTITY;

    int chaniId1 = 2;
    std::string commonName1 = "commonNameForFirstElement";
    std::string md51 = "md5CertificateForFirstElement";
    std::string sha1 = "shaCertificateForFirstElement";
    ace_cert_owner_t owner1 = AUTHOR;
    ace_cert_type_t type1 = ENDENTITY;

    int chaniId2 = 3;
    std::string commonName2 = "commonNameForSecondElement";
    std::string md52 = "md5CertificateForSecondElement";
    std::string sha2 = "shaCertificateForSecondElement";
    ace_cert_owner_t owner2 = DISTRIBUTOR;
    ace_cert_type_t type2 = ROOT;
}

/*
 * author:
 * test: ace_register_widget(), getKeyCommonNameList(), getKeyFingerprints()
 * description: Check if certificate verification works well while widget installing. Also check saved certificate data.
 * expect: Widget should be installed properly, all data from certificate should match.
 */
RUNNER_TEST(ace_install_test_09_certificate_list)
{
    struct widget_info info;
    info.author = NULL;
    info.id = NULL;
    info.type = Tizen;
    info.version = NULL;
    info.shareHerf = NULL;

    ace_certificate_data** certList = new ace_certificate_data*[4];
    certList[3] = NULL; //last element

    for (int i = 0; i < 3; ++i) {
        certList[i] = new ace_certificate_data;
    }
    certList[0]->chain_id = chaniId0;
    certList[0]->common_name = strdup(commonName0.c_str());
    certList[0]->md5_fp = strdup(md50.c_str());
    certList[0]->sha1_fp = strdup(sha0.c_str());
    certList[0]->owner = owner0;
    certList[0]->type = type0;

    certList[1]->chain_id = chaniId1;
    certList[1]->common_name = strdup(commonName1.c_str());
    certList[1]->md5_fp = strdup(md51.c_str());
    certList[1]->sha1_fp = strdup(sha1.c_str());
    certList[1]->owner = owner1;
    certList[1]->type = type1;

    certList[2]->chain_id = chaniId2;
    certList[2]->common_name = strdup(commonName2.c_str());
    certList[2]->md5_fp = strdup(md52.c_str());
    certList[2]->sha1_fp = strdup(sha2.c_str());
    certList[2]->owner = owner2;
    certList[2]->type = type2;

    ace_return_t retValue = ace_register_widget(widgetHandle, &info, certList);

    //clean up before asserts
    free(info.author);
    free(info.id);
    free(info.version);
    free(info.shareHerf);
    for (int i = 0; i < 3; ++i) {
        free(certList[i]->common_name);
        free(certList[i]->md5_fp);
        free(certList[i]->sha1_fp);
        delete certList[i];
    }
    delete[] certList;

    RUNNER_ASSERT(ACE_OK == retValue);
    RUNNER_ASSERT(AceDB::AceDAOReadOnly::isWidgetInstalled(widgetHandle));

    WidgetCertificateCNList commonNameList =
        AceDB::AceDAOReadOnly::getKeyCommonNameList(widgetHandle,
                                                    WidgetCertificateData::AUTHOR,
                                                    WidgetCertificateData::ENDENTITY);
    RUNNER_ASSERT(2 == commonNameList.size());
    RUNNER_ASSERT(commonName0 == commonNameList.front() ||
                  commonName0 == commonNameList.back());
    RUNNER_ASSERT(commonName1 == commonNameList.front() ||
                  commonName1 == commonNameList.back());
    commonNameList.clear();
    commonNameList =
        AceDB::AceDAOReadOnly::getKeyCommonNameList(widgetHandle,
                                                    WidgetCertificateData::DISTRIBUTOR,
                                                    WidgetCertificateData::ROOT);
    RUNNER_ASSERT(1 == commonNameList.size());
    RUNNER_ASSERT(commonName2 == commonNameList.front());

    FingerPrintList fpList =
        AceDB::AceDAOReadOnly::getKeyFingerprints(widgetHandle,
                                                  WidgetCertificateData::AUTHOR,
                                                  WidgetCertificateData::ENDENTITY);
    RUNNER_ASSERT(4 == fpList.size());

    fpList.clear();
    fpList =
        AceDB::AceDAOReadOnly::getKeyFingerprints(widgetHandle,
                                                  WidgetCertificateData::DISTRIBUTOR,
                                                  WidgetCertificateData::ROOT);
    RUNNER_ASSERT(2 == fpList.size());

    ace_unregister_widget(widgetHandle);
}

/*
 * test author: Tomasz Swierczek (t.swierczek@samsung.com)
 * tested functions: ace_get_policy_result()
 * purpose: New C-API tests. Tests proper policy evaluation by security daemon
 * and successful passing data to ace-install library. For three calls,
 * three results are expected: ACE_PERMIT, ACE_DENY and ACE_PROMPT.
 */
RUNNER_TEST(ace_install_test_10_policy_results)
{
    ace_widget_handle_t handle = InstallerMockup::registerWidget();
    ace_resource_t resourceA = "resourcePermit";
    ace_resource_t resourceB = "resourceDeny";
    ace_resource_t resourceC = "resourcePrompt";
    ace_policy_result_t result = ACE_UNDEFINED;
    RUNNER_ASSERT(ACE_OK == ace_get_policy_result(resourceA,
                                                  handle,
                                                  &result));
    RUNNER_ASSERT(ACE_PERMIT == result);
    RUNNER_ASSERT(ACE_OK == ace_get_policy_result(resourceB,
                                                  handle,
                                                  &result));
    RUNNER_ASSERT(ACE_DENY == result);
    RUNNER_ASSERT(ACE_OK == ace_get_policy_result(resourceC,
                                                  handle,
                                                  &result));
    RUNNER_ASSERT(ACE_PROMPT == result);
}
