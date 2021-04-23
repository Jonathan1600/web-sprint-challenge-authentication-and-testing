const Auth = require("../auth/auth-model");

const checkUsernameExists = async (req, res, next) => {
    const { username } = req.body;
    const users = await Auth.findBy({ username })
    if (!users || users.length < 1 || users === null) {
        res.status(401).json({ message: "invalid credentials" });
    } else {
        req.user = users[0]
        next()
    }

}

module.exports = {
    checkUsernameExists,
}
