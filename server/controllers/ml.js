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
		const exsitedData = await MlModel.MlDataModel.create(
			ctx.request.body/* ,
			{
			where: compareData,
			// attributes: { exclude: ['data'] },
			defaults: data
		} */).then((ret) => {
			// console.log(dataTable.get({
			// 	plain: true
			// }))
			ctx.body =  {
					code: 0,
					data:[ret.id],
					message: "success"
				}
		}).catch(err => {
			debugger	
		});
	}
	catch (e) {
		ctx.body = {
			code: 10000,
			message: e.message
		}
	}
}
exports.saveRNNData = async (ctx) => {
	try {
		const data = ctx.request.body;
		const compareData = { configData: data.configData };
		const exsitedData = await MlModel.MlRNNDataModel.findOrCreate({
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
					message: `repeated fields: ${JSON.stringify(compareData)}`
				}
		});
	}
	catch (e) {
		ctx.body = {
			code: 10000,
			message: e.message
		}
	}
}