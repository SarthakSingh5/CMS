import Portfolio from '../models/Portfolio.js';

// @desc    Get user portfolios or single template portfolio
// @route   GET /api/portfolio
// @access  Private
export const getPortfolios = async (req, res) => {
    try {
        const { templateId } = req.query;

        // If templateId query parameter is provided, return that specific template's portfolio
        if (templateId) {
            const portfolio = await Portfolio.findOne({
                user: req.user._id,
                templateId,
            }).sort({ updatedAt: -1 });

            if (!portfolio) {
                return res.status(200).json({ data: null });
            }

            return res.status(200).json({
                data: portfolio.content,
                portfolioId: portfolio._id,
                status: portfolio.status,
                name: portfolio.name,
            });
        }

        // Otherwise return all portfolios for the logged-in user
        const portfolios = await Portfolio.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.status(200).json({ success: true, count: portfolios.length, data: portfolios });
    } catch (error) {
        console.error('Error fetching portfolios:', error);
        res.status(500).json({ message: 'Server error fetching portfolios', error: error.message });
    }
};

// @desc    Get single portfolio by ID
// @route   GET /api/portfolio/:id
// @access  Private
export const getPortfolioById = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Verify ownership (unless public or admin)
        if (portfolio.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to access this portfolio' });
        }

        res.status(200).json({ success: true, data: portfolio });
    } catch (error) {
        console.error('Error fetching portfolio by ID:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create or update portfolio (upsert)
// @route   POST /api/portfolio
// @access  Private
export const savePortfolio = async (req, res) => {
    try {
        const { templateId, portfolioData, name, status, customFiles } = req.body;

        if (!templateId || !portfolioData) {
            return res.status(400).json({ message: 'Missing templateId or portfolioData' });
        }

        const portfolioName = name || portfolioData.name || 'My Portfolio';

        // Upsert by user and templateId
        const updatedPortfolio = await Portfolio.findOneAndUpdate(
            { user: req.user._id, templateId },
            {
                user: req.user._id,
                templateId,
                name: portfolioName,
                content: portfolioData,
                status: status || 'Draft',
                ...(customFiles ? { customFiles } : {}),
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
            portfolioId: updatedPortfolio._id,
            data: updatedPortfolio.content,
        });
    } catch (error) {
        console.error('Error saving portfolio:', error);
        res.status(500).json({ message: 'Server error saving portfolio', error: error.message });
    }
};

// @desc    Delete a portfolio
// @route   DELETE /api/portfolio/:id
// @access  Private
export const deletePortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Verify ownership
        if (portfolio.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this portfolio' });
        }

        await portfolio.deleteOne();
        res.status(200).json({ success: true, message: 'Portfolio removed' });
    } catch (error) {
        console.error('Error deleting portfolio:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get public portfolio by slug, ID, or templateId
// @route   GET /api/portfolio/public/:identifier
// @access  Public
export const getPublicPortfolio = async (req, res) => {
    try {
        const { identifier } = req.params;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

        let query;
        if (isObjectId) {
            query = { _id: identifier };
        } else if (identifier.startsWith('template')) {
            query = req.query.user
                ? { user: req.query.user, templateId: identifier }
                : { templateId: identifier };
        } else {
            query = { slug: identifier.toLowerCase() };
        }

        const portfolio = await Portfolio.findOne(query)
            .populate('user', 'username avatar')
            .sort({ updatedAt: -1 });

        if (!portfolio) {
            return res.status(404).json({ message: 'Public portfolio not found' });
        }

        // Increment view count asynchronously
        portfolio.views = (portfolio.views || 0) + 1;
        await portfolio.save();

        return res.status(200).json({
            success: true,
            portfolioId: portfolio._id,
            templateId: portfolio.templateId,
            name: portfolio.name,
            slug: portfolio.slug,
            views: portfolio.views,
            author: portfolio.user?.username || 'Developer',
            avatar: portfolio.user?.avatar,
            data: portfolio.content,
            updatedAt: portfolio.updatedAt,
        });
    } catch (error) {
        console.error('Error fetching public portfolio:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Remix/fork a public portfolio into authenticated user account
// @route   POST /api/portfolio/remix/:id
// @access  Private
export const remixPortfolio = async (req, res) => {
    try {
        const sourcePortfolio = await Portfolio.findById(req.params.id);

        if (!sourcePortfolio) {
            return res.status(404).json({ message: 'Source portfolio not found' });
        }

        // Upsert into user's account for that templateId
        const remixed = await Portfolio.findOneAndUpdate(
            { user: req.user._id, templateId: sourcePortfolio.templateId },
            {
                user: req.user._id,
                templateId: sourcePortfolio.templateId,
                name: `${sourcePortfolio.name || 'Portfolio'} (Remix)`,
                content: sourcePortfolio.content,
                status: 'Draft',
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Portfolio remixed successfully',
            portfolioId: remixed._id,
            templateId: remixed.templateId,
        });
    } catch (error) {
        console.error('Error remixing portfolio:', error);
        return res.status(500).json({ message: 'Server error remixing portfolio', error: error.message });
    }
};

