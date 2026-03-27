const express = require("express");
const router = express.Router();
const { signup, login ,refresh,logout} = require("../controller/auth.controller");
const {signupSchema,loginSchema}=require("../validation/auth.schema");
const validate= require("../middleware/validate.middleware");

router.post("/signup",validate(signupSchema), signup);
router.post("/login",validate(loginSchema) ,login);
router.post("/refresh", refresh);
router.post("/logout", logout);


module.exports = router;