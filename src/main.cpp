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
 * @file        main.cpp
 * @author      Lukasz Wrzosek (l.wrzosek@samsung.com)
 * @version     1.0
 * @brief       This is main routing for Security Daemon
 */

#include <systemd/sd-daemon.h>
#include <dpl/log/log.h>
#include <dpl/single_instance.h>
#include <privacy_manager_daemon.h>

#include "security_daemon.h"

#include <pthread.h>
#include <glib.h>
#include <Ecore.h>

static const std::string DAEMON_INSTANCE_UUID =
    "5ebf3f24-dad6-4a27-88b4-df7970efe7a9";

static Ecore_Event_Handler *g_exitHandler;
static Eina_Bool exitHandler(void */*data*/, int /*type*/, void */*event*/)
{
    privacy_manager_daemon_stop();
    privacy_manager_daemon_shutdown();

    auto& daemon = SecurityDaemonSingleton::Instance();
    daemon.shutdown();                   

    ecore_event_handler_del(g_exitHandler);

    ecore_main_loop_quit();

    return ECORE_CALLBACK_CANCEL;
}      

static Eina_Bool startHandler(void */*data*/)
{
    int retVal;
	auto& daemon = SecurityDaemonSingleton::Instance();
	
	privacy_manager_daemon_initialize();

	privacy_manager_daemon_start();
	
	int argc = 0;
	char* argv = NULL;

	daemon.initialize(argc, &argv);
    retVal = daemon.execute();
    if (retVal != 0)
    {
        LogError("Failed to execute daemon.");
        ecore_main_loop_quit();
        
        return ECORE_CALLBACK_CANCEL;
    }

	// Notification to systemd
	sd_notify(0, "READY=1");

    return ECORE_CALLBACK_CANCEL;
}

int main(int argc, char* argv[])
{
	DPL::SingleInstance instance;
	
	Try {
		if (!instance.TryLock(DAEMON_INSTANCE_UUID)) {
			LogError("Security Daemon is already running");
			return -1;
		}
    } Catch (DPL::SingleInstance::Exception::LockError) {
        LogError("Failed to lock/unlock Security Daemon instance.");
        return -1;
    }
    	
    if (!ecore_init())
    {
        LogError("Ecore cannot be initialized");
        return -1;
    }
	
    ecore_timer_add(0.1, &startHandler, NULL);
    g_exitHandler = ecore_event_handler_add(ECORE_EVENT_SIGNAL_EXIT, &exitHandler, NULL);
    ecore_main_loop_begin();
    ecore_shutdown();

	Try {
	    instance.Release();
    } Catch (DPL::SingleInstance::Exception::LockError) {
        LogError("Failed to release Security Daemon instance.");
        return -1;
    }

    return 0;
}
