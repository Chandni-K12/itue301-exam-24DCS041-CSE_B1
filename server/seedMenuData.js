import mongoose from 'mongoose'
import MenuItem from './models/MenuItem.js'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/itue301'

const menuData = [
  {
    name: 'Samosa',
    category: 'snack',
    price: 20,
    available: true,
    caloriesPer100g: 260,
    weightG: 80,
  },
  {
    name: 'Masala Chai',
    category: 'drink',
    price: 15,
    available: true,
    caloriesPer100g: 50,
  },
  {
    name: 'Veg Thali',
    category: 'meal',
    price: 120,
    available: true,
    caloriesPer100g: 150,
    weightG: 350,
  },
  {
    name: 'Cold Coffee',
    category: 'drink',
    price: 45,
    available: false,
    caloriesPer100g: 70,
    weightG: 250,
  },
  { name: 'Paneer Wrap', category: 'meal', price: 75, available: true, caloriesPer100g: 240, weightG: 220 },
  { name: 'Aloo Paratha', category: 'meal', price: 55, available: true, caloriesPer100g: 260, weightG: 180 },
  { name: 'Mango Lassi', category: 'drink', price: 40, available: true, caloriesPer100g: 120, weightG: 250 },
  { name: 'Pav Bhaji', category: 'meal', price: 90, available: true, caloriesPer100g: 180, weightG: 300 },
  { name: 'Poha Bowl', category: 'meal', price: 35, available: true, caloriesPer100g: 170, weightG: 250 },
  { name: 'Dhokla Plate', category: 'snack', price: 40, available: true, caloriesPer100g: 160, weightG: 150 },
]

async function seedMenuData() {
  await mongoose.connect(mongoUri)

  try {
    for (const menuDataItem of menuData) {
      const menuItem = await MenuItem.findOne({ name: menuDataItem.name })
        ?? new MenuItem({ name: menuDataItem.name })

      Object.assign(menuItem, menuDataItem)
      const savedItem = await menuItem.save()
      console.log(`Saved ${savedItem.name} (${savedItem.category})`)
    }
  } finally {
    await mongoose.disconnect()
  }
}

seedMenuData().catch((error) => {
  console.error(`Menu data seed failed: ${error.message}`)
  process.exitCode = 1
})
