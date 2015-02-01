#
#Copyright (c) 2011 Samsung Electronics Co., Ltd All Rights Reserved
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#
# @file        CMakeLists.txt
# @author      Lukasz Wrzosek (l.wrzosek@samsung.com)
# @brief
#

SET(TARGET_SEC_DAEMON_TESTS "wrt-tests-security-daemon")
SET(SEC_DAEMON_SOURCES
    ${COMMUNICATION_CLIENT_SOURCES}
    ace_ipc_test_cases.cpp
    service_test_cases.cpp
    fake_service.cpp
    ${PROJECT_SOURCE_DIR}/src/daemon/security_daemon.cpp
    main.cpp
   )
PKG_CHECK_MODULES(SEC_DAEMON_TESTS_PKGS
    dbus-1
    dpl-test-efl
    dpl-dbus-efl
    dpl-utils-efl
    REQUIRED)

INCLUDE_DIRECTORIES(
    ${SEC_DAEMON_TESTS_PKGS_INCLUDE_DIRS}
    ${COMMUNICATION_CLIENT_INCLUDES}
    ${PROJECT_SOURCE_DIR}/ace/include/
    ${PROJECT_SOURCE_DIR}/src/daemon
    ${PROJECT_SOURCE_DIR}/tests/security_daemon_tests
    ${PROJECT_SOURCE_DIR}/tests/ace_install
    )

LINK_DIRECTORIES(${SEC_DAEMON_TESTS_PKGS_LIBRARY_DIRS})

ADD_EXECUTABLE(${TARGET_SEC_DAEMON_TESTS} ${SEC_DAEMON_SOURCES})

TARGET_LINK_LIBRARIES(${TARGET_SEC_DAEMON_TESTS}
    ${SEC_DAEMON_TESTS_PKGS_LIBRARIES}
    ${TARGET_ACE_LIB})

INSTALL(TARGETS ${TARGET_SEC_DAEMON_TESTS} DESTINATION /usr/bin)
INSTALL(FILES "ipc-tests-demo.xml" DESTINATION /usr/etc/ace)
