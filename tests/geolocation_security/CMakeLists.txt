ADD_CUSTOM_COMMAND(OUTPUT
    geolocationSecurityTest1.wgt
    geolocationSecurityTest2.wgt
    COMMAND ${PROJECT_SOURCE_DIR}/tests/geolocation_security/createGeolocationSecurityTest.sh
#    COMMAND mv ${PROJECT_SOURCE_DIR}/tests/geolocation_security/*wgt ${CMAKE_CURRENT_BINARY_DIR}
    WORKING_DIRECTORY ${PROJECT_SOURCE_DIR}/tests/geolocation_security/ 
    DEPENDS createGeolocationSecurityTest.sh
)

ADD_CUSTOM_TARGET(WTF ALL DEPENDS geolocationSecurityTest1.wgt geolocationSecurityTest2.wgt)

INSTALL(FILES
    ${PROJECT_SOURCE_DIR}/tests/geolocation_security/GeolocationPolicyTest1
    ${PROJECT_SOURCE_DIR}/tests/geolocation_security/GeolocationPolicyTest2
    DESTINATION /usr/etc/ace
    PERMISSIONS OWNER_READ
                OWNER_WRITE
                GROUP_READ
                WORLD_READ
    )


INSTALL(FILES
    ${CMAKE_CURRENT_BINARY_DIR}/geolocationSecurityTest1.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/geolocationSecurityTest2.wgt
    DESTINATION /opt/apps/widget/tests/geolocation
    PERMISSIONS OWNER_READ
                OWNER_WRITE
                GROUP_READ
                WORLD_READ
    )

INSTALL(FILES
    ${PROJECT_SOURCE_DIR}/tests/geolocation_security/wrt-tests-security-geolocation.sh
    DESTINATION bin
    PERMISSIONS OWNER_READ
                OWNER_WRITE
                OWNER_EXECUTE
                GROUP_READ
                GROUP_EXECUTE
                WORLD_READ
                WORLD_EXECUTE
    )
