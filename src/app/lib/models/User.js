import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  primaryEmail: {
    type: String,
    required: true,
    unique: true,
  },
  primaryEmailVerified: {
    type: Boolean,
  },
  primaryPhone: {
    type: String,
  },
  primaryPhoneVerified: {
    type: Boolean,
  },
})

const user = models.user || model('user', UserSchema);

export default user
