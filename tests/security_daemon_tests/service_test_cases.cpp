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
#include <dpl/test/test_runner.h>
#include <dpl/framework_efl.h>
#include <dpl/event/controller.h>
#include <dpl/generic_event.h>
#include <dpl/singleton_impl.h>

#include <fake_service.h>
#include <security_daemon.h>


DECLARE_GENERIC_EVENT_0(EndLoopEvent)

class SimpleController : public DPL::Event::Controller<DPL::TypeListDecl<EndLoopEvent>::Type>
{
protected:
    void OnEventReceived(const EndLoopEvent & /* event */){
        ecore_main_loop_quit();
    }
};

typedef DPL::Singleton<SimpleController> SimpleControllerSingleton;

IMPLEMENT_SINGLETON(SimpleController);

RUNNER_TEST_GROUP_INIT(security_daemon)


/*
 * author:      ---
 * test:        Singleton test
 * description: Testing state of the daemon
 * expect:      Daemon should return correct state through FakeService.
 *
 */
RUNNER_TEST(security_daemon_singleton_test) {
    auto& daemon = SecurityDaemonSingleton::Instance();

    FakeService::s_initialized = false;
    FakeService::s_started = false;
    FakeService::s_stopped = false;
    FakeService::s_deinitialized = false;

    int argc = 0;
    char ** temp = NULL;

    daemon.initialize(argc, temp);

    RUNNER_ASSERT(FakeService::s_initialized);
    RUNNER_ASSERT(!FakeService::s_started);
    RUNNER_ASSERT(!FakeService::s_stopped);
    RUNNER_ASSERT(!FakeService::s_deinitialized);

    SimpleControllerSingleton::Instance().Touch();
    CONTROLLER_POST_EVENT(SimpleController, EndLoopEvent());

    daemon.execute();
    RUNNER_ASSERT(FakeService::s_initialized);
    RUNNER_ASSERT(FakeService::s_started);
    RUNNER_ASSERT(!FakeService::s_stopped);
    RUNNER_ASSERT(!FakeService::s_deinitialized);


    daemon.terminate();
    RUNNER_ASSERT(FakeService::s_initialized);
    RUNNER_ASSERT(FakeService::s_started);
    RUNNER_ASSERT(FakeService::s_stopped);
    RUNNER_ASSERT(!FakeService::s_deinitialized);

    daemon.shutdown();
    RUNNER_ASSERT(FakeService::s_initialized);
    RUNNER_ASSERT(FakeService::s_started);
    RUNNER_ASSERT(FakeService::s_stopped);
    RUNNER_ASSERT(FakeService::s_deinitialized);
}


