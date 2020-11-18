const ObjectID = require('mongodb').ObjectID;

exports.index = (req, res) => {
    res.json({message: 'hooray! welcome to our crud!'});
    // console.log(db);
}

exports.getUsers = (req, res) => {
    let db = req.app.locals.db;
    const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
    const start = parseInt(req.query.start);// Make sure to parse the skip to number

    db.collection('users').find().skip(start).limit(limit).toArray().then(docs => {
        res.json({items: docs})
    }).catch(e => {
        res.status(500).json(e)
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
        const filter = {'_id': ObjectID(id)};
        const options = {upsert: true};
        const updateDoc = {
            $set: item
        };
        db.collection('users').updateOne(filter, updateDoc, options).then((obj) => {
            res.json(obj)
        }).catch((err) => {
            res.status(500).json(err);
        })
    }
    // res.json({message: 'hooray! welcome to our crud/users!'});
}

exports.getOrganizations = (req, res) => {
    let db = req.app.locals.db;
    const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
    const start = parseInt(req.query.start);// Make sure to parse the skip to number

    db.collection('organizations').find().skip(start).limit(limit).toArray().then(docs => {
        res.json({items: docs})
    }).catch(e => {
        res.status(500).json(e)
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
        const filter = {'_id': ObjectID(id)};
        const options = {upsert: true};
        const updateDoc = {
            $set: item
        };
        db.collection('organizations').updateOne(filter, updateDoc, options).then((obj) => {
            res.json(obj)
        }).catch((err) => {
            res.status(500).json(err);
        })
    }
    // res.json({message: 'hooray! welcome to our crud/users!'});
}

exports.changePassword = (req, res) => {
    const pass_old = req.body.password_old,
        pass_new = req.body.password_new,
        pass_newrep = req.body.password_new_rep,
        id = req.body.id,
        db = req.app.locals.db;
    let user = {_id: ObjectID(id)};
    db.collection('users').findOne(user, (err, item) => {
        if (err) {
            // console.log('An error has occured while finding the record');
            return res.json({success: false, msg: "An error has occured while finding the record"});
        }
        if (!item) {
            return res.json({success: false, msg: "No User found"});
        }

        if (item.pass === pass_old) {
            if (pass_new !== pass_newrep){
                return res.json({success: false, msg: "New passwords not identical"});
            }
        //TODO realisation
        }

        return res.json({success: false, msg: "Invalid password"});
    })

}