import { Schema, model, models } from 'mongoose'

const ProfileSchema = new Schema({
  requested: {
    type: Boolean,
  },
  type: {
    type: String,
  },
  status: {
    type: String,
    default: 'requested',
  },
});

const VerificationSessionSchema = new Schema({
  custom_data: {
    type: String,
  },
  flow_redirect_url: {
    type: String,
  },
  profiles: {
    type: [ProfileSchema],
  },
  app_id: {
    type: Schema.Types.ObjectId,
    // ref: 'app'
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const sessionModel = models.verification_session || model('verification_session', VerificationSessionSchema);

export default sessionModel;
