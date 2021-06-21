const express = require("express")
const promotionRouter = express.Router()

promotionRouter
    .route("/")
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader("Content-Type", "text/plain")
        next()
    })
    .get((req, res) => {
        res.end("Getting promotions")
    })
    .post((req, res) => {
        res.end(
            `Posting new promotion ${req.body.name} with description ${req.body.description}`
        )
    })
    .delete((req, res) => {
        res.end("Deleting all promotions")
    })
    .put((req, res) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /promotions`)
    })

promotionRouter
    .route("/:promotionId")
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader("Content-Type", "text/plain")
        next()
    })
    .get((req, res) => {
        res.end(`Getting promotion ${req.params.promotionId}`)
    })
    .post((req, res) => {
        res.statusCode = 403
        res.end(
            `POST operation not supported on /promotions/${req.params.promotionId}`
        )
    })
    .delete((req, res) => {
        res.end(`Deleting promotion ${req.params.promotionId}`)
    })
    .put((req, res) => {
        res.end(
            `Updating promotion ${req.params.promotionId} with name ${req.body.name} and description ${req.body.description}`
        )
    })

module.exports = promotionRouter
