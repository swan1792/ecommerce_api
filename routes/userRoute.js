// import express from "express";
// import userController  from "../controllers/userController.js";

// const { userRegister, userLogin, adminLogin } = userController;

// const userRouter = express.Router();

// userRouter.post("/register", userRegister);
// userRouter.post("/login", userLogin);
// userRouter.post("/admin", adminLogin);
// export default userRouter;

import express from "express";
import userController from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const { userRegister, userLogin, adminLogin } = userController;

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/admin", adminLogin);

// GET /api/user/profile - return logged-in user data
userRouter.get("/profile", authUser, (req, res) => {
    res.json({ success: true, user: req.user });
});

export default userRouter;
