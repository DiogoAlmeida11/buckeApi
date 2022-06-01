module.exports = (sequelize, DataTypes) => {
    const User_type = sequelize.define("user_type", {
        type: {
            type: DataTypes.STRING
        }
    },
    {
        timestamps: false
    });
    return User_type;
};