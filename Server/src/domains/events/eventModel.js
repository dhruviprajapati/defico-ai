import mongoose from "mongoose";
const eventSchema = new mongoose.Schema(
{
    uploadId: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },

    transactionId: {
        type: String,
        required: true,
        trim: true,
    },

    employeeId: {
        type: String,
        required: true,
        trim: true,
    },

    employeeName: {
        type: String,
        trim: true,
    },

    storeId: {
        type: String,
        required: true,
        trim: true,
    },

    registerId: {
        type: String,
        required: true,
        trim: true,
    },

    timestamp: {
        type: Date,
        required: true,
    },

    eventType: {
        type: String,
        required: true,
        enum: [
            "SALE",
            "REFUND",
            "VOID",
            "RETURN",
            "LOSS",
            "DAMAGE"
        ],
    },

    productId: {
        type: String,
        trim: true,
    },

    productName: {
        type: String,
        trim: true,
    },

    category: {
        type: String,
        trim: true,
    },

    quantity: {
        type: Number,
        required: true,
        min: 1,
    },

    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },

    paymentMethod: {
        type: String,
        enum: [
            "CASH",
            "CARD",
            "UPI",
            "ONLINE"
        ],
    },

    approvalStatus: {
        type: Boolean,
        default: false,
    },

    approvedBy: {
        type: String,
        trim: true,
    },

    reason: {
        type: String,
        trim: true,
    },

    customerId: {
        type: String,
        trim: true,
    }
},
{
    timestamps: true,
    versionKey: false,
    collection: "normalized_events",
});

eventSchema.index({ uploadId: 1, transactionId: 1 }, { unique: true });

export const NormalizedEvent = mongoose.model(
    "NormalizedEvent",
    eventSchema
);

