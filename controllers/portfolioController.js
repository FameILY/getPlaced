const Student = require("../models/Student");
const Portfolio = require("../models/Portfolio");

exports.getPortfolio = async (req,res) => {

    if (!req.session.user){
        res.status(400).send("no session")
    } else {

        let stud = new Student();
        let prof = await stud.getStudentByEmail(req.session.user.accountEmail);

        let portfolio = new Portfolio();
        let data = await portfolio.getPortfolioByEmail(req.session.user.accountEmail)
        console.log(data)
        res.render('portfolio', {Portfolio: data, Student: prof})
    }
}