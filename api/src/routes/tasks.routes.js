const { Router } = require('express');
const { test } = require('../controllers/tasks.controller');

const router = Router();

router.get('/', (req, res) => {
    
    res.send('Test');

});

router.get('/', (req, res) => {
    
    res.get('Test');

});

router.get('/test', test);

module.exports = router;