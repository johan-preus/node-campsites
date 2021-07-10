const express = require('express')
const cors = require('./cors')
const authenticate = require('../authenticate')
const Favorite = require('../models/favorite')
const Campsite = require('../models/campsite')
const favoriteRouter = express.Router()

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({
                user: req.user._id
            })
            .populate('users')
            .populate('campsites')
            .then(favorites => {
                res.statusCode = 200
                res.setHeader('content-type', 'application/json')
                res.json(favorites)
            })
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({
                user: req.user._id
            })
            .then(favorite => {
                if (favorite) {
                    for (let campsite of req.body) {
                        if (favorite.campsites.indexOf(campsite._id) === -1) {
                            favorite.campsites.push(campsite)
                        }
                    }
                    favorite.save()
                        .then(fave => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json')
                            res.json(fave)
                        })
                } else {
                    Favorite.create({
                            user: req.user._id,
                        })
                        .then(favorite => {
                            // check for duplicates in body
                            for (let campsite of req.body) {
                                if (favorite.campsites.indexOf(campsite._id) === -1) {
                                    favorite.campsites.push(campsite)
                                }
                            }
                            favorite.save()
                                .then(fave => {
                                    res.statusCode = 200
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json(fave)
                                })
                        })
                }
            })
            .catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain')
        res.end('PUT operation not supported on /favorites')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({
                user: req.user._id
            })
            .then(response => {
                res.statusCode = 200
                if (response) {
                    res.setHeader('Content-Type', 'application/json')
                    res.json(response)
                } else {
                    res.setHeader('Content-Type', 'text/plain')
                    res.end("You don't have any favorites to delete.")
                }
            })
            .catch(err => next(err))
    })

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain')
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`)
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Campsite.findOne({
                _id: req.params.campsiteId
            })
            .then(campsite => {
                if(campsite){
                    Favorite.findOne({
                            user: req.user._id
                        })
                        .then(favorite => {
                            if (favorite) {
                                if (favorite.campsites.indexOf(req.params.campsiteId) === -1) {
                                    favorite.campsites.push(req.params.campsiteId)
                                } else {
                                    res.statusCode = 200
                                    res.setHeader('Content-Type', 'text/plain')
                                    res.end('That campsite is already in your list of favorites')
                                }
                                favorite.save()
                                    .then(fave => {
                                        res.statusCode = 200
                                        res.setHeader('Content-Type', 'application/json')
                                        res.json(fave)
                                    })
                            } else {
                                Favorite.create({
                                        user: req.user._id
                                    })
                                    .then(favorite => {
                                        favorite.campsites.push(req.params.campsiteId)
                                        favorite.save()
                                            .then(fave => {
                                                res.statusCode = 200
                                                res.setHeader('Content-Type', 'application/json')
                                                res.json(fave)
                                            })
                                    })
                            }
                        })
                } else {
                    res.statusCode = 404
                    res.setHeader('Content-Type', 'text/plain')
                    res.end(`Campsite ${req.params.campsiteId} not found`)
                }
            })
            .catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403
        res.setHeader('Content-Type', 'text/plain')
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`)
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({
                user: req.user._id
            })
            .then(favorite => {
                if (favorite) {
                    const index = favorite.campsites.indexOf(req.params.campsiteId)
                    if (index === -1) {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'text/plain')
                        res.end('That campsite is not in your favorites list.')
                    } else {
                        favorite.campsites.splice(index, 1)
                        favorite.save()
                            .then(fave => {
                                res.statusCode = 200
                                res.setHeader('Content-Type', 'application/json')
                                res.json(fave)
                            })
                    }
                } else {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/plain')
                    res.end('No favorites to delete.')
                }
            })
            .catch(err => next(err))
    })

module.exports = favoriteRouter