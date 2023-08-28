import express from 'express'
import { countAll, deleteUser, forgotPassword, getAllUsers, getSingleUser, getUser, login, resetPassword, updateUser, userRegistration } from '../controllers/userController.js'
import { validateForgotPassword, validateLogin, validateProfile, validateRegister, validateResetPassword } from '../middleware/validate.js'
import auth from '../middleware/auth.js'
import checkAdmin from '../middleware/checkAdmin.js'
import { fileURLToPath } from 'url';
import path from 'path'
import multer from 'multer'

const UserRouter = express.Router()

// Image Upload Code

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageLocation = path.join(__dirname,"../../public/profileImages")

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null,imageLocation,function(error,success){
            if(error) throw error
        })
    },
    filename:function(req,file,cb){
        const fname = Date.now()+"-"+file.originalname
        return cb(null, fname, function(error,success){
            if(error) throw error
        })
    }


})

const upload = multer({storage:storage})


UserRouter.post("/signup",validateRegister, userRegistration)

UserRouter.post('/login',validateLogin,login)

UserRouter.get("/get-all-users",auth,checkAdmin,getAllUsers)

UserRouter.get("/get-user/:id",auth, checkAdmin, getUser)

UserRouter.get("/get-single-user",auth,getSingleUser)

UserRouter.put("/update",upload.single('profileImage'),auth,validateProfile, updateUser)

UserRouter.delete("/delete/:id",auth,deleteUser)

UserRouter.get('/count',auth,checkAdmin,countAll)

UserRouter.post('/forgot-password',validateForgotPassword,forgotPassword)

UserRouter.put('/reset-password',validateResetPassword,resetPassword)

export default UserRouter
