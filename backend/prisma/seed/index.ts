import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createUser(
  username: string,
  password: string,
  role: "ADMIN" | "KASIR",
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password_hash: hashedPassword,
      role,
    },
  });
}

async function main() {
  await createUser("admin", "admin123", "ADMIN");
  await createUser("kasir", "kasir123", "KASIR");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
