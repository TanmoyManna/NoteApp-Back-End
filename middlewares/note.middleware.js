// Middleware to validate the Note req body
const validateNotesBody = async (req, res, next) => {
    console.log(req.body)
    if (!req.body.title) {
        return res.status(400).send({
            message: "Title of the Note is missing.",
            status: 400
        });
    }
    if(req.body.title.length < 3){
        return res.status(400).send({
            message: "Title should have at least 3 characters.",
            status: 400
        });
    }
    if(req.body.title.length > 100){
        return res.status(400).send({
            message: "Title should not exceed 100 characters.",
            status: 400
        });
    }

    if (!req.body.content) {
        return res.status(400).send({
            message: "Content of the Note is missing.",
            status: 400
        });
    }
    if(req.body.content < 5){
        return res.status(400).send({
            message: "Content should have at least 3 characters.",
            status: 400
        });
    }
    if(req.body.content > 1000){
        return res.status(400).send({
            message: "Content should not exceed 1000 characters.",
            status: 400
        });
    }

    next();
};

module.exports = {
    validateNotesBody: validateNotesBody
};
