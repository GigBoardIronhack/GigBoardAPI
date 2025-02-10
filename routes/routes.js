const {Router} = require("express")
const router = Router()

const { getHome } = require("../controllers/misc.controller")
const { register, login, getUser } = require("../controllers/auth.controller")
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { userEdit, userDetail, userDelete } = require("../controllers/user.controller");


router.get("/", getHome);

const upload = require("../config/storage.config");


/* AUTH */

router.post("/register", upload.single("imageUrl"), register)
router.post("/login", login)
router.get("/me", isAuthenticated, getUser)

/* USER */

router.post("/edit/:id", isAuthenticated, userEdit)
router.post("/detail/:id", isAuthenticated, userDetail)
router.post("/delete/:id", isAuthenticated, userDelete)







module.exports = router;
