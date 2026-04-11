const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// === UTILS ===
const handlePrismaError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: 'Database operation failed' });
};

// === HEALTH CHECK ===
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running and connected!' });
});

// =======================
// CATEGORIES
// =======================
app.get('/api/categories', async (req, res) => {
  try { res.json(await prisma.category.findMany()); } catch (err) { handlePrismaError(res, err); }
});

app.post('/api/categories', async (req, res) => {
  try { res.json(await prisma.category.create({ data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.put('/api/categories/:id', async (req, res) => {
  try { res.json(await prisma.category.update({ where: { id: parseInt(req.params.id) }, data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.delete('/api/categories/:id', async (req, res) => {
  try { await prisma.category.delete({ where: { id: parseInt(req.params.id) } }); res.status(204).send(); } catch (err) { handlePrismaError(res, err); }
});

// =======================
// PRODUCTS
// =======================
app.get('/api/products', async (req, res) => {
  try { res.json(await prisma.product.findMany()); } catch (err) { handlePrismaError(res, err); }
});

app.post('/api/products', async (req, res) => {
  try { res.json(await prisma.product.create({ data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.put('/api/products/:id', async (req, res) => {
  try { res.json(await prisma.product.update({ where: { id: parseInt(req.params.id) }, data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.delete('/api/products/:id', async (req, res) => {
  try { await prisma.product.delete({ where: { id: parseInt(req.params.id) } }); res.status(204).send(); } catch (err) { handlePrismaError(res, err); }
});

// =======================
// SUPPLIERS
// =======================
app.get('/api/suppliers', async (req, res) => {
  try { res.json(await prisma.supplier.findMany()); } catch (err) { handlePrismaError(res, err); }
});

app.post('/api/suppliers', async (req, res) => {
  try { res.json(await prisma.supplier.create({ data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try { res.json(await prisma.supplier.update({ where: { id: parseInt(req.params.id) }, data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try { await prisma.supplier.delete({ where: { id: parseInt(req.params.id) } }); res.status(204).send(); } catch (err) { handlePrismaError(res, err); }
});

// =======================
// CLIENTS
// =======================
app.get('/api/clients', async (req, res) => {
  try { res.json(await prisma.client.findMany()); } catch (err) { handlePrismaError(res, err); }
});

app.post('/api/clients', async (req, res) => {
  try { res.json(await prisma.client.create({ data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.put('/api/clients/:id', async (req, res) => {
  try { res.json(await prisma.client.update({ where: { id: parseInt(req.params.id) }, data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.delete('/api/clients/:id', async (req, res) => {
  try { await prisma.client.delete({ where: { id: parseInt(req.params.id) } }); res.status(204).send(); } catch (err) { handlePrismaError(res, err); }
});

// =======================
// DELIVERERS
// =======================
app.get('/api/deliverers', async (req, res) => {
  try { res.json(await prisma.deliverer.findMany()); } catch (err) { handlePrismaError(res, err); }
});

app.post('/api/deliverers', async (req, res) => {
  try { res.json(await prisma.deliverer.create({ data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.put('/api/deliverers/:id', async (req, res) => {
  try { res.json(await prisma.deliverer.update({ where: { id: parseInt(req.params.id) }, data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.delete('/api/deliverers/:id', async (req, res) => {
  try { await prisma.deliverer.delete({ where: { id: parseInt(req.params.id) } }); res.status(204).send(); } catch (err) { handlePrismaError(res, err); }
});

// =======================
// AGENTS
// =======================
app.get('/api/agents', async (req, res) => {
  try { res.json(await prisma.agent.findMany()); } catch (err) { handlePrismaError(res, err); }
});

app.post('/api/agents', async (req, res) => {
  try { res.json(await prisma.agent.create({ data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.put('/api/agents/:id', async (req, res) => {
  try { res.json(await prisma.agent.update({ where: { id: parseInt(req.params.id) }, data: req.body })); } catch (err) { handlePrismaError(res, err); }
});

app.delete('/api/agents/:id', async (req, res) => {
  try { await prisma.agent.delete({ where: { id: parseInt(req.params.id) } }); res.status(204).send(); } catch (err) { handlePrismaError(res, err); }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
