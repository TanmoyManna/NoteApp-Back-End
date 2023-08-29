const auth = require("../middlewares/authjwt");
const noteMiddleWare = require("../middlewares/note.middleware");
const notesController = require("../controllers/notes.controller");
const fileConfig = require("../configs/file.config");

const multer = require("multer");
function fileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type"), false);
  }
}
const storeImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileConfig.notesUrl)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})
const upload = multer({
  storage: storeImage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter
})
function handleFileSizeError(err, req, res, next) {
  console.log(err)
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size limit exceeded", status: 400 });
    }
  } else if (err.message === "Invalid file type") {
    return res.status(400).json({ message: "Invalid file type",status: 400 });
  }
  else {
    return res.status(500).json({ message: "An error occurred",status: 500 });
  }
  next(err);
}



module.exports = (app) => {
  /**
  * Define the route to create a Note
  * 
  * POST notesapplication/api/v1/notes -> notesController createNotes method
  */
  app.post("/notesapplication/api/v1/notes", [auth.verifytoken, upload.single('fileAttachment'),handleFileSizeError , noteMiddleWare.validateNotesBody], notesController.createNotes);

  /**
  * Define the route to get list of ToDo
  * 
  * GET notesapplication/api/v1/notes -> notesController getNotes method
  */
  app.get("/notesapplication/api/v1/notes", [auth.verifytoken, auth.checkUserType], notesController.getNotes);

  /**
  * Define the route to get details of a single ToDo
  * 
  * GET notesapplication/api/v1/notes/:id -> notesController getOneNote method
  */
  app.get("/notesapplication/api/v1/notes/:id", [auth.verifytoken, auth.isOwnerOrAdmin], notesController.getOneNote);

  /**
  * Define the route to delete a ToDo
  * 
  * DELETE notesapplication/api/v1/notes/:id -> notesController deleteNotes method
  */
  app.delete("/notesapplication/api/v1/notes/:id", [auth.verifytoken, auth.isOwnerOrAdmin], notesController.deleteNotes);

  /**
  * Define the route to update a ToDo
  * 
  * PUT notesapplication/api/v1/notes/:id -> notesController updateNotes method
  */
  app.put("/notesapplication/api/v1/notes/:id", [auth.verifytoken, auth.isOwnerOrAdmin, upload.single('fileAttachment')], notesController.updateNotes);
}