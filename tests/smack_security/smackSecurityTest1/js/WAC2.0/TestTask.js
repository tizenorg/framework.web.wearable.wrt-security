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
/**
 * This file contains the implementation of test task class.
 *
 * @author      Shi Hezhang (hezhang.shi@samsung.com)
 * @author      Pan Rui (r.pan@samsung.com)
 * @version     0.1
 */

var TestTask = {
    TYPE_MISMATCH_ERR: 17,
    INVALID_VALUES_ERR: 22,
    task: null,
    Itask:null,
    old_task:null,
    num_tasks:null,
    found_tasks:null,
    all_tasks:null,
    expectedErrorCode: null,

	createTestEvent: function (response)
    {
        TestTask.task.createTask({description:'Test Task 1',
                summary:'Task created to test Itask creation',
                dueDate: new Date(2009, 3, 30, 10, 0),
                status:0,
                priority:0});
    },

    onSuccessNonExpected: function(response)
    {
        TestEngine.test("non expected successCallback invoked", false);
    },

    onErrorExpected: function(response)
    {
        TestEngine.test("expected errorCallback invoked", true);
        TestEngine.testPresence("error code", response.code);
        TestEngine.test("Error number, was: " + response.code + ', expected: ' + TestTask.expectedErrorCode, response.code == TestTask.expectedErrorCode);
    },

    onSuccess: function(response)
    {
        TestEngine.test("Callback success", true);
    },

    onErrorCb: function(response)
    {
        TestEngine.logErr("errorCallback invoked [" + response.code + ']');
    },

    //Cal001
    test_modulePresence: function()
    {
        TestEngine.test("Calendar manager presence", deviceapis.pim.task);
    },

    //Cal002
    test_taskProperties: function()
    {
        TestEngine.test("test property HIGH_PRIORITY", deviceapis.pim.task.taskproperties.HIGH_PRIORITY === 0);
        TestEngine.test("test property MEDIUM_PRIORITY", deviceapis.pim.task.taskproperties.MEDIUM_PRIORITY  === 1);
        TestEngine.test("test property LOW_PRIORITY", deviceapis.pim.task.taskproperties.LOW_PRIORITY === 2);
        TestEngine.test("test property STATUS_COMPLETED", deviceapis.pim.task.taskproperties.STATUS_COMPLETED === 0);
        TestEngine.test("test property STATUS_NEEDS_ACTION", deviceapis.pim.task.taskproperties.STATUS_NEEDS_ACTION === 1);
        TestEngine.test("test property STATUS_IN_PROCESS", deviceapis.pim.task.taskproperties.STATUS_IN_PROCESS === 2);
        TestEngine.test("test property STATUS_CANCELLED", deviceapis.pim.task.taskproperties.STATUS_CANCELLED === 3);
    },

    onSuccessGetTask: function (response)
    {
        TestEngine.test("Found tasks", response.length > 0);
        TestTask.task=response[0];
    },

    //Cal003
    test_getTask: function()
    {
        var cbObj = TestEngine.registerCallback("getTaskLists",
            TestTask.onSuccessGetTask,
            TestTask.onErrorCb);
        deviceapis.pim.task.getTaskLists(cbObj.successCallback, cbObj.errorCallback);
    },

    //Cal004
    test_getTaskNoCallbacks: function()
    {
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, deviceapis.pim.task, "getTaskLists");
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, deviceapis.pim.task, "getTaskLists", 1);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, deviceapis.pim.task, "getTaskLists", "test1");
    },

    //Cal005
    test_getTaskInvalidCallbacks: function()
    {
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, deviceapis.pim.task, "getTaskLists", 1, TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, deviceapis.pim.task, "getTaskLists", TestTask.onErrorCb, 2);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, deviceapis.pim.task, "getTaskLists", 1, 2);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, deviceapis.pim.task, "getTaskLists", "test1", "test2");
    },

    //Cal006
    test_taskMethodsPresence: function()
    {
        TestEngine.testPresence("task.createTask presence", TestTask.task.createTask);
        TestEngine.testPresence("task.addTask presence", TestTask.task.addTask);
        TestEngine.testPresence("task.updateTask presence", TestTask.task.updateTask);
        TestEngine.testPresence("task.deleteTask presence", TestTask.task.deleteTask);
        TestEngine.testPresence("task.findTasks presence", TestTask.task.findTasks);
    },

    //Cal007
    test_getTaskName: function()
    {
        var cName = TestTask.task.name;
        TestEngine.test("test getName", isString(cName) && cName.length > 0);
        TestEngine.log("task name: " + cName);
    },

    //Cal008
    test_getTaskType: function ()
    {
        var cType = TestTask.task.type;
        TestEngine.test("test getType", cType === 0 || cType === 1);
        TestEngine.log("task type: " + cType);

    },

    //Cal009
    test_taskStaticProperties: function()
    {
        TestEngine.test("test property SIM_TASK", TestTask.task.SIM_TASK === 0);
        TestEngine.test("test property DEVICE_TASK", TestTask.task.DEVICE_TASK === 1);
    },

    //Cal010
    test_createEmptyTask: function()
    {
        TestTask.Itask = null;
        TestTask.Itask = TestTask.task.createTask();
        TestEngine.test("Itask created", TestTask.Itask != null);
    },

    //Cal011
    test_taskAttributes: function()
    {
        var Itask = TestTask.task.createTask();
        TestEngine.test("test attribute id - type: " + typeof Itask.id,
            isString(Itask.id));
        var oldId = Itask.id;
        Itask.id = "test" + oldId;
        TestEngine.test("attribute id is read only", Itask.id === oldId);
        TestEngine.test("test attribute description - type: " + typeof Itask.description,
            isString(Itask.description));
        TestEngine.test("test attribute summary - type: " + typeof Itask.summary,
            isString(Itask.summary));
        //TestEngine.test("test attribute categories - type: " + typeof Itask.categories,
         //   typeof Itask.categories == 'object' && Itask.categories.length == 0);
        TestEngine.test("test attribute status - type: " + typeof Itask.status + ", value: " + Itask.status,
            isNumber(Itask.status));
         TestEngine.test("test attribute priority - type: " + typeof Itask.priority + ", value: " + Itask.priority,
            isNumber(Itask.priority));
    },

    //Cal012
    test_createTask: function()
    {
        var date = new Date(2009, 3, 30, 10, 0);
        var newEvent = TestTask.task.createTask({
               priority:1,
               description:'Test Task 1',
               summary:'Task created to test Itask creation',
               dueDate: new Date(2009, 3, 30, 10, 0),
               status:1
          });
		TestEngine.test("correct duration", newEvent.priority === 1);
		TestEngine.test("correct duration", newEvent.status === 1);
		TestEngine.test("Itask with param created ", newEvent);
		TestEngine.test("correct description", newEvent.description === 'Test Task 1');
		TestEngine.test("correct summary", newEvent.summary === 'Task created to test Itask creation');
		TestEngine.test("correct dueDate", newEvent.dueDate.toString() === date.toString());
    },

    onSuccessAddTaskCountBefore: function(response)
    {
        TestEngine.log("onSuccessAddTaskCountBefore entered");
        //save current number of tasks
        TestTask.num_tasks = response.length;
        //add new Itask
        var objCb = TestEngine.registerCallback("onSuccessAddTaskCountBefore",
            TestTask.onSuccessAddTaskAdd,
            TestTask.onErrorCb);
        TestTask.task.addTask(objCb.successCallback,
            objCb.errorCallback,
            TestTask.Itask);
    },

    onSuccessAddTaskAdd: function(response)
    {
        TestEngine.log("onSuccessAddTaskAdd entered");
        //count the number of tasks
        var objCb = TestEngine.registerCallback("onSuccessAddTaskAdd",
            TestTask.onSuccessAddTaskCountAfter,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback,
            objCb.errorCallback);
    },

    onSuccessAddTaskCountAfter: function(response)
    {
        TestEngine.log("onSuccessAddTaskCountAfter entered");
        TestEngine.test("Number of tasks increased", TestTask.num_tasks+1 == response.length);
        //validate Itask
        var eventValidated = false;
        TestEngine.log("added Itask's id " + TestTask.Itask.id);
        for (var i in response) {
            if (TestTask.Itask.id != response[i].id) {
                continue;
            }
            TestEngine.test("description the same", response[i].description === TestTask.Itask.description);
            TestEngine.test("summary the same", response[i].summary === TestTask.Itask.summary);
            TestEngine.test("dueDate the same", response[i].dueDate.toString() === TestTask.Itask.dueDate.toString());
            TestEngine.test("status the same", response[i].status === TestTask.Itask.status);
            TestEngine.test("priority the same", response[i].priority === TestTask.Itask.priority);
            eventValidated = true;
        }
        TestEngine.test("Task has been validated", eventValidated)
        TestTask.found_tasks=null;
        TestTask.num_tasks=null;
    },

    //Cal013
    test_addTask1: function()
    {
        TestTask.Itask = TestTask.task.createTask({
	            description:'Task created to test Itask creation',
                summary:'Test Task 1',
                dueDate: new Date(2012, 11, 30, 10, 0),
                status: deviceapis.pim.task.taskproperties.STATUS_COMPLETED,
                priority: deviceapis.pim.task.taskproperties.HIGH_PRIORITY});
        //save current number of tasks
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessAddTaskCountBefore,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback, objCb.errorCallback);
        //rest of test in callbacks...
    },

    //Cal014
    test_addTask2: function()
    {
        TestTask.Itask = TestTask.task.createTask({
                summary:'Test Task 2',
                description:'Task created to test Itask creation',
                dueDate: new Date(2012, 11, 30, 10, 0),
                status: deviceapis.pim.task.taskproperties.STATUS_COMPLETED,
                priority: deviceapis.pim.task.taskproperties.HIGH_PRIORITY});
        TestTask.Itask.dueDate = new Date(2012, 10, 30, 10, 0);
        //save current number of tasks
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessAddTaskCountBefore,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback, objCb.errorCallback);
        //rest of test in callbacks...
    },

    //Cal015
    test_addTask3: function()
    {
        TestTask.Itask = TestTask.task.createTask({
                summary:'Test Task 3',
                description:'Task created to test Itask creation',
                dueDate: new Date(2012, 11, 30, 10, 0),
                status: 2,
                priority: 0});
        //save current number of tasks
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessAddTaskCountBefore,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback, objCb.errorCallback);
        //rest of test in callbacks...
    },

    //Cal016
    test_addTask4: function()
    {
        TestTask.Itask = TestTask.task.createTask({
                summary:'Test Task 4',
                description:'Task created to test Itask creation',
                dueDate: new Date(2012, 11, 30, 10, 0),
                status: 0,
                priority: 0});

        //save current number of tasks
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessAddTaskCountBefore,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback, objCb.errorCallback);
        //rest of test in callbacks...
    },

    //Cal017
    test_addTask5: function()
    {
        TestTask.Itask = TestTask.task.createTask({
                summary:'Test Task 5',
                description:'Task created to test Itask creation',
                dueDate: new Date(2012, 11, 30, 10, 0),
                status: 0,
                priority: 0});
        //save current number of tasks
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessAddTaskCountBefore,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback, objCb.errorCallback);
        //rest of test in callbacks...
    },

    //Cal018
    test_addTaskNoParams: function()
    {
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask");
    },

    //Cal019
    test_addTaskNullCallbacksParams: function()
    {
        var Itask = TestTask.createTestEvent();
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", 1, TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", "test", TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", "test", TestTask.onErrorCb, Itask);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", TestTask.onSuccessNonExpected, 1);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", TestTask.onSuccessNonExpected, "test");
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", TestTask.onSuccessNonExpected, "test", Itask);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", 1, 1, Itask);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", "test", "test", Itask);
    },

    //Cal020
    test_addTaskWrongEventParam: function()
    {
        TestTask.expectedErrorCode = TestTask.INVALID_VALUES_ERR;

        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", TestTask.onSuccessNonExpected, TestTask.onErrorCb, 22);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", TestTask.onSuccessNonExpected, TestTask.onErrorCb, "test");
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", TestTask.onSuccessNonExpected, TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "addTask", TestTask.onSuccessNonExpected, TestTask.onErrorCb, new Date());
        var objCb1 = TestEngine.registerCallback("Add Itask with null Itask param",
            TestTask.onSuccessNonExpected,
            TestTask.onErrorExpected);
        TestTask.task.addTask(objCb1.successCallback,
            objCb1.errorCallback,
            null);

        var objCb2 = TestEngine.registerCallback("Add Itask with undefined Itask param",
            TestTask.onSuccessNonExpected,
            TestTask.onErrorExpected);
        TestTask.task.addTask(objCb2.successCallback,
            objCb2.errorCallback,
            undefined);

    },

    onSuccessFindAllTasks: function(response)
    {
        TestEngine.test("FindAllTasks", response.length > 0);
        TestTask.all_tasks=response;
    },

    //Cal021
    test_findAllTasks: function()
    {
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessFindAllTasks,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback,
            objCb.errorCallback);
    },

    onSuccessFindTaskWithFilterNoResults: function(response)
    {
        TestEngine.test("FindTasks with filter not found results", response.length == 0);
        TestTask.num_tasks=null;
    },

    test_FindTasksWithFilterNoResults: function(filter)
    {
        if(filter) {
            for(var i in filter) {
                TestEngine.log("---Filter---: " + i + " : " + filter[i]);
            }
        }
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessFindTaskWithFilterNoResults,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback,
            objCb.errorCallback,
            filter);
    },

    onSuccessFindTaskWithFilterSomeResults: function(response)
    {
        TestEngine.test("FindTasks with filter found results", response.length > 0);
        TestTask.num_tasks=null;
    },

    test_FindTasksWithFilterSomeResults: function(filter)
    {
        if(filter) {
            for(var i in filter) {
                TestEngine.log("---Filter---: " + i + " : " + filter[i]);
            }
        }
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessFindTaskWithFilterSomeResults,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback,
            objCb.errorCallback,
            filter);
    },

    //Cal022
    test_findTasksId: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterSomeResults(
            {id: TestTask.all_tasks[0].id});
    },

    //Cal023
    test_findTasksSummary: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterSomeResults(
            {summary:'Test Task 1'});
    },

    //Cal024
    test_findTasksDescription: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterSomeResults(
            {description:'Task created to test Itask creation'});
    },

    //Cal028~~~~~~~~~~~~
    test_findTasksStatus: function()
    {
	    var status1 = deviceapis.pim.task.taskproperties.STATUS_COMPLETED;
	    var status2 = deviceapis.pim.task.taskproperties.STATUS_IN_PROCESS;
	    var statusArray =new Array();
		statusArray.push(status1);
		statusArray.push(status2);
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterSomeResults(
            {status: statusArray});
    },

    //Cal028~~~~~~~~~~~~
    test_findTasksPriority: function()
    {
	    var priority1 = deviceapis.pim.task.taskproperties.HIGH_PRIORITY;
	    var priority2 = deviceapis.pim.task.taskproperties.MEDIUM_PRIORITY;
	    var priorityArray =new Array();
		priorityArray.push(priority1);
		priorityArray.push(priority2);
        TestEngine.test("Some priority to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterSomeResults(
            {priority: priorityArray});
    },


    //Cal029
    test_findTasksFullDueDate: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterSomeResults(
            {initialDueDate: new Date(2010, 11, 30, 1, 0),
             endDueDate: new Date(2012, 11, 30, 23, 0)});
    },

    //Cal030
    test_findTasksInitialDueDate: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterSomeResults(
            {initialDueDate: new Date(2010, 11, 30, 1, 0),
              endDueDate: null});
    },

    //Cal031
    test_findTasksEndDueDate: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterSomeResults(
            {initialDueDate: null,
              endDueDate: new Date(2012, 11, 30, 23, 0)});
    },

    //Cal032
    test_findTasksEmptyFilter: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterSomeResults({});
    },

    //Cal033
    test_findTasksFullDueDateNoResults: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterNoResults(
            {initialDueDate: new Date(1980, 11, 30, 1, 0),
             endDueDate: new Date(1980, 11, 30, 23, 0)});
    },

    //Cal035
    test_findTasksSummaryNoResults: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterNoResults(
            {summary:'non existing summary'});
    },

    //Cal036
    test_findTasksDescriptionNoResults: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterNoResults(
            {description:'non existing description'});
    },

    //Cal037
    test_findTasksIdNoResults: function()
    {
        TestEngine.test("Some tasks to be found", TestTask.all_tasks.length > 0);
        TestTask.test_FindTasksWithFilterNoResults(
            {id:"2000000"});
    },

    //Cal039
    test_findTasksNoParams: function()
    {
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "findTasks");
    },

    //Cal040
    test_findTasksNullCallbacksParams: function()
    {
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "findTasks", TestTask.onSuccessNonExpected, 1);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "findTasks", TestTask.onSuccessNonExpected, "test");
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "findTasks", 1, TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "findTasks", "test", TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "findTasks", 1, 1);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "findTasks", "test", "test");
    },

    //Cal041
    test_findTasksWrongFilterParam: function()
    {
        TestTask.expectedErrorCode = TestTask.TYPE_MISMATCH_ERR;
        var objCb1 = TestEngine.registerCallback("Find tasks with null filter param",
            TestTask.onSuccess,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb1.successCallback,
            objCb1.errorCallback,
            null);

        var objCb2 = TestEngine.registerCallback("Find tasks with undefined filter param",
            TestTask.onSuccess,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb2.successCallback,
            objCb2.errorCallback,
            undefined);

        var objCb3 = TestEngine.registerCallback("Find tasks with null filter param",
            TestTask.onSuccess,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb3.successCallback,
            objCb3.errorCallback,
            22);

        var objCb4 = TestEngine.registerCallback("Find tasks with undefined filter param",
            TestTask.onSuccess,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb4.successCallback,
            objCb4.errorCallback,
            "test");
    },

    //Cal042
    test_updateTask: function()
    {
        if(TestTask.all_tasks.length > 0)
        {
            var all=TestTask.all_tasks;
            TestTask.old_task=all[0];

            //all_tasks.length is added to be sure that it is not
            //result of previous update

            all[0].description = "Updated"+all.length;
            all[0].summary = "Updated";
            TestTask.Itask = all[0];

            var objCb = TestEngine.registerCallback("updateTask",
                TestTask.onSuccessUpdateTask1,
                TestTask.onErrorCb);
            TestTask.task.updateTask(objCb.successCallback,
                objCb.errorCallback,
                TestTask.Itask);
        }
    },

    onSuccessUpdateTask1: function(response)
    {
        TestEngine.log("onSuccessUpdateTask1 entered");
        //find this Itask
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessUpdateTask2,
            TestTask.onErrorCb);

        TestTask.task.findTasks(objCb.successCallback,
            objCb.errorCallback,
            {description: TestTask.Itask.description,
                summary: TestTask.Itask.summary});
    },

    onSuccessUpdateTask2: function(response)
    {
        TestEngine.log("onSuccessUpdateTask2 entered");
        TestTask.found_tasks=response;
        TestTask.num_tasks = response.length;
        if(TestTask.found_tasks.length>0)
        {
            var f_flag=0;
            for(var i in TestTask.found_tasks)
            {
                if( TestTask.found_tasks[i].description == TestTask.Itask.description &&
                    TestTask.found_tasks[i].summary == TestTask.Itask.summary)
                {
                    TestEngine.test("Update Itask", true);
                    f_flag=1;
                }
            }

            if(f_flag==0)
            {
                TestEngine.test("Update Itask", false);
            }
        }
        else
        {
            TestEngine.test("Updated tasks found", false);
        }

        var objCb = TestEngine.registerCallback("updateTask",
            TestTask.onSuccessUpdateTask3,
            TestTask.onErrorCb);
        TestTask.task.updateTask(objCb.successCallback,
            objCb.errorCallback,
            TestTask.old_task);

    },

    onSuccessUpdateTask3: function(response)
    {
        TestEngine.log("onSuccessUpdateTask3 entered");
        TestEngine.test("Task restored from update", true);
    },

    //Cal043
    test_updateTaskNoParams: function()
    {
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask");
    },

    //Cal044
    test_updateTaskNullCallbacksParams: function()
    {
        var Itask = TestTask.createTestEvent();
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", 1, TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", "test", TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", "test", TestTask.onErrorCb, Itask);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", TestTask.onSuccessNonExpected, 1);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", TestTask.onSuccessNonExpected, "test");
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", TestTask.onSuccessNonExpected, "test", Itask);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", 1, 1, Itask);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", "test", "test", Itask);
    },

    //Cal045
    test_updateTaskWrongTaskParam: function()
    {
        TestTask.expectedErrorCode = TestTask.INVALID_VALUES_ERR;

        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", TestTask.onSuccessNonExpected, TestTask.onErrorCb, 22);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", TestTask.onSuccessNonExpected, TestTask.onErrorCb, "test");
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", TestTask.onSuccessNonExpected, TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "updateTask", TestTask.onSuccessNonExpected, TestTask.onErrorCb, new Date());

        var objCb1 = TestEngine.registerCallback("Update Itask with null Itask param",
            TestTask.onSuccessNonExpected,
            TestTask.onErrorExpected);
        TestTask.task.updateTask(objCb1.successCallback,
            objCb1.errorCallback,
            null);

        var objCb2 = TestEngine.registerCallback("Update Itask with undefined Itask param",
            TestTask.onSuccessNonExpected,
            TestTask.onErrorExpected);
        TestTask.task.updateTask(objCb2.successCallback,
            objCb2.errorCallback,
            undefined);
    },
    //Cal046
    test_deleteTask: function()
    {
        //find all tasks
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessDeleteTask1,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback,
            objCb.errorCallback);
    },

    onSuccessDeleteTask1: function(response)
    {
        TestEngine.log("onSuccessDeleteTask1 entered");
        TestEngine.test("FindAllTasks", response.length > 0);
        TestTask.all_tasks=response;

        if(TestTask.all_tasks.length > 0)
        {
            TestTask.old_task=TestTask.all_tasks.length;
            TestTask.Itask = TestTask.all_tasks[0];

            var objCb = TestEngine.registerCallback("deleteTask",
                TestTask.onSuccessDeleteTask2,
                TestTask.onErrorCb);
            TestTask.task.deleteTask(objCb.successCallback,
                objCb.errorCallback,
                TestTask.Itask.id);
        }
        else
        {
            TestEngine.test("Events for delete found", false);
        }
    },

    onSuccessDeleteTask2: function(response)
    {
        TestEngine.log("onSuccessDeleteTask2 entered");
        //check number of tasks now
        var objCb = TestEngine.registerCallback("findTasks",
            TestTask.onSuccessDeleteTask3,
            TestTask.onErrorCb);
        TestTask.task.findTasks(objCb.successCallback,
            objCb.errorCallback);
    },

    onSuccessDeleteTask3: function(response)
    {
        TestEngine.log("onSuccessDeleteTask3 entered");
        TestTask.all_tasks=response;
        var num_after=response.length;
        TestEngine.test("deleteTask", num_after + 1 == TestTask.old_task );
    },


    //Cal047
    test_deleteTaskNoParams: function()
    {
        TestEngine.catchErrorType("code", 17, TestTask.task, "deleteTask");
    },

    //Cal048
    test_deleteTaskNullCallbacksParams: function()
    {
        var Itask = TestTask.createTestEvent();
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "deleteTask", "test", TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "deleteTask", 1, TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "deleteTask", "test", TestTask.onErrorCb, 1);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "deleteTask", TestTask.onSuccessNonExpected, "test");
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "deleteTask", TestTask.onSuccessNonExpected, "test");
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "deleteTask", TestTask.onSuccessNonExpected, "test", 1);
    },

    //Cal049
    test_deleteTaskWrongTaskParam: function()
    {
        TestTask.expectedErrorCode = TestTask.INVALID_VALUES_ERR;

        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "deleteTask", TestTask.onSuccessNonExpected, TestTask.onErrorCb);
        TestEngine.catchErrorType("code", TestTask.TYPE_MISMATCH_ERR, TestTask.task, "deleteTask", TestTask.onSuccessNonExpected, TestTask.onErrorCb, new Date());

        var objCb1 = TestEngine.registerCallback("Delete Itask with null Itask param",
            TestTask.onSuccessNonExpected,
            TestTask.onErrorExpected);
        TestTask.task.deleteTask(objCb1.successCallback,
            objCb1.errorCallback,
            null);

        var objCb2 = TestEngine.registerCallback("Delete Itask with undefined Itask param",
            TestTask.onSuccessNonExpected,
            TestTask.onErrorExpected);
        TestTask.task.deleteTask(objCb2.successCallback,
            objCb2.errorCallback,
            undefined);
    }
};

TestEngine.setTestSuiteName("[WAC2.0][Task]");

//Cal001
//TestEngine.addTest(true,TestTask.test_modulePresence, "[WAC2.0][Task] Test Task");
//
////Cal002
//TestEngine.addTest(true,TestTask.test_taskProperties, "[WAC2.0][Task] Test Itask properties");
////Cal003
TestEngine.addTest(true,TestTask.test_getTask, "[WAC2.0][Task] Get task");
//
////Cal004
//TestEngine.addTest(true,TestTask.test_getTaskNoCallbacks, "[WAC2.0][Task] Get task with no callbacks");
////Cal005
//TestEngine.addTest(true,TestTask.test_getTaskInvalidCallbacks, "[WAC2.0][Task] Get task with invalid callbacks");
////Cal006
//TestEngine.addTest(true,TestTask.test_taskMethodsPresence, "[WAC2.0][Task] Task methods presence");
////Cal007
//TestEngine.addTest(true,TestTask.test_getTaskName, "[WAC2.0][Task] Get task name");
////Cal008
//TestEngine.addTest(true,TestTask.test_getTaskType, "[WAC2.0][Task] Get task type");
////Cal009
//TestEngine.addTest(true,TestTask.test_taskStaticProperties, "[WAC2.0][Task] Task static properties");
//
////Cal010
//TestEngine.addTest(true,TestTask.test_createEmptyTask, "[WAC2.0][Task] Create empty Itask");
////Cal011
//TestEngine.addTest(true,TestTask.test_taskAttributes, "[WAC2.0][Task] Itask attributes");
////Cal012
//TestEngine.addTest(true,TestTask.test_createTask, "[WAC2.0][Task] Create Itask");
//
////Cal013
//TestEngine.addTest(true,TestTask.test_addTask1, "[WAC2.0][Task] Add event1");
////Cal014
//TestEngine.addTest(true,TestTask.test_addTask2, "[WAC2.0][Task] Add event2");
////Cal015
//TestEngine.addTest(true,TestTask.test_addTask3, "[WAC2.0][Task] Add event3");
////Cal016
//TestEngine.addTest(true,TestTask.test_addTask4, "[WAC2.0][Task] Add event4");
////Cal017
//TestEngine.addTest(true,TestTask.test_addTask5, "[WAC2.0][Task] Add event5");
//
////Cal018
//TestEngine.addTest(true,TestTask.test_addTaskNoParams, "[WAC2.0][Task] Add Itask with no params");
////Cal019
//TestEngine.addTest(true,TestTask.test_addTaskNullCallbacksParams, "[WAC2.0][Task] Add Itask with wrong callbacks");
////Cal020
//TestEngine.addTest(true,TestTask.test_addTaskWrongEventParam, "[WAC2.0][Task] Add Itask with wrong Itask param");
//
////Cal021
//TestEngine.addTest(true,TestTask.test_findAllTasks, "[WAC2.0][Task] Find all tasks");
////Cal022
//TestEngine.addTest(true,TestTask.test_findTasksId, "[WAC2.0][Task] Find tasks, filter: id");
////Cal023
//TestEngine.addTest(true,TestTask.test_findTasksSummary, "[WAC2.0][Task] Find tasks, filter: summary");
////Cal024
//TestEngine.addTest(true,TestTask.test_findTasksDescription, "[WAC2.0][Task] Find tasks, filter: description");
////Cal025
//TestEngine.addTest(true,TestTask.test_findTasksStatus, "[WAC2.0][Task] Find tasks, filter: status");
//
//TestEngine.addTest(true,TestTask.test_findTasksPriority, "[WAC2.0][Task] Find tasks, filter: priority");
////Cal030
//TestEngine.addTest(true,TestTask.test_findTasksInitialDueDate, "[WAC2.0][Task] Find tasks, filter: initialDueDate");
////Cal031
//TestEngine.addTest(true,TestTask.test_findTasksEndDueDate, "[WAC2.0][Task] Find tasks, filter: endDueDate");
////Cal032
//TestEngine.addTest(true,TestTask.test_findTasksEmptyFilter, "[WAC2.0][Task] Find tasks, filter: empty filter");
//
////Cal035
//TestEngine.addTest(true,TestTask.test_findTasksSummaryNoResults, "[WAC2.0][Task] Find tasks, no results, filter: summary");
////Cal036
//TestEngine.addTest(true,TestTask.test_findTasksDescriptionNoResults, "[WAC2.0][Task] Find tasks, no results, filter: description");
////Cal039
//TestEngine.addTest(true,TestTask.test_findTasksNoParams, "[WAC2.0][Task] Find tasks with no params");
////Cal040
//TestEngine.addTest(true,TestTask.test_findTasksNullCallbacksParams, "[WAC2.0][Task] Find tasks with wrong callbacks");
////Cal041
//TestEngine.addTest(true,TestTask.test_findTasksWrongFilterParam, "[WAC2.0][Task] Find tasks with wrong filter param");
//
//TestEngine.addTest(true,TestTask.test_updateTask, "[WAC2.0][Task] Update Itask");
////Cal043
//TestEngine.addTest(true,TestTask.test_updateTaskNoParams, "[WAC2.0][Task] Update Itask with no params");
////Cal044
//TestEngine.addTest(true,TestTask.test_updateTaskNullCallbacksParams, "[WAC2.0][Task] Update Itask with wrong callbacks");
////Cal045
//TestEngine.addTest(true,TestTask.test_updateTaskWrongTaskParam, "[WAC2.0][Task] Update Itask with wrong Itask param");
//
////Cal046
//TestEngine.addTest(true,TestTask.test_deleteTask, "[WAC2.0][Task] Delete Itask");
////Cal047
//TestEngine.addTest(true,TestTask.test_deleteTaskNoParams, "[WAC2.0][Task] Delete Itask with no params");
////Cal048
//TestEngine.addTest(true,TestTask.test_deleteTaskNullCallbacksParams, "[WAC2.0][Task] Delete Itask with wrong callbacks");
////Cal049
//TestEngine.addTest(true,TestTask.test_deleteTaskWrongTaskParam, "[WAC2.0][Task] Delete Itask with wrong Itask param");
