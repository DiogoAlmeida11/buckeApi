const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const User_type = db.user_type;


exports.signup = async (req, res) => {
    try {
        let user = await User.findOne(
            { where: { email_utilizador: req.body.email_utilizador } }
        );
        if (user)
            return res.status(400).json({ message: "Email already associated with account!" });

        // save User to database
        user = await User.create({
            email_utilizador: req.body.email_utilizador,
            password: bcrypt.hashSync(req.body.password, 10), // generates hash to password
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            courseID: 1,
        });
        if (req.body.user_type) {
            let user_type = await User_type.findOne({ where: { type: req.body.user_type } });
            if (user_type) {
                if (user_type.type === "Admin") {
                    await User.update({ id_type: 1 }, { where: { id: user.id } })
                } else if (user_type.type === "Association") {
                    await User.update({ id_type: 3 }, { where: { id: user.id } })
                }
            }
        }
        else
            await User.update({ id_type: 2 }, { where: { id: user.id } })
        return res.json({ message: "User was registered successfully!" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

exports.signin = async (req, res) => {
    try {

        let user = await User.findOne({ where: { email_utilizador: req.body.email_utilizador } });
        if (!user) return res.status(404).json({ message: "Username or password invalid!" });

        // tests a string (password in body) against a hash (password in database)
        const passwordIsValid = bcrypt.compareSync(
            req.body.password, user.password
        );
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null, message: "Username or password invalid!"
            });
        }

        // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
        });
        let user_type = await User_type.findOne({ where: { id: user.id_type } });
        return res.status(200).json({
            id: user.id, email_utilizador: user.email_utilizador,
            email_utilizador: user.email_utilizador, nome: user.nome, user_type: user_type.type.toUpperCase(), accessToken: token
        });
    } catch (err) { res.status(500).json({ message: err.message }); };
};

exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    // verify request token given the JWT secret key
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.loggedUserId = decoded.id; // save user ID for future verifications
        next();
    });
};

exports.isAdmin = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let user_type = await User_type.findOne({ where: { id: user.id_type } });
    if (user_type.type === "Admin")
    {
        next();
    }else{
        return res.status(403).send({
            message: "Require Admin User Type!"
        });
    }
};

exports.isAdminOrLoggedUser = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let user_type = await User_type.findOne({ where: { id: user.id_type } });
    if (user_type.type === "Admin" || (user.id == req.params.userID)){
        next();
    }else{
        return res.status(403).send({
            message: "Require Admin User Type!"
        });
    }
};


exports.isAssociation = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId);
    let user_type = await User_type.findOne({ where: { id: user.id_type } });
    if (user_type.type === "Association" || user_type.type === "Admin")
    {
        next();
    }else{
        return res.status(403).send({
            message: "Require Association or Admin User Type!"
        });
    }
};