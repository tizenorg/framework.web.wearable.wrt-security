#!/bin/sh

#####################################################################
# Copyright (c) 2012 Samsung Electronics Co., Ltd All Rights Reserved
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
#####################################################################

#####################################################################
#   author: pawel.polawski@partner.samsung.com
#####################################################################

#testing internet access and date on the target
error(){
    echo "[ERROR]" $1
    exit 1
}

check_network_access(){
  echo "--- Checking for network access..."
  ping -c 2 www.google.com > /dev/null || error 'Network not accessible'
  echo 'Network access OK'
}

check_date(){
  echo "--- Checkig date..."
  date
  openssl verify -CAfile /opt/apps/widget/tests/vcore_certs/cacert.pem   /opt/apps/widget/tests/vcore_certs/respcert.pem 2>/dev/null | grep OK 1>/dev/null || error 'Date not set properly'
  echo 'Date OK'
}

kill_daemons(){
    #minimum time after kill should be at lest 2 seconds
    echo "--- Killing daemons"
    wrt_security_create_clean_db.sh
    pkill -9 security-ser
    sleep 3
    pkill -9 wrt-security
    sleep 3
    echo "--- Done"
}

start_daemons(){
    echo "--- Starting daemons"
    sleep 1
    security-server &
    sleep 1
    wrt-security-daemon &
    sleep 1
    echo "--- Done"
}


echo "### Starting tests ######################################################"

case $1 in

"ace")
    echo "========================================================================="
    echo "ACE"
    echo
    #environment setup
    cp /usr/etc/ace/WAC2.0Policy.xml /usr/etc/ace/WAC2.0Policy.xml.bk
    cp /usr/etc/ace/TizenPolicy.xml /usr/etc/ace/TizenPolicy.xml.bk
    cp /usr/etc/ace/WAC2.0Policy-test.xml /usr/etc/ace/WAC2.0Policy.xml
    cp /usr/etc/ace/TizenPolicy-test.xml /usr/etc/ace/TizenPolicy.xml
    kill_daemons
    #test binary execution
    wrt-tests-ace $2 $3
    ;;

"ace-client")
    echo "========================================================================="
    echo "ACE-CLIENT"
    echo
    #environment setup
    cp /usr/etc/ace/WAC2.0Policy.xml.bk /usr/etc/ace/WAC2.0Policy.xml
    cp /usr/etc/ace/TizenPolicy.xml.bk /usr/etc/ace/TizenPolicy.xml
    kill_daemons
    #test binary execution
    wrt-tests-ace-client $2 $3
    ;;

"ace-settings")
    echo "========================================================================="
    echo "ACE-SETTINGS"
    echo
    #environment setup
    kill_daemons
    #test binary execution
    wrt-tests-ace-settings $2 $3
    ;;

"ace-install")
    echo "========================================================================="
    echo "ACE-INSTALL"
    echo
    #environment setup
    cp /usr/etc/ace/WAC2.0Policy.xml /usr/etc/ace/WAC2.0Policy.xml.bk
    cp /usr/etc/ace/ace-install-api-demo-policy.xml /usr/etc/ace/WAC2.0Policy.xml
    wrt_security_change_policy.sh
    kill_daemons
    #test binary execution
    wrt-tests-ace-install $2 $3
    ;;

"security-daemon")
    echo "========================================================================="
    echo "SECURITY-DAEMON"
    echo
    #environment setup
    cp /usr/etc/ace/WAC2.0Policy.xml.bk /usr/etc/ace/WAC2.0Policy.xml
    cp /usr/etc/ace/WAC2.0Policy.xml /usr/etc/ace/WAC2.0Policy.xml.bk
    cp /usr/etc/ace/ipc-tests-demo.xml /usr/etc/ace/WAC2.0Policy.xml
    wrt_security_change_policy.sh
    kill_daemons
    #test binary execution
    wrt-tests-security-daemon $2 $3
    ;;

*)
    echo "Correct using:"
    echo "    security_test.sh <module> <args_for_module>"
    echo
    echo "modules: ace, ace-client, ace-settings, ace-install, security-daemon"
    ;;

esac

#clean up
kill_daemons

echo "### Tests done ##########################################################"
