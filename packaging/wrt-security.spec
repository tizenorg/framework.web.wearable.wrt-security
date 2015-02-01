Name:       wrt-security
Summary:    Wrt security daemon.
Version:    0.0.67
Release:    0
Group:      Security/Access Control
License:    Apache License, Version 2.0
URL:        N/A
Source0:    %{name}-%{version}.tar.gz
Source1001: %{name}.manifest
BuildRequires: cmake
BuildRequires: zip
BuildRequires: pkgconfig(dlog)
BuildRequires: pkgconfig(openssl)
BuildRequires: libattr-devel
BuildRequires: pkgconfig(libsmack)
BuildRequires: pkgconfig(dbus-1)
BuildRequires: pkgconfig(libpcrecpp)
BuildRequires: pkgconfig(icu-i18n)
BuildRequires: pkgconfig(libsoup-2.4)
BuildRequires: pkgconfig(xmlsec1)
BuildRequires: pkgconfig(capi-appfw-app-manager)
BuildRequires: pkgconfig(capi-appfw-package-manager)
BuildRequires: pkgconfig(privacy-manager-client)
BuildRequires: pkgconfig(privacy-manager-server)
BuildRequires: pkgconfig(dpl-wrt-dao-ro)
BuildRequires: pkgconfig(libsystemd-daemon)
BuildRequires: pkgconfig(sqlite3)
BuildRequires: pkgconfig(db-util)

BuildRequires: tizen-security-policy
Requires: tizen-security-policy
%{?systemd_requires}

%description
Wrt security daemon and utilities.

%package -n wrt-security-devel
Summary:    Header files for client libraries.
Group:      Development/Libraries
Requires:   wrt-security = %{version}-%{release}

%description -n wrt-security-devel
Developer files for client libraries.

#%package -n wrt-security-tests
#Summary: test for wrt-security
#Group: Development
#Requires: wrt-security = %{version}-%{release}

#%description -n wrt-security-tests
#Tests for wrt security.

%define enable_privacy_manager 1
%define enable_wrt_ocsp 0

%prep
%setup -q
cp %{SOURCE1001} .

%build
export LDFLAGS+="-Wl,--rpath=%{_libdir}"

%cmake . -DDPL_LOG="ON" \
        -DVERSION=%{version} \
        -DCMAKE_BUILD_TYPE=%{?build_type:%build_type} \
%if 0%{?enable_wrt_ocsp}
        -DENABLE_WRT_OCSP=1 \
%else
        -DENABLE_WRT_OCSP=0 \
%endif
%if 0%{?enable_privacy_manager}
	-DENABLE_PRIVACY_MANAGER=1 
%endif


make %{?jobs:-j%jobs}


%install
rm -rf %{buildroot}
mkdir -p %{buildroot}/usr/share/license
cp LICENSE %{buildroot}/usr/share/license/%{name}

%make_install
mkdir -p %{buildroot}%{_libdir}/systemd/system/multi-user.target.wants
mkdir -p %{buildroot}%{_libdir}/systemd/system/sockets.target.wants
ln -sf /usr/lib/systemd/system/wrt-security-daemon.service %{buildroot}%{_libdir}/systemd/system/multi-user.target.wants/wrt-security-daemon.service
ln -sf /usr/lib/systemd/system/wrt-security-daemon.socket  %{buildroot}%{_libdir}/systemd/system/sockets.target.wants/wrt-security-daemon.socket

%clean
rm -rf %{buildroot}

%post
if [ ! -e "/opt/dbspace/.ace.db" ]; then
    echo "This is new install of wrt-security"
    echo "Calling /usr/bin/wrt_security_create_clean_db.sh"
    /usr/bin/wrt_security_create_clean_db.sh
else
    # Find out old and new version of databases
    ACE_OLD_DB_VERSION=`sqlite3 /opt/dbspace/.ace.db ".tables" | grep "DB_VERSION_"`
    ACE_NEW_DB_VERSION=`cat /usr/share/wrt-engine/ace_db.sql | tr '[:blank:]' '\n' | grep DB_VERSION_`
    echo "OLD ace database version ${ACE_OLD_DB_VERSION}"
    echo "NEW ace database version ${ACE_NEW_DB_VERSION}"

    if [ ${ACE_OLD_DB_VERSION} -a ${ACE_NEW_DB_VERSION} ]
    then
        if [ ${ACE_NEW_DB_VERSION} = ${ACE_OLD_DB_VERSION} ]
        then
            echo "Equal database detected so db installation ignored"
        else
            echo "Calling /usr/bin/wrt_security_create_clean_db.sh"
            /usr/bin/wrt_security_create_clean_db.sh
        fi
    else
        echo "Calling /usr/bin/wrt_security_create_clean_db.sh"
        /usr/bin/wrt_security_create_clean_db.sh
    fi
fi

/sbin/ldconfig
echo "[WRT] wrt-security postinst done ..."

%postun
/sbin/ldconfig

%files -n wrt-security
%manifest %{name}.manifest
%defattr(-,root,root,-)
%attr(755,root,root) /usr/bin/wrt-security-daemon
%{_libdir}/libace*.so
%{_libdir}/libace*.so.*
%{_libdir}/libwrt-security-commons.so
%{_libdir}/libwrt-security-commons.so.*
%{_libdir}/libwrt-security-commons-log.so
%{_libdir}/libwrt-security-commons-log.so.*
%{_libdir}/libwrt-security-commons-db.so
%{_libdir}/libwrt-security-commons-db.so.*
%if 0%{?enable_wrt_ocsp}
%{_libdir}/libwrt-ocsp.so
%{_libdir}/libwrt-ocsp.so.*
%endif

/usr/share/wrt-engine/*
%attr(755,root,root) %{_bindir}/wrt_security_create_clean_db.sh
%attr(755,root,root) %{_bindir}/wrt_security_change_policy.sh
%attr(664,root,root) %{_datadir}/dbus-1/services/*
%attr(664,root,root) /usr/etc/ace/bondixml*
%attr(664,root,root) /usr/etc/ace/UnrestrictedPolicy.xml
%attr(664,root,root) /usr/etc/ace/WAC2.0Policy.xml
%{_datadir}/license/%{name}
%{_libdir}/systemd/*

%files -n wrt-security-devel
%manifest %{name}.manifest
%defattr(-,root,root,-)
%{_includedir}/wrt-security/*
%{_includedir}/ace/*
%{_includedir}/ace-client/*
%{_includedir}/ace-settings/*
%{_includedir}/ace-install/*
%{_includedir}/ace-common/*
%{_includedir}/ace-popup-validation/*
%{_libdir}/pkgconfig/security-client.pc
%{_libdir}/pkgconfig/security-communication-client.pc
%{_libdir}/pkgconfig/security-core.pc
%{_libdir}/pkgconfig/security-dao-ro.pc
%{_libdir}/pkgconfig/security-dao-rw.pc
%{_libdir}/pkgconfig/security-install.pc
%{_libdir}/pkgconfig/security-popup-validation.pc
%{_libdir}/pkgconfig/security-settings.pc
%{_libdir}/pkgconfig/security.pc
%{_libdir}/pkgconfig/wrt-security-commons.pc
%{_libdir}/pkgconfig/wrt-security-commons-log.pc
%{_libdir}/pkgconfig/wrt-security-commons-db.pc
%if 0%{?enable_wrt_ocsp}
%{_includedir}/wrt-ocsp/*
%{_libdir}/pkgconfig/security-wrt-ocsp.pc
%endif

#%files -n wrt-security-tests
#/usr/bin/wrt-test*
#/usr/bin/security-tests*
#/usr/etc/ace/policy*
#/usr/etc/ace/attr*
#/usr/etc/ace/general*
#/usr/etc/ace/inter*
#/usr/etc/ace/undefined*
#/usr/etc/ace/CMTest/*
#/usr/etc/ace/TizenPolicy-test.xml
#/usr/etc/ace/WAC2.0Policy-test.xml
#/opt/share/cert-svc/certs/code-signing/wac/root_cacert.pem
#/usr/etc/ace/ipc-tests-demo.xml
#/usr/etc/ace/ace-install-api-demo-policy.xml
#/usr/etc/ace/GeolocationPolicyTest*
#/opt/apps/widget/tests/geolocation/geolocationSecurityTest*
#/opt/apps/widget/tests/smack/smacksecurity*
#/usr/etc/ace/PermitAllPolicy.xml
