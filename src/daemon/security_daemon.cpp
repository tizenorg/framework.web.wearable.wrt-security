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
 * @file        security_daemon.cpp
 * @author      Lukasz Wrzosek (l.wrzosek@samsung.com)
 * @version     1.0
 * @brief       This is implementation file of Security Daemon
 */

#include "security_daemon.h"

#include <dpl/assert.h>
#include <dpl/foreach.h>
#include <dpl/log/log.h>
#ifdef DBUS_CONNECTION
#include <dpl/framework_efl.h>
#endif

#include <dpl/singleton_impl.h>
IMPLEMENT_SINGLETON(SecurityDaemon::SecurityDaemon)

#include <ace-dao-rw/AceDAO.h>

namespace SecurityDaemon {

SecurityDaemon::SecurityDaemon() :
    m_initialized(false),
    m_terminating(false),
    m_returnValue(0)
{
}

void SecurityDaemon::initialize(int& /*argc*/, char** /*argv*/)
{
    DPL::Log::LogSystemSingleton::Instance().SetTag("SECURITY_DAEMON");
    LogDebug("Initializing");
    Assert(!m_initialized && "Already Initialized");

    DatabaseService::initialize();
    FOREACH (service, m_servicesList) {
        (*service)->initialize();
    }
    m_initialized = true;
    LogDebug("Initialized");
}

int SecurityDaemon::execute()
{
    Assert(m_initialized && "Not Initialized");
    LogDebug("Starting execute");
    FOREACH (service, m_servicesList) {
        (*service)->start();
    }

    return m_returnValue;
}

void SecurityDaemon::terminate(int returnValue)
{
    Assert(m_initialized && "Not Initialized");
    Assert(!m_terminating && "Already terminating");
    LogDebug("Terminating");

    m_returnValue = returnValue;
    m_terminating = true;

    FOREACH (service, m_servicesList) {
        (*service)->stop();
    }
}

void SecurityDaemon::shutdown()
{
    LogDebug("Shutdown");
    Assert(m_initialized && "Not Initialized");

    DatabaseService::deinitialize();
    FOREACH (service, m_servicesList) {
        (*service)->deinitialize();
    }

    m_initialized = false;
}

namespace DatabaseService {

void initialize(void)
{
    LogDebug("Ace/Wrt database services initializing...");
    AceDB::AceDAO::attachToThreadRW();
}

void deinitialize(void)
{
    LogDebug("Ace/Wrt database services deinitializing...");
    AceDB::AceDAO::detachFromThread();
}

} //namespace DatabaseService

} //namespace SecurityDaemon
