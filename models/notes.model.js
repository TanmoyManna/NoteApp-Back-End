// this file will contain the schema of the To Do

const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    content : {
        type : String,
        require : true,
    },
    fileAttachment:{
        type: String,
    },
    createdBy : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "Users"
    },
    createdAt : {
        type : Date,
        default : () =>{
            return Date.now()
        },
        immutable : true
    },
    updatedAt : {
        type : Date,
        default : () =>{
            return Date.now()
        }
    }
});


module.exports = mongoose.model("Notes",notesSchema);