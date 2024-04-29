const accountsCollection = require("../db").db().collection("accounts");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

let Account = function (data) {
  this.data = data;
  this.errors = [];
};

Account.prototype.cleanUp = function () {
  this.data = {
    accountFirstName: this.data.accountFirstName,
    accountLastName: this.data.accountLastName,
    accountEmail: this.data.accountEmail,
    accountPassword: this.data.accountPassword,
    accountContactNo: this.data.accountContactNo,
    isProfileSet: false,
    role: this.data.role,
    createdDate: new Date(),
  };
};

//req.body data must be sent here to the function by the controller
Account.prototype.regAccount = async function () {
  console.log("inside model Account");
  this.cleanUp();
  if (!this.errors.length) {
    //hashing the password
    let salt = bcrypt.genSaltSync(10);
    this.data.accountPassword = bcrypt.hashSync(
      this.data.accountPassword,
      salt
    );

    //check if the email already exists
    let isEmailExist = await accountsCollection.findOne({
      accountEmail: this.data.accountEmail,
    });
    console.log(isEmailExist);

    if (!isEmailExist) {
      let data = await accountsCollection.insertOne(this.data); //this will return metadata or smthng
      console.log("after inserting data:");
      console.log(data);
      //we want the doc for storing in other collection aswell, so
      let account = await accountsCollection.findOne({
        _id: new ObjectId(data.insertedId),
      });

      return account; //return the doc
    } else {
      return "Sorry! Email already exist";
    }
  }
};

//first send req.body through controller to this function below
Account.prototype.loginAccount = async function (accountdata) {
  console.log("inside model");
  const { accountEmail, accountPassword } = accountdata;

  //checking if email is correct
  let isEmailExist = await accountsCollection.findOne({
    accountEmail,
  });

  //if not then return
  if (!isEmailExist) {
    return "Invalid Credentials";
  }

  // if yes then check passwords by comparing with doc
  let comparison = await bcrypt.compareSync(
    accountPassword,
    isEmailExist.accountPassword
  );

  // if not equal
  if (!comparison) {
    return "Invalid Credentials";
  }

  //its equal

  //return the doc
  return isEmailExist;
};

Account.prototype.updateStatus = async (email) => {
  let data = await accountsCollection.findOneAndUpdate(
    { accountEmail: email },
    {
      $set: {
        isProfileSet: true,
      },
    }
  );

  return data;
};

Account.prototype.downgradeStatus = async (email) => {
  let data = await accountsCollection.findOneAndUpdate(
    { accountEmail: email },
    {
      $set: {
        isProfileSet: false,
      },
    }
  );

  return data;
};


Account.prototype.checkProfile = async (email) => {
  console.log('checking profile')
  let data = await accountsCollection.findOne({ accountEmail: email });

  if (data.isProfileSet == false) {
    console.log('damn, its not set!')
    
    return false;

  } else {
    return true;
  }
};
module.exports = Account;
