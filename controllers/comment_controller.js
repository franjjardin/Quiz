var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
	models.Comment.find({
		where:{
			id: Number(commentId)
		}
	}).then(function(comment) {
		if (comment) {
			req.comment = comment;
			next();
		} else { next(new Error('No existe commentId=' + commentId))}
	}).catch(function(error){next(error)});
};

// GET /quizes/new
exports.new = function(req,res){
	res.render('comments/new.ejs',{quizid:req.params.quizId,errors:[]});
};

exports.create = function(req,res){
	var comment=models.Comment.build(
	{
		texto: req.body.comment.texto,
		QuizId: req.params.quizId
	});
	// guardar en BD los campos de quiz
	var errors= comment.validate();
	
	if(errors){
		res.render('comments/new.ejs',{comment: comment, quizid: req.params.quizId, errors:err.errors});
	}else{
		comment
		.save()
		.then(function(){
			// Redireccion http URL relativo lista preguntas
			res.redirect('/quizes/'+req.params.quizId);
		});
	}
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res){
	req.comment.publicado = true;

	req.comment.save({fields: ["publicado"]})
		.then(function(){ res.redirect('/quizes/'+req.params.quizId);})
		.catch(function(error){next(error)});
};