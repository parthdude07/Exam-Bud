const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// dummy auth
app.use((req, res, next) => {
  const id = parseInt(req.header('x-user-id')) || 1;
  const role = req.header('x-user-role') || 'USER';
  req.user = { id, role };
  next();
});

// Branch & semester & subject listings 
app.get('/branches', async (req, res) => {
  const branches = await prisma.branch.findMany();
  res.json(branches);
});
app.get('/branches/:bid/semesters', async (req, res) => {
  const sems = await prisma.semester.findMany({
    where: { branchId: +req.params.bid }
  });
  res.json(sems);
});
app.get('/semesters/:sid/subjects', async (req, res) => {
  const subs = await prisma.subject.findMany({
    where: { semesterId: +req.params.sid }
  });
  res.json(subs);
});

//  Uploads 
const uploadRoutes = require('./src/routes/uploadRoutes.js');
app.use('/', uploadRoutes);

//  Discussions
app.get('/subjects/:sid/discussions', async (req, res) => {
  const ds = await prisma.discussion.findMany({
    where: { subjectId: +req.params.sid },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(ds);
});
app.post('/subjects/:sid/discussions', async (req, res) => {
  const { content } = req.body;
  const d = await prisma.discussion.create({
    data: {
      content,
      subjectId: +req.params.sid,
      userId: req.user.id
    }
  });
  res.json(d);
});

//  Labs 
const labRoutes = require('./src/routes/labRoutes.js');
app.use('/', labRoutes);

app.listen(process.env.PORT, () =>
  console.log(` Backend running on http://localhost:${process.env.PORT}`)
);