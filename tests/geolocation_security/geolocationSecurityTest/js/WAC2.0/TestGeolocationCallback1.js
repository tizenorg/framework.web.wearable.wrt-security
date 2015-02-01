function localSuccessCallback(position){
    jsPrint("Success callback");
    TestEngine.test("Access granted.", true);
}

function localErrorCallback(error){
    jsPrint("Error callback");
    TestEngine.test("Access failed.", false);
}
