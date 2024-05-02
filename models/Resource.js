const coursesCollection = require("../db").db().collection("courses");
const articlesCollection = require("../db").db().collection("articles");
const { ObjectId } = require("mongodb");
const { exec } = require("child_process");
const { Console } = require("console");

let Resource = function (data) {
  this.data = data;
  this.errors = [];
};

Resource.prototype.cleanUp = function () {
  this.data = {
    resourceType: this.data.resourceType,
    resourceDomain: this.data.resourceDomain,
    resourceTitle: this.data.resourceTitle,
    resourceThumbnail: this.data.resourceThumbnail,
    resourceLink: this.data.resourceLink,
    resourceSnippet: this.data.resourceSnippet,
    createdDate: new Date(),
  };
};

//courses

Resource.prototype.executeCourseScript = async function (domain) {
  return new Promise((resolve, reject) => {
    let pathToScript = '"D:/Fun Projects/getPlaced2/scripts/coursera.py"';
    exec(`python ${pathToScript} ${domain}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error.message); 
        console.log(error.message);
      } else if (stderr) {
        console.error(`stderr: ${stderr}`);
        console.log(stderr);
        reject(stderr);
      } else {
        try {
          // Assuming the Python script prints JSON data to stdout
          const courses = JSON.parse(stdout);
          resolve(courses);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          reject(parseError.message);
        }
      }
    });
  });
};

Resource.prototype.getCourses = async function (domain) {
  try {
    const result = await this.executeCourseScript(domain);
    // console.log("Script output:", result);
    return result;
  } catch (error) {
    console.error("Error occurred:", error);
    return "Error occurred";
  }
};

Resource.prototype.saveCourse = async function (data) {
  try {
    // Clean up each object in the array
    const cleanedData = data.map((course) => {
      // Clean up the course object
      this.data = course;
      this.cleanUp();
      return this.data;
    });
    const result = await coursesCollection.insertMany(cleanedData);

    return result;
    // console.log("Courses saved successfully:", result.insertedCount)
  } catch (error) {
    console.log(error);
  }
};

Resource.prototype.getCoursesByDomain = async function (domain) {
  try {
    console.log("searching in the db")
    const courses = await coursesCollection.find({ resourceDomain: domain }).toArray();
    if (courses.length == 0){
      console.log("no courses found in db")

      return courses
    } 
    console.log("courses found in db")
    return courses;
  } catch (error) {
    console.error("Error retrieving courses by domain:", error);
  }
};

//Articles

Resource.prototype.executeMediumScript = async function (domain) {
  return new Promise((resolve, reject) => {
    let pathToScript = '"D:/Fun Projects/getPlaced2/scripts/medium.py"';
    exec(`python ${pathToScript} ${domain}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error.message);
        console.log(error.message);
      } else if (stderr) {
        console.error(`stderr: ${stderr}`);
        console.log(stderr);
        reject(stderr);
      } else {
        try {
          // Assuming the Python script prints JSON data to stdout
          const articles = JSON.parse(stdout);
          resolve(articles);
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          reject(parseError.message);
        }
      }
    });
  });
};

Resource.prototype.getArticles = async function (domain) {
  try {
    const result = await this.executeMediumScript(domain);
    // console.log("Script output:", result);
    return result;
  } catch (error) {
    console.error("Error occurred:", error);
    return "Error occurred";
  }
};

Resource.prototype.saveArticles = async function (data) {
  try {
    // Clean up each object in the array
    const cleanedData = data.map((article) => {
      // Clean up the article object
      this.data = article;
      this.cleanUp();
      return this.data;
    });
    const result = await articlesCollection.insertMany(cleanedData);

    return result;
    // console.log("Articles saved successfully:", result.insertedCount)
  } catch (error) {
    console.log(error);
  }
};

Resource.prototype.getArticlesByDomain = async function (domain) {
  try {
    console.log("searching in the db")
    const articles = await articlesCollection.find({ resourceDomain: domain }).toArray();
    if (articles.length == 0){
      console.log("no articles found in db")

      return articles
    } 
    console.log("articles found in db")
    return articles;
  } catch (error) {
    console.error("Error retrieving articles by domain:", error);
  }
};

module.exports = Resource;
