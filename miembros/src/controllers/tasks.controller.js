//const pool = require('../db');

const test = async (req, res) => {
    
    console.log('Test - yes')
    return res.json({
        message: "test"
    });

}


module.exports = {
    test
}