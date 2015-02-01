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
rm -f smacksecurity*.wgt

# remove vim template files
rm -f `find . -name ".*.swp"`
rm -f `find . -name "*~"`

ORGPATH=`pwd`

cd smackSecurityTest1
zip ../smacksecurity0.wgt -r *
for i in 1 2 3 4 5 6 7 8 9 10
do
    cd $ORGPATH/smackSecurityTest2
    cp config$i.xml config.xml
    cp js/include$i.js js/include.js
    zip ../smacksecurity$i.wgt -r *
done

