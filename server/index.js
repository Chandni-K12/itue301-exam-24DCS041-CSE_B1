import mongoose from 'mongoose'
import express from 'express'
import Order from './models/Order.js'

const app = express()
const port = Number(process.env.PORT) || 5000
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/itue301'

const menuCaloriesPer100g = {
  Samosa: 260,
  'Masala Chai': 50,
  'Veg Thali': 150,
  'Cold Coffee': 70,
  'Paneer Wrap': 240,
  'Aloo Paratha': 260,
  'Mango Lassi': 120,
  'Pav Bhaji': 180,
  'Poha Bowl': 170,
  'Dhokla Plate': 160,
}

function formatOrder(order) {
  return {
    id: order._id.toString(),
    itemName: order.itemName,
    qty: order.qty,
    weightG: order.weightG,
    kcal: order.kcal,
  }
}

app.use((request, response, next) => {
  console.log(`[${request.method}] [${request.path}] [${new Date().toISOString()}]`)
  next()
})

app.use(express.json())

app.post('/api/v1/orders', async (request, response) => {
  const body = request.body ?? {}
  const { itemName } = body
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId : 'default'
  const qty = body.qty === undefined ? 1 : body.qty
  const weightG = body.weightG === undefined ? 100 : body.weightG

  if (typeof itemName !== 'string' || !Object.hasOwn(menuCaloriesPer100g, itemName)) {
    return response.status(400).json({
      error: 'itemName must be a menu item',
    })
  }

  if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    return response.status(400).json({
      error: 'qty must be a whole number from 1 to 10',
    })
  }

  if (typeof weightG !== 'number' || !Number.isFinite(weightG) || weightG <= 0) {
    return response.status(400).json({
      error: 'weightG must be a number greater than 0',
    })
  }

  const order = await Order.create({
    sessionId,
    itemName,
    qty,
    weightG,
    kcal: Math.round((menuCaloriesPer100g[itemName] * weightG * qty) / 100),
  })

  return response.status(201).json(formatOrder(order))
})

app.get('/api/v1/orders', async (request, response) => {
  const query = typeof request.query.sessionId === 'string'
    ? { sessionId: request.query.sessionId }
    : {}
  const orders = await Order.find(query).sort({ _id: 1 })
  return response.status(200).json(orders.map(formatOrder))
})

app.get('/api/v1/orders/:id', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(404).json({ error: 'Order not found' })
  }

  const order = await Order.findById(request.params.id)
  if (!order) return response.status(404).json({ error: 'Order not found' })
  return response.status(200).json(formatOrder(order))
})

app.delete('/api/v1/orders/:id', async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(404).json({ error: 'Order not found' })
  }

  const order = await Order.findByIdAndDelete(request.params.id)
  if (!order) return response.status(404).json({ error: 'Order not found' })
  return response.status(200).json(formatOrder(order))
})

app.get('/api/v1/boom', () => {
  throw new Error('Intentional test error')
})

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error)
  return response.status(500).json({ error: 'Something went wrong' })
})

async function startServer() {
  await mongoose.connect(mongoUri)
  app.listen(port, () => {
    console.log(`Orders API connected to MongoDB and listening on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error(`Could not start orders API: ${error.message}`)
  process.exitCode = 1
})
