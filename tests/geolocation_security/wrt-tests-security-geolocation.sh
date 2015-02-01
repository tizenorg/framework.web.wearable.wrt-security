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

wrt_reset_all.sh
if [ -e /usr/etc/ace/WAC2.0Policy.back ]; then
    echo "Policy backup already exists";
else
    mv /usr/etc/ace/WAC2.0Policy.xml /usr/etc/ace/WAC2.0Policy.back
fi

echo "Set up policy file"
cp /usr/etc/ace/GeolocationPolicyTest1 /usr/etc/ace/WAC2.0Policy.xml

echo "Reset policy settings in daemon"
wrt_security_change_policy.sh

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
    uid=`echo $1 | awk -F ": " '{print $2}'`
    if echo $uid | egrep -q '^[0-9]+$'; then
        echo "Second widget id: $uid"
        DPL_TEST_OUTPUT=text wrt-client -l $uid
    else
        echo "Result: $1"
    fi
    move_result "geolocation_$1"
}

echo "Widget installation"
result1=`wrt-installer -if /opt/apps/widget/tests/geolocation/geolocationSecurityTest1.wgt`
result2=`wrt-installer -if /opt/apps/widget/tests/geolocation/geolocationSecurityTest2.wgt`

run_widget "$result1"

echo "Set up policy file"
cp /usr/etc/ace/GeolocationPolicyTest2 /usr/etc/WAC2.0Policy.xml
echo "Reset policy setting in daemon."
wrt_security_change_policy.sh

run_widget "$result2"

echo "Restore original policy"
cp /usr/etc/ace/WAC2.0Policy.back /usr/etc/ace/WAC2.0Policy.xml
echo "Reset policy settings in daemon"
wrt_security_change_policy.sh


