const {Router} = require("express")
const router = Router()

const { getHome } = require("../controllers/misc.controller")

router.get("/", getHome);

module.exports = router;
