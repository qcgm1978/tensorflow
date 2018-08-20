const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase-ml');

exports.MlConfigModel = sequelize.define('formula', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	degreeCoefs: {
		type: Sequelize.JSON,
		allowNull: false
	},
	points: {
		type: Sequelize.BIGINT,
		defaultValue: 100,
		allowNull: true
	},
	iterations: {
		type: Sequelize.INTEGER,
		defaultValue: 75,
		allowNull: true
	},
	rate: {
		type: Sequelize.FLOAT,
		defaultValue: 0.5,
		allowNull: false
	}
}, {
		timestamps: false,
	});

exports.MlConfigRNNModel = sequelize.define('rnn', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	digits: {
		type: Sequelize.BIGINT,
		allowNull: false
	},
	trainingSize: {
		type: Sequelize.BIGINT,
		defaultValue: 5000,
		allowNull: false
	},
	iterations: {
		type: Sequelize.INTEGER,
		defaultValue: 100,
		allowNull: false
	},
	type: {
		type: Sequelize.STRING,
		defaultValue: 'SimpleRNN',
		allowNull: false
	},
	layers: {
		type: Sequelize.INTEGER
	},
	layerSize: {
		type: Sequelize.INTEGER
	},
	batchSize: {
		type: Sequelize.INTEGER

	},

	examples: {
		type: Sequelize.INTEGER

	}
}, {
		timestamps: false,
	});

exports.MlDataModel = sequelize.define('data', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	data: {
		type: Sequelize.JSON,
		allowNull: false
	},
	rate: {
		type: Sequelize.FLOAT,
		allowNull: false
	},
	iterations: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	periods: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	formula: {
		type: Sequelize.STRING,
		allowNull: false
	}

}, {
		timestamps: false,
	});
exports.MlRNNDataModel = sequelize.define('rnn-data', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	configData: {
		type: Sequelize.JSON,
		allowNull: false
	},
	validationLoss: {
		type: Sequelize.FLOAT,
		allowNull: false
	},
	trainAccuracy: {
		type: Sequelize.FLOAT,
		allowNull: false
	},
	validationAccuracy: {
		type: Sequelize.FLOAT,
		allowNull: false
	},
	correctLen: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	correct: {
		type: Sequelize.JSON,
		allowNull: false
	},
	wrongLen: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	wrong: {
		type: Sequelize.JSON,
		allowNull: false
	},
	examplesPerSec: {
		type: Sequelize.FLOAT,
		allowNull: false
	}

}, {
		timestamps: false,
	});
exports.MlDataFitModel = sequelize.define('fit-data', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	num: {
		type: Sequelize.FLOAT,
		allowNull: false
	},


}, {
		timestamps: false,
	});