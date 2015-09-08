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
 * @file        log.cpp
 * @author      Przemyslaw Dobrowolski (p.dobrowolsk@samsung.com)
 * @version     1.0
 * @brief       This file is the implementation file of log system
 */
#include <stddef.h>
#include <dpl/log/log.h>
#include <dpl/singleton_impl.h>

IMPLEMENT_SINGLETON(DPL::Log::LogSystem)

namespace DPL {
namespace Log {

bool LogSystem::IsLoggingEnabled() const
{
    return m_isLoggingEnabled;
}

LogSystem::LogSystem() :
    m_dlogProvider(NULL),
    m_isLoggingEnabled(true)
{
    // DLOG
    m_dlogProvider = new DLOGLogProvider();
    AddProvider(m_dlogProvider);
}

LogSystem::~LogSystem()
{
    // Delete all providers
    for (AbstractLogProviderPtrList::iterator iterator = m_providers.begin();
         iterator != m_providers.end();
         ++iterator)
    {
        delete *iterator;
    }

    m_providers.clear();

    // And even default providers
    m_dlogProvider = NULL;
}

void LogSystem::SetTag(const char* tag)
{
    if (m_dlogProvider != NULL) {
        m_dlogProvider->SetTag(tag);
    }
}

void LogSystem::AddProvider(AbstractLogProvider *provider)
{
    m_providers.push_back(provider);
}

void LogSystem::RemoveProvider(AbstractLogProvider *provider)
{
    m_providers.remove(provider);
}

void LogSystem::Debug(const char *message,
                      const char *filename,
                      int line,
                      const char *function)
{
    for (AbstractLogProviderPtrList::iterator iterator = m_providers.begin();
         iterator != m_providers.end();
         ++iterator)
    {
        (*iterator)->Debug(message, filename, line, function);
    }
}

void LogSystem::Info(const char *message,
                     const char *filename,
                     int line,
                     const char *function)
{
    for (AbstractLogProviderPtrList::iterator iterator = m_providers.begin();
         iterator != m_providers.end();
         ++iterator)
    {
        (*iterator)->Info(message, filename, line, function);
    }
}

void LogSystem::Warning(const char *message,
                        const char *filename,
                        int line,
                        const char *function)
{
    for (AbstractLogProviderPtrList::iterator iterator = m_providers.begin();
         iterator != m_providers.end();
         ++iterator)
    {
        (*iterator)->Warning(message, filename, line, function);
    }
}

void LogSystem::Error(const char *message,
                      const char *filename,
                      int line,
                      const char *function)
{
    for (AbstractLogProviderPtrList::iterator iterator = m_providers.begin();
         iterator != m_providers.end();
         ++iterator)
    {
        (*iterator)->Error(message, filename, line, function);
    }
}

void LogSystem::Pedantic(const char *message,
                         const char *filename,
                         int line,
                         const char *function)
{
    for (AbstractLogProviderPtrList::iterator iterator = m_providers.begin();
         iterator != m_providers.end();
         ++iterator)
    {
        (*iterator)->Pedantic(message, filename, line, function);
    }
}
}
} // namespace DPL
