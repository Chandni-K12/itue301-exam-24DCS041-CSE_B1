import mongoose from 'mongoose'
import MenuItem from './models/MenuItem.js'
import { formatValidationError } from './utils/formatValidationError.js'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/itue301'

async function seedMenuItem() {
  await mongoose.connect(mongoUri)

  try {
    const validItem = new MenuItem({
      name: 'Seed Samosa',
      price: 20,
      category: 'snack',
      caloriesPer100g: 260,
      weightG: 80,
    })
    const savedItem = await validItem.save()
    console.log('Saved valid menu item:')
    console.log(JSON.stringify(savedItem.toObject(), null, 2))

    const invalidItem = new MenuItem({
      name: 'This invalid menu item name is longer than fifty characters',
      price: -5,
      category: 'dessert',
      available: true,
      caloriesPer100g: 950,
      weightG: 2100,
    })

    try {
      await invalidItem.save()
      throw new Error('The invalid seed item unexpectedly passed validation')
    } catch (error) {
      if (!(error instanceof mongoose.Error.ValidationError)) throw error
      console.log('Formatted validation error:')
      console.log(JSON.stringify(formatValidationError(error), null, 2))
    }
  } finally {
    await mongoose.disconnect()
  }
}

seedMenuItem().catch((error) => {
  console.error(`Seed failed: ${error.message}`)
  process.exitCode = 1
})
