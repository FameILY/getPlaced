const router = require("express").Router();
const accountController = require("./controllers/accountController")
const studentController = require("./controllers/studentController")
const resourceController = require("./controllers/resourceController")
const quizController = require("./controllers/quizController")
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
// router.get('/quiz', (req,res)=> {
//     if (!req.session.user){
//         res.send("No session")
//     } else {

    

//     let stud = new Student()
//     let prof = stud.getStudentByEmail(req.session.user.accountEmail)

//     res.render('quiz/quiz', {Student: prof})
//     }
// })

router.get('/cQuestions', quizController.renderCQuestions)
router.get('/quiz/:qName', quizController.renderQuiz)

router.post('/saveScore', quizController.saveScore)

router.use((req, res) => {
    res.status(404).render("404");
  });
module.exports = router
