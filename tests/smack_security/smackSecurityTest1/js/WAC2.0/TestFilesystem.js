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
// -------------------------| Globals
var MAX_PATH_LENGTH = 256;

var LOCATION_SPECIFIERS = new Array(
    'wgt-package',
    'wgt-private',
    'wgt-private-tmp',
    'documents',
    'images',
    'videos',
    'removable',
    'downloads'
);

var TEST_ROOT_LOCATION = 'downloads';

// -------------------------| Error verification prerequisites
TestEngine.setErrorType(Object);
TestEngine.setErrorField('code');
var TYPE_MISMATCH_ERR = 17;
var IO_ERR = 100;
var INVALID_VALUES_ERR = 22;
var SECURITY_ERR = 18;
var NOT_FOUND_ERR = 8;
var UNKNOWN_ERR = 0;

// -------------------------| Setting up environment.
try {
  function on_resolve_error(err) { }
  function on_resolve_success(file) {
    function on_listFiles_success(files) {
      for (i = 0; i < files.length; ++i) {
        if (files[i].name.match(/^test_wac20_filesystem_/)) {
          files[i].isDirectory ? deleteDirectory(file, files[i]) : deleteFile(file, files[i]);
        }
      }
    }
    function on_listFiles_error(err) {
      TestEngine.log("Error while listing files.");
    }
    file.listFiles(on_listFiles_success, on_listFiles_error);
  }
  deviceapis.filesystem.resolve(on_resolve_success, on_resolve_error, TEST_ROOT_LOCATION);
}
catch (e) {
  TestEngine.log("Exception while setting up environment.");
}

// -------------------------| Tests
// WAC2-FILESYSTEM-001: Check filesystem manager properties.
function test_filesystem_properties_001() {
  var props = new Array();
  props.push(new Array('maxPathLength', MAX_PATH_LENGTH, 0, true, TestEngine.NUMBER));
  TestEngine.testProperties(deviceapis.filesystem, props);
}

// WAC2-FILESYSTEM-002: Resolve a file.
function test_filesystem_resolve_002() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) { TestEngine.test("resolve()", isFileObject(file));}
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-003: Resolve a non-existent file.
function test_filesystem_resolve_003() {
  function on_resolve_error(err) {
    TestEngine.test("resolve() non-existent file [IO_ERR]", (err.code == IO_ERR));
  }
  function on_resolve_success(file) {
    TestEngine.test("resolve() non-existent file [IO_ERR]", false);
  }
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, "locationdd");
}

// WAC-FILESYSTEM-004: List files from root directory.
function test_file_listFiles_004() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", isFileObject(file));
    function on_listFiles_error(err) {
      TestEngine.test("listFiles() [" + err.code + "]", false);
    }
    function on_listFiles_success(files) {
      TestEngine.test("listFiles()", isArray(files));
    }
    var cb = TestEngine.registerCallback("listFiles", on_listFiles_success, on_listFiles_error);
    file.listFiles(cb.successCallback, cb.errorCallback);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-005: Open file in read mode.
function test_file_open_005() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", isFileObject(file));
    var file2 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file2));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.close();
      deleteFile(file, file2);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    var stream = file2.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-006: Open file in write mode.
function test_file_open_006() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var file2 = file.createFile(getFileName());
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.close();
      deleteFile(file, file2);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    var stream = file2.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-007: Open file in append mode.
function test_file_open_007() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var file2 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file2));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.close();
      deleteFile(file, file2);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    var stream = file2.openStream(cb.successCallback, cb.errorCallback, "a", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-008: Call open function with invalid value of parameter 'mode'.
function test_file_open_error_008() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    function on_openStream_error(err) {
      TestEngine.test("Calling openStream() with invalid mode.", err.code === err.INVALID_VALUES_ERR);
      deleteFile(file, file2);
    }
    function on_openStream_success(fs) {
      TestEngine.test("Calling openStream() with invalid mode.", false);
      fs.close();
      deleteFile(file, file2);
    }
    var file2 = file.createFile(getFileName());
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file2.openStream(cb.successCallback, cb.errorCallback, "x", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-009: Call open function with invalid value of parameter 'encoding'.
function test_file_open_error_009() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    function on_openStream_error(err) {
      TestEngine.test("Calling openStream() with invalid encoding.", err.code === err.INVALID_VALUES_ERR);
      deleteFile(file, file2);
    }
    function on_openStream_success(fs) {
      TestEngine.test("Calling openStream() with invalid encoding.", false);
      fs.close();
      deleteFile(file, file2);
    }
    var file2 = file.createFile(getFileName());
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file2.openStream(cb.successCallback, cb.errorCallback, "r", "cp-1250");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-010: Copy file w/o overwrite.
function test_file_copyTo_010() {
  var g_file = null;
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    g_file = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_file));
    function on_copyTo_error(err) {
      TestEngine.test("copyTo() [" + err.code + "]", false);
      deleteFile(file, g_file);
    }
    function on_copyTo_success(file2) {
      TestEngine.test("copyTo()", isFile(file2));
      deleteFile(file, file2);
      deleteFile(file, g_file);
    }
    var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
    file.copyTo(cb.successCallback, cb.errorCallback, g_file.fullPath, file.fullPath + "/" + getFileName(), false);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-011: Copy file w/o overwrite when destination exists.
function test_file_copyTo_error_011() {
  var g_file = null;
  var g_dest = null;
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    g_dest = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_dest));

    g_file = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_file));

    function on_copyTo_error(err) {
      TestEngine.test("copyTo() [" + err.code + "]", (err.code == IO_ERR));
      deleteFile(file, g_file);
      deleteFile(file, g_dest);
    }
    function on_copyTo_success(file2) {
      TestEngine.test("copyTo()", false);
      deleteFile(file, file2);
      deleteFile(file, g_file);
      deleteFile(file, g_dest);
    }
    var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
    file.copyTo(cb.successCallback, cb.errorCallback, g_file.fullPath, file.fullPath + "/" + g_dest.name, false);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-012: Copy file with overwrite when destination exists.
function test_file_copyTo_012() {
  var g_file = null;
  var g_dest = null;
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    g_dest = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_dest));

    g_file = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_file));
    function on_copyTo_error(err) {
      TestEngine.test("copyTo() [" + err.code + "]", false);
      deleteFile(file, g_file);
      deleteFile(file, g_dest);
    }
    function on_copyTo_success(file2) {
      TestEngine.test("copyTo()", isFile(file2));
      deleteFile(file, file2);
      deleteFile(file, g_file);
    }
    var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
    file.copyTo(cb.successCallback, cb.errorCallback, g_file.fullPath, file.fullPath + "/" + g_dest.name, true);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-013: Create file.
function test_file_createFile_013() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var file1 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file1));
    deleteFile(file, file1);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-014: Create file with invalid characters in path.
function test_file_createFile_error_014() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.log("Calling createFile() with invalid characters in path. [NULL OBJECT]");
    TestEngine.catchErrorType("code", 100, file, "createFile", "!@#$%^&*(");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-015: Create file when it already exists.
function test_file_createFile_error_015() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var file1 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file1));
    TestEngine.log("Calling createFile() with path that already exists. [NULL OBJECT]");
    TestEngine.catchErrorType("code", 100, file, "createFile", file1.name);
    deleteFile(file, file1);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-016: Create file in file instead of directory.
function test_file_createFile_error_016() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var file1 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file1));
    TestEngine.log("Calling createFile() on file object. [NULL OBJECT]");
    TestEngine.catchErrorType("code", 100, file1, "createFile", getFileName());
    deleteFile(file, file1);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-017: Create file with invalid path componenet - "..".
function test_file_createFile_error_017() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.testPresetError(
        "Calling createFile() with invalid path component - \"..\".",
        function(){file.createFile("../testFile_021");},
        INVALID_VALUES_ERR
    );
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-018: Create directory.
function test_file_createDirectory_018() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var dir = file.createDirectory(getDirName());
    TestEngine.test("createDirectory()", isDir(dir));
    deleteDirectory(file, dir);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-019: Create directory with invalid character in path.
function test_file_createDirectory_error_019() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.log("Calling createDirectory() with invalid character in path. - [NULL OBJECT]");
    TestEngine.catchErrorType("code", 100, file, "createDirectory", "!@#$%^&*(");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-020: Create directory when it already exists.
function test_file_createDirectory_error_020() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var dir = file.createDirectory(getDirName());
    TestEngine.test("createDirectory()", isDir(dir));
    TestEngine.log("Calling createDirectory() with path that already exists. - [NULL OBJECT]");
    TestEngine.catchErrorType("code", 100, file, "createDirectory", dir.name);
    deleteDirectory(file, dir);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-021: Create directory in file instead of directory.
function test_file_createDirectory_error_021() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var file1 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file1));
    TestEngine.log("Calling createDirectory() on file object. - [NULL OBJECT]");
    TestEngine.catchErrorType("code", 100, file1, "createDirectory", getDirName());
    deleteFile(file, file1);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-022: Create file with invalid path componenet - "..".
function test_file_createDirectory_error_022() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.testPresetError(
      "Calling createDirectory() with invalid path component - \"..\".",
      function(){file.createDirectory("../" + getDirName());},
      INVALID_VALUES_ERR
    );
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-023: Move file w/o overwrite.
function test_file_moveTo_023() {
  var g_file = null;
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    g_file = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_file));
    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", false);
      deleteFile(file, g_file);
    }
    function on_moveTo_success(file1) {
      TestEngine.test("moveTo()", true);
      deleteFile(file, file1);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    file.moveTo(cb.successCallback, cb.errorCallback, g_file.fullPath, file.fullPath + "/" + getFileName(), false);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-024: Move file w/o overwrite when destination exists.
function test_file_moveTo_error_024() {
  var g_file = null;
  var g_dest = null;
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    g_dest = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_dest));
    g_file = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_file));

    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [IO_ERR]", (err.code == IO_ERR));
      deleteFile(file, g_file);
      deleteFile(file, g_dest);
    }
    function on_moveTo_success(file1) {
      TestEngine.test("moveTo()", false);
      deleteFile(file, file1);
      deleteFile(file, g_dest);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    file.moveTo(cb.successCallback, cb.errorCallback, g_file.fullPath, g_dest.fullPath, false);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-025: Move file with overwrite when destination exists.
function test_file_moveTo_025() {
  var g_file = null;
  var g_dest = null;
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    g_dest = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_dest));
    g_file = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_file));

    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", false);
      deleteFile(file, g_file);
      deleteFile(file, g_dest);
    }
    function on_moveTo_success(file1) {
      TestEngine.test("moveTo()", isFile(file1));
      deleteFile(file, file1);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    file.moveTo(cb.successCallback, cb.errorCallback, g_file.fullPath, g_dest.fullPath, true);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-026: Delete a file.
function test_file_deleteFile_026() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    deleteFile(file, f);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-027: Call deleteFile() on a directory.
function test_file_deleteFile_error_027() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var dir = file.createDirectory(getDirName());
    TestEngine.test("createDirectory()", isDir(dir));
    function on_deleteFile_error(err) {
      TestEngine.test("deleteFile() [" + err.code + "]", (err.code == INVALID_VALUES_ERR));
      deleteDirectory(file, dir);
    }
    function on_deleteFile_success() {
      TestEngine.test("deleteFile()", false);
    }
    var cb = TestEngine.registerCallback("deleteFile", on_deleteFile_success, on_deleteFile_error);
    file.deleteFile(cb.successCallback, cb.errorCallback, dir.fullPath);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-028: Call deleteFile() on a file.
function test_file_deleteFile_error_028() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var file1 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file1));
    var file2 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file2));
    function on_deleteFile_error(err) {
      TestEngine.test("Call deleteFile() on a file. [IO_ERR]", (err.code == IO_ERR));
      deleteFile(file, file1);
      deleteFile(file, file2);
    }
    function on_deleteFile_success() {
      TestEngine.test("Call deleteFile() on a file. [IO_ERR]", false);
      deleteFile(file, file2);
    }
    var cb = TestEngine.registerCallback("deleteFile", on_deleteFile_success, on_deleteFile_error);
    file1.deleteFile(cb.successCallback, cb.errorCallback, file2.fullPath);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-029: Call deleteFile() on the same file twice.
function test_file_deleteFile_error_029() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    deleteFile(file, f);
    function on_deleteFile_error(err) {
      TestEngine.test("Call deleteFile() on a file that has already been deleted. [IO_ERR]", (err.code == IO_ERR));
    }
    function on_deleteFile_success() {
      TestEngine.test("Call deleteFile() on a file that has already been deleted. [IO_ERR]", false);
    }
    var cb = TestEngine.registerCallback("deleteFile", on_deleteFile_success, on_deleteFile_error);
    file.deleteFile(cb.successCallback, cb.errorCallback, f.fullPath);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-030: Call deleteFile() on opened file.
function test_file_deleteFile_error_030() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      function on_deleteFile_error(err) {
        TestEngine.test("Call deleteFile() on opened file. [IO_ERR]", (err.code == IO_ERR));
        stream.close();
        deleteFile(file, f);
      }
      function on_deleteFile_success() {
        TestEngine.test("Call deleteFile() on opened file. [IO_ERR]", false);
        stream.close();
      }
      var cb = TestEngine.registerCallback("deleteFile", on_deleteFile_success, on_deleteFile_error);
      file.deleteFile(cb.successCallback, cb.errorCallback, f.fullPath);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-031: Delete a directory.
function test_file_deleteDirectory_031() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var dir = file.createDirectory(getDirName());
    TestEngine.test("createDirectory()", isDir(dir));
    deleteDirectory(file, dir);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-032: Call deleteDirectory() on a file.
function test_file_deleteDirectory_error_032() {
  var g_file = null;
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    g_file = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(g_file));
    function on_deleteDirectory_error(err) {
      TestEngine.test("Call deleteDirectory() on a file. [IO_ERR] [" + err.code + "]", (err.code == IO_ERR));
      deleteFile(file, g_file);
    }
    function on_deleteDirectory_success(file) {
      TestEngine.test("deleteDirectory()", false);
      deleteFile(file, g_file);
    }
    var cb = TestEngine.registerCallback("deleteDirectory", on_deleteDirectory_success, on_deleteDirectory_error);
    g_file.deleteDirectory(cb.successCallback, cb.errorCallback, "foo", true);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-033: Call deleteDirectory() on the same directory twice.
function test_file_deleteDirectory_error_033() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var dir = file.createDirectory(getDirName());
    TestEngine.test("createDirectory()", isDir(dir));
      function on_deleteDirectory2_error(err) {
        TestEngine.test("Call deleteDirectory() on a dir that has already been deleted. [IO_ERR] [" + err.code + "]", (err.code == IO_ERR));
      }
      function on_deleteDirectory2_success(file) {
        TestEngine.test("deleteDirectory()", false);
      }
    deleteDirectory(file, dir);
    var cb = TestEngine.registerCallback("deleteDirectory", on_deleteDirectory2_success, on_deleteDirectory2_error);
    file.deleteDirectory(cb.successCallback, cb.errorCallback, dir.fullPath, true);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-034: Call deleteDirectory() non-recursively on non-empty directory.
function test_file_deleteDirectory_error_034() {
  var g_dir = null;
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    g_dir = file.createDirectory(getDirName());
    TestEngine.test("createDirectory()", isDir(g_dir));
    TestEngine.test("createFile()", isFile(g_dir.createFile(getFileName())));
    function on_deleteDirectory_error(err) {
      TestEngine.test("Call deleteDirectory() non-recursively on non-empty dir. [IO_ERR]", (err.code == IO_ERR));
      deleteDirectory(file, g_dir);
    }
    function on_deleteDirectory_success() {
      TestEngine.test("deleteDirectory()", false);
    }
    var cb = TestEngine.registerCallback("deleteDirectory", on_deleteDirectory_success, on_deleteDirectory_error);
    file.deleteDirectory(cb.successCallback, cb.errorCallback, g_dir.fullPath, false);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-035: Call write()/read() on a stream.
function test_filestream_write_read_035() {
  var test_string = "It's alive! Alive!";
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream1) {
      TestEngine.test("openStream()", isFilestream(stream1));
      stream1.write(test_string);
      stream1.close();
      function on_openStream1_success(r_stream) {
        TestEngine.test("openStream()", isFilestream(r_stream));
        var read_string = r_stream.read(test_string.length);
        r_stream.close();
        TestEngine.test("write()/read()", (read_string === test_string));
        deleteFile(file, f);
      }
      function on_openStream1_error(err) {
        TestEngine.test("openStream() [" + err.code + "]", false);
      }
      var cb = TestEngine.registerCallback("openStream", on_openStream1_success, on_openStream1_error);
      f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-036: Call read() on a closed stream.
function test_filestream_read_error_036() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.close();
      TestEngine.testPresetError(
        "Call read() on a closed stream. [IO_ERR]",
        function(){stream.read(3);},
        IO_ERR
      );
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-037: Call read() on a stream with EOF flag set.
function test_filestream_read_error_037() {
  var test_string = "It's alive! Alive!";
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_string);
      stream.close();
      function on_openStream1_success(stream1) {
        TestEngine.test("openStream()", isFilestream(stream1));
        var read_string = stream1.read(test_string.length);
        TestEngine.testPresetError(
          "Call read() on stream with EOF set. [IO_ERR]",
          function(){stream1.read(1);},
          IO_ERR
        );
        stream1.close();
        deleteFile(file, f);
      }
      function on_openStream1_error(err) {
        TestEngine.test("openStream() [" + err.code + "]", false);
        deleteFile(file, f);
      }
      var cb = TestEngine.registerCallback("openStream", on_openStream1_success, on_openStream1_error);
      f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-038: Call openStream() on a directory.
function test_file_open_error_038() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var dir = file.createDirectory(getDirName());
    TestEngine.test("createDirectory()", isDir(dir));
    function on_openStream_success(stream) {
      TestEngine.test("Call openStream() on a directory.", false);
      stream.close();
    }
    function on_openStream_error(err) {
      TestEngine.test("Call openStream() on a directory. [IO_ERR]", (err.code == IO_ERR));
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    dir.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    deleteDirectory(file, dir);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-040: Call read() on write-only stream.
function test_filestream_read_error_040() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call read() on write-only stream. [IO_ERR]",
        function(){stream.read(0);},
        IO_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream()", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-041: Call write() on a closed stream.
function test_filestream_write_error_041() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.close();
      TestEngine.testPresetError(
        "Call write() on a closed stream. [IO_ERR]",
        function(){stream.write('test');},
        IO_ERR
      );
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream()", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-042: Call write() on read-only stream.
function test_filestream_write_error_042() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call write() on read-only stream. [IO_ERR]",
        function(){stream.write('test');},
        IO_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream()", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-043
// Parameters: stringData = array
// Result: Test passes (toString() called on JS Array).
function test_filestream_write_error_043() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(new Array('t','e','s','t'));
      TestEngine.test("write()", true);
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream()", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-044: Call write() w/o argument.
function test_filestream_write_error_044() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call write() w/o argument. [TYPE_MISMATCH_ERR]",
        function(){stream.write();},
        TYPE_MISMATCH_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream()", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-045: Call read() with invalid argument type.
function test_filestream_read_error_045() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.test("read()", stream.read('should be a number') == '');
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-046: Call read() w/o argument.
function test_filestream_read_error_046() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call read() w/o argument. [TYPE_MISMATCH_ERR]",
        function(){stream.read();},
        TYPE_MISMATCH_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-047: Call writeBytes()/readBytes() on a stream.
function test_filestream_writeBytes_readBytes_047() {
  var test_array = new Array(1, 2, 3, 4);
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.writeBytes(test_array);
      stream.close();
      function on_openStream1_success(stream1) {
        TestEngine.test("openStream()", isFilestream(stream1));
        var read_array = stream1.readBytes(test_array.length);
        stream1.close();
        var cmp = false;
        if (test_array.length == read_array.length) {
          cmp = true;
          for (i = 0; i < test_array.length; ++i) {
            if (test_array[i] != read_array[i]) {
              cmp = false;
              break;
            }
          }
        }
        TestEngine.test("writeBytes()/readBytes()", cmp);
        deleteFile(file, f);
      }
      function on_openStream1_error(err) {
        TestEngine.test("openStream() [" + err.code + "]", false);
        deleteFile(file, f);
      }
      var cb = TestEngine.registerCallback("openStream", on_openStream1_success, on_openStream1_error);
      f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-048: Call readBytes() on a closed stream.
function test_filestream_readBytes_error_048() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.close();
      TestEngine.testPresetError(
        "Call readBytes() on a closed stream. [IO_ERR]",
        function(){stream.readBytes(3);},
        IO_ERR
      );
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-049: Call readBytes() on a stream with EOF flag set.
function test_filestream_readBytes_error_049() {
  var test_array = new Array(1, 2, 3, 4);
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.writeBytes(test_array);
      stream.close();
      function on_openStream1_success(stream1) {
        TestEngine.test("openStream()", isFilestream(stream1));
        var read_array = stream1.readBytes(100);
        TestEngine.testPresetError(
          "Call readBytes() on stream with EOF set. [IO_ERR]",
          function(){stream1.readBytes(1);},
          IO_ERR
        );
        stream1.close();
        deleteFile(file, f);
      }
      function on_openStream1_error(err) {
        TestEngine.test("openStream() [" + err.code + "]", false);
        deleteFile(file, f);
      }
      var cb = TestEngine.registerCallback("openStream", on_openStream1_success, on_openStream1_error);
      f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-051: Call readBytes() on write-only stream.
function test_filestream_readBytes_error_051() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call readBytes() on write-only stream. [IO_ERR]",
        function(){stream.readBytes(0);},
        IO_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-052
// Parameters: byteCount = string
// Result: Test passes (conversion exception).
function test_filestream_readBytes_error_052() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.test("readBytes()", stream.readBytes('should be a number').length == 0);
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-053: Call readBytes() w/o argument.
function test_filestream_readBytes_error_053() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call read() w/o argument. [TYPE_MISMATCH_ERR]",
        function(){stream.readBytes();},
        TYPE_MISMATCH_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-054: Call writeBytes() on a closed stream.
function test_filestream_writeBytes_error_054() {
  var test_array = new Array(1, 2, 3, 4);
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.close();
      TestEngine.testPresetError(
        "Call writeBytes() on a closed stream. [IO_ERR]",
        function(){stream.writeBytes(test_array);},
        IO_ERR
      );
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-055: Call writeBytes() on read-only stream.
function test_filestream_writeBytes_error_055() {
  var test_array = new Array(1, 2, 3, 4);
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call writeBytes() on read-only stream. [IO_ERR]",
        function(){stream.writeBytes(test_array);},
        IO_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-056: Call writeBytes() with invalid argument type.
function test_filestream_writeBytes_error_056() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call writeBytes() with invalid argument. [TYPE_MISMATCH_ERR]",
        function(){stream.writeBytes(3);},
        TYPE_MISMATCH_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-057: Call writeBytes() w/o argument.
function test_filestream_writeBytes_057() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.writeBytes();
      stream.close();

      function on_openStream_read_success(stream) {
        TestEngine.test("openStream()", isFilestream(stream));
        var readData = stream.readBytes(256);
        stream.close();
        TestEngine.test("readBytes()", isArray(readData) && readData.length == 0);
        deleteFile(file, f);
      }

      var cb = TestEngine.registerCallback("openStream", on_openStream_read_success, on_openStream_error);
      f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-058: Call writeBase64()/readBase64() on a stream.
function test_filestream_writeBase64_readBase64_058() {
  var test_base64 = 'dGVzdA==';
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.writeBase64(test_base64);
      stream.close();
      function on_openStream1_success(stream1) {
        TestEngine.test("openStream()", isFilestream(stream1));
        var read_base64 = stream1.readBase64(100);
        stream1.close();
        TestEngine.test("writeBase64()/readBase64()", (test_base64 === read_base64));
        deleteFile(file, f);
      }
      function on_openStream1_error(err) {
        TestEngine.test("openStream() [" + err.code + "]", false);
        deleteFile(file, f);
      }
      var cb = TestEngine.registerCallback("openStream", on_openStream1_success, on_openStream1_error);
      f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-059: Call writeBase64()/read() on a stream.
function test_filestream_writeBase64_read_059() {
  var test_base64 = 'dGVzdA==';
  var test_string = 'test';
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.writeBase64(test_base64);
      stream.close();
      function on_openStream1_success(stream1) {
        TestEngine.test("openStream()", isFilestream(stream1));
        var read_string = stream1.read(test_string.length);
        stream1.close();
        TestEngine.test("writeBase64()/read()", (test_string === read_string));
        deleteFile(file, f);
      }
      function on_openStream1_error(err) {
        TestEngine.test("openStream() [" + err.code + "]", false);
        deleteFile(file, f);
      }
      var cb = TestEngine.registerCallback("openStream", on_openStream1_success, on_openStream1_error);
      f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-060: Call write()/readBase64() on a stream.
function test_filestream_write_readBase64_060() {
  var test_base64 = 'dGVzdA==';
  var test_string = 'test';
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_string);
      stream.close();
      function on_openStream1_success(stream1) {
        TestEngine.test("openStream()", isFilestream(stream1));
        var read_base64 = stream1.readBase64(100);
        stream1.close();
        TestEngine.test("write()/readBase64()", (test_base64 === read_base64));
        deleteFile(file, f);
      }
      function on_openStream1_error(err) {
        TestEngine.test("openStream() [" + err.code + "]", false);
        deleteFile(file, f);
      }
      var cb = TestEngine.registerCallback("openStream", on_openStream1_success, on_openStream1_error);
      f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-061: Call readBase64() on a closed stream.
function test_filestream_readBase64_error_061() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.close();
      TestEngine.testPresetError(
        "Call readBase64() on a closed stream. [IO_ERR]",
        function(){stream.readBase64(3);},
        IO_ERR
      );
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-062: Call readBase64() on a stream with EOF flag set.
function test_filestream_readBase64_error_062() {
  var test_base64 = 'dGVzdA==';
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.writeBase64(test_base64);
      stream.close();
      function on_openStream1_success(stream1) {
        TestEngine.test("openStream()", isFilestream(stream1));
        var read_base64 = stream1.readBase64(100);
        TestEngine.testPresetError(
          "Call readBase64() on stream with EOF set. [IO_ERR]",
          function(){stream1.readBase64(1);},
          IO_ERR
        );
        stream1.close();
        deleteFile(file, f);
      }
      function on_openStream1_error(err) {
        TestEngine.test("openStream() [" + err.code + "]", false);
        deleteFile(file, f);
      }
      var cb = TestEngine.registerCallback("openStream", on_openStream1_success, on_openStream1_error);
      f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-064: Call readBase64() on write-only stream.
function test_filestream_readBase64_error_064() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call readBase64() on write-only stream. [IO_ERR]",
        function(){stream.readBase64(0);},
        IO_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-065
// Parameters: byteCount = string
// Result: Test passes (empty string).
function test_filestream_readBase64_error_065() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.test("readBase64()", stream.readBase64('should be a number') == '');
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-066: Call readBase64() w/o argument.
function test_filestream_readBase64_error_066() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call readBase64() w/o argument. [TYPE_MISMATCH_ERR]",
        function(){stream.readBase64();},
        TYPE_MISMATCH_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-067: Call writeBase64() on a closed stream.
function test_filestream_writeBase64_error_067() {
  var test_base64 = 'dGVzdA==';
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.close();
      TestEngine.testPresetError(
        "Call writeBase64() on a closed stream. [IO_ERR]",
        function(){stream.writeBase64(test_base64);},
        IO_ERR
      );
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-068: Call writeBase64() on read-only stream.
function test_filestream_writeBase64_error_068() {
  var test_base64 = 'dGVzdA==';
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call writeBase64() on read-only stream. [IO_ERR]",
        function(){stream.writeBase64(test_base64);},
        IO_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-069
// Parameters: base64Data = invalid value
// Result: IO_ERR thrown in place.
function test_filestream_writeBase64_error_069() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call writeBase64() with invalid argument.",
        function(){stream.writeBase64(3);},
        IO_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-070: Call writeBase64() w/o argument.
function test_filestream_writeBase64_error_070() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.testPresetError(
        "Call writeBase64() w/o argument. [TYPE_MISMATCH_ERR]",
        function(){stream.writeBase64();},
        TYPE_MISMATCH_ERR
      );
      stream.close();
      deleteFile(file, f);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-071: Call createFile() on node resolved in read-only mode.
function test_file_createFile_error_071() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.testPresetError(
      "Call createFile() on read-only node. [SECURITY_ERR]",
      function() {
        var f = file.createFile(getFileName());
        deleteFile(file, f);
      },
      SECURITY_ERR
    );
  }
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "r");
}

// WAC-FILESYSTEM-072: Call deleteFile() on node resolved in read-only mode.
function test_file_deleteFile_error_072() {
  var filename = getFileName();
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("createFile()", isFile(file.createFile(filename)));

    function on_resolve1_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
    function on_resolve1_success(file) {
      var f = file.resolve(filename);
      TestEngine.test("resolve()", isFile(f));

      function on_deleteFile_error(err) {
        TestEngine.test("Call deleteFile() on read-only node. [SECURITY_ERR]", (err.code == SECURITY_ERR));
        function on_resolve2_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
        function on_resolve2_success(file) {
          var f = file.resolve(filename);
          TestEngine.test("resolve()", isFile(f));
          deleteFile(file, f);
        }
        var cb = TestEngine.registerCallback("resolve", on_resolve2_success, on_resolve2_error);
        deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "rw");
      }
      function on_deleteFile_success() {
        TestEngine.test("Call deleteFile() on read-only node. [SECURITY_ERR]", false);
      }
      var cb = TestEngine.registerCallback("deleteFile", on_deleteFile_success, on_deleteFile_error);
      file.deleteFile(cb.successCallback, cb.errorCallback, f.fullPath);
    }
    var cb = TestEngine.registerCallback("resolve", on_resolve1_success, on_resolve1_error);
    deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "r");
  }
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "rw");
}

// WAC-FILESYSTEM-073: Call deleteDirectory() on node resolved in read-only mode.
function test_file_deleteDirectory_error_073() {
  var dirname = getDirName();
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("createDirectory()", isDir(file.createDirectory(dirname)));

    function on_resolve1_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
    function on_resolve1_success(file) {
      var dir = file.resolve(dirname);
      TestEngine.test("resolve()", isDir(dir));

      function on_deleteDirectory_error(err) {
        TestEngine.test("Call deleteDirectory() on read-only node. [SECURITY_ERR]", (err.code == SECURITY_ERR));
        function on_resolve2_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
        function on_resolve2_success(file) {
          var dir = file.resolve(dirname);
          TestEngine.test("resolve()", isDir(dir));
          deleteDirectory(file, dir);
        }
        var cb = TestEngine.registerCallback("resolve", on_resolve2_success, on_resolve2_error);
        deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "rw");
      }
      function on_deleteDirectory_success() {
        TestEngine.test("Call deleteDirectory() on read-only node. [SECURITY_ERR]", false);
      }
      var cb = TestEngine.registerCallback("deleteDirectory", on_deleteDirectory_success, on_deleteDirectory_error);
      file.deleteDirectory(cb.successCallback, cb.errorCallback, dir.fullPath, true);
    }
    var cb = TestEngine.registerCallback("resolve", on_resolve1_success, on_resolve1_error);
    deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "r");
  }
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "rw");
}

// WAC-FILESYSTEM-074: Call moveTo() on node resolved in read-only mode.
function test_file_moveTo_error_074() {
  var src_filename = getFileName();
  var dst_filename = getFileName();
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(src_filename);
    TestEngine.test("createFile()", isFile(f));

    function on_resolve1_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
    function on_resolve1_success(file) {
      var f = file.resolve(src_filename);
      TestEngine.test("resolve()", isFile(f));

      function on_moveTo_error(err) {
        TestEngine.test("Call moveTo() on read-only mode. [SECURITY_ERR]", (err.code == SECURITY_ERR));
        function on_resolve2_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
        function on_resolve2_success(file) {
          var f = file.resolve(src_filename);
          TestEngine.test("resolve()", isFile(f));
          deleteFile(file, f);
        }
        var cb = TestEngine.registerCallback("resolve", on_resolve2_success, on_resolve2_error);
        deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "rw");
      }
      function on_moveTo_success(file1) {
        TestEngine.test("Call moveTo() on read-only mode. [SECURITY_ERR]", false);
        function on_resolve2_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
        function on_resolve2_success(file) {
          var f = file.resolve(dst_filename);
          TestEngine.test("resolve()", isFile(f));
          deleteFile(file, f);
        }
        var cb = TestEngine.registerCallback("resolve", on_resolve2_success, on_resolve2_error);
        deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "rw");
      }
      var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
      file.moveTo(cb.successCallback, cb.errorCallback, f.fullPath, file.fullPath + '/' + dst_filename, true);
    }
    var cb = TestEngine.registerCallback("resolve", on_resolve1_success, on_resolve1_error);
    deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "r");
  }
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "rw");
}

// WAC-FILESYSTEM-075: Call openStream() in write-only mode on node resolved in read-only mode.
function test_file_openStream_error_075() {
  var filename = getFileName();
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(filename);
    TestEngine.test("createFile()", isFile(f));

    function on_resolve1_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
    function on_resolve1_success(r_file) {
      var f = r_file.resolve(filename);
      TestEngine.test("resolve()", isFile(f));

      function on_openStream_success(stream) {
        TestEngine.test("Call openStream() in write-only mode on read-only node. [SECURITY_ERR]", false);
        stream.close();
        deleteFile(file, f);
      }
      function on_openStream_error(err) {
        TestEngine.test("Call openStream() in write-only mode on read-only node. [SECURITY_ERR]", (err.code == SECURITY_ERR));
        deleteFile(file, f);
      }
      var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
      f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
    }
    var cb = TestEngine.registerCallback("resolve", on_resolve1_success, on_resolve1_error);
    deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "r");
  }
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, "rw");
}

// WAC-FILESYSTEM-076: Call readAsText() on a file.
function test_file_readAsText_076() {
  var test_content = "Ala ma kota";
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));

    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_content);
      stream.close();
      function on_readAsText_error(err) {
        TestEngine.test("readAsText() [" + err.code + "]", false);
        deleteFile(file, f);
      }
      function on_readAsText_success(str) {
        TestEngine.test("readAsText()", (str === test_content));
        deleteFile(file, f);
      }
      var cb = TestEngine.registerCallback("readAsText", on_readAsText_success, on_readAsText_error);
      f.readAsText(cb.successCallback, cb.errorCallback, "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(file, f);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    f.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-077: Call readAsText() on a directory.
function test_file_readAsText_error_077() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var dir = file.createDirectory(getDirName());
    TestEngine.test("createDirectory()", isDir(dir));

    function on_readAsText_error(err) {
      TestEngine.test("Call readAsText() on a directory [IO_ERR]", (err.code == IO_ERR));
    }
    function on_readAsText_success(str) {
      TestEngine.test("Call readAsText() on a directory [IO_ERR]", false);
    }
    var cb = TestEngine.registerCallback("readAsText", on_readAsText_success, on_readAsText_error);
    dir.readAsText(cb.successCallback, cb.errorCallback, "UTF-8");
    deleteDirectory(file, dir);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-078: Call readAsText() on a deleted file.
function test_file_readAsText_error_078() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(root) {
    var file = root.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file));

    function on_deleteFile_error(err) { TestEngine.test("deleteFile() [" + err.code + "]", false); }
    function on_deleteFile_success() {
      function on_readAsText_error(err) {
        TestEngine.test("Call readAsText() on a deleted file [IO_ERR]", (err.code == IO_ERR));
      }
      function on_readAsText_success(str) {
        TestEngine.test("Call readAsText() on a deleted file [IO_ERR]", false);
      }
      var cb = TestEngine.registerCallback("readAsText", on_readAsText_success, on_readAsText_error);
      file.readAsText(cb.successCallback, cb.errorCallback, "UTF-8");
    }
    var cb = TestEngine.registerCallback("deleteFile", on_deleteFile_success, on_deleteFile_error);
    root.deleteFile(cb.successCallback, cb.errorCallback, file.fullPath);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-079: Call toUri() on file located in root folder.
function test_file_toUri_079() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var f = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(f));
    var uri = f.toURI();
    TestEngine.test("Call toUri() returns non empty string", isString(uri) && uri.length > 0);
    TestEngine.log("created uri: " + uri);
    deleteFile(file, f);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-080: Resolve a file with mode set to null.
function test_filesystem_resolve_080() {
  function on_resolve_error(err) {
    TestEngine.test("resolve()", false);
  }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", true);
  }
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, null);
}

// WAC-FILESYSTEM-081: List files with null passed as filter.
function test_file_listFiles_081() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", isFileObject(file));
    function on_listFiles_error(err) {
      TestEngine.test("listFiles() [" + err.code + "]", false);
    }
    function on_listFiles_success(files) {
      TestEngine.test("listFiles()", isArray(files));
    }
    var cb = TestEngine.registerCallback("listFiles", on_listFiles_success, on_listFiles_error);
    file.listFiles(cb.successCallback, cb.errorCallback, null);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-082: List files with undefined passed as filter.
function test_file_listFiles_082() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", isFileObject(file));
    function on_listFiles_error(err) {
      TestEngine.test("listFiles() [" + err.code + "]", false);
    }
    function on_listFiles_success(files) {
      TestEngine.test("listFiles()", isArray(files));
    }
    var cb = TestEngine.registerCallback("listFiles", on_listFiles_success, on_listFiles_error);
    file.listFiles(cb.successCallback, cb.errorCallback, undefined);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-083
// Parameters: filter = 1, others = valid
// Result: Test passes.
function test_file_listFiles_error_083() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", isFileObject(file));

    function on_listFiles_error(err) {
      TestEngine.test("listFiles()", false);
    }
    function on_listFiles_success(files) {
      TestEngine.test("listFiles()", isArray(files));
    }
    var cb = TestEngine.registerCallback("listFiles", on_listFiles_success, on_listFiles_error);
    file.listFiles(cb.successCallback, cb.errorCallback, 1);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-084: List files with null passed as success callback.
function test_file_listFiles_error_084() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", isFileObject(file));
    function on_listFiles_error(err) {
      TestEngine.test("listFiles() [" + err.code + "]", (err.code == INVALID_VALUES_ERR));
    }
    function on_listFiles_success(files) {
      TestEngine.test("listFiles()", false);
    }
    var cb = TestEngine.registerCallback("listFiles", on_listFiles_success, on_listFiles_error);
    file.listFiles(null, cb.errorCallback);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-085
// Parameters: successCallback = undefined, others = valid
// Result: INVALID_VALUES_ERR thrown via error callback.
function test_file_listFiles_error_085() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", isFileObject(file));
    function on_listFiles_error(err) {
      TestEngine.test("listFiles()", (err.code == INVALID_VALUES_ERR));
    }
    var cb = TestEngine.registerCallback("listFiles", undefined, on_listFiles_error);
    file.listFiles(cb.successCallback, cb.errorCallback);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-086: List files with both callbacks set to null. Nothing should happen.
function test_file_listFiles_error_086() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", isFileObject(file));
    function on_listFiles_error(err) {
      TestEngine.test("listFiles() [" + err.code + "]", false);
    }
    function on_listFiles_success(files) {
      TestEngine.test("listFiles()", false);
    }
    // Pass callbacks directly to prevent "widget run timeout".
    file.listFiles(null, null);
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-087: Test optionality of the last parameter.
function test_file_open_087() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", isFileObject(file));
    var file2 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file2));
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.close();
      deleteFile(file, file2);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    var stream = file2.openStream(cb.successCallback, cb.errorCallback, "r");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-088: Test success callback set to null.
function test_file_open_error_088() {
  function on_resolve_success(root) {
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", (err.code == INVALID_VALUES_ERR));
      deleteFile(root, file);
    }
    var file = createFileForParent(root);
    // Pass callbacks directly to prevent "widget run timeout".
    var cb = TestEngine.registerCallback("openStream", null, on_openStream_error);
    var stream = file.openStream(null, cb.errorCallback, "r");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-089
// Parameters: successCallback = undefined, others = valid
// Result: INVALID_VALUES_ERR thrown via error callback.
function test_file_open_error_089() {
  function on_resolve_success(root) {
    var file = createFileForParent(root);

    function on_openStream_error(err) {
      TestEngine.test("openStream()", (err.code == INVALID_VALUES_ERR));
      deleteFile(root, file);
    }
    
    var cb = TestEngine.registerCallback("openStream", undefined, on_openStream_error);
    var stream = file.openStream(cb.successCallback, cb.errorCallback, "r");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-090: Test passing invalid mode with error callback set to null.
function test_file_open_error_090() {
  function on_resolve_success(root) {
    function on_openStream_success(fs) {
      TestEngine.test("Calling openStream() with invalid mode.", false);
      fs.close();
      deleteFile(root, file);
    }
    var file = createFileForParent(root);
    testNoExceptionWithMessage("openStream()", function() {
      // Pass callbacks directly to prevent "widget run timeout".
      file.openStream(on_openStream_success, null, "x", "UTF-8");
    });
    deleteFile(root, file);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-091: Call readAsText() w/o specifing encoding parameter.
function test_file_readAsText_091() {
  var test_content = "Ala ma kota";
  function on_resolve_success(root) {
    var file = createFileForParent(root)

    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_content);
      stream.close();

      function on_readAsText_error(err) {
        TestEngine.test("readAsText() [" + err.code + "]", false);
        deleteFile(root, file);
      }
      function on_readAsText_success(str) {
        TestEngine.test("readAsText()", (str === test_content));
        deleteFile(root, file);
      }
      var cb = TestEngine.registerCallback("readAsText", on_readAsText_success, on_readAsText_error);
      file.readAsText(cb.successCallback, cb.errorCallback);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-092: Call readAsText() with encoding parameter set to null.
function test_file_readAsText_092() {
  var test_content = "Ala ma kota";
  function on_resolve_success(root) {
    var file = createFileForParent(root)

    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_content);
      stream.close();

      function on_readAsText_error(err) {
        TestEngine.test("readAsText() [" + err.code + "]", false);
        deleteFile(root, file);
      }
      function on_readAsText_success(str) {
        TestEngine.test("readAsText()", (str === test_content));
        deleteFile(root, file);
      }
      var cb = TestEngine.registerCallback("readAsText", on_readAsText_success, on_readAsText_error);
      file.readAsText(cb.successCallback, cb.errorCallback, null);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-093: Call readAsText() with error callback set to null.
function test_file_readAsText_093() {
  var test_content = "Ala ma kota";
  function on_resolve_success(root) {
    var file = createFileForParent(root)

    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_content);
      stream.close();

      function on_readAsText_success(str) {
        TestEngine.test("readAsText()", (str === test_content));
        deleteFile(root, file);
      }
      var cb = TestEngine.registerCallback("readAsText", on_readAsText_success, null);
      file.readAsText(cb.successCallback, null);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-094: Call readAsText() w/o specifing error callback.
function test_file_readAsText_094() {
  var test_content = "Ala ma kota";
  function on_resolve_success(root) {
    var file = createFileForParent(root)

    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_content);
      stream.close();

      function on_readAsText_success(str) {
        TestEngine.test("readAsText()", (str === test_content));
        deleteFile(root, file);
      }
      var cb = TestEngine.registerCallback("readAsText", on_readAsText_success, null);
      file.readAsText(cb.successCallback);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-095: Call readAsText() with success callback set to null.
function test_file_readAsText_error_095() {
  var test_content = "Ala ma kota";
  function on_resolve_success(root) {
    var file = createFileForParent(root)

    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_content);
      stream.close();

      function on_readAsText_error(err) {
        TestEngine.test("readAsText() [" + err.code + "]", (err.code == INVALID_VALUES_ERR));
        deleteFile(root, file);
      }
      var cb = TestEngine.registerCallback("readAsText", null, on_readAsText_error);
      file.readAsText(null, cb.errorCallback);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-096: Call readAsText() with both callbacks set to null.
function test_file_readAsText_error_096() {
  var test_content = "Ala ma kota";
  function on_resolve_success(root) {
    var file = createFileForParent(root)

    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_content);
      stream.close();

      testNoExceptionWithMessage("readAsText()", function() {
        file.readAsText(null, null);
      });
      deleteFile(root, file);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-097
// Parameters: successCallback = undefined, others = valid
// Result: INVALID_VALUES_ERR thrown via error callback.
function test_file_readAsText_error_097() {
  var test_content = "Ala ma kota";
  function on_resolve_success(root) {
    var file = createFileForParent(root)

    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_content);
      stream.close();

      function on_readAsText_error(err) {
        TestEngine.test("readAsText()", (err.code == INVALID_VALUES_ERR));
        deleteFile(root, file);
      }
      
      var cb = TestEngine.registerCallback("readAsText", undefined, on_readAsText_error);
      file.readAsText(cb.successCallback, cb.errorCallback, "r");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-098: Call readAsText() with invalid encoding parameter.
function test_file_readAsText_error_098() {
  var test_content = "Ala ma kota";
  function on_resolve_success(root) {
    var file = createFileForParent(root)

    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_content);
      stream.close();

      function on_readAsText_error(err) {
        TestEngine.test("readAsText() [" + err.code + "]", (err.code == INVALID_VALUES_ERR));
        deleteFile(root, file);
      }
      function on_readAsText_success(str) {
        TestEngine.test("readAsText()", false);
        deleteFile(root, file);
      }
      var cb = TestEngine.registerCallback("readAsText", on_readAsText_success, on_readAsText_error);
      file.readAsText(cb.successCallback, cb.errorCallback, "INVALID");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-099: Call deleteDirectory() with error callback set to null.
function test_file_deleteDirectory_099() {
  function on_resolve_success(root) {
    var dir = createDirForParent(root);
    function on_deleteDirectory_success() {
      TestEngine.test("deleteDirectory()", true);
    }
    var cb = TestEngine.registerCallback("deleteDirectory", on_deleteDirectory_success, null);
    root.deleteDirectory(cb.successCallback, null, dir.fullPath, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-100: Call deleteDirectory() with error callback set to null
//                     and directory set to invalid value.
function test_file_deleteDirectory_error_100() {
  function on_resolve_success(root) {
    function on_deleteDirectory_success() {
      TestEngine.test("deleteDirectory()", false);
    }
    testNoExceptionWithMessage("deleteDirectory()", function() {
      // Pass callbacks directly to prevent "widget run timeout".
      root.deleteDirectory(on_deleteDirectory_success, null, "../", true);
    });
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-101: Call deleteDirectory() with success callback set to null.
function test_file_deleteDirectory_error_101() {
  function on_resolve_success(root) {
    var dir = createDirForParent(root);
    function on_deleteDirectory_error(err) {
      TestEngine.test("deleteDirectory() [" + err.code + "]", (err.code == INVALID_VALUES_ERR));
      deleteDirectory(root, dir);
    }
    var cb = TestEngine.registerCallback("deleteDirectory", null, on_deleteDirectory_error);
    root.deleteDirectory(null, cb.errorCallback, dir.fullPath, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-102
// Parameters: successCallback = undefined, others = valid
// Result: INVALID_VALUES_ERR thrown via error callback.
function test_file_deleteDirectory_error_102() {
  function on_resolve_success(root) {
    var dir = createDirForParent(root);
    function on_deleteDirectory_error(err) {
      TestEngine.test("deleteDirectory()", (err.code == INVALID_VALUES_ERR));
      deleteDirectory(root, dir);
    }
    var cb = TestEngine.registerCallback("deleteDirectory", undefined, on_deleteDirectory_error);
    root.deleteDirectory(cb.successCallback, cb.errorCallback, dir.fullPath, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-103
// Parameters: directory = undefined, others = valid
// Result: INVALID_VALUES_ERR thrown via error callback.
function test_file_deleteDirectory_error_103() {
  function on_resolve_success(root) {
    var dir = createDirForParent(root);
    function on_deleteDirectory_error(err) {
      TestEngine.test("deleteDirectory()", (err.code == INVALID_VALUES_ERR));
      deleteDirectory(root, dir);
    }
    function on_deleteDirectory_success() {
      TestEngine.test("deleteDirectory()", false);
      deleteDirectory(root, dir);
    }
    var cb = TestEngine.registerCallback("deleteDirectory", on_deleteDirectory_success, on_deleteDirectory_error);
    root.deleteDirectory(cb.successCallback, cb.errorCallback, undefined, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-104
// Parameters: recursive = undefined, others = valid
// Result: Test passes.
function test_file_deleteDirectory_error_104() {
  function on_resolve_success(root) {
    var dir = createDirForParent(root);
    function on_deleteDirectory_error(err) {
      TestEngine.test("deleteDirectory()", false);
      deleteDirectory(root, dir);
    }
    function on_deleteDirectory_success() {
      TestEngine.test("deleteDirectory()", true);
    }
    
    var cb = TestEngine.registerCallback("deleteDirectory", on_deleteDirectory_success, on_deleteDirectory_error);
    root.deleteDirectory(cb.successCallback, cb.errorCallback, dir.fullPath, undefined);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-105: Call deleteDirectory() with directory parameter pointing to a file.
function test_file_deleteDirectory_error_105() {
  function on_resolve_success(root) {
    var file = createFileForParent(root);
    function on_deleteDirectory_error(err) {
      TestEngine.test("deleteDirectory() [" + err.code + "]", (err.code == INVALID_VALUES_ERR));
      deleteFile(root, file);
    }
    function on_deleteDirectory_success() {
      TestEngine.test("deleteDirectory()", false);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("deleteDirectory", on_deleteDirectory_success, on_deleteDirectory_error);
    root.deleteDirectory(cb.successCallback, cb.errorCallback, file.fullPath, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-106: Call deleteFile() with error callback set to null.
function test_file_deleteFile_106() {
  function on_resolve_success(root) {
    var file = createFileForParent(root);
    function on_deleteFile_success() {
      TestEngine.test("deleteFile()", true);
    }
    var cb = TestEngine.registerCallback("deleteFile", on_deleteFile_success, null);
    root.deleteFile(cb.successCallback, null, file.fullPath);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-107: Call deleteFile() with error callback set to null
//                     and file set to invalid value.
function test_file_deleteFile_error_107() {
  function on_resolve_success(root) {
    function on_deleteFile_success() {
      TestEngine.test("deleteFile()", false);
    }
    testNoExceptionWithMessage("deleteFile()", function() {
      // Pass callbacks directly to prevent "widget run timeout".
      root.deleteFile(on_deleteFile_success, null, "../");
    });
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-108: Call deleteFile() with success callback set to null.
function test_file_deleteFile_error_108() {
  function on_resolve_success(root) {
    var file = createFileForParent(root);
    function on_deleteFile_error(err) {
      TestEngine.test("deleteFile() [" + err.code + "]", (err.code == INVALID_VALUES_ERR));
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("deleteFile", null, on_deleteFile_error);
    root.deleteFile(null, cb.errorCallback, file.fullPath);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-109
// Parameters: successCallback = undefined, others valid
// Result: INVALID_VALUES_ERR thrown via error callback.
function test_file_deleteFile_error_109() {
  function on_resolve_success(root) {
    var file = createFileForParent(root);
    function on_deleteFile_error(err) {
      TestEngine.test("deleteFile()", (err.code == INVALID_VALUES_ERR));
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("deleteFile", undefined, on_deleteFile_error);
    root.deleteFile(cb.successCallback, cb.errorCallback, file.fullPath);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-110
// Parameters: file = undefined, others = valid
// Result: INVALID_VALUES_ERR thrown via error callback.
function test_file_deleteFile_error_110() {
  function on_resolve_success(root) {
    function on_deleteFile_error(err) {
      TestEngine.test("deleteFile()", (err.code == INVALID_VALUES_ERR));
    }
    function on_deleteFile_success() {
      TestEngine.test("deleteFile()", false);
    }
    var cb = TestEngine.registerCallback("deleteFile", on_deleteFile_success, on_deleteFile_error);
    root.deleteFile(cb.successCallback, cb.errorCallback, undefined);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-111
// Parameters: errorCallback = undefined, others = valid
// Result: Test passes.
function test_file_deleteFile_error_111() {
  function on_resolve_success(root) {
    var file = createFileForParent(root);
    function on_deleteFile_success() {
      TestEngine.test("deleteFile()", true);
    }
    var cb = TestEngine.registerCallback("deleteFile", on_deleteFile_success, undefined);
    root.deleteFile(cb.successCallback, cb.errorCallback, file.fullPath);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-112
// Parameters: mode = undefined, others = valid
// Result: Test passes.
function test_filesystem_resolve_112() {
  function on_resolve_error(err) {
   TestEngine.test("resolve() [" + err.code + "]", false);
  }
  function on_resolve_success(root) {
   TestEngine.test("resolve()", true);
  }
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION, undefined);
}

// WAC-FILESYSTEM-113
// Parameters: encoding = undefined, others = valid
// Result: Test passes.
function test_file_readAsText_113() {
  var test_content = "Ala ma kota";
  function on_resolve_success(root) {
    var file = createFileForParent(root)

    function on_openStream_success(stream) {
      TestEngine.test("openStream()", isFilestream(stream));
      stream.write(test_content);
      stream.close();

      function on_readAsText_error(err) {
        TestEngine.test("readAsText() [" + err.code + "]", false);
        deleteFile(root, file);
      }
      function on_readAsText_success(str) {
        TestEngine.test("readAsText()", (str === test_content));
        deleteFile(root, file);
      }
      var cb = TestEngine.registerCallback("readAsText", on_readAsText_success, on_readAsText_error);
      file.readAsText(cb.successCallback, cb.errorCallback, undefined);
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-114
// Parameters: encoding = undefined, others = valid
// Result: INVALID_VALUES_ERR thrown via error callback.
function test_file_open_114() {
  function on_resolve_success(root) {
    var file = createFileForParent(root);
    function on_openStream_error(err) {
      TestEngine.test("openStream()", (err.code == INVALID_VALUES_ERR));
      deleteFile(root, file);
    }
    function on_openStream_success(stream) {
      TestEngine.test("openStream()", false);
      stream.close();
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    var stream = file.openStream(cb.successCallback, cb.errorCallback, "r", undefined);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-115
// Parameters: originFilePath = (empty) directory, overwrite = false
// Result: Test passes.
function test_file_copyTo_115() {
  function on_resolve_success(root) {
    var dir = createDirForParent(root);
    function on_copyTo_error(err) {
      TestEngine.test("copyTo() [" + err.code + "]", false);
      deleteDirectory(root, dir);
    }
    function on_copyTo_success(copy) {
      TestEngine.test("copyTo()", isDir(copy));
      deleteDirectory(root, copy);
      deleteDirectory(root, dir);
    }
    var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
    root.copyTo(cb.successCallback, cb.errorCallback, dir.fullPath, root.fullPath + "/" + getDirName(), false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-116
// Parameters: originFilePath = (non-empty) directory, overwrite = false
// Result: Test passes.
function test_file_copyTo_116() {
  function on_resolve_success(root) {
    var dir = createDirForParent(root);
    var file = createFileForParent(dir);
    function on_copyTo_error(err) {
      TestEngine.test("copyTo() [" + err.code + "]", false);
      deleteDirectory(root, dir);
    }
    function on_copyTo_success(copy) {
      TestEngine.test("copyTo()", isDir(copy));
      var child = copy.resolve(file.name);
      TestEngine.test("copyTo()", isFile(child));
      deleteDirectory(root, copy);
      deleteDirectory(root, dir);
    }
    var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
    root.copyTo(cb.successCallback, cb.errorCallback, dir.fullPath, root.fullPath + "/" + getDirName(), false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-117
// Parameters: originFilePath = undefined, other params = valid.
// Result: INVALID_VALUES_ERR thrown via errorCallback.
function test_file_copyTo_error_117() {
  function on_resolve_success(root) {
    function on_copyTo_error(err) {
      TestEngine.test("copyTo()", (err.code == INVALID_VALUES_ERR));
    }
    function on_copyTo_success(copy) {
      TestEngine.test("copyTo()", false);
      deleteDirectory(root, copy);
    }
    var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
    root.copyTo(cb.successCallback, cb.errorCallback, undefined, root.fullPath + "/" + getDirName(), false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-118
// Parameters: originFilePath = invalid path, overwrite = false
// Result: INVALID_VALUES_ERR returned by error callback.
function test_file_copyTo_error_118() {
  function on_resolve_success(root) {
   function on_copyTo_error(err) {
     TestEngine.test("copyTo() [" + err.code + "]", (err.code == INVALID_VALUES_ERR));
   }
   function on_copyTo_success(copy) {
     TestEngine.test("copyTo()", false);
     deleteDirectory(root, copy);
   }
   var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
   root.copyTo(cb.successCallback, cb.errorCallback, "../", root.fullPath + "/" + getDirName(), false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-119
// Parameters: originFilePath = valid file, destinationFilePath = valid directory, overwrite = true
// Result: Test passes (replacing destination directory with a origin file).
function test_file_copyTo_119() {
  function on_resolve_success(root) {
    var file = createFileForParent(root);
    var dir = createDirForParent(root);
    function on_copyTo_error(err) {
      TestEngine.test("copyTo() [" + err.code + "]", false);
      deleteDirectory(root, dir);
      deleteFile(root, file);
    }
    function on_copyTo_success(copy) {
      TestEngine.test("copyTo()", (copy.fullPath == dir.fullPath) && isFile(copy));
      deleteFile(root, copy);
      deleteFile(root, file);
    }
    var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
    root.copyTo(cb.successCallback, cb.errorCallback, file.fullPath, dir.fullPath, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-120
// Parameters: originFilePath = valid file, destinationFilePath = valid directory, overwrite = false
// Result: IO_ERR passed via error callback.
function test_file_copyTo_error_120() {
  function on_resolve_success(root) {
   var file = createFileForParent(root);
   var dir = createDirForParent(root);
   function on_copyTo_error(err) {
     TestEngine.test("copyTo() [" + err.code + "]", (err.code == IO_ERR));
     deleteDirectory(root, dir);
     deleteFile(root, file);
   }
   function on_copyTo_success(copy) {
     TestEngine.test("copyTo()", false);
     deleteFile(root, copy);
     deleteFile(root, file);
   }
   var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
   root.copyTo(cb.successCallback, cb.errorCallback, file.fullPath, dir.fullPath, false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-121
// Parameters: originFilePath = valid directory, destinationFilePath = valid file, overwrite = true
// Result: Test passes (replacing destination file with a origin directory).
function test_file_copyTo_121() {
  function on_resolve_success(root) {
   var file = createFileForParent(root);
   var dir = createDirForParent(root);
   var child = createFileForParent(dir);
   function on_copyTo_error(err) {
     TestEngine.test("copyTo() [" + err.code + "]", false);
     deleteDirectory(root, dir);
     deleteFile(root, file);
   }
   function on_copyTo_success(copy) {
     TestEngine.test("copyTo()", (copy.fullPath == file.fullPath) && isDir(copy));
     TestEngine.test("resolve()", isFile(copy.resolve(child.name)));
     deleteDirectory(root, copy);
     deleteDirectory(root, dir);
   }
   var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
   root.copyTo(cb.successCallback, cb.errorCallback, dir.fullPath, file.fullPath, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-122
// Parameters: originFilePath = valid directory, destinationFilePath = valid file, overwrite = false
// Result: IO_ERR passed via error callback.
function test_file_copyTo_error_122() {
  function on_resolve_success(root) {
    var file = createFileForParent(root);
    var dir = createDirForParent(root);
    function on_copyTo_error(err) {
      TestEngine.test("copyTo() [" + err.code + "]", (err.code == IO_ERR));
      deleteDirectory(root, dir);
      deleteFile(root, file);
    }
    function on_copyTo_success(copy) {
      TestEngine.test("copyTo()", false);
      deleteDirectory(root, copy);
      deleteDirectory(root, dir);
    }
    var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
    root.copyTo(cb.successCallback, cb.errorCallback, dir.fullPath, file.fullPath, false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-123
// Parameters: originFilePath = valid directory, destinationFilePath = valid directory, overwrite = true
// Result: Test passes (replacing destination directory with a origin directory).
function test_file_copyTo_123() {
  function on_resolve_success(root) {
    var src = createDirForParent(root);
    var dest = createDirForParent(root);
    var child = createFileForParent(src);
    function on_copyTo_error(err) {
      TestEngine.test("copyTo() [" + err.code + "]", false);
      deleteDirectory(root, src);
      deleteDirectory(root, dest);
    }
    function on_copyTo_success(copy) {
      TestEngine.test("copyTo()", (copy.fullPath == dest.fullPath) && isDir(copy));
      TestEngine.test("resolve()", isFile(copy.resolve(child.name)));
      deleteDirectory(root, copy);
      deleteDirectory(root, src);
    }
    var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
    root.copyTo(cb.successCallback, cb.errorCallback, src.fullPath, dest.fullPath, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-124
// Parameters: originFilePath = valid directory, destinationFilePath = valid directory, overwrite = false
// Result: IO_ERR passed via error callback.
function test_file_copyTo_error_124() {
  function on_resolve_success(root) {
    var src = createDirForParent(root);
    var dest = createDirForParent(root);
    function on_copyTo_error(err) {
     TestEngine.test("copyTo() [" + err.code + "]", (err.code == IO_ERR));
     deleteDirectory(root, src);
     deleteDirectory(root, dest);
    }
    function on_copyTo_success(copy) {
     TestEngine.test("copyTo()", false);
     deleteDirectory(root, copy);
     deleteDirectory(root, src);
    }
    var cb = TestEngine.registerCallback("copyTo", on_copyTo_success, on_copyTo_error);
    root.copyTo(cb.successCallback, cb.errorCallback, src.fullPath, dest.fullPath, false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-125
// Parameters: originFilePath = (empty) directory, overwrite = false
// Result: Test passes.
function test_file_moveTo_125() {
  function on_resolve_success(root) {
    var src = createDirForParent(root);
    var dest = root.fullPath + "/" + getDirName();
    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", false);
      deleteDirectory(root, src);
    }
    function on_moveTo_success(result) {
      TestEngine.test("moveTo()", isDir(result));
      TestEngine.testPresetError(
        "resolve() [NOT_FOUND_ERR]",
        function() { root.resolve(src.name) },
        NOT_FOUND_ERR
      );
      deleteDirectory(root, result);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    root.moveTo(cb.successCallback, cb.errorCallback, src.fullPath, dest, false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-126
// Parameters: originFilePath = (non-empty) directory, overwrite = false
// Result: Test passes.
function test_file_moveTo_126() {
  function on_resolve_success(root) {
    var src = createDirForParent(root);
    var file = createFileForParent(src);
    var dest = root.fullPath + "/" + getDirName();
    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", false);
      deleteDirectory(root, src);
    }
    function on_moveTo_success(result) {
      TestEngine.test("moveTo()", isDir(result));
      var child = result.resolve(file.name);
      TestEngine.test("resolve()", isFile(child));
      TestEngine.testPresetError(
        "resolve() [NOT_FOUND_ERR]",
        function() { root.resolve(src.name) },
        NOT_FOUND_ERR
      );
      deleteDirectory(root, result);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    root.moveTo(cb.successCallback, cb.errorCallback, src.fullPath, dest, false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-127
// Parameters: originFilePath = undefined, other params = valid.
// Result: INVALID_VALUES_ERR thrown via errorCallback.
function test_file_moveTo_error_127() {
  function on_resolve_success(root) {
    var dest = root.fullPath + "/" + getDirName();
    function on_moveTo_error(err) {
      TestEngine.test("moveTo()", (err.code == INVALID_VALUES_ERR));
    }
    function on_moveTo_success(result) {
      TestEngine.test("moveTo()", false);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    root.moveTo(cb.successCallback, cb.errorCallback, undefined, dest, false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-128
// Parameters: originFilePath = invalid path, overwrite = false
// Result: INVALID_VALUES_ERR returned by error callback.
function test_file_moveTo_error_128() {
  function on_resolve_success(root) {
    var src = "../";
    var dest = root.fullPath + "/" + getDirName();
    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", (err.code == INVALID_VALUES_ERR));
    }
    function on_moveTo_success(result) {
      TestEngine.test("moveTo()", false);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    root.moveTo(cb.successCallback, cb.errorCallback, src, dest, false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-129
// Parameters: originFilePath = valid file, destinationFilePath = valid directory, overwrite = true
// Result: IO_ERR passed via error callback.
function test_file_moveTo_129() {
  function on_resolve_success(root) {
    var src = createFileForParent(root);
    var dest = createDirForParent(root);
    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", (err.code == IO_ERR));
      deleteFile(root, src);
      deleteDirectory(root, dest);
    }
    function on_moveTo_success(result) {
      TestEngine.test("moveTo()", false);
      deleteFile(root, result);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    root.moveTo(cb.successCallback, cb.errorCallback, src.fullPath, dest.fullPath, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-130
// Parameters: originFilePath = valid file, destinationFilePath = valid directory, overwrite = false
// Result: IO_ERR passed via error callback.
function test_file_moveTo_error_130() {
  function on_resolve_success(root) {
    var src = createFileForParent(root);
    var dest = createDirForParent(root);
    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", (err.code == IO_ERR));
      deleteFile(root, src);
      deleteDirectory(root, dest);
    }
    function on_moveTo_success(result) {
      TestEngine.test("moveTo()", false);
      deleteFile(root, result);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    root.moveTo(cb.successCallback, cb.errorCallback, src.fullPath, dest.fullPath, false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-131
// Parameters: originFilePath = valid directory, destinationFilePath = valid file, overwrite = true
// Result: IO_ERR passed via error callback.
function test_file_moveTo_131() {
  function on_resolve_success(root) {
    var src = createDirForParent(root);
    var child = createFileForParent(src);
    var dest = createFileForParent(root);
    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", (err.code == IO_ERR));
      deleteDirectory(root, src);
      deleteFile(root, dest);
    }
    function on_moveTo_success(result) {
      TestEngine.test("moveTo()", false);
      deleteFile(root, result);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    root.moveTo(cb.successCallback, cb.errorCallback, src.fullPath, dest.fullPath, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-132
// Parameters: originFilePath = valid directory, destinationFilePath = valid file, overwrite = false
// Result: IO_ERR passed via error callback.
function test_file_moveTo_error_132() {
  function on_resolve_success(root) {
    var src = createDirForParent(root);
    var child = createFileForParent(src);
    var dest = createFileForParent(root);
    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", (err.code == IO_ERR));
      deleteDirectory(root, src);
      deleteFile(root, dest);
    }
    function on_moveTo_success(result) {
      TestEngine.test("moveTo()", false);
      deleteDirectory(root, result);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    root.moveTo(cb.successCallback, cb.errorCallback, src.fullPath, dest.fullPath, false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-133
// Parameters: originFilePath = valid directory, destinationFilePath = valid directory, overwrite = true
// Result: Test passes (replacing destination directory with a origin directory).
function test_file_moveTo_133() {
  function on_resolve_success(root) {
    var src = createDirForParent(root);
    var child = createFileForParent(src);
    var dest = createDirForParent(root);
    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", false);
      deleteDirectory(root, src);
      deleteDirectory(root, dest);
    }
    function on_moveTo_success(result) {
      TestEngine.test("moveTo()", (result.fullPath == dest.fullPath) && isDir(result));
      TestEngine.test("resolve()", isFile(result.resolve(child.name)));
      TestEngine.testPresetError(
        "resolve() [NOT_FOUND_ERR]",
        function() { root.resolve(src.name); },
        NOT_FOUND_ERR
      );
      deleteDirectory(root, result);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    root.moveTo(cb.successCallback, cb.errorCallback, src.fullPath, dest.fullPath, true);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-134
// Parameters: originFilePath = valid directory, destinationFilePath = valid directory, overwrite = false
// Result: IO_ERR passed via error callback.
function test_file_moveTo_error_134() {
  function on_resolve_success(root) {
    var src = createDirForParent(root);
    var child = createFileForParent(src);
    var dest = createDirForParent(root);
    function on_moveTo_error(err) {
      TestEngine.test("moveTo() [" + err.code + "]", (err.code == IO_ERR));
      deleteDirectory(root, src);
      deleteDirectory(root, dest);
    }
    function on_moveTo_success(result) {
      TestEngine.test("moveTo()", false);
      deleteDirectory(root, result);
    }
    var cb = TestEngine.registerCallback("moveTo", on_moveTo_success, on_moveTo_error);
    root.moveTo(cb.successCallback, cb.errorCallback, src.fullPath, dest.fullPath, false);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-135
// Parameters: filePath = valid path to an existing file
// Result: Test passes.
function test_file_resolve_135() {
  function on_resolve_success(root) {
    var file = createFileForParent(root);
    var resolved = root.resolve(file.name);
    TestEngine.test("resolve()", isFile(resolved) && (file.fullPath == resolved.fullPath));
    deleteFile(root, file);
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-136
// Parameters: filePath = valid path to non-existing file
// Result: NOT_FOUND_ERR thrown in place.
function test_file_resolve_error_136() {
  function on_resolve_success(root) {
    var fileNotExist = getFileName();
    TestEngine.testPresetError(
      "resolve() [NOT_FOUND_ERR]",
      function() { root.resolve(fileNotExist); },
      NOT_FOUND_ERR
    );
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-137
// Parameters: filePath = invalid path
// Result: NOT_FOUND_ERR thrown in place.
function test_file_resolve_error_137() {
  function on_resolve_success(root) {
   var invalidPath = "../";
   TestEngine.testPresetError(
     "resolve() [INVALID_VALUES_ERR]",
     function() { root.resolve(invalidPath); },
     INVALID_VALUES_ERR
   );
  }
  resolve_root_location(on_resolve_success);
}

// WAC-FILESYSTEM-138: Open file in append mode and test append mode.
function test_file_append_behaviour_138() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) {
    var file2 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file2));
    function on_openStream_success(stream) {
      function on_openStream_success2(stream) {
        function on_openStream_success3(stream) {
            var array = stream.readBytes(4);
            TestEngine.test("readBytes(4)", array.length === 4);
            TestEngine.test("array[0]", array[0] === 1);
            TestEngine.test("array[1]", array[1] === 2);
            TestEngine.test("array[2]", array[2] === 3);
            TestEngine.test("array[3]", array[3] === 4);
            stream.close();
            deleteFile(file, file2);
        }
        TestEngine.test("openStream()", isFilestream(stream));
        stream.writeBytes([3, 4]);
        stream.close();
        //reopen in read mode
        var cb = TestEngine.registerCallback("openStream", on_openStream_success3, on_openStream_error);
        file2.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
      }
      TestEngine.test("openStream()", isFilestream(stream));
      stream.writeBytes([1, 2]);
      stream.close();
      //reopen again in append mode
      var cb = TestEngine.registerCallback("openStream", on_openStream_success2, on_openStream_error);
      file2.openStream(cb.successCallback, cb.errorCallback, "a", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
    }
    var cb = TestEngine.registerCallback("openStream", on_openStream_success, on_openStream_error);
    file2.openStream(cb.successCallback, cb.errorCallback, "a", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC-FILESYSTEM-139: Set postion.
function test_file_set_position_139() {
  function on_resolve_error(err) {
      TestEngine.test("resolve() [" + err.code + "]", false);
  }
  function on_resolve_success(file) {
    function on_openStream_success(stream) {
      function on_openStream_success2(stream) {
        TestEngine.test("Correct postion after opening",
            stream.position === 0);
        var array = stream.readBytes(5);
        TestEngine.test("Correct number of bytes read", array.length === 4);
        TestEngine.test("Correct values of bytes read", array[0] === 5 &&
            array[1] === 6 && array[2] === 7 && array[3] === 8);
        stream.position = 2;
        array = stream.readBytes(1);
        TestEngine.test("Correct values of bytes read at pos 2",
            array.length === 1 && array[0] === 7);
        stream.position = 1;
        array = stream.readBytes(1);
        TestEngine.test("Correct values of bytes read at pos 1",
            array.length === 1 && array[0] === 6);
        stream.position = 0;
        array = stream.readBytes(1);
        TestEngine.test("Correct values of bytes read at pos 0",
            array.length === 1 && array[0] === 5);
        stream.position = 3;
        array = stream.readBytes(1);
        TestEngine.test("Correct values of bytes read at pos 3",
            array.length === 1 && array[0] === 8);
        stream.close();
        deleteFile(file, file2);
      }
      TestEngine.test("openStream()", isFilestream(stream));
      TestEngine.test("Correct postion after opening",
          stream.position === 0);
      stream.writeBytes([1, 2, 3, 4]);
      TestEngine.test("Correct postion after write ", stream.position === 4);
      stream.position = 0;
      TestEngine.test("Correct postion after setting postion",
          stream.position === 0);
      stream.writeBytes([5, 6, 7, 8]);
      stream.close();
      var cb = TestEngine.registerCallback("openStream",
          on_openStream_success2, on_openStream_error);
      file2.openStream(cb.successCallback, cb.errorCallback, "r", "UTF-8");
    }
    function on_openStream_error(err) {
      TestEngine.test("openStream() [" + err.code + "]", false);
    }
    var file2 = file.createFile(getFileName());
    TestEngine.test("createFile()", isFile(file2));
    var cb = TestEngine.registerCallback("openStream",
        on_openStream_success, on_openStream_error);
    file2.openStream(cb.successCallback, cb.errorCallback, "w", "UTF-8");
  }
  resolve_root(on_resolve_success, on_resolve_error);
}

// WAC2-FILESYSTEM-140: Resolve wgt-package in rw mode.
// Result: UNKNOWN_ERR thrown via error callback.
function test_filesystem_resolve_error_140() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", (err.code == UNKNOWN_ERR)); }
  function on_resolve_success(file) { TestEngine.test("resolve()", false);}
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, 'wgt-package', 'rw');
}

// WAC2-FILESYSTEM-141: Resolve wgt-package/config.xml in rw mode.
// Result: UNKNOWN_ERR thrown via error callback.
function test_filesystem_resolve_error_141() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", (err.code == UNKNOWN_ERR)); }
  function on_resolve_success(file) { TestEngine.test("resolve()", false);}
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, 'wgt-package/config.xml', 'rw');
}

// WAC2-FILESYSTEM-142: Resolve wgt-package in r mode.
// Result: Success.
function test_filesystem_resolve_142() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) { TestEngine.test("resolve()", isFileObject(file));}
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, 'wgt-package', 'r');
}
 
// WAC2-FILESYSTEM-143: Resolve wgt-package/config.xml in r mode.
// Result: Success.
function test_filesystem_resolve_143() {
  function on_resolve_error(err) { TestEngine.test("resolve() [" + err.code + "]", false); }
  function on_resolve_success(file) { TestEngine.test("resolve()", isFileObject(file));}
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, 'wgt-package/config.xml', 'r');
}

//=============================================================================
TestEngine.setTestSuiteName("[WAC2.0][Filesystem]");
//TestEngine.addTest(true, test_filesystem_properties_001, "WAC-FILESYSTEM-001");
//TestEngine.addTest(true, test_filesystem_resolve_002, "WAC-FILESYSTEM-002");
//TestEngine.addTest(true, test_filesystem_resolve_003, "WAC-FILESYSTEM-003");
//TestEngine.addTest(true, test_file_listFiles_004, "WAC-FILESYSTEM-004");
//TestEngine.addTest(true, test_file_open_005, "WAC-FILESYSTEM-005");
//TestEngine.addTest(true, test_file_open_006, "WAC-FILESYSTEM-006");
//TestEngine.addTest(true, test_file_open_007, "WAC-FILESYSTEM-007");
//TestEngine.addTest(true, test_file_open_error_008, "WAC-FILESYSTEM-008");
//TestEngine.addTest(true, test_file_open_error_009, "WAC-FILESYSTEM-009");
//TestEngine.addTest(true, test_file_copyTo_010, "WAC-FILESYSTEM-010");
//TestEngine.addTest(true, test_file_copyTo_error_011, "WAC-FILESYSTEM-011");
//TestEngine.addTest(true, test_file_copyTo_012, "WAC-FILESYSTEM-012");
//TestEngine.addTest(true, test_file_createFile_013, "WAC-FILESYSTEM-013");
//TestEngine.addTest(true, test_file_createFile_error_014, "WAC-FILESYSTEM-014");
//TestEngine.addTest(true, test_file_createFile_error_015, "WAC-FILESYSTEM-015");
//TestEngine.addTest(true, test_file_createFile_error_016, "WAC-FILESYSTEM-016");
//TestEngine.addTest(true, test_file_createFile_error_017, "WAC-FILESYSTEM-017");
//TestEngine.addTest(true, test_file_createDirectory_018, "WAC-FILESYSTEM-018");
//TestEngine.addTest(true, test_file_createDirectory_error_019, "WAC-FILESYSTEM-019");
//TestEngine.addTest(true, test_file_createDirectory_error_020, "WAC-FILESYSTEM-020");
//TestEngine.addTest(true, test_file_createDirectory_error_021, "WAC-FILESYSTEM-021");
//TestEngine.addTest(true, test_file_createDirectory_error_022, "WAC-FILESYSTEM-022");
//TestEngine.addTest(true, test_file_moveTo_023, "WAC-FILESYSTEM-023");
//TestEngine.addTest(true, test_file_moveTo_error_024, "WAC-FILESYSTEM-024");
//TestEngine.addTest(true, test_file_moveTo_025, "WAC-FILESYSTEM-025");
//TestEngine.addTest(true, test_file_deleteFile_026, "WAC-FILESYSTEM-026");
//TestEngine.addTest(true, test_file_deleteFile_error_027, "WAC-FILESYSTEM-027");
//TestEngine.addTest(true, test_file_deleteFile_error_028, "WAC-FILESYSTEM-028");
//TestEngine.addTest(true, test_file_deleteFile_error_029, "WAC-FILESYSTEM-029");
//TestEngine.addTest(true, test_file_deleteFile_error_030, "WAC-FILESYSTEM-030");
//TestEngine.addTest(true, test_file_deleteDirectory_031, "WAC-FILESYSTEM-031");
//TestEngine.addTest(true, test_file_deleteDirectory_error_032, "WAC-FILESYSTEM-032");
//TestEngine.addTest(true, test_file_deleteDirectory_error_033, "WAC-FILESYSTEM-033");
//TestEngine.addTest(true, test_file_deleteDirectory_error_034, "WAC-FILESYSTEM-034");
//TestEngine.addTest(true, test_filestream_write_read_035, "WAC-FILESYSTEM-035");
TestEngine.addTest(true, test_filestream_read_error_036, "WAC-FILESYSTEM-036");
//TestEngine.addTest(true, test_filestream_read_error_037, "WAC-FILESYSTEM-037");
//TestEngine.addTest(true, test_file_open_error_038, "WAC-FILESYSTEM-038");
//TestEngine.addTest(true, test_filestream_read_error_040, "WAC-FILESYSTEM-040");
//TestEngine.addTest(true, test_filestream_write_error_041, "WAC-FILESYSTEM-041");
//TestEngine.addTest(true, test_filestream_write_error_042, "WAC-FILESYSTEM-042");
//TestEngine.addTest(true, test_filestream_write_error_043, "WAC-FILESYSTEM-043");
//TestEngine.addTest(true, test_filestream_write_error_044, "WAC-FILESYSTEM-044");
//TestEngine.addTest(true, test_filestream_read_error_045, "WAC-FILESYSTEM-045");
//TestEngine.addTest(true, test_filestream_read_error_046, "WAC-FILESYSTEM-046");
//TestEngine.addTest(true, test_filestream_writeBytes_readBytes_047, "WAC-FILESYSTEM-047");
//TestEngine.addTest(true, test_filestream_readBytes_error_048, "WAC-FILESYSTEM-048");
//TestEngine.addTest(true, test_filestream_readBytes_error_049, "WAC-FILESYSTEM-049");
//TestEngine.addTest(true, test_filestream_readBytes_error_051, "WAC-FILESYSTEM-051");
//TestEngine.addTest(true, test_filestream_readBytes_error_052, "WAC-FILESYSTEM-052");
//TestEngine.addTest(true, test_filestream_readBytes_error_053, "WAC-FILESYSTEM-053");
//TestEngine.addTest(true, test_filestream_writeBytes_error_054, "WAC-FILESYSTEM-054");
//TestEngine.addTest(true, test_filestream_writeBytes_error_055, "WAC-FILESYSTEM-055");
//TestEngine.addTest(true, test_filestream_writeBytes_error_056, "WAC-FILESYSTEM-056");
//TestEngine.addTest(true, test_filestream_writeBytes_057, "WAC-FILESYSTEM-057");
//TestEngine.addTest(true, test_filestream_writeBase64_readBase64_058, "WAC-FILESYSTEM-058");
//TestEngine.addTest(true, test_filestream_writeBase64_read_059, "WAC-FILESYSTEM-059");
//TestEngine.addTest(true, test_filestream_write_readBase64_060, "WAC-FILESYSTEM-060");
//TestEngine.addTest(true, test_filestream_readBase64_error_061, "WAC-FILESYSTEM-061");
//TestEngine.addTest(true, test_filestream_readBase64_error_062, "WAC-FILESYSTEM-062");
//TestEngine.addTest(true, test_filestream_readBase64_error_064, "WAC-FILESYSTEM-064");
//TestEngine.addTest(true, test_filestream_readBase64_error_065, "WAC-FILESYSTEM-065");
//TestEngine.addTest(true, test_filestream_readBase64_error_066, "WAC-FILESYSTEM-066");
//TestEngine.addTest(true, test_filestream_writeBase64_error_067, "WAC-FILESYSTEM-067");
//TestEngine.addTest(true, test_filestream_writeBase64_error_068, "WAC-FILESYSTEM-068");
//TestEngine.addTest(true, test_filestream_writeBase64_error_069, "WAC-FILESYSTEM-069");
//TestEngine.addTest(true, test_filestream_writeBase64_error_070, "WAC-FILESYSTEM-070");
//TestEngine.addTest(true, test_file_createFile_error_071, "WAC-FILESYSTEM-071");
//TestEngine.addTest(true, test_file_deleteFile_error_072, "WAC-FILESYSTEM-072");
//TestEngine.addTest(true, test_file_deleteDirectory_error_073, "WAC-FILESYSTEM-073");
//TestEngine.addTest(true, test_file_moveTo_error_074, "WAC-FILESYSTEM-074");
//TestEngine.addTest(true, test_file_openStream_error_075, "WAC-FILESYSTEM-075");
//TestEngine.addTest(true, test_file_readAsText_076, "WAC-FILESYSTEM-076");
//TestEngine.addTest(true, test_file_readAsText_error_077, "WAC-FILESYSTEM-077");
//TestEngine.addTest(true, test_file_readAsText_error_078, "WAC-FILESYSTEM-078");
//TestEngine.addTest(true, test_file_toUri_079, "WAC-FILESYSTEM-079");
//TestEngine.addTest(true, test_filesystem_resolve_080, "WAC-FILESYSTEM-080");
//TestEngine.addTest(true, test_file_listFiles_081, "WAC-FILESYSTEM-081");
//TestEngine.addTest(true, test_file_listFiles_082, "WAC-FILESYSTEM-082");
//TestEngine.addTest(true, test_file_listFiles_error_083, "WAC-FILESYSTEM-083");
//TestEngine.addTest(true, test_file_listFiles_error_084, "WAC-FILESYSTEM-084");
//TestEngine.addTest(true, test_file_listFiles_error_085, "WAC-FILESYSTEM-085");
//TestEngine.addTest(true, test_file_listFiles_error_086, "WAC-FILESYSTEM-086");
//TestEngine.addTest(true, test_file_open_087, "WAC-FILESYSTEM-087");
//TestEngine.addTest(true, test_file_open_error_088, "WAC-FILESYSTEM-088");
//TestEngine.addTest(true, test_file_open_error_089, "WAC-FILESYSTEM-089");
//TestEngine.addTest(true, test_file_open_error_090, "WAC-FILESYSTEM-090");
//TestEngine.addTest(true, test_file_readAsText_091, "WAC-FILESYSTEM-091");
//TestEngine.addTest(true, test_file_readAsText_092, "WAC-FILESYSTEM-092");
//TestEngine.addTest(true, test_file_readAsText_093, "WAC-FILESYSTEM-093");
//TestEngine.addTest(true, test_file_readAsText_094, "WAC-FILESYSTEM-094");
//TestEngine.addTest(true, test_file_readAsText_error_095, "WAC-FILESYSTEM-095");
//TestEngine.addTest(true, test_file_readAsText_error_096, "WAC-FILESYSTEM-096");
//TestEngine.addTest(true, test_file_readAsText_error_097, "WAC-FILESYSTEM-097");
//TestEngine.addTest(true, test_file_readAsText_error_098, "WAC-FILESYSTEM-098");
//TestEngine.addTest(true, test_file_deleteDirectory_099, "WAC-FILESYSTEM-099");
//TestEngine.addTest(true, test_file_deleteDirectory_error_100, "WAC-FILESYSTEM-100");
//TestEngine.addTest(true, test_file_deleteDirectory_error_101, "WAC-FILESYSTEM-101");
//TestEngine.addTest(true, test_file_deleteDirectory_error_102, "WAC-FILESYSTEM-102");
//TestEngine.addTest(true, test_file_deleteDirectory_error_103, "WAC-FILESYSTEM-103");
//TestEngine.addTest(true, test_file_deleteDirectory_error_104, "WAC-FILESYSTEM-104");
//TestEngine.addTest(true, test_file_deleteDirectory_error_105, "WAC-FILESYSTEM-105");
//TestEngine.addTest(true, test_file_deleteFile_106, "WAC-FILESYSTEM-106");
//TestEngine.addTest(true, test_file_deleteFile_error_107, "WAC-FILESYSTEM-107");
//TestEngine.addTest(true, test_file_deleteFile_error_108, "WAC-FILESYSTEM-108");
//TestEngine.addTest(true, test_file_deleteFile_error_109, "WAC-FILESYSTEM-109");
//TestEngine.addTest(true, test_file_deleteFile_error_110, "WAC-FILESYSTEM-110");
//TestEngine.addTest(true, test_file_deleteFile_error_111, "WAC-FILESYSTEM-111");
//TestEngine.addTest(true, test_filesystem_resolve_112, "WAC-FILESYSTEM-112");
//TestEngine.addTest(true, test_file_readAsText_113, "WAC-FILESYSTEM-113");
//TestEngine.addTest(true, test_file_open_114, "WAC-FILESYSTEM-114");
//TestEngine.addTest(true, test_file_copyTo_115, "WAC-FILESYSTEM-115");
//TestEngine.addTest(true, test_file_copyTo_116, "WAC-FILESYSTEM-116");
//TestEngine.addTest(true, test_file_copyTo_error_117, "WAC-FILESYSTEM-117");
//TestEngine.addTest(true, test_file_copyTo_error_118, "WAC-FILESYSTEM-118");
//TestEngine.addTest(true, test_file_copyTo_119, "WAC-FILESYSTEM-119");
//TestEngine.addTest(true, test_file_copyTo_error_120, "WAC-FILESYSTEM-120");
//TestEngine.addTest(true, test_file_copyTo_121, "WAC-FILESYSTEM-121");
//TestEngine.addTest(true, test_file_copyTo_error_122, "WAC-FILESYSTEM-122");
//TestEngine.addTest(true, test_file_copyTo_123, "WAC-FILESYSTEM-123");
//TestEngine.addTest(true, test_file_copyTo_error_124, "WAC-FILESYSTEM-124");
//TestEngine.addTest(true, test_file_moveTo_125, "WAC-FILESYSTEM-125");
//TestEngine.addTest(true, test_file_moveTo_126, "WAC-FILESYSTEM-126");
//TestEngine.addTest(true, test_file_moveTo_error_127, "WAC-FILESYSTEM-127");
//TestEngine.addTest(true, test_file_moveTo_error_128, "WAC-FILESYSTEM-128");
//TestEngine.addTest(true, test_file_moveTo_129, "WAC-FILESYSTEM-129");
//TestEngine.addTest(true, test_file_moveTo_error_130, "WAC-FILESYSTEM-130");
//TestEngine.addTest(true, test_file_moveTo_131, "WAC-FILESYSTEM-131");
//TestEngine.addTest(true, test_file_moveTo_error_132, "WAC-FILESYSTEM-132");
//TestEngine.addTest(true, test_file_moveTo_133, "WAC-FILESYSTEM-133");
//TestEngine.addTest(true, test_file_moveTo_error_134, "WAC-FILESYSTEM-134");
//TestEngine.addTest(true, test_file_resolve_135, "WAC-FILESYSTEM-135");
//TestEngine.addTest(true, test_file_resolve_error_136, "WAC-FILESYSTEM-136");
//TestEngine.addTest(true, test_file_resolve_error_137, "WAC-FILESYSTEM-137");
//TestEngine.addTest(true, test_file_append_behaviour_138, "WAC-FILESYSTEM-138");
//TestEngine.addTest(true, test_file_set_position_139, "WAC-FILESYSTEM-139");
//TestEngine.addTest(true, test_filesystem_resolve_error_140, "WAC-FILESYSTEM-140");
//TestEngine.addTest(true, test_filesystem_resolve_error_141, "WAC-FILESYSTEM-141");
//TestEngine.addTest(true, test_filesystem_resolve_142, "WAC-FILESYSTEM-142");
//TestEngine.addTest(true, test_filesystem_resolve_143, "WAC-FILESYSTEM-143");

//=============================================================================
// --------------------------| Utilities

function isFileObject(obj) {
  return (obj instanceof deviceapis.filesystem.File);
}

function isFile(obj) {
  return (isFileObject(obj) && !obj.isDirectory);
}

function isDir(obj) {
  return (isFileObject(obj) && obj.isDirectory);
}

function isFilestream(obj) {
  return (obj instanceof deviceapis.filesystem.FileStream);
}

function deleteDirectory(parent, dir) {
  function on_error(err) {
    TestEngine.test("deleteDirectory() [" + err.code + "]", false);
  }
  function on_success() {
    TestEngine.test("deleteDirectory()", true);
  }
  var cb = TestEngine.registerCallback("deleteDirectory", on_success, on_error);
  parent.deleteDirectory(cb.successCallback, cb.errorCallback, dir.fullPath, true);
}

function deleteFile(parent, file) {
  function on_error(err) {
    TestEngine.test("deleteFile() [" + err.code + "]", false);
  }
  function on_success() {
    TestEngine.test("deleteFile()", true);
  }
  var cb = TestEngine.registerCallback("deleteFile", on_success, on_error);
  parent.deleteFile(cb.successCallback, cb.errorCallback, file.fullPath);
}

// For common behaviour use resolve_root_location
function resolve_root(on_success_callback, on_error_callback) {
  var cb = TestEngine.registerCallback("resolve", on_success_callback, on_error_callback);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION);
}

function resolve_root_location(handler) {
  function on_resolve_error(err) {
    TestEngine.test("resolve() [" + err.code + "]", false);
  }
  function on_resolve_success(file) {
    TestEngine.test("resolve()", isFileObject(file));
    handler(file);
  }
  var cb = TestEngine.registerCallback("resolve", on_resolve_success, on_resolve_error);
  deviceapis.filesystem.resolve(cb.successCallback, cb.errorCallback, TEST_ROOT_LOCATION);
}

var counter = 1;

function getFileName() {
  var nr = Math.floor(Math.random() * 1000);
  var date = new Date();
  return "test_wac20_filesystem_file_" + nr + "_" + (counter++) + "_"
         + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
}

function getDirName() {
  var nr = Math.floor(Math.random() * 1000);
  var date = new Date();
  return "test_wac20_filesystem_dir_" + nr + "_" + (counter++) + "_"
         + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
}

function createFileForParent(parent) {
  var result = parent.createFile(getFileName());
  TestEngine.test("createFile()", isFile(result));
  return result;
}

function createDirForParent(parent) {
  var result = parent.createDirectory(getDirName());
  TestEngine.test("createDirectory()", isDir(result));
  return result;
}

function testNoExceptionWithMessage(message, fun) {
  var testResult = true;
  try {
    fun();
  }
  catch (e) {
    testResult = false;
  }
  TestEngine.test(message, testResult);
}
