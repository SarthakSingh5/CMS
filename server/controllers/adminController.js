import User from '../models/User.js';
import Content from '../models/contentModel.js';

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a user's role (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        // Prevent admin from demoting themselves
        if (req.params.id === req.user.id.toString()) {
            return res.status(400).json({ message: 'Cannot change your own role' });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { returnDocument: 'after' }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user.id.toString()) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get platform-wide admin stats + chart data
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
    try {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [totalUsers, totalContent, publishedCount, draftCount, newUsersThisWeek] =
            await Promise.all([
                User.countDocuments(),
                Content.countDocuments(),
                Content.countDocuments({ status: 'Published' }),
                Content.countDocuments({ status: 'Draft' }),
                User.countDocuments({ createdAt: { $gte: weekAgo } }),
            ]);

        // --- Top 5 authors by page count ---
        const topAuthors = await Content.aggregate([
            {
                $group: {
                    _id: '$author',
                    total: { $sum: 1 },
                    published: { $sum: { $cond: [{ $eq: ['$status', 'Published'] }, 1, 0] } },
                    drafts: { $sum: { $cond: [{ $eq: ['$status', 'Draft'] }, 1, 0] } },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'authorInfo',
                },
            },
            {
                $project: {
                    name: { $ifNull: [{ $arrayElemAt: ['$authorInfo.username', 0] }, 'Unknown'] },
                    total: 1,
                    published: 1,
                    drafts: 1,
                },
            },
        ]);

        // --- Signups per day for the last 7 days ---
        const signupsByDay = await User.aggregate([
            { $match: { createdAt: { $gte: weekAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Fill in missing days with 0
        const signupChart = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const found = signupsByDay.find(s => s._id === dateStr);
            signupChart.push({ date: label, signups: found ? found.count : 0 });
        }

        // --- Pages created per day last 7 days ---
        const contentByDay = await Content.aggregate([
            { $match: { createdAt: { $gte: weekAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const contentChart = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const found = contentByDay.find(s => s._id === dateStr);
            contentChart.push({ date: label, pages: found ? found.count : 0 });
        }

        res.status(200).json({
            totalUsers,
            totalContent,
            publishedCount,
            draftCount,
            newUsersThisWeek,
            topAuthors,
            signupChart,
            contentChart,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
