import { Schema, model, models } from "mongoose";

const AppSchema = new Schema({
  name: {
    type: String,
  },
  tokens: {
    type: [String],
  },
});

const appModel = models.app || model('app', AppSchema);

export default appModel;
