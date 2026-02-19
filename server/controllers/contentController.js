import Content from '../models/contentModel.js';

// @desc    Get all content
// @route   GET /api/content
// @access  Public
export const getContents = async (req, res) => {
    try {
        const contents = await Content.find().populate('author', 'username email');
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new content
// @route   POST /api/content
// @access  Private
export const createContent = async (req, res) => {
    const { title, body, status } = req.body;

    if (!title || !body) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const content = await Content.create({
            title,
            body,
            status,
            author: req.user.id,
        });
        res.status(201).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private (Author/Admin)
export const updateContent = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the content author or is admin
        if (content.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedContent = await Content.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedContent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private (Author/Admin)
export const deleteContent = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the content author or is admin
        if (content.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await content.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
