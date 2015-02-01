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
 * @file    widget_installer.h
 * @author  Tomasz Swierczek (t.swierczek@samsung.com)
 * @brief   Class that manages widget installation for ACE tests
 */
#ifndef _TESTS_ACE_WIDGET_INSTALLER_H_
#define _TESTS_ACE_WIDGET_INSTALLER_H_

#include <ace-dao-rw/AceDAO.h>
#include <ace-dao-ro/common_dao_types.h>
#include <sys/time.h>
#include <ctime>
#include <cstdlib>

#define INVALID_WIDGET_HANDLE -1

using namespace AceDB;

namespace InstallerMockup {

class WacSecurityMock : public IWacSecurity
{
public:
    WacSecurityMock() :
        mRecognized(false),
        mDistributorSigned(false),
        mWacSigned(false)
    {
    }

    virtual const WidgetCertificateDataList& getCertificateList() const
    {
        return mList;
    }

    virtual bool isRecognized() const { return mRecognized; }
    virtual bool isDistributorSigned() const { return mDistributorSigned; }
    virtual bool isWacSigned() const { return mWacSigned; }
    virtual void getCertificateChainList(CertificateChainList& /*lst*/) const {}
    virtual void getCertificateChainList(CertificateChainList& /*lst*/,
            CertificateSource /* source */) const {}

    WidgetCertificateDataList& getCertificateListRef()
    {
        return mList;
    }

    void setRecognized(bool recognized) { mRecognized = recognized; }
    void setDistributorSigned(bool distributorSigned)
    {
        mDistributorSigned = distributorSigned;
    }
    void setWacSigned(bool wacSigned) { mWacSigned = wacSigned; }

private:
    WidgetCertificateDataList mList;
    // author signature verified
    bool mRecognized;
    // known distribuor
    bool mDistributorSigned;
    // distributor is wac
    bool mWacSigned;

};

static WidgetHandle _registerWidget(const WidgetRegisterInfo& regInfo,
                                    const IWacSecurity& sec,
                                    int line)
{
    //randomize widget handle
    WidgetHandle handle = INVALID_WIDGET_HANDLE;
    struct timeval tv;
    gettimeofday(&tv, NULL);
    srand(time(NULL) + tv.tv_usec);
    do {
        handle = rand();
    } while (AceDAOReadOnly::isWidgetInstalled(handle));

    try
    {
        auto previous = AceDAOReadOnly::getHandleList();

        // register widget
        AceDAO::registerWidgetInfo(handle, regInfo, sec.getCertificateList());

        RUNNER_ASSERT_MSG(handle != INVALID_WIDGET_HANDLE,
                          "(called from line " << line << ")");

        auto current = AceDAOReadOnly::getHandleList();
        RUNNER_ASSERT_MSG(previous.size()+1 == current.size(),
                          "(called from line " << line << ")");

        RUNNER_ASSERT_MSG(AceDAOReadOnly::isWidgetInstalled(handle),
                          "(called from line " << line << ")");
    } catch (AceDAOReadOnly::Exception::DatabaseError) {
        RUNNER_ASSERT_MSG(
                false,
                "Unexpected exception (called from line " << line << ")");
    }
    return handle;
}

WidgetHandle registerWidget(AppTypes appType = AppTypes::WAC20)
{
    WacSecurityMock sec;
    WidgetRegisterInfo regInfo;
    regInfo.type = appType;
    return _registerWidget(regInfo, sec, __LINE__);
}

} // namespace

#endif // _TESTS_ACE_WIDGET_INSTALLER_H_
