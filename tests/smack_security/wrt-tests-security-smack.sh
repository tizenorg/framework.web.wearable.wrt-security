#/bin/sh

TEST_RESULT_DIR=
TEST_TYPE="text"

while getopts "o:d:" opts
do
    case "$opts" in
        d)  echo "Output directory: $OPTARG"
            TEST_RESULT_DIR="$OPTARG" ;;
        o)  echo "Output type: $OPTARG"
            TEST_TYPE="$OPTARG" ;;
        [?])echo "Usage $0 [-o output_type] [-d output_directory]"
            exit 1;;
    esac
done

result=`rpm -qa | grep wrt-extra`
if [ -z "$result" ]; then
    echo "You must install wrt-extra before run this script";
    exit;
fi

export DPL_USE_OLD_STYLE_LOGS=0
export DPL_TEST_OUTPUT="$TEST_TYPE"

function task_info(){
    text="$1"
    status="$2"
    if [ $status -eq 0 ]; then
        echo -e "\033[32m$text    \033[0m [ \033[32mDONE\033[0m ] ";
    else
        echo -e "\033[32m$text    \033[0m [ \033[31mFAIL\033[0m ] ";
    fi
}

function error_msg(){
    text="$1"
    echo -e "\031[32m$text\033[0m] ";
}

function set_up_env(){
    wrt_reset_all.sh
    if [ -e /usr/etc/ace/WAC2.0Policy.back ]; then
        error_msg "Policy backup already exists";
    else
        mv /usr/etc/ace/WAC2.0Policy.xml /usr/etc/ace/WAC2.0Policy.back
        task_info "Create policy backup" $?
    fi

    cp /usr/etc/ace/PermitAllPolicy.xml /usr/etc/ace/WAC2.0Policy.xml
    task_info "Set up test policy file" $?

    wrt_security_change_policy.sh
    task_info "Reset policy settings in daemon" $?
}

function set_up_nodevcap_env(){
    if [ -d /tmp/smack.back ]; then
        error_msg "Backup directory with smack files already exists.";
    else
        mkdir -p /tmp/smack.back
        cp /usr/share/privilege-control/*.smack /tmp/smack.back/
        task_info "Create smack files backup" $?
        echo -n > /usr/share/privilege-control/accelerometer.smack
        echo -n > /usr/share/privilege-control/filesystem.read.smack
        echo -n > /usr/share/privilege-control/filesystem.write.smack
        echo -n > /usr/share/privilege-control/orientation.smack
        echo -n > /usr/share/privilege-control/pim.calendar.read.smack
        echo -n > /usr/share/privilege-control/pim.calendar.write.smack
        echo -n > /usr/share/privilege-control/pim.contact.read.smack
        echo -n > /usr/share/privilege-control/pim.contact.write.smack
        echo -n > /usr/share/privilege-control/pim.task.read.smack
        echo -n > /usr/share/privilege-control/pim.task.write.smack
        task_info "Replace smack files with empty one..." $?
    fi
}

function move_result(){
    source=`pwd`
    echo "Function move_resutl. Source: $source"
    if [ "x$TEST_RESULT_DIR" = "x" ]; then
        return
    fi

    if [ "x$TEST_TYPE" != "x" ]; then
        echo "Move: mv results.xml $TEST_RESULT_DIR/$1.$TEST_TYPE"
        mv results.xml "$TEST_RESULT_DIR/$1.$TEST_TYPE"
    fi
}

function run_widget(){
    #cut -d: -f2
    uid=`echo $1 | awk -F ": " '{print $2}'`
    if echo $uid | egrep -q '^[0-9]+$'; then
        echo "First widget id: $uid"
        wrt-client -l $uid
        result_code=$?
        echo "wrt-client exit with code $result_code";
    else
        echo "Result $1"
    fi
    move_result "smack_$uid"
}

function run_widget_nosmack(){
    #cut -d: -f2
    uid=`echo $1 | awk -F ": " '{print $2}'`
    if echo $uid | egrep -q '^[0-9]+$'; then
        echo "First widget id: $uid"
        wrt-client -l $uid
        result_code=$?
        echo "wrt-client exit with code $result_code";
        if [ $result_code -eq 139 ]; then
            echo "Widget ended with crash (as expected)             [  OK  ]";
        fi
    else
        echo "Result $1"
    fi
    move_result "nosmack_$uid"
}

function restore_env(){
    cp /usr/etc/ace/WAC2.0Policy.back /usr/etc/ace/WAC2.0Policy.xml && rm /usr/etc/ace/WAC2.0Policy.back
    task_info "Restore policy file and remove backup copy" $?
    cp /tmp/smack.back/* /usr/share/privilege-control/ && rm /tmp/smack.back -rf
    task_info "Restore smack file and remove backup copy" $?
    wrt_security_change_policy.sh
    task_info "Reset policy settings in daemon" $?
}

if [ "x$1" = "xfix" ]; then
    echo "I will try to restore evironment";
    restore_env
    exit 0;
fi

set_up_env

echo "Widget installation"
result0=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity0.wgt`
task_info "Widget smacksecurity0.wgt installed" $?
result1=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity1.wgt`
task_info "Widget smacksecurity1.wgt installed" $?
result2=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity2.wgt`
task_info "Widget smacksecurity2.wgt installed" $?
result3=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity3.wgt`
task_info "Widget smacksecurity3.wgt installed" $?
result4=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity4.wgt`
task_info "Widget smacksecurity4.wgt installed" $?
result5=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity5.wgt`
task_info "Widget smacksecurity5.wgt installed" $?
result6=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity6.wgt`
task_info "Widget smacksecurity6.wgt installed" $?
result7=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity7.wgt`
task_info "Widget smacksecurity7.wgt installed" $?
result8=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity8.wgt`
task_info "Widget smacksecurity8.wgt installed" $?
result9=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity9.wgt`
task_info "Widget smacksecurity9.wgt installed" $?
result10=`wrt-installer -if /opt/apps/widget/tests/smack/smacksecurity10.wgt`
task_info "Widget smacksecurity10.wgt installed" $?

echo "**************************************************"
echo "**************** Start tests *********************"
echo "**************************************************"

run_widget "$result0"

set_up_nodevcap_env

run_widget_nosmack "$result1"
run_widget_nosmack "$result2"
run_widget_nosmack "$result3"
run_widget_nosmack "$result4"
run_widget_nosmack "$result5"
run_widget_nosmack "$result6"
run_widget_nosmack "$result7"
run_widget_nosmack "$result8"
run_widget_nosmack "$result9"
run_widget_nosmack "$result10"

restore_env
