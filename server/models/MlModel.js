const Sequelize = require('sequelize');
const sequelize = require('../config/sequelizeBase-ml');

const MlModel = sequelize.define('formula', {
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

}, {
		timestamps: false,
	});

module.exports = MlModel;