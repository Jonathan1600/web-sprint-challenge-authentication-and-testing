const db = require('../../data/dbConfig');

function find() {
    return db("users")
        .select("id", "username")
        .orderBy("id")
}

const findBy = async (filter) => {
    const users = await db("users")
        .select("id", "username", "password")
        .orderBy("id")
        .where(filter)

    return users
}

const findById = async (user_id) => {
    const user = await db("users")
        .select("id", "username", "password")
        .where("id", user_id).first()

    return user
}

async function add(user) {
    let [created_user_id] = await db("users").insert({ username: user.username, password: user.hashedPassword })
    return findById(created_user_id)
}

module.exports = {
    add,
    find,
    findBy,
    findById,
};
