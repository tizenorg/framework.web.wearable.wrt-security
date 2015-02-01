
SET(ETC_DIR ${PROJECT_SOURCE_DIR}/etc)

  INSTALL(FILES
    ${ETC_DIR}/wrt_security_create_clean_db.sh
    ${ETC_DIR}/wrt_security_change_policy.sh
    DESTINATION /usr/bin
    )

INSTALL(FILES
    ${ETC_DIR}/schema.xsd
    DESTINATION share/wrt-engine
    )
