const {Router} = require("express")
const router = Router()

const { getHome } = require("../controllers/misc.controller")
const { register, login, getUser } = require("../controllers/auth.controller")
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { userEdit, userDetail, userDelete } = require("../controllers/user.controller");
const { purposalCreate } = require("../controllers/purposal.controller");


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


/* ARTIST */
router.post("/create", isAuthenticated, isAgency, artistCreate)
router.get("/list", isAuthenticated, isAgency, artistList)
router.post("/edit/:id", isAuthenticated, isAgency, artistEdit)
router.post("/delete/:id", isAuthenticated, isAgency, artistDelete)



/* PURPOSAL */

router.post("/purposal",isAuthenticated, purposalCreate)






module.exports = router;
