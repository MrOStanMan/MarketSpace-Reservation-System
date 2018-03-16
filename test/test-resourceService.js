var helper = require('./helper.js')
    , noteService = require('../server/note/noteService.js')
    , moment = require('moment')
;

exports['setUp'] = function(callback) {
    helper.HideLogging(this);
    helper.OpenDb(callback);
}

exports['tearDown'] = function(callback) {
    helper.ShowLogging(this);
    helper.CloseDb(callback);
}

//========================================================
// crud_Normal_Succeeds
//========================================================
exports.crud_Normal_Succeeds = function(test) {
    test.expect(24);
    var req = helper.GetReq();
    var res = helper.GetRes();

    //Create
    var note = {
        title: 'Test Note',
        description: 'Desc',
        appliesTo: {
            allProducts: true,
            productsMatchingTags: false,
        }
    }
    noteService.create(req, res, note, function(err, note) {

        test.equal(null, err);
        test.ok(note);
        test.equal('Test Note', note.title);
        test.equal('Desc', note.description);
        test.equal(true, note.appliesTo.allProducts);
        test.equal(false, note.appliesTo.productsMatchingTags);

        //Read
        noteService.findByUser(req, res, req.user.userNumber, function(err, notes) {

            test.equal(null, err);
            test.ok(notes);
            test.equal(1, notes.length);
            test.ok(notes[0]);
            test.equal('Test Note', notes[0].title);
            test.equal('Desc', notes[0].description);
            test.equal(true, notes[0].appliesTo.allProducts);
            test.equal(false, notes[0].appliesTo.productsMatchingTags);

            //Update
            note = {
                title: 'Test Note Updated',
                description: 'Desc Updated',
                appliesTo: {
                    allProducts: false,
                    productsMatchingTags: true,
                    tags: ['one', 'two']
                }
            }
            noteService.update(req, res, notes[0].noteNumber, note, function(err, updatedNote) {

                test.equal(null, err);
                test.ok(updatedNote);
                test.equal('Test Note Updated', updatedNote.title);
                test.equal('Desc Updated', updatedNote.description);
                test.equal(false, updatedNote.appliesTo.allProducts);
                test.equal(true, updatedNote.appliesTo.productsMatchingTags);
                test.equal(2, updatedNote.appliesTo.tags.length);
                test.equal('one', updatedNote.appliesTo.tags[0]);
                test.equal('two', updatedNote.appliesTo.tags[1]);

                //Delete
                noteService.delete(req, res, updatedNote.noteNumber, function(err) {

                    test.equal(null, err);
                    test.done();
                });
            });
        });
    });
}