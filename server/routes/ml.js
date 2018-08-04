const router = require('koa-router')();
const ml = require('../controllers/ml');


router.get('/api/ml/getDefaultData', ml.getDefaultData);
router.post('/api/ml/saveData', ml.saveData);


module.exports = router;
