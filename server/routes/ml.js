const router = require('koa-router')();
const ml = require('../controllers/ml');


router.get('/api/ml/getDefaultData', ml.getDefaultData);


module.exports = router;
