import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        templateId: {
            type: String,
            required: [true, 'Please specify a template ID'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide a portfolio name'],
            default: 'My Portfolio',
            trim: true,
        },
        slug: {
            type: String,
            trim: true,
            lowercase: true,
        },
        status: {
            type: String,
            enum: ['Draft', 'Previewing', 'Published', 'Archived'],
            default: 'Draft',
        },
        deploymentUrl: {
            type: String,
            trim: true,
        },
        vercelProjectId: {
            type: String,
            trim: true,
        },
        // Dynamic content structure matching the template props
        content: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        // Custom files from in-browser sandbox edits
        customFiles: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Portfolio', portfolioSchema);

