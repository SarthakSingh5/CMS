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
            { new: true }
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

// @desc    Get platform-wide admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
    try {
        const [totalUsers, totalContent, publishedCount, draftCount] = await Promise.all([
            User.countDocuments(),
            Content.countDocuments(),
            Content.countDocuments({ status: 'Published' }),
            Content.countDocuments({ status: 'Draft' }),
        ]);

        // Recent signups (last 7 days)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: weekAgo } });

        res.status(200).json({
            totalUsers,
            totalContent,
            publishedCount,
            draftCount,
            newUsersThisWeek,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
