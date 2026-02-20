import User from '../models/User.js';
import Content from '../models/contentModel.js';

// @desc    Get dashboard stats (role-aware)
// @route   GET /api/stats
// @access  Private
export const getStats = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';

        if (isAdmin) {
            // Admin: platform-wide stats
            const totalUsers = await User.countDocuments();
            const totalContent = await Content.countDocuments();
            const publishedCount = await Content.countDocuments({ status: 'Published' });
            const draftCount = await Content.countDocuments({ status: 'Draft' });

            return res.status(200).json({
                isAdmin: true,
                users: totalUsers,
                content: {
                    total: totalContent,
                    byStatus: { Published: publishedCount, Draft: draftCount },
                },
            });
        } else {
            // Regular user: only their own stats
            const userId = req.user._id;
            const myTotal = await Content.countDocuments({ author: userId });
            const myPublished = await Content.countDocuments({ author: userId, status: 'Published' });
            const myDrafts = await Content.countDocuments({ author: userId, status: 'Draft' });

            return res.status(200).json({
                isAdmin: false,
                content: {
                    total: myTotal,
                    byStatus: { Published: myPublished, Draft: myDrafts },
                },
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
