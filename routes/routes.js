const {Router} = require("express")
const router = Router()

const { getHome } = require("../controllers/misc.controller")
const { register, login } = require("../controllers/auth.controller")
const { isAuthenticated } = require("../middlewares/auth.middleware");

router.get("/", getHome);

const upload = require("../config/storage.config");


/* AUTH */

router.post("/register", upload.single("imageUrl"), register)
router.post("/login", login)
router.get("/me", isAuthenticated)




module.exports = router;
