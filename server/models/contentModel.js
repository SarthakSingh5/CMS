import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    body: {
        type: String,
        required: [true, 'Please add some content'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft',
    },
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);
