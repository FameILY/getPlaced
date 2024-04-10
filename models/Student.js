const studentsCollection = require("../db").db().collection("students");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

let Student = function (data) {
  this.data = data;
  this.errors = [];
};

Student.prototype.cleanUp = function () {
  this.data = {
    studentFirstName: this.data.accountFirstName,
    studentLastName: this.data.accountLastName,
    studentEmail: this.data.accountEmail,
    studentPassword: this.data.accountPassword,

    workExperience: [
      {
        title: this.data.title,
        company: this.data.company,
        location: this.data.location, // TextField
        workIndustry: this.data.workIndustry, // DropDown
        workCountry: this.data.workCountry, // Dropdown of various countries
        startDate: new Date(this.data.startDate),
        endDate: new Date(this.data.endDate),
        description: this.data.description,
      },
    ],
    education: [
      {
        school: this.data.school,
        degree: this.data.degree, // Drop Down
        field: this.data.field,
        educationStartDate: new Date(this.data.educationStartDate),
        educationEndDate: new Date(this.data.educationEndDate),
      },
    ],
    languages: [], // Dropdown
    skills: [], // API key se hoga kaam
    interests: [],
    domains: [],
    bio: this.data.bio,

    projects: [
      {
        projectName: this.data.projectName,
        projectDescription: this.data.projectDescription,
        associatedWith: this.data.associatedWith, // Dropdown mai work experience plus education. We need to store in state
        projectStartDate: new Date(this.data.projectStartDate),
        projectEndDate: new Date(this.data.projectStartDate),
      },
    ],
    certificates: [
      {
        certificateName: this.data.certificateName,
        certificateImage: this.data.certificateImage,
        certificateDescription: this.data.certificateDescription,
      },
    ],
    credits: Number(50),

    // Personal Information
    dateOfBirth: new Date(this.data.dateOfBirth), // By default, we need to select
    gender: this.data.gender,
    // Dropdown of various countries, states and cities
    country: this.data.country,
    city: this.data.city,
    state: this.data.state,
    address: this.data.address,
    pinCode: Number(this.data.pinCode),
    contactNumber: this.data.contactNumber,
    profileImage: this.data.profileImage,
    createdDate: new Date(),
  };
};

Student.prototype.regStudent = async function () {
  console.log("Inside Student Model");
  try {
    this.cleanUp();
    if (!this.errors.length) {
      console.log("Student model");
      // console.log("this.data");
      // console.log(this.data);

      //hashing the password here too
      let salt = bcrypt.genSaltSync(10);
      this.data.studentPassword = bcrypt.hashSync(
        this.data.studentPassword,
        salt
      );

      //checking if it exists already
      let isEmailExist = await studentsCollection.findOne({
        studentEmail: this.data.studentEmail,
      });
      console.log("does email exist?: ",isEmailExist);

      //saving
      if (!isEmailExist) {
        console.log("dosent exist in student collection, saving");
        let student = await studentsCollection.insertOne(this.data);

        console.log("after inserting student:");
        console.log(student);

        //now we have to return the doc so
        let studId = student.insertedId;
        let studProfile = await studentsCollection.findOne({
          _id: new ObjectId(studId),
        });

        return studProfile;
      } else {
        return "Sorry! Email already exist";
      }
    } else {
      console.log(this.errors);
    }
  } catch (err) {
    console.log(err);
  }
};

Student.prototype.setUpProfile = async function (userProfile, em) {
  console.log("inside model");
  let email = em

  try {
    let data = await studentsCollection.findOneAndUpdate(
      { studentEmail: email },
      {
        $set: {
          workExperience: [
            {
              title: userProfile.title,
              company: userProfile.company,
              location: userProfile.location, // TextField
              workCountry: userProfile.country, // Dropdown of various countries
              startDate: new Date(userProfile.startDate),
              endDate: new Date(userProfile.endDate),
              description: userProfile.description,
            },
          ],
          education: [
            {
              school: userProfile.school,
              degree: userProfile.degree,
              field: userProfile.field,
              educationStartDate: new Date(userProfile.educationStartDate),
              educationEndDate: new Date(userProfile.educationEndDate),
            },
          ],
          languages: userProfile.languages, // Dropdown
          skills: userProfile.skills, // API key se hoga kaam
          interests: userProfile.interests,
          domains: userProfile.domains.trim(),
          bio: userProfile.bio,
          projects: [
            {
              projectName: userProfile.projectName,
              projectDescription: userProfile.projectDescription,
              associatedWith: userProfile.associatedWith, // Dropdown mai work experience plus education
              projectStartDate: new Date(userProfile.projectStartDate),
              projectEndDate: new Date(userProfile.projectEndDate),
            },
          ],
          certificates: [
            {
              certificateName: userProfile.certificateName,
              certificateImage: userProfile.certificateImage,
              certificateDescription: userProfile.certificateDescription,
            },
          ],
          dateOfBirth: new Date(userProfile.dateOfBirth),
          gender: userProfile.gender,

          // Dropdown of various countries, states and cities
          country: userProfile.country,
          city: userProfile.city,
          state: userProfile.state,
          address: userProfile.address,
          pinCode: Number(userProfile.pinCode),
          contactNumber: userProfile.contactNumber,
          profileImage: userProfile.profileImage,
          createdDate: new Date(),
        },
      }, {
        new: true
      }
    );

    // console.log(data)

    return data;
  } catch (err) {
    console.log(err);
  }
};

//new one:


// Student.prototype.setUpProfile = async function (userProfile, em) {
//   console.log("inside model");
//   let email = em;

//   try {
//     // Construct the $set object dynamically
//     let $set = {};

//     // Loop through properties of userProfile
//     Object.keys(userProfile).forEach(key => {
//       // Check if the property value is not null or undefined
//       if (
//         userProfile[key] !== null &&
//         userProfile[key] !== undefined &&
//         key !== "profileImage" &&
//         key !== "certificateImage"
//       ) {
//         // Add the property to the $set object
//         $set[key] = userProfile[key];
//       }
//     });

//     // Check if profileImage and certificateImage are provided
//     if (userProfile.profileImage !== undefined) {
//       $set.profileImage = userProfile.profileImage;
//     }
//     if (userProfile.certificateImage !== undefined || userProfile.certificateImage !== null) {
//       $set.certificateImage = userProfile.certificateImage;
//     }

//     // Perform the update only if $set is not empty
//     if (Object.keys($set).length > 0) {
//       let data = await studentsCollection.findOneAndUpdate(
//         { studentEmail: email },
//         { $set },
//         { new: true }
//       );

//       return data;
//     } else {
//       // No fields to update
//       return null;
//     }
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };


Student.prototype.getStudentByEmail = async function (accountEmail) {
  console.log("Account to find: ", accountEmail);
  try{
    let data = await studentsCollection.findOne({ studentEmail: accountEmail });
    return data;
  }
  catch (err){
    console.log(err);
  }
};



module.exports = Student;
