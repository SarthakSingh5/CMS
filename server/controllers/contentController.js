import Content from '../models/contentModel.js';

// Strip HTML tags to produce plain-text excerpt
const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 200);
};

// @desc    Get all content
// @route   GET /api/content
// @access  Public
export const getContents = async (req, res) => {
    try {
        const contents = await Content.find()
            .populate('author', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single content by ID
// @route   GET /api/content/:id
// @access  Public
export const getContentById = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id).populate('author', 'username email');
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new content
// @route   POST /api/content
// @access  Private
export const createContent = async (req, res) => {
    const { title, gjsHtml, gjsCss, status } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Please add a title' });
    }

    try {
        const content = await Content.create({
            title,
            gjsHtml: gjsHtml || '',
            gjsCss: gjsCss || '',
            body: stripHtml(gjsHtml),
            status: status || 'Draft',
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

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (content.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const { title, gjsHtml, gjsCss, status } = req.body;

        const updatedContent = await Content.findByIdAndUpdate(
            req.params.id,
            {
                title: title || content.title,
                gjsHtml: gjsHtml !== undefined ? gjsHtml : content.gjsHtml,
                gjsCss: gjsCss !== undefined ? gjsCss : content.gjsCss,
                body: gjsHtml !== undefined ? stripHtml(gjsHtml) : content.body,
                status: status || content.status,
            },
            { new: true, runValidators: true }
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

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (content.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await content.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
