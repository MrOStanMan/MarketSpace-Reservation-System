var helper = require('./helper.js');

exports['setUp'] = function(callback) {
    //helper.HideLogging(this);
    helper.OpenDb(callback);
}

exports['tearDown'] = function(callback) {
    //helper.ShowLogging(this);
    helper.CloseDb(callback);
}


exports.assert_arrayindexOf_correct = function(test){
    //expects 2 tests to run before the done function is executed.
    test.expect(2);

    //First param = constant value: -1
    //Second param = teset object: checking the content of the index
    test.equal(-1, [1,2,3].indexOf(5));
    test.equal(-1, [1,2,3].indexOf(0));
    test.done();
}

//Checks to see if the test condition was true.
exports.assert_true_succeeds = function(test){
    test.expect(1);
    test.ok(true);
    test.done();
};


exports.assert_nullPlus_succeeds = function(test){
    test.expect(1);
    test.ok("hello", null + "hello");
    test.done();
};


