const dbConfig = require('../config/db.config.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
    ,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

// sequelize.authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

(async () => {
    try {
        await sequelize.authenticate;
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();

const db = {};
db.sequelize = sequelize;

//export User model
db.user = require("./user.model.js")(sequelize, DataTypes);
//export Project model
db.project = require("./project.model.js")(sequelize, DataTypes);
//export Annoucement model
db.annoucement = require("./annoucement.model.js")(sequelize, DataTypes);
//export Comment model
db.comment = require("./comment.model.js")(sequelize, DataTypes);
//export Curso model
db.course = require("./course.model.js")(sequelize, DataTypes);
//export Annoucement_type model
db.annoucement_type = require("./annoucement_type.model.js")(sequelize, DataTypes);
//export User_comment model
db.user_comment = require("./user_comment.model.js")(sequelize, DataTypes);
//export Gender model
db.gender = require("./gender.model.js")(sequelize, DataTypes);
//export Category
db.category = require("./category.model.js")(sequelize, DataTypes);
// export project_comment
db.project_comment = require("./project_comment.model.js")(sequelize, DataTypes);
//export fav_userproject
db.fav_userproject = require("./fav_userproject.model.js")(sequelize, DataTypes);
//export fav_userproject
db.fav_userannoucement = require("./fav_userannoucement.model.js")(sequelize, DataTypes);
//define relationships

//users
//1:M
db.course.hasMany(db.user);
db.user.belongsTo(db.course);
//1:M
db.user.hasMany(db.annoucement);
db.annoucement.belongsTo(db.user);
//1:M
db.gender.hasMany(db.user);
db.user.belongsTo(db.gender);
//N:M
db.user.belongsToMany(db.project, { through: 'UserProjects' });
db.project.belongsToMany(db.user, { through: 'UserProjects' });
//1:M
db.user.hasMany(db.user_comment);
db.user_comment.belongsTo(db.user);
//1:M
db.user.hasMany(db.fav_userproject);
db.fav_userproject.belongsTo(db.user);
//1:M
db.user.hasMany(db.fav_userannoucement);
db.fav_userannoucement.belongsTo(db.user);

//annoucements
//1:M
db.category.hasMany(db.annoucement);
db.annoucement.belongsTo(db.category);
//1:M
db.annoucement_type.hasMany(db.annoucement);
db.annoucement.belongsTo(db.annoucement_type);

//projects
//1:M
db.project.hasMany(db.project_comment);
db.project_comment.belongsTo(db.project);

//comments
//1:M
db.comment.hasMany(db.user_comment);
db.user_comment.belongsTo(db.comment);
//1:M
db.comment.hasMany(db.project_comment);
db.project_comment.belongsTo(db.comment);


// optionally: SYNC
// db.sequelize.sync()
//     .then(() => {
//         console.log('DB is successfully synchronized')
//     })
//     .catch(e => {
//         console.log(e)
//     });

// optionally: SYNC
(async () => {
    try {
        await sequelize.sync(/*{ force: true }*/);
        console.log('DB is successfully synchronized')
    } catch (error) {
        console.log(e)
    }
})();

module.exports = db;