const router = require("express").Router();
const accountController = require("./controllers/accountController")
const studentController = require("./controllers/studentController")
const resourceController = require("./controllers/resourceController")
const quizController = require("./controllers/quizController")
const portfolioController = require("./controllers/portfolioController")
const path = require("path");
const Student = require("./models/Student")

//account

router.get('/', accountController.landing)

router.get('/login', (req, res)=> {
    if(req.session.user){
        res.redirect('/')
    } else {
        res.render('auth/login-regis')
    }
})

router.get('/setUpProfile', studentController.renderSetProfile)
router.get('/viewProfile', studentController.renderViewProfile)

router.get('/home', accountController.renderHome)
router.get('/logout', accountController.logout)
router.post('/register', accountController.regAccount)
router.post('/setUpProfile', studentController.setUpProfile)
router.post('/login', accountController.loginAccount)
router.post('/logout', accountController.logout)


//resource
router.post('/getCourses',resourceController.getCourses)
router.post('/getArticles', resourceController.getArticles)

//quiz

router.get('/cQuestions', quizController.renderCQuestions)
router.get('/quiz/:qName', quizController.renderQuiz)
router.get('/prepare/:qName', quizController.renderPrepare)

//saving scores
router.post('/saveScore', quizController.saveScore)




//test routes
router.get('/getPortfolio', portfolioController.getPortfolio)

router.get('/what', (req,res)=> {
    res.render('error')
})
router.use((req, res) => {
    res.status(404).render("404");
  });
module.exports = router
