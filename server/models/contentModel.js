import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    // GrapesJS editor output
    gjsHtml: {
        type: String,
        default: '',
    },
    gjsCss: {
        type: String,
        default: '',
    },
    // Auto-generated plain-text preview for content list cards
    body: {
        type: String,
        default: '',
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
