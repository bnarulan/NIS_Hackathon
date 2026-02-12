import { PrismaClient, Role, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const resident = await prisma.user.upsert({
    where: { iin: "123456789012" },
    update: {},
    create: {
      iin: "123456789012",
      passwordHash:
        "$2b$10$eW5oJp3bKCsOq3rC5nqbcOzvBf4pHf1jD9YVtBoP7s.6ZzI9FQ6a2",
      role: Role.RESIDENT
    }
  });

  const contractor = await prisma.user.upsert({
    where: { iin: "987654321098" },
    update: {},
    create: {
      iin: "987654321098",
      passwordHash:
        "$2b$10$eW5oJp3bKCsOq3rC5nqbcOzvBf4pHf1jD9YVtBoP7s.6ZzI9FQ6a2",
      role: Role.CONTRACTOR
    }
  });

  const controller = await prisma.user.upsert({
    where: { iin: "111122223333" },
    update: {},
    create: {
      iin: "111122223333",
      passwordHash:
        "$2b$10$eW5oJp3bKCsOq3rC5nqbcOzvBf4pHf1jD9YVtBoP7s.6ZzI9FQ6a2",
      role: Role.CONTROLLER
    }
  });

  await prisma.post.createMany({
    data: [
      {
        userId: resident.id,
        category: "Дорога",
        description: "Яма на дороге возле школы, машины объезжают по встречке",
        lat: 51.1605,
        lng: 71.4704,
        dangerLevel: 4,
        locationWeight: 6,
        status: PostStatus.OPEN
      },
      {
        userId: resident.id,
        category: "Освещение",
        description: "Не работает освещение на детской площадке",
        lat: 51.163,
        lng: 71.45,
        dangerLevel: 3,
        locationWeight: 5,
        status: PostStatus.IN_PROGRESS,
        assignedContractorId: contractor.id
      }
    ]
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });