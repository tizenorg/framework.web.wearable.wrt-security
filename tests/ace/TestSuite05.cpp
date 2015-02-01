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
/*
 * @file    TestSuite05.cpp
 * @author  unknown
 * @version 1.0
 * @brief   Test cases for Attribute class.
 */

#include <iostream>
#include <list>
#include <set>
#include <string>
#include <memory>

#include <dpl/test/test_runner.h>

#include <ace/Attribute.h>
#include <ace-dao-ro/BaseAttribute.h>

#define TESTSUITE05(n) \
RUNNER_TEST(ts05_attr_tests_ ## n)

class AT : public Attribute {
public:
    AT(std::string nm)
      : Attribute(nm)
    {}

    static std::string* uriAuthorityStatic(const std::string *input) {
        AT at("Micky");
        return at.uriAuthority(input);
    }

    static std::string* uriHostStatic(const std::string *input) {
        AT at("Pluto");
        return at.uriHost(input);
    }

    static std::string* uriSchemeStatic(const std::string *input) {
        AT at("Donald");
        return at.uriScheme(input);
    }

    static std::string* uriSchemeAuthorityStatic(const std::string *input) {
        AT at("Winnie the Pooh");
        return at.uriSchemeAuthority(input);
    }

    static std::string* uriPathStatic(const std::string *input) {
        AT at("Hannibal");
        return at.uriPath(input);
    }

    static bool markTest(){
        bool result = true;
        for(int i =0; i<128; ++i){
            if( i == '-' || i == '_' || i == '.'|| i == '!'|| i == '~' || i == '*' || i == '\'' || i == ')' || i == '(' ){
                if (!mark[i]){
                    result = false;
                    break;
                }
            }
            else{
                if(mark[i]){
                    result =false;
                    break;
                }
            }
        }
        return result;
    }

    static bool digitTest(){
        bool result = true;
        for(int i =0; i<128; ++i){
            if( i > 47 && i < 58 ){
                if (!digit[i]){
                    result = false;
                    break;
                }
            }
            else{
                if(digit[i]){
                    result =false;
                    break;
                }
            }
        }
        return result;
    }

    static bool alphaTest(){
        bool result = true;
        for(int i =0; i<128; ++i){
            if( ( i>64 && i<91 ) || ( i>96 && i<123  ) ) {
                if (!alpha[i]){
                    result = false;
                    break;
                }
            }
            else{
                if(alpha[i]){
                    result =false;
                    break;
                }
            }
        }
        return result;
    }

    static bool isEscapedStatic(const char esc[3]) {
        AT at("Swinka");
        return at.isEscaped(esc);
    }
};

bool assertEqual(const std::string * actual, const char * intended) {
    if (actual == NULL || intended == NULL) {
        if (intended == NULL && actual == NULL) {
            return true;
        }
        else {
            return false;
        }
    }

    std::string temp(intended);

    if (temp == *actual) {
        return true;
    }
    else {
        return false;
    }
}

bool assertTrue(bool condition){
    return condition;
}

bool assertFalse(bool condition){
    return !condition;
}

RUNNER_TEST_GROUP_INIT(ACE_TEST_SUITE_05)

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://www.wp.pl" argument
 * expect: "www.wp.pl"
 */
TESTSUITE05(01_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://www.wp.pl");
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "www.wp.pl"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://authority?path/asdf" argument
 * expect: "authority"
 */
TESTSUITE05(02_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://authority?path/asdf");
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "authority"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "abcd" argument
 * expect: ""
 */
TESTSUITE05(03_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("abcd"); //This should be interpreted as schema
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ""));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://authority/asdf" argument
 * expect: "authority"
 */
TESTSUITE05(04_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://authority/asdf");
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "authority"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://user@host:20?ds" argument
 * expect: "user@host:20"
 */
TESTSUITE05(05_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://user@host:20?ds");
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "user@host:20"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://hostname:23" argument
 * expect: "hostname:23"
 */
TESTSUITE05(06_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://hostname:23");
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "hostname:23"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://hostname:23" argument
 * expect: "hostname:23"
 */
TESTSUITE05(07_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://user@host:port");
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "user@host:port"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://1user@host:port" argument
 * expect: "1user@host:port"
 */
TESTSUITE05(08_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://1user@host:port"); //This is a VALID URI
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "1user@host:port"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://abc%30" argument
 * expect: "abc%30"
 */
TESTSUITE05(09_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://abc%30"); //This is not a valid uri
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "abc%30"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http:///asd" argument (not a valid URI)
 * expect: ""
 */
TESTSUITE05(10_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http:///asd"); //This is not a valid uri
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ""));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://?asd" argument (not a valid URI)
 * expect: ""
 */
TESTSUITE05(11_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://?asd"); //This is not a valid uri
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ""));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://%34%56%67%ab" argument
 * expect: "%34%56%67%ab"
 */
TESTSUITE05(12_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://%34%56%67%ab");
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "%34%56%67%ab"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://<>" argument (not a valid URI)
 * expect: NULL
 */
TESTSUITE05(13_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://<>"); //This is not a valid uri
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), NULL));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriAuthority method of Attribute class on
 * "http://\\/" argument (not a valid URI)
 * expect: NULL
 */
TESTSUITE05(14_uriAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://\\/"); //This is not a valid uri
    outcome.reset(AT::uriAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), NULL));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "http://user@host:23" argument
 * expect: "host"
 */
TESTSUITE05(15_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("http://user@host:23");
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "host"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "http://user@host:name" argument (not a valid URI)
 * expect: ""
 */
TESTSUITE05(16_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("http://user@host:name"); //This is not a valid uri
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ""));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "http::::" argument (not a valid URI)
 * expect: ""
 */
TESTSUITE05(17_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("http::::"); //This is a valid uri
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ""));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "..%%%." argument (not a valid URI)
 * expect: NULL
 */
TESTSUITE05(18_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("..%%%."); //This is not a valid uri
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), NULL));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "ftp://abds.eu/fda" argument
 * expect: "abds.eu"
 */
TESTSUITE05(19_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp://abds.eu/fda");
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "abds.eu"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "abs%14ccc" argument
 * expect: ""
 */
TESTSUITE05(20_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("abs%14ccc");
    //This is a valid uri because it's interpreted as a path not a host
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ""));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "http://abc@123.2.23.213:982" argument
 * expect: "123.2.23.213"
 */
TESTSUITE05(21_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("http://abc@123.2.23.213:982");
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "123.2.23.213"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "http://abc@1233.2.23.213:982" argument
 * expect: ""
 */
TESTSUITE05(22_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("http://abc@1233.2.23.213:982");
    //Hostname is invalid, but uri is valid
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ""));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "http://ab%23c@host" argument
 * expect: "host"
 */
TESTSUITE05(23_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("http://ab%23c@host"); //Valid escaped characters
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "host"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "http://ab%23c@host%34" argument
 * expect: ""
 */
TESTSUITE05(24_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("http://ab%23c@host%34"); //Invalid escaped characters in hostname
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ""));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "http://ab%GGc@host" argument
 * expect: NULL
 */
TESTSUITE05(25_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("http://ab%GGc@host"); //Wrong character %
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), NULL));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriHost method of Attribute class on
 * "http://www.example.pl" argument
 * expect: "www.example.pl"
 */
TESTSUITE05(26_uriHost){
    std::unique_ptr<std::string> outcome;
    std::string query("http://www.example.pl");
    outcome.reset(AT::uriHostStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "www.example.pl"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriScheme method of Attribute class on
 * "http://host" argument
 * expect: "http"
 */
TESTSUITE05(27_uriScheme){
    std::unique_ptr<std::string> outcome;
    std::string query("http://host");
    outcome.reset(AT::uriSchemeStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "http"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriScheme method of Attribute class on
 * "1http://host" argument
 * expect: NULL
 */
TESTSUITE05(28_uriScheme){
    std::unique_ptr<std::string> outcome;
    //Wrong character '1' in scheme , it's not an URI because two slashes are not acceptable
    //in any other place than in separation between scheme and pat
    std::string query("1http://host");
    outcome.reset(AT::uriSchemeStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), NULL));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriScheme method of Attribute class on
 * "ftp+a-fdf.ads://host" argument
 * expect: "ftp+a-fdf.ads"
 */
TESTSUITE05(29_uriScheme){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp+a-fdf.ads://host");
    outcome.reset(AT::uriSchemeStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "ftp+a-fdf.ads"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriScheme method of Attribute class on
 * "+++://host" argument
 * expect: NULL
 */
TESTSUITE05(30_uriScheme){
    std::unique_ptr<std::string> outcome;
    //Scheme cannot start with plus, it's not an URI because two slashes are not acceptable
    //in any other place than in separation between scheme and path
    std::string query("+++://host");
    outcome.reset(AT::uriSchemeStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), NULL));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriScheme method of Attribute class on
 * "aaaac" argument
 * expect: ""
 */
TESTSUITE05(31_uriScheme){
    std::unique_ptr<std::string> outcome;
    std::string query("aaaac"); //It's a path not a scheme'a
    outcome.reset(AT::uriSchemeStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ""));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriScheme method of Attribute class on
 * "ftpa%34fdfads://host" argument
 * expect: NULL
 */
TESTSUITE05(32_uriScheme){
    std::unique_ptr<std::string> outcome;
    //no escaped characters in schema, it's not an URI because two slashes are not acceptable
    //in any other place than in separation between scheme and path
    std::string query("ftpa%34fdfads://host");
    outcome.reset(AT::uriSchemeStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), NULL));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriScheme method of Attribute class on
 * "meaninglessstring://host%34" argument
 * expect: "meaninglessstring"
 */
TESTSUITE05(33_uriScheme){
    std::unique_ptr<std::string> outcome;
    //no escaped characters in schema, it's not an URI because two slashes are not acceptable
    //in any other place than in separation between scheme and path
    std::string query("meaninglessstring://host%34");
    outcome.reset(AT::uriSchemeStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "meaninglessstring"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriScheme method of Attribute class on
 * "meaninglessstring2://" argument
 * expect: "meaninglessstring2"
 */
TESTSUITE05(34_uriScheme){
    std::unique_ptr<std::string> outcome;
    std::string query("meaninglessstring2://");
    outcome.reset(AT::uriSchemeStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "meaninglessstring2"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriScheme method of Attribute class on
 * "http://www.samsung.com/ace/bondi#5" argument
 * expect: "http"
 */
TESTSUITE05(35_uriScheme){
    std::unique_ptr<std::string> outcome;
    std::string query("http://www.samsung.com/ace/bondi#5");
    outcome.reset(AT::uriSchemeStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "http"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriScheme method of Attribute class on
 * "www.samsung.com" argument
 * expect: ""
 */
TESTSUITE05(36_uriScheme){
    std::unique_ptr<std::string> outcome;
    std::string query("www.samsung.com");
    outcome.reset(AT::uriSchemeStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ""));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriSchemeAuthority method of Attribute class on
 * "http://www.samsung.com" argument
 * expect: "http://www.samsung.com"
 */
TESTSUITE05(37_uriSchemeAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://www.samsung.com");
    outcome.reset(AT::uriSchemeAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "http://www.samsung.com"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriSchemeAuthority method of Attribute class on
 * "ftp23://www.samsung.com/avc%23" argument
 * expect: "ftp23://www.samsung.com"
 */
TESTSUITE05(38_uriSchemeAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp23://www.samsung.com/avc%23");
    outcome.reset(AT::uriSchemeAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "ftp23://www.samsung.com"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriSchemeAuthority method of Attribute class on
 * "ftp++://anonymous@hostname:12/avc%23" argument
 * expect: "ftp++://anonymous@hostname:12"
 */
TESTSUITE05(39_uriSchemeAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp++://anonymous@hostname:12/avc%23");
    outcome.reset(AT::uriSchemeAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "ftp++://anonymous@hostname:12"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriSchemeAuthority method of Attribute class on
 * "32ftp://anonymous@hostname:12/avc%23" argument
 * expect: NULL
 */
TESTSUITE05(40_uriSchemeAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("32ftp://anonymous@hostname:12/avc%23");
    outcome.reset(AT::uriSchemeAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), NULL));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriSchemeAuthority method of Attribute class on
 * "http://aaabbb?acd" argument
 * expect: "http://aaabbb"
 */
TESTSUITE05(41_uriSchemeAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://aaabbb?acd");
    outcome.reset(AT::uriSchemeAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "http://aaabbb"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriSchemeAuthority method of Attribute class on
 * "http://aaabbb/acd;sdf;sdf" argument
 * expect: "http://aaabbb"
 */
TESTSUITE05(42_uriSchemeAuthority){
    std::unique_ptr<std::string> outcome;
    std::string query("http://aaabbb/acd;sdf;sdf");
    outcome.reset(AT::uriSchemeAuthorityStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "http://aaabbb"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriPath method of Attribute class on
 * "ftp://authority//invalidpath" argument
 * expect: NULL
 */
TESTSUITE05(43_uriPath){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp://authority//invalidpath");
    outcome.reset(AT::uriPathStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), NULL));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriPath method of Attribute class on
 * "ftp://authority/validpath" argument
 * expect: "validpath"
 */
TESTSUITE05(44_uriPath){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp://authority/validpath");
    outcome.reset(AT::uriPathStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "validpath"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriPath method of Attribute class on
 * "ftp://authority/validpath;param;param" argument
 * expect: "validpath;param;param"
 */
TESTSUITE05(45_uriPath){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp://authority/validpath;param;param");
    outcome.reset(AT::uriPathStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "validpath;param;param"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriPath method of Attribute class on
 * "ftp://authority/validpath;param;param?query" argument
 * expect: "validpath;param;param"
 */
TESTSUITE05(46_uriPath){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp://authority/validpath;param;param?query");
    outcome.reset(AT::uriPathStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "validpath;param;param"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriPath method of Attribute class on
 * "ftp://authority/validpath;?param;param?query" argument
 * expect: "validpath;"
 */
TESTSUITE05(47_uriPath){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp://authority/validpath;?param;param?query");
    outcome.reset(AT::uriPathStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "validpath;"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriPath method of Attribute class on
 * "ftp://authority/validpath;param?;param?query" argument
 * expect: "validpath;param"
 */
TESTSUITE05(48_uriPath){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp://authority/validpath;param?;param?query");
    outcome.reset(AT::uriPathStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "validpath;param"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriPath method of Attribute class on
 * "ftp://authority/valid:path?query" argument
 * expect: "valid:path"
 */
TESTSUITE05(49_uriPath){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp://authority/valid:path?query");
    outcome.reset(AT::uriPathStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "valid:path"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriPath method of Attribute class on
 * "ftp://authority/:::" argument
 * expect: ":::"
 */
TESTSUITE05(50_uriPath){
    std::unique_ptr<std::string> outcome;
    std::string query("ftp://authority/:::");
    outcome.reset(AT::uriPathStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), ":::"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriPath method of Attribute class on
 * "/path1/path2?abc#fragment" argument
 * expect: "path1/path2"
 */
TESTSUITE05(51_uriPath){
    std::unique_ptr<std::string> outcome;
    std::string query("/path1/path2?abc#fragment");
    outcome.reset(AT::uriPathStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "path1/path2"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing uriPath method of Attribute class on
 * "http://www.samsung.com/normalpath/path2?query" argument
 * expect: "normalpath/path2"
 */
TESTSUITE05(52_uriPath){
    std::unique_ptr<std::string> outcome;
    std::string query("http://www.samsung.com/normalpath/path2?query");
    outcome.reset(AT::uriPathStatic(&query));
    RUNNER_ASSERT(assertEqual(outcome.get(), "normalpath/path2"));

}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing if "mark" static table in Attribute class contains
 * "true" on indices for characters -_.!~*')(
 * expect: true
 */
TESTSUITE05(53_markTest){
    RUNNER_ASSERT(AT::markTest());
}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing if "digit" static table in Attribute class contains
 * "true" on indices for characters that are digits
 * expect: true
 */
TESTSUITE05(54_digitTest){
    RUNNER_ASSERT(AT::digitTest());
}

/*
 * author: unknown
 * test: ACE Engine
 * description: testing if "digit" static table in Attribute class contains
 * "true" on indices for characters that are real characters (letters)
 * expect: true
 */
TESTSUITE05(55_alphaTest){
    RUNNER_ASSERT(AT::alphaTest());
}

/*
 * author: unknown
 * test: ACE Engine
 * description: checking Attribute isEscapedStatic method of Attribute class
 * expect: true, true, false, false, false, false, true, true
 */
TESTSUITE05(56_escapedTest){
    const char * query = "%23";
    RUNNER_ASSERT(assertTrue(AT::isEscapedStatic(query)));
    query = "%ab";
    RUNNER_ASSERT(assertTrue(AT::isEscapedStatic(query)));

    query = "%a";
    RUNNER_ASSERT(assertFalse(AT::isEscapedStatic(query)));

    query = "%rw";
    RUNNER_ASSERT(assertFalse(AT::isEscapedStatic(query)));

    query = NULL;
    RUNNER_ASSERT(assertFalse(AT::isEscapedStatic(query)));

    query = "abc";
    RUNNER_ASSERT(assertFalse(AT::isEscapedStatic(query)));

    query = "%bc";
    RUNNER_ASSERT(assertTrue(AT::isEscapedStatic(query)));

    query = "%DF";
    RUNNER_ASSERT(assertTrue(AT::isEscapedStatic(query)));
}

