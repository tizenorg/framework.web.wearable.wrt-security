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
 * @file    TestSuite04.cpp
 * @author  unknown
 * @version 1.0
 * @brief   Test cases for Combiner.
 */

#include <list>
#include <string>
#include <memory>

#include <dpl/log/log.h>
#include <dpl/test/test_runner.h>

#include <ace/CombinerImpl.h>
#include <ace/PolicySet.h>
#include <ace/Effect.h>

#define TESTSUITE04(n) \
RUNNER_TEST(ts04_combiner_tests_ ## n)

bool assertEffectEqual(Effect actual, Effect expected){
    return (actual == expected);
}

class WTF : public CombinerImpl{
public:
    // the evaluation functions should be static and public
    // but they are protected methods!
    Effect denyOverrides(std::list<ExtendedEffect> &lst){
        return CombinerImpl::denyOverrides(lst).getEffect();
    }
    Effect permitOverrides(std::list<ExtendedEffect> &lst){
        return CombinerImpl::permitOverrides(lst).getEffect();
    }
    Effect firstApplicable(std::list<ExtendedEffect> &lst){
        return CombinerImpl::firstApplicable(lst).getEffect();
    }
    Effect firstMatchingTarget(std::list<ExtendedEffect> &lst){
        return CombinerImpl::firstMatchingTarget(lst).getEffect();
    }
};

Effect denyOverridesTest(std::list<ExtendedEffect> &lst) {
    WTF impl;
    return impl.denyOverrides(lst);
}

Effect permitOverridesTest(std::list<ExtendedEffect> &lst) {
    WTF impl;
    return impl.permitOverrides(lst);
}

Effect firstApplicableTest(std::list<ExtendedEffect> &lst) {
    WTF impl;
    return impl.firstApplicable(lst);
}

Effect firstMatchingTargetTest(std::list<ExtendedEffect> &lst) {
    WTF impl;
    return impl.firstMatchingTarget(lst);
}

RUNNER_TEST_GROUP_INIT(ACE_TEST_SUITE_04)


/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effects Deny,
 * Undetermined, Permit, Inapplicable
 * expect: evaluation of effect list to Deny
 */
TESTSUITE04(00_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Undetermined);
    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Deny));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effects
 * Undetermined, Permit, Inapplicable, Deny, Permit
 * expect: evaluation of effect list to Deny
 */
TESTSUITE04(01_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Undetermined);
    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(Deny);
    effectList.push_back(Permit);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Deny));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effects
 * Undetermined, Permit, Inapplicable, Permit
 * expect: evaluation of effect list to Undetermined
 */
TESTSUITE04(02_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Undetermined);
    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(Permit);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Undetermined));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effects
 * Permit, Inapplicable, Permit, Undetermined, PromptSession
 * expect: evaluation of effect list to Undetermined
 */
TESTSUITE04(03_denyOverrides){
    std::list<ExtendedEffect> effectList;

    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(Permit);
    effectList.push_back(Undetermined);
    effectList.push_back(PromptSession);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Undetermined));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effects
 * Permit, Inapplicable, Permit, PromptOneShot, PromptSession, PromptBlanket
 * expect: evaluation of effect list to PromptOneShot
 */
TESTSUITE04(04_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(Permit);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, PromptOneShot));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effects
 * Permit, Inapplicable, Permit, PromptSession, PromptBlanket
 * expect: evaluation of effect list to PromptSession
 */
TESTSUITE04(05_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(Permit);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, PromptSession));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effects
 * Permit, Inapplicable, Permit, PromptBlanket
 * expect: evaluation of effect list to PromptBlanket
 */
TESTSUITE04(06_denyOverrides){
    std::list<ExtendedEffect> effectList;

    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(Permit);
    effectList.push_back(PromptBlanket);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, PromptBlanket));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effects
 * Permit, Inapplicable, Permit
 * expect: evaluation of effect list to Permit
 */
TESTSUITE04(07_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(Permit);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Permit));
}


/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining one element
 * effects list with Inapplicable
 * expect: evaluation of effect list to Inapplicable
 */
TESTSUITE04(08_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Inapplicable));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining empty effect list
 * expect: evaluation of effect list to Inapplicable
 */
TESTSUITE04(09_denyOverrides){
    std::list<ExtendedEffect> effectList;
    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Inapplicable));
}


/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effect list
 * Deny, Undetermined, Permit, Error, Inapplicable
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(10_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Undetermined);
    effectList.push_back(Permit);
    effectList.push_back(Error);
    effectList.push_back(Inapplicable);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effect list
 * Error, Undetermined, Error, Inapplicable, Permit
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(11_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Error);
    effectList.push_back(Undetermined);
    effectList.push_back(Error);
    effectList.push_back(Inapplicable);
    effectList.push_back(Permit);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effect list
 * Permit, Inapplicable, Permit, Error, PromptOneShot, PromptSession,
 * PromptBlanket
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(12_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(Permit);
    effectList.push_back(Error);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);


    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effect list
 * Permit, Inapplicable, Permit, Error, PromptBlanket,
 * PromptSession
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(13_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(Permit);
    effectList.push_back(Error);
    effectList.push_back(PromptBlanket);
    effectList.push_back(PromptSession);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effect list
 * Error, Inapplicable
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(14_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Error);
    effectList.push_back(Inapplicable);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "denyOverrides" for combining effect list
 * Inapplicable, Error
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(15_denyOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);
    effectList.push_back(Error);

    Effect eff = denyOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining effect list
 * Deny, Undetermined, Permit, Inapplicable, PromptOneShot, PromptSession,
 * PromptBlanket
 * expect: evaluation of effect list to Permit
 */
TESTSUITE04(16_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Undetermined);
    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);

    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Permit));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining effect list
 * Deny, Inapplicable, PromptOneShot, PromptSession, PromptBlanket, Undetermined
 * expect: evaluation of effect list to Undetermined
 */
TESTSUITE04(17_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);
    effectList.push_back(Undetermined);

    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Undetermined));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining effect list
 * Deny, Inapplicable, PromptOneShot, PromptSession, PromptBlanket
 * expect: evaluation of effect list to PromptBlanket
 */
TESTSUITE04(18_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);


    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, PromptBlanket));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining effect list
 * Deny, PromptOneShot, PromptSession, Inapplicable
 * expect: evaluation of effect list to PromptSession
 */
TESTSUITE04(19_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(Inapplicable);

    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, PromptSession));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining effect list
 * Deny, Inapplicable, PromptOneShot
 * expect: evaluation of effect list to PromptOneShot
 */
TESTSUITE04(20_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);

    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, PromptOneShot));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining effect list
 * Deny, Inapplicable
 * expect: evaluation of effect list to Deny
 */
TESTSUITE04(21_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Inapplicable);

    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Deny));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining one element
 * effect list with Inapplicable
 * expect: evaluation of effect list to Inapplicable
 */
TESTSUITE04(22_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);

    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Inapplicable));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining empty effect
 * list
 * expect: evaluation of effect list to Inapplicable
 */
TESTSUITE04(23_permitOverrides){
    std::list<ExtendedEffect> effectList;

    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Inapplicable));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining effect list
 * Deny, Undetermined, Permit, Inapplicable, Error, PromptSession,
 * PromptOneShot, PromptBlanket
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(24_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Undetermined);
    effectList.push_back(Permit);
    effectList.push_back(Inapplicable);
    effectList.push_back(Error);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptBlanket);

    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining effect list
 * Deny, Inapplicable, Error, PromptOneShot, PromptSession, PromptBlanket,
 * Undetermined, Error
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(25_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);
    effectList.push_back(Undetermined);
    effectList.push_back(Error);

    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining effect list
 * Deny, Error, Inapplicable, PromptOneShot
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(26_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Error);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);

    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "permitOverrides" for combining one element
 * effect list with Error
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(27_permitOverrides){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Error);
    Effect eff = permitOverridesTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstApplicable" for combining effect list
 * Deny, Inapplicable, PromptOneShot, PromptSession, PromptBlanket, Undetermined
 * expect: evaluation of effect list to Deny
 */
TESTSUITE04(28_firstApplicable){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);
    effectList.push_back(Undetermined);

    Effect eff = firstApplicableTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Deny));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstApplicable" for combining effect list
 * Undetermined, Deny, PromptOneShot, Inapplicable, PromptOneShot,
 * PromptSession, PromptBlanket, Undetermined
 * expect: evaluation of effect list to Undetermined
 */
TESTSUITE04(29_firstApplicable){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Undetermined);
    effectList.push_back(Deny);
    effectList.push_back(PromptOneShot);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);
    effectList.push_back(Undetermined);

    Effect eff = firstApplicableTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Undetermined));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstApplicable" for combining effect list
 * Inapplicable, Deny, PromptOneShot, Inapplicable, PromptOneShot,
 * PromptSession, PromptBlanket, Undetermined
 * expect: evaluation of effect list to Deny
 */
TESTSUITE04(30_firstApplicable){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);
    effectList.push_back(Deny);
    effectList.push_back(PromptOneShot);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);
    effectList.push_back(Undetermined);

    Effect eff = firstApplicableTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Deny));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstApplicable" for combining effect list
 * Inapplicable, Undetermined, PromptOneShot, Inapplicable, PromptOneShot,
 * PromptSession, PromptBlanket, Undetermined
 * expect: evaluation of effect list to Undetermined
 */
TESTSUITE04(31_firstApplicable){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);
    effectList.push_back(Undetermined);
    effectList.push_back(PromptOneShot);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);
    effectList.push_back(Undetermined);

    Effect eff = firstApplicableTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Undetermined));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstApplicable" for combining effect list
 * Inapplicable, Inapplicable, Inapplicable
 * expect: evaluation of effect list to Inapplicable
 */
TESTSUITE04(32_firstApplicable){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);
    effectList.push_back(Inapplicable);
    effectList.push_back(Inapplicable);

    Effect eff = firstApplicableTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Inapplicable));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstApplicable" for combining effect list
 * Inapplicable, Inapplicable, Inapplicable, Permit
 * expect: evaluation of effect list to Permit
 */
TESTSUITE04(33_firstApplicable){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);
    effectList.push_back(Inapplicable);
    effectList.push_back(Inapplicable);
    effectList.push_back(Permit);

    Effect eff = firstApplicableTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Permit));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstApplicable" for combining empty effect
 * list
 * expect: evaluation of effect list to Inapplicable
 */
TESTSUITE04(34_firstApplicable){
    std::list<ExtendedEffect> effectList;

    Effect eff = firstApplicableTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Inapplicable));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstApplicable" for combining effect list
 * Deny, Inapplicable, PromptOneShot, Error, PromptSession, PromptBlanket,
 * Undetermined
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(35_firstApplicable){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Inapplicable);
    effectList.push_back(PromptOneShot);
    effectList.push_back(Error);
    effectList.push_back(PromptSession);
    effectList.push_back(PromptBlanket);
    effectList.push_back(Undetermined);

    Effect eff = firstApplicableTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstApplicable" for combining effect list
 * Inapplicable, Inapplicable, Inapplicable, Error, Permit
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(36_firstApplicable){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);
    effectList.push_back(Inapplicable);
    effectList.push_back(Inapplicable);
    effectList.push_back(Error);
    effectList.push_back(Permit);

    Effect eff = firstApplicableTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstApplicable" for combining one element
 * effect list with Error
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(37_firstApplicable){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Error);

    Effect eff = firstApplicableTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining effect list
 * Inapplicable, Deny, PromptOneShot, Inapplicable
 * expect: evaluation of effect list to Inapplicable
 */
TESTSUITE04(38_firstMatching){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);
    effectList.push_back(Deny);
    effectList.push_back(PromptOneShot);
    effectList.push_back(Inapplicable);

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Inapplicable));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining effect list
 * Undetermined, Deny, PromptOneShot, Inapplicable
 * expect: evaluation of effect list to Undetermined
 */
TESTSUITE04(39_firstMatching){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Undetermined);
    effectList.push_back(Deny);
    effectList.push_back(PromptOneShot);
    effectList.push_back(Inapplicable);

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Undetermined));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining effect list
 * Deny, Inapplicable
 * expect: evaluation of effect list to Deny
 */
TESTSUITE04(39a_firstMatching){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Deny);
    effectList.push_back(Inapplicable);

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Deny));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining one element
 * effect list with Permit
 * expect: evaluation of effect list to Permit
 */
TESTSUITE04(39b_firstMatching){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Permit);

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Permit));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining effect list
 * Undetermined, Undetermined, Undetermined
 * expect: evaluation of effect list to Undetermined
 */
TESTSUITE04(40_firstMatching){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Undetermined);
    effectList.push_back(Undetermined);
    effectList.push_back(Undetermined);

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Undetermined));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining empty effect list
 * expect: evaluation of effect list to Inapplicable
 */
TESTSUITE04(41_firstMatching){
    std::list<ExtendedEffect> effectList;

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Inapplicable));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining one element
 * effect list with Inapplicable
 * expect: evaluation of effect list to Inapplicable
 */
TESTSUITE04(42_firstMatching){
    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Inapplicable));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining effect list
 * Undetermined, Undetermined, Undetermined, Deny, Inapplicable, Undetermined,
 * Deny, PromptOneShot, Inapplicable
 * expect: evaluation of effect list to Undetermined
 */
TESTSUITE04(43_firstMatching){

    std::list<ExtendedEffect> effectList;
    effectList.push_back(Undetermined);
    effectList.push_back(Undetermined);
    effectList.push_back(Undetermined);
    effectList.push_back(Deny);
    effectList.push_back(Inapplicable);
    effectList.push_back(Undetermined);
    effectList.push_back(Deny);
    effectList.push_back(PromptOneShot);
    effectList.push_back(Inapplicable);

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Undetermined));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining effect list
 * Inapplicable, Deny, PromptOneShot, Error, Inapplicable
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(44_firstMatching){

    std::list<ExtendedEffect> effectList;
    effectList.push_back(Inapplicable);
    effectList.push_back(Deny);
    effectList.push_back(PromptOneShot);
    effectList.push_back(Error);
    effectList.push_back(Inapplicable);

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining effect list
 * Undetermined, Undetermined, Error, Undetermined, Deny, Inapplicable,
 * Undetermined, Deny, PromptOneShot, Inapplicable
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(45_firstMatching){

    std::list<ExtendedEffect> effectList;
    effectList.push_back(Undetermined);
    effectList.push_back(Undetermined);
    effectList.push_back(Error);
    effectList.push_back(Undetermined);
    effectList.push_back(Deny);
    effectList.push_back(Inapplicable);
    effectList.push_back(Undetermined);
    effectList.push_back(Deny);
    effectList.push_back(PromptOneShot);
    effectList.push_back(Inapplicable);

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}

/*
 * author: unknown
 * test: ACE Engine
 * description: Tested algorithm "firstMatching" for combining one element
 * effect list with Error
 * expect: evaluation of effect list to Error
 */
TESTSUITE04(46_firstMatching){

    std::list<ExtendedEffect> effectList;
    effectList.push_back(Error);

    Effect eff = firstMatchingTargetTest(effectList);
    RUNNER_ASSERT(assertEffectEqual(eff, Error));
}
