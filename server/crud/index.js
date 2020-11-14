exports.index = (req, res) => {
    res.json({message: 'hooray! welcome to our crud!'});
    // console.log(db);
}

exports.getUsers = (req, res)=>{
    res.json({message: 'hooray! welcome to our crud/users!'});
}