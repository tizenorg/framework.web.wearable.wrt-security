#!/bin/sh

#  wrt-plugins
#
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

test_dir=./

III=`pwd`
echo "KATALOG: $III"

cd $test_dir
rm -f geolocationSecurityTest1.wgt
rm -f geolocationSecurityTest2.wgt

# remove vim template files
rm -f `find . -name ".*.swp"`
rm -f `find . -name "*~"`

ORGPATH=`pwd`

cd geolocationSecurityTest
cp js/WAC2.0/TestGeolocationCallback1.js js/WAC2.0/TestGeolocationCallback.js
cp config1.xml config.xml
zip ../geolocationSecurityTest1.wgt -r *
cp js/WAC2.0/TestGeolocationCallback2.js js/WAC2.0/TestGeolocationCallback.js
cp config2.xml config.xml
zip ../geolocationSecurityTest2.wgt -r *

