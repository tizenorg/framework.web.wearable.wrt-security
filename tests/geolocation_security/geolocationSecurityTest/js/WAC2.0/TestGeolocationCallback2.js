function localSuccessCallback(position){
    jsPrint("Success callback");
    TestEngine.test("Access granted.", false);
}

function localErrorCallback(error){
    jsPrint("Error callback");
    TestEngine.test("Access failed.", true);
}
