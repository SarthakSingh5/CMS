import mongoose from 'mongoose';

const cvSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        portfolioId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Portfolio',
            default: null,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Please provide a CV title'],
            default: 'My CV',
            trim: true,
        },
        format: {
            type: String,
            enum: ['pdf', 'json', 'html'],
            default: 'pdf',
        },
        fileUrl: {
            type: String,
            trim: true,
        },
        // Stores all CV data (experience, education, skills, projects, summary)
        content: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Cv', cvSchema);

