const User = require("../models/User.model")

module.exports.isAgency = async (req, res, next) => {
    try{
        const user = await User.findById(req.currentUserId)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
          }
      
          if (user.role !== "agency") {
            return res.status(403).json({ success: false, message: "Access denied: Not an agency" });
          }
        next()
    }catch(error){
        next(error)
    }
}