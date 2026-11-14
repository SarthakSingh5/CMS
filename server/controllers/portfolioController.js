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

