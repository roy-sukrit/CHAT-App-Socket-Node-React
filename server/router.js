const express= require('express')
const router= express.Router();

router.get('/',(req,res) => {
    res.send("server is running on port 8000")

});

module.exports= router;