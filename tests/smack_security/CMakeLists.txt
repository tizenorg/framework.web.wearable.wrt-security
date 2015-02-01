ADD_CUSTOM_COMMAND(OUTPUT
    smacksecurity0.wgt
    smacksecurity1.wgt
    smacksecurity2.wgt
    smacksecurity3.wgt
    smacksecurity4.wgt
    smacksecurity5.wgt
    smacksecurity6.wgt
    COMMAND ${PROJECT_SOURCE_DIR}/tests/smack_security/createSmackSecurityTest.sh
#    COMMAND mv ${PROJECT_SOURCE_DIR}/tests/smack_security/*wgt ${CMAKE_CURRENT_BINARY_DIR}
    WORKING_DIRECTORY ${PROJECT_SOURCE_DIR}/tests/smack_security/ 
    DEPENDS createSmackSecurityTest.sh
)

ADD_CUSTOM_TARGET(WTF2 ALL
    DEPENDS
        smacksecurity0.wgt
        smacksecurity1.wgt
        smacksecurity2.wgt
        smacksecurity3.wgt
        smacksecurity4.wgt
        smacksecurity5.wgt
        smacksecurity6.wgt
    )

INSTALL(FILES
    ${PROJECT_SOURCE_DIR}/tests/smack_security/PermitAllPolicy.xml
    DESTINATION /usr/etc/ace
    PERMISSIONS OWNER_READ
                OWNER_WRITE
                GROUP_READ
                WORLD_READ
    )


INSTALL(FILES
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity0.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity1.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity2.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity3.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity4.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity5.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity6.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity7.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity8.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity9.wgt
    ${CMAKE_CURRENT_BINARY_DIR}/smacksecurity10.wgt
    DESTINATION /opt/apps/widget/tests/smack/
    PERMISSIONS OWNER_READ
                OWNER_WRITE
                GROUP_READ
                WORLD_READ
    )

INSTALL(FILES
    ${PROJECT_SOURCE_DIR}/tests/smack_security/wrt-tests-security-smack.sh
    DESTINATION bin
    PERMISSIONS OWNER_READ
                OWNER_WRITE
                OWNER_EXECUTE
                GROUP_READ
                GROUP_EXECUTE
                WORLD_READ
                WORLD_EXECUTE
    )
