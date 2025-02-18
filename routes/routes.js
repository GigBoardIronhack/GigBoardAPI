const {Router} = require("express")
const router = Router()

const { getHome } = require("../controllers/misc.controller")
const { register, login, getUser } = require("../controllers/auth.controller")
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { isAgency, isPromoter } = require("../middlewares/user.middleware")
const { userEdit, userDetail, userDelete } = require("../controllers/user.controller");
const { purposalCreate, agencyEditPurposal, listAgencyPurposal, purposalDelete, getPurposal, listPromoterPurposal } = require("../controllers/purposal.controller");
const { artistCreate, artistList, artistDelete, artistEdit, artistDetail, agencyArtistList } = require("../controllers/artist.controller");
const { favorite, listFavorites } = require("../controllers/favorite.controller")
const { create, detail, list, chatDelete } = require("../controllers/chat.controller.js")
const { createMessage } = require("../controllers/message.controller");

const upload = require("../config/storage.config");


router.get("/", getHome);


/* AUTH */

router.post("/register", upload.single("imageUrl"), register)
router.post("/login", login)
router.get("/me", isAuthenticated, getUser)

/* USER */

router.get("/users/:id", isAuthenticated, userDetail)
router.patch("/users/:id", isAuthenticated, userEdit)
router.delete("/users/:id", isAuthenticated, userDelete)


/* ARTIST */
router.get("/artists/agency", isAuthenticated, agencyArtistList)
router.get("/artists/:id", isAuthenticated, artistDetail)
router.get("/artists", isAuthenticated, isPromoter, artistList)
router.post("/artists", isAuthenticated, isAgency,upload.single("imageUrl"), artistCreate)
router.patch("/artists/:id", isAuthenticated, isAgency, artistEdit)
router.delete("/artists/:id", isAuthenticated, isAgency, artistDelete)

/* FAVORITE */

router.get("/favorites", isAuthenticated, isPromoter, listFavorites)
router.post("/artists/:id/favorites", isAuthenticated, isPromoter, favorite)

/* PURPOSAL */

router.get("/purposals/promoter", isAuthenticated, isPromoter, listPromoterPurposal)
router.get("/purposals/:id", isAuthenticated, getPurposal)
router.get("/purposals", isAuthenticated, isAgency, listAgencyPurposal)
router.post("/artists/:id/purposal",isAuthenticated, isPromoter, purposalCreate)
router.patch("/purposals/:id", isAuthenticated, agencyEditPurposal)
router.delete("/purposals/:id", isAuthenticated,  purposalDelete)

/* CHATS */

router.get("/chats/:chatId", isAuthenticated, detail);
router.get("/chats", isAuthenticated, list);
router.post("/chats", isAuthenticated, create);
router.delete("/chats/:chatId", isAuthenticated, chatDelete);

/* MESSAGES */

router.post(
  "/chats/messages/create",
  isAuthenticated, createMessage
);

module.exports = router;







module.exports = router;
