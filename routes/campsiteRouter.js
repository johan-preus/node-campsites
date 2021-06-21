const express = require("express")
const campsiteRouter = express.Router()

// this will be the route /campsites/, called as middleware in server.js

campsiteRouter
    .route("/:campsiteId")
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader("Content-Type", "text/plain")
        next()
    })
    .get((req, res) => {
        res.end(`Sending details of campsite ${req.params.campsiteId}`)
    })
    .post((req, res) => {
        res.statusCode = 403
        res.end(
            `POST operation not supported on /campsites/${req.params.campsiteId}`
        )
    })
    .put((req, res) => {
        res.end(
            `Updating campstie ${req.params.campsiteId} with name ${req.body.name} and description ${req.body.description}`
        )
    })
    .delete((req, res) => {
        res.end(`Deleting campsite ${req.params.campsiteId}`)
    })

campsiteRouter
    .route("/")
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader("Content-Type", "text/plain")

        // passes control to next relevant routing method
        next()
    })
    .get((req, res) => {
        res.end("Will send all the campsites to you.")
    })
    .post((req, res) => {
        res.end(
            `Will add the campsite: ${req.body.name} with description ${req.body.description}`
        )
    })
    .put((req, res) => {
        res.statusCode = 403
        res.end("PUT operation not supported on /campsites")
    })
    .delete((req, res) => {
        res.end("Deleting all campsites")
    })

module.exports = campsiteRouter
