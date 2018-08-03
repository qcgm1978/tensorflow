
const MlModel = require('../models/MlModel.js');

// get default formula data
exports.getDefaultData = async (ctx) => {
	// console.log('aaaaaaaaa')
	const id = ctx.query.id;
	try {
		console.log(id)
		const ml = await MlModel.findOne({
			attributes: ['degreeCoefs', 'points', 'iterations'],
			where: {
				id
			},
		});
		if (!ml) {
			ctx.body = {
				code: 404,
				data: {
					result: 'no ini data'
				}
			};
			return;
		}



		ctx.body = {
			code: 0,
			data: {
				result: ml
			}
		}
	}
	catch (e) {
		ctx.body = {
			code: 10000,
			message: e.message
		}
	}
}