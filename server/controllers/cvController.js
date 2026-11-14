import Cv from '../models/Cv.js';

// @desc    Get authenticated user's CV data
// @route   GET /api/cv
// @access  Private
export const getUserCv = async (req, res) => {
    try {
        const cv = await Cv.findOne({
            user: req.user._id,
        }).sort({ updatedAt: -1 });

        if (!cv) {
            return res.status(200).json({ data: null });
        }

        res.status(200).json({
            success: true,
            cvId: cv._id,
            title: cv.title,
            data: cv.content,
        });
    } catch (error) {
        console.error('Error fetching CV:', error);
        res.status(500).json({ message: 'Server error fetching CV', error: error.message });
    }
};

// @desc    Save or update user's CV data (upsert)
// @route   POST /api/cv
// @access  Private
export const saveUserCv = async (req, res) => {
    try {
        const { cvData, title } = req.body;

        if (!cvData) {
            return res.status(400).json({ message: 'Missing cvData' });
        }

        const personalInfo = cvData.personalInfo || {};
        const nameFromData = personalInfo.fullName;
        const cvTitle = title || (nameFromData ? `${nameFromData}'s CV` : 'My CV');

        const updatedCv = await Cv.findOneAndUpdate(
            { user: req.user._id },
            {
                user: req.user._id,
                title: cvTitle,
                content: cvData,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        res.status(200).json({
            success: true,
            cvId: updatedCv._id,
            data: updatedCv.content,
        });
    } catch (error) {
        console.error('Error saving CV:', error);
        res.status(500).json({ message: 'Server error saving CV', error: error.message });
    }
};

