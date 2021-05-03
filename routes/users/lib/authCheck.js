const jwt = require('jsonwebtoken');

const checkIsUserHaveValidJwtToken = async (req, res, next) => {
    try {
        let jwtToken  = req.headers.authorization.slice(7);

        let decodedJWT = jwt.verify(jwtToken, process.env.JWT_VERY_SECRET);

        console.log(decodedJWT);
        if (decodedJWT) {
            next();
        }
    } catch (e) {
			res.status(500).json({
				message: e.message,
			});
		}
}
module.exports = {
    checkIsUserHaveValidJwtToken
}