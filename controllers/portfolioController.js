const Student = require("../models/Student");
const Portfolio = require("../models/Portfolio");

exports.test = async (req,res) => {

    if (!req.session.user){
        res.status(400).send("no session")
    } else {

        let portfolio = new Portfolio();
        let data = await portfolio.getPortfolioByEmail(req.session.user.accountEmail)
        res.send(data)
    }
}