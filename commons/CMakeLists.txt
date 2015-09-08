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
#
# @file        CMakeLists.txt
# @author      Przemyslaw Dobrowolski (p.dobrowolsk@samsung.com)
# @version     1.0
# @brief
#

# Check minimum CMake version
CMAKE_MINIMUM_REQUIRED(VERSION 2.6)

# Project name
PROJECT(wrt-security-commons)

STRING(REGEX MATCH "([^.]*)" API_VERSION "${VERSION}")
ADD_DEFINITIONS("-DAPI_VERSION=\"$(API_VERSION)\"")

# Comment this to disable control of global settings with environment variable
ADD_DEFINITIONS("-DGLOBAL_SETTINGS_CONTROL")

# Build type
IF(NOT CMAKE_BUILD_TYPE)
    SET(CMAKE_BUILD_TYPE "Release")
ENDIF(NOT CMAKE_BUILD_TYPE)

# Options
OPTION(DPL_LOG "DPL logs status" OFF)
IF(DPL_LOG AND NOT CMAKE_BUILD_TYPE MATCHES "profiling")
    MESSAGE(STATUS "Logging enabled for DPL")
    ADD_DEFINITIONS("-DDPL_LOGS_ENABLED")
ELSE(DPL_LOG AND NOT CMAKE_BUILD_TYPE MATCHES "profiling")
    MESSAGE(STATUS "Logging disabled for DPL")
ENDIF(DPL_LOG AND NOT CMAKE_BUILD_TYPE MATCHES "profiling")

OPTION(WITH_TESTS "Build tests" OFF)
OPTION(WITH_CHILD "Build additional test subdirectory. WITH_TEST must be ON" OFF)

# Compiler flags
SET(CMAKE_C_FLAGS_PROFILING    "-O2")
SET(CMAKE_CXX_FLAGS_PROFILING  "-O2 -std=c++0x")
SET(CMAKE_C_FLAGS_DEBUG        "-O0 -g")
SET(CMAKE_CXX_FLAGS_DEBUG      "-O0 -std=c++0x -g")
SET(CMAKE_C_FLAGS_RELEASE      "-O2 -g")
SET(CMAKE_CXX_FLAGS_RELEASE    "-O2 -std=c++0x -g -fvisibility-inlines-hidden")
SET(CMAKE_CXX_FLAGS_CCOV       "-O0 -std=c++0x -g --coverage")

ADD_DEFINITIONS("-fPIC")                        # If supported for the target machine, emit position-independent code, suitable for dynamic linking and avoiding any limit on the size of the global offset table. This option makes a difference on the m68k, PowerPC and SPARC. (BJ: our ARM too?)

# Compiler flags
ADD_DEFINITIONS("-fvisibility=default")         # mark all exported symbols as visible

# Warnings mode
#ADD_DEFINITIONS("-Werror")                      # Make all warnings into errors.

# Warning flags
ADD_DEFINITIONS("-Wall")                        # Generate all warnings
ADD_DEFINITIONS("-Wextra")                      # Generate even more extra warnings
ADD_DEFINITIONS("-pedantic")                    # Accept only pedantic code
#ADD_DEFINITIONS("-Weffc++")                     # Accept only effective C++ code
ADD_DEFINITIONS("-Wwrite-strings")              # Do not accept writing to contant string memory
ADD_DEFINITIONS("-Winit-self")                  # Do not accept initializing variable with itself
ADD_DEFINITIONS("-Wcast-align")                 # Do not accept misaligning with casting
ADD_DEFINITIONS("-Wcast-qual")                  # Do not accept removing qualifiers with casting
#ADD_DEFINITIONS("-Wold-style-cast")             # Do not accept old style casting
ADD_DEFINITIONS("-Wpointer-arith")              # Warn about void pointer arthimetic
ADD_DEFINITIONS("-Wstrict-aliasing")            # Ensure strict aliasing
ADD_DEFINITIONS("-Wuninitialized")              # Do not accept uninitialized variables
ADD_DEFINITIONS("-Wmissing-declarations")       # Warn about global and non-accesible functions
ADD_DEFINITIONS("-Woverloaded-virtual")         # Warn about incidental overiding non-virtual base methods
ADD_DEFINITIONS("-Wnon-virtual-dtor")           # Warn about non-virtual destructor
ADD_DEFINITIONS("-Wctor-dtor-privacy")          # Warn about useless and non-constructible classes
#ADD_DEFINITIONS("-Wlong-long")                  # Do not allow using long long
#ADD_DEFINITIONS("-Wunreachable-code")           # Warn about unreachable code
ADD_DEFINITIONS("-Wfloat-equal")                # Do not accept comparing floating points with equal operator
ADD_DEFINITIONS("-Wabi")                        # Warn about possible ABI problems
ADD_DEFINITIONS("-Wswitch-enum")                # Check switch enumeration
ADD_DEFINITIONS("-Wformat=2")                   # Check printf formatting
ADD_DEFINITIONS("-Wundef")                      # Warn if an undefined identifier is evaluated in an @if directive.
ADD_DEFINITIONS("-Wshadow")                     # Warn whenever a local variable shadows another local variable, parameter or global variable or whenever a built-in function is shadowed
ADD_DEFINITIONS("-Wconversion")                 # Warn for implicit conversions that may alter a value
ADD_DEFINITIONS("-Wlogical-op")                 # Warn about suspicious uses of logical operators in expressions
#ADD_DEFINITIONS("-Waggregate-return")           # Warn if any functions that return structures or unions are defined or called.
ADD_DEFINITIONS("-Wmissing-field-initializers") # Warn if a structure's initializer has some fields missing.
ADD_DEFINITIONS("-Wredundant-decls")            # Warn if anything is declared more than once in the same scope, even in cases where multiple declaration is valid and changes nothing.
#ADD_DEFINITIONS("-Wmissing-include-dirs")       # Warn if a user-supplied include directory does not exist.
ADD_DEFINITIONS("-Wswitch-default")             # Warn whenever a switch statement does not have a default case.
ADD_DEFINITIONS("-Wsync-nand")                  # Warn when __sync_fetch_and_nand and __sync_nand_and_fetch built-in functions are used. These functions changed semantics in GCC 4.4.
ADD_DEFINITIONS("-Wunused")                     # All the above -Wunused options combined.
ADD_DEFINITIONS("-Wstrict-overflow=5")          # Also warn about cases where the compiler reduces the magnitude of a constant involved in a comparison.
ADD_DEFINITIONS("-Wdisabled-optimization")      # Warn if a requested optimization pass is disabled.
ADD_DEFINITIONS("-std=c++0x")

#
# Core library files
#
# Define all core library headers and sources. As detail files
# are usually templated and though recompiled in each file, we
# have to compile full source for each target.
#

# Set names of binaries being created
SET(TARGET_DPL_EFL "lib${PROJECT_NAME}")
SET(TARGET_DPL_DB_EFL "lib${PROJECT_NAME}-db")
SET(TARGET_DPL_LOG_EFL "lib${PROJECT_NAME}-log")

macro(configure_and_install_pkg PKG_FILE)
    CONFIGURE_FILE(${PKG_FILE}.in ${PKG_FILE} @ONLY)
    INSTALL(FILES ${CMAKE_CURRENT_BINARY_DIR}/${PKG_FILE} DESTINATION lib/pkgconfig)
endmacro(configure_and_install_pkg)

ADD_SUBDIRECTORY(modules)
ADD_SUBDIRECTORY(build)

