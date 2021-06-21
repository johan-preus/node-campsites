const express = require("express")
const partnerRouter = express.Router()

partnerRouter
    .route("/")
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader("Content-Type", "text/plain")
        next()
    })
    .get((req, res) => {
        res.end("Getting partners")
    })
    .post((req, res) => {
        res.end(
            `Posting new partner ${req.body.name} with description ${req.body.description}`
        )
    })
    .delete((req, res) => {
        res.end("Deleting all partners")
    })
    .put((req, res) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /partners`)
    })

partnerRouter
    .route("/:partnerId")
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader("Content-Type", "text/plain")
        next()
    })
    .get((req, res) => {
        res.end(`Getting partner ${req.params.partnerId}`)
    })
    .post((req, res) => {
        res.statusCode = 403
        res.end(
            `POST operation not supported on /partners/${req.params.partnerId}`
        )
    })
    .delete((req, res) => {
        res.end(`Deleting partner ${req.params.partnerId}`)
    })
    .put((req, res) => {
        res.end(
            `Updating partner ${req.params.partnerId} with name ${req.body.name} and description ${req.body.description}`
        )
    })

module.exports = partnerRouter
