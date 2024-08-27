import PostModel from "./PostModel.js";
import PostMetaModel from "./PostMetaModel.js";

PostModel.hasMany(PostMetaModel, {
    foreignKey: "post_id",
    as: 'meta'
});

PostMetaModel.belongsTo(PostModel, {
    foreignKey: "post_id",
    as: "post_meta"
});

export default {PostModel, PostMetaModel};