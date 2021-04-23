const Auth = require("../auth/auth-model");

const checkBody = async (req, res, next) => {
    const body = req.body;
    if (!body) {
        res.status(401).json({ message: "username and password required" });
    } else if (!body.password || !body.username || body.password == null || body.username == null) {
        res.status(401).json({ message: "username and password required" });
    } else {
        next()
    }

}

const checkUsernameTaken = async (req, res, next) => {
    const { username } = req.body;
    const users = await Auth.findBy({ username })
    if (!users || users.length < 1 || users === null) {
        next()
    } else {
        res.status(401).json({ message: "username taken" });
    }

}

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
    checkUsernameTaken,
    checkBody
}
