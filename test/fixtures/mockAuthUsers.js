const userWithAllPermissions = {
  username: "userTest",
  roles: ["system.admin", "system.editor", "system.user"]
};
const editorUser = {
  username: "editor",
  roles: ["system.editor", "system-user"]
};
const user = {
  username: "user",
  roles: ["system.user"]
};

module.exports = {
  allPermissions: userWithAllPermissions,
  editor: editorUser,
  user: user
};
