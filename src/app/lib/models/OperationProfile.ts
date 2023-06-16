import { Schema, model, models } from 'mongoose'

const OperationProfileSchema = new Schema({
  dba_name: {
    type: String,
  },
  description: {
    type: String,
  },
  naics: {
    type: String
  }
},
 { timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }}
);


const opsProfileModel = models.operation_profile || model('operation_profile', OperationProfileSchema);

export default opsProfileModel;
