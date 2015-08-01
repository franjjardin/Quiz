var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); // autoload :quizId

// Definción de rutas con :quizId
router.get('/quizes',						quizController.index);
router.get('/quizes/:quizId(\\d+)',			quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',	quizController.answer);

/* GET page Author. */
router.get('/author', function(req, res) {
  res.render('author', { author: 'Francisco Javier Jardín', info: 'Alumno curso MiriadaX' });
});

module.exports = router;