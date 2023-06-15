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
  cancel_redirect_url: {
    type: String,
  },
  profiles: {
    type: [ProfileSchema],
  },
  app_id: {
    type: Schema.Types.ObjectId,
    // ref: 'app'
  },
  status: {
    type: String,
    default: 'pending',
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const sessionModel = models.verification_session || model('verification_session', VerificationSessionSchema);


const port = process.env.PORT || 3000
const BASE = process.env.NODE_ENV === 'development' ? ('http://localhost:' + port) : 'https://chaseid.fly.dev'

export const renderVerificationSessionJson = (verificationSession: any, base: string = BASE) => {
  const verificationSessionUrl = base + '/verify/' + verificationSession._id
  return Object.assign({}, {
    verification_session_url: verificationSessionUrl,
  }, verificationSession.toObject());
}

export default sessionModel;
