var BigRedDb = exports = module.exports;

var Utils = require("./utils")
var QHelper = require("./queryhelper")

// Sample mongodb usage
var Db = require("mongodb").Db;
var Server = require("mongodb").Server;
var mongoHost = "localhost";
var mongoPort = "27017";
var dbName = "bigred";
var collectionName = "browsingData";
var serverOptions = {
        'auto_reconnect': true,
        'poolSize': 10
};
var db = new Db(dbName, new Server(mongoHost, mongoPort, serverOptions), {safe: false});
var database = undefined

BigRedDb.getDatabase = function(cb) {
    if (database) {
        return cb(database, function(){});
    }
    db.open(function(err, db) {
        db.authenticate('api', 'apipass', function(err, result) {
            if(err) { return console.log(err); }
            return cb(db)
        });
    });
}

BigRedDb.getDatabase(function(db){
    console.log("Got the db!");
    database = db
});

BigRedDb.insertData = function(data, cb) {
    BigRedDb.getDatabase(function(db) {
	    var collection = db.collection(collectionName);
        var newData = Utils.reformatData(data)
        if (!newData || newData.URLs.length == 0) {
            return cb()
        }
	    collection.insert({data: newData, createdAt: new Date().getTime()}, function(err, item){
            if (err) console.log(err)
            cb()
        });
    });
}

BigRedDb.getTrending = function(params, cb) {
    BigRedDb.getDatabase(function(db, endF) {
    	var collection = db.collection(collectionName);
        if (!params || !params.location ||
            params.location.length < 2 || !params.timeFrame) {
            console.log("Badly formed request!")
            return cb([])
        }
        var rad = params.radius || 100
        var lon = Number(params.location[0])
        var lat = Number(params.location[1])
        var mins = Number(params.timeFrame)
        var cutTime = new Date().getTime() - 60000*mins
        var query = {
            "data.location": {
                $near: {
                    $geometry: {type: "Point", coordinates: [lon, lat]}, 
                    $maxDistance: rad*100, 
                    $minDistance: 0
                }
            },
            $where : "this.createdAt > " + cutTime
        }
    	collection.find(query).limit(5000).sort({ createdAt: -1 }).toArray(function(err, items) {
            var urls = QHelper.getPublicURLRanked(items, lon, lat);
            // console.log(urls)
            cb(urls)
    	});
    });
}

BigRedDb.getSuggestions = function(params, cb) {
    BigRedDb.getDatabase(function(db, endF) {
    	var collection = db.collection(collectionName);
        if (!params || !params.location ||
            params.location.length < 2) {
            console.log("Badly formed request!")
            return cb([])
        }
        var rad = params.radius || 100
        var lon = Number(params.location[0])
        var lat = Number(params.location[1])
        var query = {
            "data.userId": params.userId,
            "data.location": {
                $near: {
                    $geometry: {type: "Point", coordinates: [lon, lat]}, 
                    $maxDistance: rad*100, 
                    $minDistance: 0
                }
            }
        }
    	collection.find(query).sort({ createdAt: -1 }).toArray(function(err, items) {
            if (!items || items.length == 0) {
                console.log(params)
                return cb([])
            }
            var urls = QHelper.getSuggestedURLs(items, lon, lat)
            // console.log(urls)
            cb(urls);
    	});
    });
}

BigRedDb.init = function(app) {
    console.log("Initializing BigRedDb!");
    app.get('/api/newId', function(req, res) {
        console.log("/api/newId");
        // TODO
        res.send({error: 0, userId: Math.random()})
    });

    app.post('/api/ping', function(req, res) {
        console.log("/api/ping");
        res.send({error: 0, pong: 1})
    });

    app.get('/api/suggest', function(req, res) {
        console.log("/api/suggest");
        BigRedDb.getSuggestions(req.param("options"), function(urls) {
            res.send({error:0, urls:urls});
        });
    });
    
    app.get('/api/trending', function(req, res) {
        console.log("/api/trending");
        BigRedDb.getTrending(req.param("options"), function(urls){
            res.send({error:0, urls:urls});
        });
    });

    app.post('/api/update', function(req, res) {
        console.log("/api/update");
        BigRedDb.insertData(req.body.data, function() {
            res.send({error: 0})
        });
    });
}

