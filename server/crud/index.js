const ObjectID = require('mongodb').ObjectID;

exports.index = (req, res) => {
    res.json({message: 'hooray! welcome to our crud!'});
    // console.log(db);
}

exports.getUsers = (req, res) => {
    let db = req.app.locals.db;
    db.collection('users').find().toArray().then(docs => {
        res.json({items: docs})
    })
    // res.json({message: 'hooray! welcome to our crud/users!'});
}

exports.putUsers = (req, res) => {
    if (!req.body.items) {
        res.json({success: 'false'});
    } else {
        let item = JSON.parse(req.body.items);
        let id = item._id;
        delete item._id;
        delete item.id;
        let db = req.app.locals.db;
        const filter = { '_id': ObjectID(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: item };
        db.collection('users').updateOne(filter,updateDoc,options).then((obj) => {
            res.json(obj)
        }).catch((err) => {
            res.json(err);
        })
    }
    // res.json({message: 'hooray! welcome to our crud/users!'});
}

exports.getOrganizations = (req, res) => {
    let db = req.app.locals.db;
    db.collection('organizations').find().toArray().then(docs => {
        res.json({items: docs})
    })
    // res.json({message: 'hooray! welcome to our crud/users!'});
}

exports.putOrganizations = (req, res) => {
    if (!req.body.items) {
        res.json({success: 'false'});
    } else {
        let item = JSON.parse(req.body.items);
        let id = item._id;
        delete item._id;
        delete item.id;
        let db = req.app.locals.db;
        const filter = { '_id': ObjectID(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: item };
        db.collection('organizations').updateOne(filter,updateDoc,options).then((obj) => {
            res.json(obj)
        }).catch((err) => {
            res.json(err);
        })
    }
    // res.json({message: 'hooray! welcome to our crud/users!'});
}