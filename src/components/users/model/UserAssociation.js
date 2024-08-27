import UserMetaModel from "./UserMetaModel.js";
import UserModel from "./UserModel.js";

UserModel.hasMany(UserMetaModel, {
    foreignKey: 'user_id',
    as: 'meta'
});

UserMetaModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user',
});

export default {UserModel, UserMetaModel};