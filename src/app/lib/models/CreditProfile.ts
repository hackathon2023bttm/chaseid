import { Schema, model, models } from 'mongoose'

const CreditProfileSchema = new Schema({
  employer: {
    type: String,
  },
  annual_income_amount: {
    type: Number,
  },
  annual_income_currency: {
    type: String,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const creditProfile = models.credit_profile || model('credit_profile', CreditProfileSchema);

export default creditProfile;
