import "dotenv/config";
import connectDb from "../db/connectDb.js";
import Role from "../models/RoleModel.js";
import User from "../models/UserModel.js";
import bcryptjs from "bcryptjs";
// connectDb()

const existingRole = await Role.find();
// console.log(!existingRole.length)

if (!existingRole.length) {
  const roles = [
    new Role({ roleName: "Admin" }),
    new Role({ roleName: "Organizer" }),
    new Role({ roleName: "User" }),
  ];
  await Role.insertMany(roles);
}

const adminRoleId = await Role.findOne({ roleName: "Admin" });

const existingAdmin = await User.findOne({ role: adminRoleId._id });

if (!existingAdmin) {
  
  const hashPassword = bcryptjs.hashSync(process.env.ADMIN_PASSWORD, 10);
  const admin = new User({
    name: "admin",
    email: "admin@gmail.com",
    phone: 7470990427,
    birthDate: "3-7-2002",
    password: hashPassword,
    role: adminRoleId._id,
  });
  await admin.save();
}

console.log("Data seeded successfully");
