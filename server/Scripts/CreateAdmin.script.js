// Find admin in db
// If does not exists, create one
  // make sure the password is hashed
// If exists, log message

const User = require('../User/User.modal');
const Bcrypt = require('../Lib/Bcrypt.lib');

let AdminUser = null;

(async () => {
  AdminUser = await User.findOne({ username: process.env.ADMIN_USERNAME }).exec();
})()

if (AdminUser) {
  console.log('Admin account already exists. Skipping "Create Admin Account" process.');
} else {
  Bcrypt.hashPassword(process.env.ADMIN_PASSWORD)
    .then(async (hashedPassword) => {     
      const newAdminUser = new User({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
      });
      newAdminUser.save()
        .then(() => {
          console.log('Successfully created admin account.');
        })
        .catch((err) => {
          console.log(err);
          process.exit(1);
        });
    })
    .catch((hashErr) => {
      console.log(hashErr);
      process.exit(1);
    });
}
