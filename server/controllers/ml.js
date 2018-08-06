
const MlModel = require('../models/MlModel');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
exports.getMlData = async (ctx) => {
	// console.log('aaaaaaaaa')
	const id = ctx.query.id;
	try {
		console.log(id)
		const ml = await MlModel.MlDataModel.findAll({
			attributes: ['id', 'rate', 'periods', 'iterations', 'formula', 'data'],
			where: {
				formula: { [Op.like]: '%coef' }
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

// get default formula data
exports.getDefaultData = async (ctx) => {
	// console.log('aaaaaaaaa')
	const id = ctx.query.id;
	try {
		console.log(id)
		const ml = await MlModel.MlConfigModel.findOne({
			attributes: ['degreeCoefs', 'points', 'iterations', 'rate'],
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
			data: ml
		}
	}
	catch (e) {
		ctx.body = {
			code: 10000,
			message: e.message
		}
	}
}

exports.getRNNDefaultData = async (ctx) => {
	const id = ctx.query.id;
	try {
		console.log(id)
		const ml = await MlModel.MlConfigRNNModel.findOne({
			attributes: ['digits', 'trainingSize', 'type', 'layers', 'layerSize', 'batchSize', 'iterations', 'examples'],
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
			data: ml
		}
	}
	catch (e) {
		ctx.body = {
			code: 10000,
			message: e.message
		}
	}
}

exports.saveData = async (ctx) => {
	try {
		const data = ctx.request.body.data;
		const compareData = { ...data };
		delete compareData.data;
		const exsitedData = await MlModel.MlDataModel.findOrCreate({
			where: compareData,
			// attributes: { exclude: ['data'] },
			defaults: data
		}).spread((dataTable, created) => {
			// console.log(dataTable.get({
			// 	plain: true
			// }))
			ctx.body = created ? {
				code: 0,
				message: 'insert successfully'
			} : {
					code: 10000,
					message: "repeated fields"
				}

			/*
			 findOrCreate returns an array containing the object that was found or created and a boolean that will be true if a new object was created and false if not, like so:
		
			[ {
				username: 'sdepold',
				job: 'Technical Lead JavaScript',
				id: 1,
				createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
				updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
			  },
			  true ]
		
		 In the example above, the "spread" on line 39 divides the array into its 2 parts and passes them as arguments to the callback function defined beginning at line 39, which treats them as "user" and "created" in this case. (So "user" will be the object from index 0 of the returned array and "created" will equal "true".)
			*/
		});


		// const data = ctx.request.body.data;
		// console.log(data)
		// const res = await MlDataModel.MlSaveModel.create({
		// 	data: data.data,
		// 	rate: data.rate,
		// 	iterations: data.iterations,
		// 	periods: data.periods,
		// 	formula: data.formula
		// 	// rate: 0,
		// 	// iterations: 0,
		// 	// periods: 0,
		// 	// formula: 'body.formula'
		// });



	}
	catch (e) {
		ctx.body = {
			code: 10000,
			message: e.message
		}
	}
}