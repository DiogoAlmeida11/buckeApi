module.exports = (sequelize, DataTypes) => {
    const Annoucement_type = sequelize.define("annoucement_type", {
        descricao_tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Description can not be empty or null!" } }
        }
    }, {
        timestamps: false
    });
    return Annoucement_type;
};