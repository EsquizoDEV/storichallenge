const bcrypt = require("bcryptjs");

const users = [
  {
    name: "Luis",
    email: "luismtzesq@gmail.com",
    password: "admin",
    role: "admin",
  },
  { name: "user", email: "esquizo@gmail.com", password: "user", role: "user" },
];

async function hashPasswords(users: any[]) {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log(
      `INSERT INTO "users" (name, email, password, role) VALUES ('${user.name}', '${user.email}', '${hashedPassword}', '${user.role}');`
    );
  }
}

hashPasswords(users);
