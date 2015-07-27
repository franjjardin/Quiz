// Definición del modelo de Quiz

module.exports = function(sequalize, DataTypes) {
	return sequelize.define('Quiz',
	{ pregunta:  DataTypes.STRING,
	  respuesta: DataTypes.STRING,
	});
}