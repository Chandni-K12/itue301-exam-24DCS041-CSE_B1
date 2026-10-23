import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true,
    maxlength: [50, 'name must be at most 50 characters'],
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
    min: [0, 'price must be 0 or greater'],
  },
  category: {
    type: String,
    required: [true, 'category is required'],
    enum: {
      values: ['snack', 'meal', 'drink'],
      message: 'category must be snack, meal, or drink',
    },
    default: 'snack',
  },
  available: {
    type: Boolean,
    default: true,
  },
  caloriesPer100g: {
    type: Number,
    required: [true, 'caloriesPer100g is required'],
    min: [0, 'caloriesPer100g must be 0 or greater'],
    max: [900, 'caloriesPer100g must be at most 900'],
  },
  weightG: {
    type: Number,
    default: 100,
    min: [1, 'weightG must be at least 1'],
    max: [2000, 'weightG must be at most 2000'],
    validate: {
      validator(value) {
        return this.category !== 'drink' || value <= 500
      },
      message: 'weightG for a drink must be at most 500',
    },
  },
})

const MenuItem = mongoose.models.MenuItem
  || mongoose.model('MenuItem', menuItemSchema)

export default MenuItem
