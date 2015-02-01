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
 * @author  Tomasz Swierczek (t.swierczek@samsung.com)
 * @version 1.0
 * @brief   PolicyInformationPoint mockup class
 */
#ifndef WRT_MOCKUPS_POLICY_INFORMATION_POINT_MOCK_H_
#define WRT_MOCKUPS_POLICY_INFORMATION_POINT_MOCK_H_

class PolicyInformationPoint {
  public:
    PolicyInformationPoint(void*, void*, void*){};
    virtual ~PolicyInformationPoint(){};
    void getAttributesValues(void*, void*){};

};

#endif // WRT_MOCKUPS_POLICY_INFORMATION_POINT_MOCK_H_
