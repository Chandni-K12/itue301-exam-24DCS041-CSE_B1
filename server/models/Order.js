import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    default: 'default',
  },
  itemName: {
    type: String,
    required: true,
    enum: [
      'Samosa', 'Masala Chai', 'Veg Thali', 'Cold Coffee', 'Paneer Wrap',
      'Aloo Paratha', 'Mango Lassi', 'Pav Bhaji', 'Poha Bowl', 'Dhokla Plate',
    ],
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 1,
  },
  weightG: {
    type: Number,
    required: true,
    min: Number.MIN_VALUE,
    default: 100,
  },
  kcal: {
    type: Number,
    required: true,
    min: 0,
  },
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order
