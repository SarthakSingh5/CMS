import User from '../models/User.js';
import Content from '../models/contentModel.js';

// @desc    Get dashboard stats
// @route   GET /api/stats
// @access  Private
export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalContent = await Content.countDocuments();

        const contentByStatus = await Content.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Transform aggregation result into key-value pairs
        const statusCounts = {};
        contentByStatus.forEach((item) => {
            statusCounts[item._id] = item.count;
        });

        res.status(200).json({
            users: totalUsers,
            content: {
                total: totalContent,
                byStatus: statusCounts,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
