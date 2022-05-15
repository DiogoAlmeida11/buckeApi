module.exports = (sequelize, DataTypes) => {
    const Gender = sequelize.define("gender", {
        descricao_genero: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Gender can not be empty or null!" } }
        }
    }, {
        timestamps: false
    });
    return Gender;
};