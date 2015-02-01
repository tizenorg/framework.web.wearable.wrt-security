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
# @author      Tomasz Swierczek (t.swierczek@samsung.com)
# @version     0.1
#
include(FindPkgConfig)

SET(TARGET_ACE_INSTALL_TEST "wrt-tests-ace-install")

PKG_CHECK_MODULES(ACE_INSTALL_TEST_DEPS
    dpl-test-efl
    dpl-db-efl
    REQUIRED
    )

SET(ACE_INSTALL_TEST_SOURCES
    ${PROJECT_SOURCE_DIR}/tests/ace_install/ace_install_tests.cpp
    ${PROJECT_SOURCE_DIR}/tests/ace_install/test_cases.cpp
    )

SET(ACE_INSTALL_TEST_INCLUDES
    ${ACE_INSTALL_DEPS_INCLUDE_DIRS}
    ${PROJECT_SOURCE_DIR}/ace_install/include
    ${PROJECT_SOURCE_DIR}/ace_common/include
    ${PROJECT_SOURCE_DIR}/tests/ace_install
    ${PROJECT_SOURCE_DIR}/ace/include
    )

ADD_DEFINITIONS(${ACE_INSTALL_TEST_DEPS_CFLAGS})
ADD_DEFINITIONS(${ACE_INSTALL_TEST_CFLAGS_OTHER})
ADD_DEFINITIONS(-D ACE_INSTALL_TESTS)

INCLUDE_DIRECTORIES(${ACE_INSTALL_TEST_INCLUDES})

ADD_EXECUTABLE(${TARGET_ACE_INSTALL_TEST} ${ACE_INSTALL_TEST_SOURCES})

TARGET_LINK_LIBRARIES(${TARGET_ACE_INSTALL_TEST}
    ${TARGET_ACE_LIB}
    ${TARGET_ACE_INSTALL_LIB}
    ${ACE_INSTALL_TEST_DEPS_LIBRARIES}
    )

INSTALL(TARGETS ${TARGET_ACE_INSTALL_TEST} DESTINATION /usr/bin)
INSTALL(FILES "ace-install-api-demo-policy.xml" DESTINATION /usr/etc/ace)