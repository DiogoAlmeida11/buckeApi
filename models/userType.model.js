module.exports = (sequelize, DataTypes) => {
    const UserType = sequelize.define("user_type", {
        type: {
            type: DataTypes.STRING,
            defaultValue: "regular"
        }
    },
        {
            timestamps: false
        });
    return UserType;
};