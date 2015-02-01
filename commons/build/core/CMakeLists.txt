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
# @file        CMakeLists.txt
# @author      Przemyslaw Dobrowolski (p.dobrowolsk@samsung.com)
# @version     1.0
# @brief
#

# Check required modules
INCLUDE(FindPkgConfig)
PKG_CHECK_MODULES(SYS_EFL
  icu-uc
  openssl
  dlog
#  minizip
  REQUIRED
)

# Add core include directories
INCLUDE_DIRECTORIES(
    ${DPL_LOG_INCLUDE_DIR}
    ${DPL_CORE_INCLUDE_DIR}
)

INCLUDE_DIRECTORIES(SYSTEM ${SYS_EFL_INCLUDE_DIRS})

LINK_DIRECTORIES(${SYS_EFL_LIBRARY_DIRS})

# Base EFL based DPL library
SET(DPL_EFL_LIBRARY "${PROJECT_NAME}")

# Build shared library
ADD_LIBRARY(${TARGET_DPL_EFL} SHARED
    ${DPL_CORE_SOURCES}
    ${DPL_LOG_SOURCES}
)

TARGET_LINK_LIBRARIES(${TARGET_DPL_EFL} ${SYS_EFL_LIBRARIES} "-lrt")

# Target library properties
SET_TARGET_PROPERTIES(${TARGET_DPL_EFL} PROPERTIES
    SOVERSION ${API_VERSION} 
 VERSION ${VERSION}
    CLEAN_DIRECT_OUTPUT 1
    OUTPUT_NAME ${DPL_EFL_LIBRARY})

# Install libraries
INSTALL(TARGETS ${TARGET_DPL_EFL}
        DESTINATION ${LIB_INSTALL_DIR})


# Install pkgconfig script
configure_and_install_pkg(wrt-security-commons.pc)
