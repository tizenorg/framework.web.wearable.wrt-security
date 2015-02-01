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

SET(TARGET_ACE_CLIENT_TEST "wrt-tests-ace-client")

PKG_CHECK_MODULES(ACE_CLIENT_TEST_DEPS
    dpl-test-efl
    dpl-db-efl
    REQUIRED
    )

SET(ACE_CLIENT_TEST_SOURCES
    ${COMMUNICATION_CLIENT_SOURCES}
    ${PROJECT_SOURCE_DIR}/tests/ace_client/ace_client_tests.cpp
    ${PROJECT_SOURCE_DIR}/tests/ace_client/test_cases.cpp
    ${PROJECT_SOURCE_DIR}/ace_client/src/ace_client.cpp
    ${PROJECT_SOURCE_DIR}/ace_client/src/ace_api_client.cpp
    ${PROJECT_SOURCE_DIR}/ace/engine/Attribute.cpp
    ${PROJECT_SOURCE_DIR}/ace/engine/Policy.cpp
    ${PROJECT_SOURCE_DIR}/ace/engine/Rule.cpp
    ${PROJECT_SOURCE_DIR}/ace/engine/Condition.cpp
    ${PROJECT_SOURCE_DIR}/ace/engine/Subject.cpp
    ${PROJECT_SOURCE_DIR}/ace/engine/TreeNode.cpp
    ${PROJECT_SOURCE_DIR}/ace/dao/BaseAttribute.cpp
    ${PROJECT_SOURCE_DIR}/src/services/ace/logic/attribute_facade.cpp
    ${PROJECT_SOURCE_DIR}/src/services/ace/logic/simple_roaming_agent.cpp
    ${PROJECT_SOURCE_DIR}/mockups/AceDAOReadOnly_mock.cpp
    ${PROJECT_SOURCE_DIR}/mockups/communication_client_mock.cpp
    )

SET(ACE_CLIENT_TEST_INCLUDES
    ${COMMUNICATION_CLIENT_INCLUDES}
    ${ACE_CLIENT_DEPS_INCLUDE_DIRS}
    ${PROJECT_SOURCE_DIR}/ace_client/include
    ${PROJECT_SOURCE_DIR}/ace_common/include
    ${PROJECT_SOURCE_DIR}/ace_client/include/ace-client
    ${PROJECT_SOURCE_DIR}/ace/include/
    ${PROJECT_SOURCE_DIR}/ace/include/ace/
    ${PROJECT_SOURCE_DIR}/ace/include/ace-dao-ro/
    ${PROJECT_SOURCE_DIR}/mockups/                     # Mockups
    ${PROJECT_SOURCE_DIR}/src/daemon/dbus/             # Security daemon config
    ${PROJECT_SOURCE_DIR}/src/services/ace/            # AceServerApi
    ${PROJECT_SOURCE_DIR}/src/services/ace/dbus/api/
    ${PROJECT_SOURCE_DIR}/src/services/popup/dbus/api/ # PopupResponseServerApi
    ${PROJECT_SOURCE_DIR}/src/services/popup
    ${PROJECT_SOURCE_DIR}/src/services/ace/logic/
    )

ADD_DEFINITIONS(${ACE_CLIENT_TEST_DEPS_CFLAGS})
ADD_DEFINITIONS(${ACE_CLIENT_TEST_CFLAGS_OTHER})
ADD_DEFINITIONS(-D ACE_CLIENT_TESTS)

INCLUDE_DIRECTORIES(${ACE_CLIENT_TEST_INCLUDES})

ADD_EXECUTABLE(${TARGET_ACE_CLIENT_TEST} ${ACE_CLIENT_TEST_SOURCES})

TARGET_LINK_LIBRARIES(${TARGET_ACE_CLIENT_TEST}
    ${TARGET_ACE_LIB}
    ${ACE_CLIENT_TEST_DEPS_LIBRARIES}
    )

INSTALL(TARGETS ${TARGET_ACE_CLIENT_TEST} DESTINATION /usr/bin)
