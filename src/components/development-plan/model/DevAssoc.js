import DevelopmentPlanModel from "./DevelopmentPlanModel.js";
import DevelopmentPlanMeta from "./DevelopmentPlanMeta.js";
import DevelopmentPlanVerify from "./DevelopmentPlanVerify.js";

// Associate DevelopmentPlanModel with DevelopmentPlanMeta
DevelopmentPlanModel.hasMany(DevelopmentPlanMeta, {
  foreignKey: "plan_id",
  as: "metas",
  onDelete: "CASCADE",
});

DevelopmentPlanMeta.belongsTo(DevelopmentPlanModel, {
  foreignKey: "plan_id",
  as: "plan",
});

// Associate DevelopmentPlanMeta with DevelopmentPlanVerify
DevelopmentPlanMeta.hasMany(DevelopmentPlanVerify, {
  foreignKey: "milestone_id",
  as: "verifications",
  onDelete: "CASCADE",
});

DevelopmentPlanVerify.belongsTo(DevelopmentPlanMeta, {
  foreignKey: "milestone_id",
  as: "meta",
});

// Associate DevelopmentPlanModel with DevelopmentPlanVerify (if needed)
DevelopmentPlanModel.hasMany(DevelopmentPlanVerify, {
  foreignKey: "post_id",
  as: "verifications",
  onDelete: "CASCADE",
});

DevelopmentPlanVerify.belongsTo(DevelopmentPlanModel, {
  foreignKey: "post_id",
  as: "plan",
});

export default { DevelopmentPlanModel, DevelopmentPlanMeta, DevelopmentPlanVerify };
