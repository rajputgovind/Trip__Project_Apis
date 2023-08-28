const checkOrganizer = (req, res, next) => {
    try {
      if (req.user && req.user.role.roleName === "Organizer") {
        next();
      } else {
        throw new Error();
      }
    } catch (err) {
      res
        .status(401)
        .json({ success: false, message: "unAuthorized" });
    }
  };
  
  export default checkOrganizer;
  