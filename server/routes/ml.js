const router = require('koa-router')();
const ml = require('../controllers/ml');


router.get('/api/ml/getDefaultData', ml.getDefaultData);
router.get('/api/ml/getRNNDefaultData', ml.getRNNDefaultData);
router.get('/api/ml/getMlData', ml.getMlData);
router.post('/api/ml/saveData', ml.saveData);
router.post('/api/ml/saveRNNData', ml.saveRNNData);


module.exports = router;
