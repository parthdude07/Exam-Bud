const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    await prisma.user.createMany({
      data: [
        { name: 'Alice', image: '', role: 'USER' },
        { name: 'Bob',   image: '', role: 'ADMIN' }
      ]
    });
    console.log('🗒️  Seeded users');
  }


  const branchCount = await prisma.branch.count();
  if (branchCount === 0) {
    const branches = ['CSE','ECE','SM','MECH'];
    for (const name of branches) {
      const b = await prisma.branch.create({ data: { name } });
      for (let i = 1; i <= 8; i++) {
        const sem = await prisma.semester.create({
          data: { number: i, branchId: b.id }
        });
        await prisma.subject.createMany({
          data: [
            { name: `Subject A${i}`, semesterId: sem.id },
            { name: `Subject B${i}`, semesterId: sem.id }
          ]
        });
      }
    }
    console.log('📚 Seeded branches, semesters & subjects');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
