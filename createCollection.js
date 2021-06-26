const MongoClient = require("mongodb").MongoClient
const url = "mongodb://localhost:27017/"

MongoClient.connect(url, function (err, db) {
    if (err) throw err
    const dbo = db.db("nucampsite")
    dbo.createCollection("partners", function (err, res) {
        if (err) throw err
        console.log("Partners Collection created!")
        db.close()
    })
    dbo.createCollection("promotions", function (err, res) {
        if (err) throw err
        console.log("Promotions Collection created!")
        db.close()
    })
})
