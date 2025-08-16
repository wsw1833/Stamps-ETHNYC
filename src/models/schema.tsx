import { unique } from 'next/dist/build/utils';

const mongoose = require('mongoose');
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
    txHash: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    ipfs: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    voucherType: {
      type: String,
      required: true,
    },
    voucherAmount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'used', 'expired'],
      default: 'active',
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
    collection: 'Stamp',
  }
);

const Stamp = mongoose.models.Stamp || mongoose.model('Stamps', StampSchema);

export { Stamp };
