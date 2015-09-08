# Copyright (c) 2011 Samsung Electronics Co., Ltd All Rights Reserved
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#        http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
#
######################################################################

IF(DEFINED DBUS_CONNECTION)
#DB vcore
PKG_CHECK_MODULES(ACE_DB_DEP
    dpl-efl
    REQUIRED)
ENDIF()

#DB ace
ADD_CUSTOM_COMMAND(
    OUTPUT ${CMAKE_BINARY_DIR}/ace/database_checksum_ace.h
    COMMAND ${CMAKE_SOURCE_DIR}/ace/orm/gen_db_md5.sh
    ARGS ${CMAKE_BINARY_DIR}/ace/database_checksum_ace.h
         ${CMAKE_SOURCE_DIR}/ace/orm/ace_db
    DEPENDS ${CMAKE_SOURCE_DIR}/ace/orm/ace_db
            ${CMAKE_SOURCE_DIR}/ace/orm/gen_db_md5.sh
    COMMENT "Generating ACE database checksum"
    )
ADD_CUSTOM_TARGET(ACE_DB_CHECKSUM_HEADER DEPENDS ${CMAKE_BINARY_DIR}/ace/database_checksum_ace.h)

STRING(REPLACE ";" ":" DEPENDENCIES "${ACE_DB_DEP_INCLUDE_DIRS}")

IF(DEFINED DBUS_CONNECTION)
ADD_CUSTOM_COMMAND( OUTPUT .ace.db
  COMMAND rm -f ${CMAKE_CURRENT_BINARY_DIR}/.ace.db
  COMMAND CPATH=${DEPENDENCIES} gcc -Wall -include ${CMAKE_BINARY_DIR}/ace/database_checksum_ace.h -I${PROJECT_SOURCE_DIR}/ace/orm -E ${PROJECT_SOURCE_DIR}/ace/orm/ace_db_sql_generator.h | grep --invert-match "^#" > ${CMAKE_CURRENT_BINARY_DIR}/ace_db.sql
  COMMAND sqlite3 ${CMAKE_CURRENT_BINARY_DIR}/.ace.db ".read ${CMAKE_CURRENT_BINARY_DIR}/ace_db.sql" || rm -f ${CMAKE_CURRENT_BINARY_DIR}/.ace.db
  DEPENDS ACE_DB_CHECKSUM_HEADER ${PROJECT_SOURCE_DIR}/ace/orm/ace_db_sql_generator.h ${PROJECT_SOURCE_DIR}/ace/orm/ace_db
  )
ELSE()
ADD_CUSTOM_COMMAND( OUTPUT .ace.db
  COMMAND rm -f ${CMAKE_CURRENT_BINARY_DIR}/.ace.db
  COMMAND CPATH=${DEPENDENCIES} gcc -Wall -include ${CMAKE_BINARY_DIR}/ace/database_checksum_ace.h -I${PROJECT_SOURCE_DIR}/commons/modules/db/include -I${PROJECT_SOURCE_DIR}/ace/orm -E ${PROJECT_SOURCE_DIR}/ace/orm/ace_db_sql_generator.h | grep --invert-match "^#" > ${CMAKE_CURRENT_BINARY_DIR}/ace_db.sql
  COMMAND sqlite3 ${CMAKE_CURRENT_BINARY_DIR}/.ace.db ".read ${CMAKE_CURRENT_BINARY_DIR}/ace_db.sql" || rm -f ${CMAKE_CURRENT_BINARY_DIR}/.ace.db
  DEPENDS ACE_DB_CHECKSUM_HEADER ${PROJECT_SOURCE_DIR}/ace/orm/ace_db_sql_generator.h ${PROJECT_SOURCE_DIR}/ace/orm/ace_db
  )
ENDIF()

ADD_CUSTOM_COMMAND( OUTPUT .ace.db-journal
  COMMAND touch
  ARGS  ${CMAKE_CURRENT_BINARY_DIR}/.ace.db-journal
  )

ADD_CUSTOM_TARGET(Sqlite3DbACE ALL DEPENDS .ace.db .ace.db-journal)

INSTALL(FILES ${CMAKE_CURRENT_BINARY_DIR}/ace_db.sql
    DESTINATION share/wrt-engine/
    )

###########################################################

INCLUDE(FindPkgConfig)

SET(ACE_TEST_PATH "/usr/apps/org.tizen.policy")

INSTALL(FILES
    ${CMAKE_CURRENT_SOURCE_DIR}/configuration/bondixml.xsd
    ${CMAKE_CURRENT_SOURCE_DIR}/configuration/UnrestrictedPolicy.xml
    ${CMAKE_CURRENT_SOURCE_DIR}/configuration/WAC2.0Policy.xml
    DESTINATION /usr/etc/ace
    PERMISSIONS OWNER_READ OWNER_WRITE GROUP_READ GROUP_WRITE)

IF(DEFINED DBUS_CONNECTION)
SET(ACE_LIB_DEPS_BASIC
    dpl-efl
    dpl-db-efl
    dpl-event-efl
    ecore
    appcore-efl
    openssl
    sqlite3
    dlog
    vconf
    db-util
    libpcrecpp
    icu-uc
    libxml-2.0
    )
ELSE()
SET(ACE_LIB_DEPS_BASIC
    openssl
    sqlite3
    dlog
    vconf
    icu-uc
    libxml-2.0
    )
ENDIF()

IF(SMACK_ENABLED)
    LIST(APPEND ACE_LIB_DEPS_BASIC libprivilege-control)
ENDIF(SMACK_ENABLED)

PKG_CHECK_MODULES(ACE_LIB_DEPS ${ACE_LIB_DEPS_BASIC} REQUIRED)

SET(WRT_ACE_DIR ${PROJECT_SOURCE_DIR}/ace)

SET(ACE_SOURCES
  ${WRT_ACE_DIR}/engine/PolicyEvaluator.cpp
  ${WRT_ACE_DIR}/engine/PolicyInformationPoint.cpp
  ${WRT_ACE_DIR}/engine/CombinerImpl.cpp
  ${WRT_ACE_DIR}/engine/parser.cpp
  ${WRT_ACE_DIR}/engine/PolicyEnforcementPoint.cpp
  ${WRT_ACE_DIR}/engine/SettingsLogic.cpp
  ${WRT_ACE_DIR}/engine/Attribute.cpp
  ${WRT_ACE_DIR}/engine/Condition.cpp
  ${WRT_ACE_DIR}/engine/Policy.cpp
  ${WRT_ACE_DIR}/engine/Rule.cpp
  ${WRT_ACE_DIR}/engine/Subject.cpp
  ${WRT_ACE_DIR}/engine/TreeNode.cpp
  ${WRT_ACE_DIR}/engine/ConfigurationManager.cpp
)

INCLUDE_DIRECTORIES(${ACE_LIB_DEPS_INCLUDE_DIRS})
INCLUDE_DIRECTORIES(${WRT_ACE_DIR}/include)

IF(NOT DEFINED DBUS_CONNECTION)
INCLUDE_DIRECTORIES(${PROJECT_SOURCE_DIR}/commons/modules/log/include)
INCLUDE_DIRECTORIES(${PROJECT_SOURCE_DIR}/commons/modules/core/include)
INCLUDE_DIRECTORIES(${PROJECT_SOURCE_DIR}/commons/modules/db/include)
LINK_DIRECTORIES(
    ${PROJECT_SOURCE_DIR}/commons/build/core
    ${PROJECT_SOURCE_DIR}/commons/build/log
    ${PROJECT_SOURCE_DIR}/commons/build/db
    )
ENDIF()

SET(WITH_ACE_SETTINGS_SERVER_SOURCES
   ${WITH_ACE_SETTINGS_SERVER_NONE_SOURCES}
   )

ADD_LIBRARY(${TARGET_ACE_LIB} SHARED
    ${ACE_SOURCES}
    ${WITH_ACE_SETTINGS_SERVER_SOURCES}
)

SET_TARGET_PROPERTIES(${TARGET_ACE_LIB} PROPERTIES
    SOVERSION ${API_VERSION}
    VERSION ${VERSION})

SET_TARGET_PROPERTIES(${TARGET_ACE_LIB} PROPERTIES
    COMPILE_FLAGS -fPIC)

IF(DEFINED DBUS_CONNECTION)
TARGET_LINK_LIBRARIES(${TARGET_ACE_LIB}
    ${TARGET_ACE_DAO_RW_LIB}
    ${ACE_LIB_DEPS_LIBRARIES}
    )
ELSE()
TARGET_LINK_LIBRARIES(${TARGET_ACE_LIB}
    ${TARGET_ACE_DAO_RW_LIB}
    ${ACE_LIB_DEPS_LIBRARIES}
    libwrt-security-commons
    libwrt-security-commons-log
    libwrt-security-commons-db
    )
ENDIF()

INSTALL(TARGETS ${TARGET_ACE_LIB}
    DESTINATION ${LIB_INSTALL_DIR})

INSTALL(FILES
    include/ace/WRT_INTERFACE.h
    DESTINATION
    include/ace
    )

add_subdirectory(dao)
