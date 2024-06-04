import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  account_no: {
    type: String,
    required: [true, "account number is required"],
  },
  favorite_account_no: {
    type: String,
    required: [true, "favorite account number is required"],
  },
  alias: {
    type: String,
    required: [true, "alias is required"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

FavoriteSchema.methods.toJSON = function () {
  const favorite = this.toObject();
  return favorite;
};

export default mongoose.model("Favorite", FavoriteSchema);
