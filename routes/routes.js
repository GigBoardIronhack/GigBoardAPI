const {Router} = require("express")
const router = Router()

const { getHome } = require("../controllers/misc.controller")
const { register, login, getUser } = require("../controllers/auth.controller")
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isAgency, isPromoter } = require("../middlewares/user.middleware")
const { userEdit, userDetail, userDelete } = require("../controllers/user.controller");
const { artistCreate, artistList, artistDelete, artistEdit, artistDetail } = require("../controllers/artist.controller");
const { favorite, listFavorites } = require("../controllers/favorite.controller")

const upload = require("../config/storage.config");


router.get("/", getHome);


/* AUTH */

router.post("/register", upload.single("imageUrl"), register)
router.post("/login", login)
router.get("/me", isAuthenticated, getUser)

/* USER */

router.get("/users/:id", isAuthenticated, userDetail)
router.patch("/users/me", isAuthenticated, userEdit)
router.delete("/users/me", isAuthenticated, userDelete)


/* ARTIST */
router.post("/artists/:id", isAuthenticated, isAgency, artistCreate)
router.get("/artists", isAuthenticated, artistList)
router.patch("/artists/:id", isAuthenticated, isAgency, artistEdit)
router.delete("/artists/:id", isAuthenticated, isAgency, artistDelete)
router.get("/artists/:id", isAuthenticated, artistDetail)

/* FAVORITE */

router.post("/artists/:artistId/favorites", isAuthenticated, isPromoter, favorite )

router.get("/artists/favorites", isAuthenticated, isPromoter, listFavorites)




module.exports = router;
