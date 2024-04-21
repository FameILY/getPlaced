portfolioCollection = require("../db").db().collection("portfolios")
const { ObjectId } = require("mongodb");

let Portfolio = function(data) {
    this.data = data,
    this.errors = []
}

Portfolio.prototype.cleanUp = function() {
    this.data = {
        studentEmail: this.data.studentEmail,
        aptitudeTests: [{
            testName: this.data.qName,
            initialRes: {
                score: this.data.qScore,
                from: this.data.qFrom,  
            },
            latestRes: {
                latestScore: this.data.qScore,
                latestFrom: this.data.qFrom,
            },
            tries: this.data.tries
        }],
        courses: [{
            courseName: this.data.courseName,
            courseDomain: this.data.courseDomain,
        }],
        articles: [{
            articelName: this.data.articleName,
            articleDomain: this.data.articleDomain,
        }]
    }
}


