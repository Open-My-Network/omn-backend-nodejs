import rolesData from "../config/user-role.json" assert { type: "json" };

export const rbacMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.wp_capabilities;

    if (!userRoles) {
      return res
        .status(403)
        .json({ message: "Access denied. No roles assigned." });
    }

    const hasRole = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

export default rbacMiddleware;
