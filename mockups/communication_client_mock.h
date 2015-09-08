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
/**
 * @author      Tomasz Swierczek (t.swierczek@samsung.com)
 * @version     1.0
 * @brief       DBus client mockup class.
 */

#ifndef WRT_MOCKUPS_DBUS_CLIENT_MOCK_H_
#define WRT_MOCKUPS_DBUS_CLIENT_MOCK_H_

#include <dpl/exception.h>
#include <dpl/assert.h>

#include <string>
#include <vector>
#include "ace_server_api.h"
#include "popup_response_server_api.h"

namespace WrtSecurity {
namespace Communication {

/*
 * This class is a mockup implementation for some methods called
 * with DBus::Client.
 */

class Client
{

  public:
    class Exception
    {
      public:
        DECLARE_EXCEPTION_TYPE(DPL::Exception, Base)
        DECLARE_EXCEPTION_TYPE(Base, SecurityCommunicationClientException)
    };

    Client(std::string /*interfaceName*/)
    {
    }

    // ACE server api check access method
    void call(const std::string &methodName,
              int,
              const std::string&,
              const std::string&,
              const std::vector<std::string>&,
              const std::vector<std::string>&,
              const std::string&,
              int* outArg)
    {
        if (methodName == WrtSecurity::AceServerApi::CHECK_ACCESS_METHOD()) {
            Assert(NULL != outArg);
            *outArg = m_checkAccessResult;
            return;
        }
    }

    void call(const std::string &methodName,
                  bool,
                  int,
                  int,
                  const std::string&,
                  const std::string&,
                  const std::vector<std::string>&,
                  const std::vector<std::string>&,
                  const std::string&,
                  bool* outArg)
    {
        if (methodName == WrtSecurity::PopupServerApi::VALIDATION_METHOD()) {
            Assert(NULL != outArg);
            *outArg = m_validationResult;
            return;
        }
    }


    ~Client()
    {
    }

    static void setCheckAccessResult(int value)
    {
        m_checkAccessResult = value;
    }

    static void setValidationResult(bool value)
    {
        m_validationResult = value;
    }

  private:
    static int m_checkAccessResult;
    static bool m_validationResult;
};

} // namespace DBus
}

#endif // WRT_MOCKUPS_DBUS_CLIENT_MOCK_H_
