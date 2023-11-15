const express = require("express");
const app = express();

app.listen(3000, () => console.log("Server is running..."));

app.get("/", (req, res) => {
    res.send({
        lastModified: new Date(),
        status: "Active",
        code: 200
    });
});

app.route('/book/:bookId/:libraryId')
    .get((req, res) => {
        console.log({
            params: req.params,
            query: req.query
        })
        res.send({
            params: req.params,
            query: req.query
        })
    })
    .post((req, res) => {
        res.send('Add a book')
    })
    .put((req, res) => {
        res.send('Update the book')
    })