const Notes = require("../models/notes.model");
const fileDelete = require("../utils/deleteFiles");

/**
 * Function to allow the users to create a Notes
 * 
 * when a user calls the endpoint:
 * POST notesapplication/api/v1/notes, router should call the below method
 */
exports.createNotes = async (req, res) => {
  try {
    const NotesObj = {
      title: req.body.title,
      content: req.body.content,
      createdBy: req.userId
    };
    if (req.file) {
      NotesObj['fileAttachment'] = req.file.filename;
    }
    const savedNotes = await Notes.create(NotesObj);

    res.status(200).send({
      data: savedNotes,
      massage: "Notes created successfully",
      status: 200
    });
  } catch (err) {
    console.log("Error while creating Notes ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
};


/**
 * Function to allow the users to get all Notes created by him
 * 
 * when a user calls the endpoint:
 * GET notesapplication/api/v1/notes, router should call the below method
 */
exports.getNotes = async (req, res) => {
  try {
    const queryObj = {};
    if (req.userType == 'USER') {
      queryObj['createdBy'] = req.userId
    }

    console.log(req.userType)
    const allNotes = await Notes.find(queryObj);

    res.status(200).send({
      data: allNotes,
      message: "Successfully fetched all Notes",
      status: 200
    });
  } catch (err) {
    console.log("Error while fetching Notes ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}


/**
 * Function to allow the users to get details of a single Notes
 * 
 * when a user calls the endpoint:
 * GET notesapplication/api/v1/notes/:id, router should call the below method
 */
exports.getOneNote = async (req, res) => {
  try {
    const NotesId = req.params.id;

    const NotesObj = await Notes.findById(NotesId);
    if (!NotesObj) {
      return res.status(404).send({
        message: "Notes with the given id is not found",
        status: 401
      });
    }

    res.status(200).send({
      data: NotesObj,
      message: "Successfully fetched the Notes details",
      status: 200
    });
  } catch (err) {
    console.log("Error while fetching Notess ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}


/**
 * Function to allow the users to delete Notes created by him
 * 
 * when a user calls the endpoint:
 * DELETE notesapplication/api/v1/notes/:id, router should call the below method
 */
exports.deleteNotes = async (req, res) => {
  try {
    const NotesId = req.params.id;

    const toBeDeleted = await Notes.findById(NotesId);
    if (!toBeDeleted) {
      return res.status(404).send({
        message: "Notes with the given id to be deleted is not found",
        status: 401
      });
    }
    if(toBeDeleted.fileAttachment){
      fileDelete.deleteFiles('notes/' + toBeDeleted.fileAttachment);
    }
    const queryObj = {
      _id: toBeDeleted._id
    };
    const deleteObj = await Notes.deleteOne(queryObj);
    if (!deleteObj) {
      return res.status(500).send({
        message: "Some internal server error",
        status: 500
      });
    }
    res.status(200).send({ message: "Successfully deleted the Notes", status: 200 });
  } catch (err) {
    console.log("Error while deleting Notes ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}


/**
 * Function to allow the users to update Notes created by him
 * 
 * when a user calls the endpoint:
 * PUT notesapplication/api/v1/notes/:id, router should call the below method
 */
exports.updateNotes = async (req, res) => {
  try {
    const NotesId = req.params.id;
    const NotesToBeUpdate = await Notes.findById(NotesId);
    if (!NotesToBeUpdate) {
      return res.status(404).send({
        message: "Notes with the given id to be updated is not found",
      });
    }

    NotesToBeUpdate.title = req.body.title ? req.body.title : NotesToBeUpdate.title;
    NotesToBeUpdate.content = req.body.content ? req.body.content : NotesToBeUpdate.content;
    if (req.file) {
      fileDelete.deleteFiles('notes/' + NotesToBeUpdate.fileAttachment);
      NotesToBeUpdate.fileAttachment = req.file.filename;
    }
    const updatedNotes = await NotesToBeUpdate.save();
    console.log(updatedNotes);
    if (!updatedNotes) {
      return res.status(500).send({
        message: "Some internal server error",
        status: 500
      });
    }

    res.status(200).send({ updatedNotes, message: "Successfully updated the Notes", status: 200 });
  } catch (err) {
    console.log("Error while updating Notes ", err.message);
    res.status(500).send({
      message: "Some internal server error",
      status: 500
    });
  }
}