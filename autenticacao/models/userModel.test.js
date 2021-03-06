const test = require("blue-tape");
const userModel = require("./userModel");
const userProfiles = require("./userProfiles");
const db = require("./db");

function runTests() {
  let userId;

  function testModel(testName, fn) {
    test(testName, async (t) => {
      await db.connect();
      try {
        return await fn(t);
      } finally {
        await db.disconnect();
      }
    });
  }

  testModel("UserModel findUser", async (t) => {
    const user = await userModel.findUser("adm");
    //console.log(JSON.stringify(user, null, 2));

    if (user) userId = user._id;
    t.assert(user, "User Returned");
  });

  testModel("UserModel findUserById", async (t) => {
    const user = await userModel.findUserById(userId);
    //console.log(JSON.stringify(user, null, 2));

    if (user) userId = user._id;
    t.assert(user, "User Returned");
  });

  testModel("UserModel createUser", async (t) => {
    const username = "MARIO";
    const password = "abc";
    const email = "mario@email.com";
    const profile = userProfiles.USER_PROFILE;
    const result = await userModel.createUser(
      username,
      password,
      email,
      profile
    );
    //console.log(JSON.stringify(result, null, 2));

    t.assert(result.insertedCount > 0, "User created");
  });

  testModel("UserModel resetPassword", async (t) => {
    const email = "mario@email.com";
    const { result, newPassword } = await userModel.resetPassword(email);
    //console.log(JSON.stringify(result, null, 2));

    t.assert(result.modifiedCount > 0 && newPassword, "Password reseted");
  });

  testModel("UserModel countAll", async (t) => {
    const count = await userModel.countAll();
    //console.log(count);

    t.assert(count > 0, "Users counted");
  });

  testModel("UserModel findAllUsers", async (t) => {
    const users = await userModel.findAllUsers(1);
    //console.log(users);

    t.assert(users && users.length > 0, "Users returned");
  });
}

module.exports = { runTests };
