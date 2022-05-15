module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("category", {
        descricao_categoria: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Description can not be empty or null!" } }
        }
    }, {
        timestamps: false
    });
    return Category;
};