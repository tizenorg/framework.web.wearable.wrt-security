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
#ifndef _FAKE_SERVICE_H_
#define _FAKE_SERVICE_H_

#include <security_daemon.h>

class FakeService : public SecurityDaemon::DaemonService {
public:
    void initialize() {
        s_initialized = true;
    }
    void start() {
        s_started = true;
    }
    void stop() {
        s_stopped = true;
    }

    void deinitialize() {
        s_deinitialized = true;
    }

    static bool s_initialized;
    static bool s_started;
    static bool s_stopped;
    static bool s_deinitialized;
};

DAEMON_REGISTER_SERVICE_MODULE(FakeService)

#endif // _FAKE_SERVICE_H_
