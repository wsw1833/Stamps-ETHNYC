import mongoose from 'mongoose';

const { Schema } = mongoose;

// Named Stamp Schema
const StampSchema = new Schema(
  {
    ownerAddress: {
      type: String,
      required: true,
      index: true,
    },
    stampId: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      required: true,
    },
    disountAmount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    txHash: {
      type: String,
      required: true,
      unique: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    ipfs: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'used', 'expired'],
      default: 'active',
    },
    variant: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
    collection: 'Stamp',
  }
);

const Stamp = mongoose.models.Stamp || mongoose.model('Stamps', StampSchema);

export { Stamp };
