var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error) {next(error);});
};

// GET /quizes y /quizes?search=
exports.index = function(req, res) {
	var buscar = "";
	if (req.query.search !== undefined){
		var searchSQL = req.query.search.replace(' ','%');
		searchSQL = '%'+searchSQL+'%';
		buscar = {where: ["pregunta like ?", searchSQL], order: 'pregunta ASC'};
	}
	models.Quiz.findAll(buscar).then(
		function(quizes) {
			res.render('quizes/index.ejs', { quizes: quizes, errors:[]});
		}
	).catch(function(error){next(error);
	});
};

// GET /quizes/:id
exports.show = function(req, res){
	res.render('quizes/show', {quiz: req.quiz,errors:[]});
};

// GET /quizes/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado,errors:[]});

};

// GET /quizes/new
exports.new = function(req,res){
	var quiz = models.Quiz.build(
		{pregunta:"Pregunta",respuesta:"Respuesta",tema:"otro"}
	);
	res.render('quizes/new',{quiz:quiz,errors:[]});
};

exports.create = function(req,res){
	var quiz=models.Quiz.build( req.body.quiz);
	// guardar en BD los campos de quiz
	var errors= quiz.validate();
	
	if(errors){
		var i=0;
		var errores = new Array();
		for (var prop in errors){
			errores[i++]={message: errors[prop]};
		}
		res.render('quizes/new',{quiz: quiz, errors:errores});
	}else{
		quiz
		.save({fields: ["pregunta","respuesta","tema"]})
		.then(function(){
			// Redireccion http URL relativo lista preguntas
			res.redirect('/quizes');
		});
	}
};

// GET /quizes/:id/edit
exports.edit = function(req,res){
	var quiz=req.quiz; // autoload de instanca quiz
	res.render('quizes/edit',{quiz:quiz, errors:[]});
};

// PUT /quizes/:id
exports.update = function(req,res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	var errors = req.quiz.validate();
	if(errors){
		var i=0;
		var errores = new Array();
		for (var prop in errors){
			errores[i++]={message: errors[prop]};
		}
		res.render('quizes/edit',{quiz: req.quiz, errors:errores});
	}else{
		req.quiz
		.save({fields: ["pregunta","respuesta","tema"]})
		.then(function(){
			// Redireccion http URL relativo lista preguntas
			res.redirect('/quizes');
		});
	}
};

// DELETE /quizes/:id
exports.destroy = function(req,res){
	req.quiz.destroy()
	.then(function(){
		// Redireccion http URL relativo lista preguntas
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};