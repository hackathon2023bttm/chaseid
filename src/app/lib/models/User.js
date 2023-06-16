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
  primaryCreditProfile: {
    type: Schema.Types.ObjectId,
  },
  creditProfiles: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  primaryOperationProfile: {
    type: Schema.Types.ObjectId,
  },
  operationProfiles: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
});

const user = models.user || model('user', UserSchema);

export default user
