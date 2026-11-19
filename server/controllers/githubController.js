import { Octokit } from '@octokit/rest';
import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import { getFilesFromTemplate, getFilesFromSandbox } from '../utils/exportFiles.js';

// @desc    Upload project to GitHub
// @route   POST /api/github/upload
export const uploadToGitHub = async (req, res) => {
  try {
    const {
      repoName,
      isPrivate = false,
      templateId,
      portfolioData,
      sandboxId,
      source = 'template',
      token: directToken,
      saveToken = false,
    } = req.body;

    if (!repoName || !templateId) {
      return res.status(400).json({ error: 'Missing required fields: repoName and templateId' });
    }

    // Resolve GitHub token: request token > user token in DB > env token
    let token = directToken || req.user?.githubToken || process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(403).json({
        error: 'NO_GITHUB_ACCOUNT',
        message: 'No GitHub Personal Access Token found. Please enter a token with "repo" scope.',
      });
    }

    token = token.trim();

    // If saveToken requested and user is authenticated, persist to user profile
    if (saveToken && req.user && directToken) {
      req.user.githubToken = token;
      await req.user.save();
    }

    // Collect project files
    let files;
    if (source === 'sandbox' && sandboxId) {
      try {
        files = await getFilesFromSandbox(sandboxId);
      } catch (err) {
        return res.status(500).json({
          error: 'SANDBOX_ERROR',
          message: err.message || 'Could not read sandbox files',
        });
      }
    } else {
      if (!portfolioData) {
        return res.status(400).json({ error: 'portfolioData is required for template export' });
      }
      files = await getFilesFromTemplate(templateId, portfolioData);
    }

    const octokit = new Octokit({ auth: token });

    // Verify token and fetch authenticated user
    let user;
    try {
      const userRes = await octokit.users.getAuthenticated();
      user = userRes.data;
    } catch (err) {
      return res.status(401).json({
        error: 'INVALID_TOKEN',
        message: 'Invalid GitHub token. Please check permissions or generate a new token.',
      });
    }

    // Create GitHub Repository
    let repo;
    try {
      const repoRes = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: !!isPrivate,
        auto_init: true,
        description: 'Developer portfolio site crafted with Forged (https://forged.dev)',
      });
      repo = repoRes.data;
    } catch (err) {
      if (err.status === 422) {
        return res.status(409).json({
          error: 'REPO_EXISTS',
          message: `Repository "${repoName}" already exists on GitHub.`,
        });
      }
      if (err.status === 401 || err.status === 403) {
        return res.status(403).json({
          error: 'INSUFFICIENT_SCOPE',
          message: 'GitHub token lacks "repo" permissions to create repositories.',
        });
      }
      throw err;
    }

    // Small delay to let GitHub initialize the repository main branch
    await new Promise((r) => setTimeout(r, 1200));

    // Get current main branch ref
    const { data: ref } = await octokit.git.getRef({
      owner: user.login,
      repo: repo.name,
      ref: 'heads/main',
    });
    const parentCommitSha = ref.object.sha;

    const { data: parentCommit } = await octokit.git.getCommit({
      owner: user.login,
      repo: repo.name,
      commit_sha: parentCommitSha,
    });
    const baseTreeSha = parentCommit.tree.sha;

    // Create blobs for all files
    const blobPromises = Array.from(files.entries()).map(async ([filePath, content]) => {
      const { data: blob } = await octokit.git.createBlob({
        owner: user.login,
        repo: repo.name,
        content,
        encoding: 'utf-8',
      });
      return { path: filePath, sha: blob.sha };
    });
    const blobs = await Promise.all(blobPromises);

    // Create git tree
    const { data: tree } = await octokit.git.createTree({
      owner: user.login,
      repo: repo.name,
      base_tree: baseTreeSha,
      tree: blobs.map(({ path: p, sha }) => ({
        path: p,
        mode: '100644',
        type: 'blob',
        sha,
      })),
    });

    // Create commit
    const { data: commit } = await octokit.git.createCommit({
      owner: user.login,
      repo: repo.name,
      message: 'Initial portfolio release from Forged (https://forged.dev)',
      tree: tree.sha,
      parents: [parentCommitSha],
    });

    // Update main branch pointer
    await octokit.git.updateRef({
      owner: user.login,
      repo: repo.name,
      ref: 'heads/main',
      sha: commit.sha,
    });

    // Update MongoDB portfolio record if logged in
    if (req.user) {
      await Portfolio.findOneAndUpdate(
        { user: req.user._id, templateId },
        { deploymentUrl: repo.html_url },
        { upsert: false }
      );
    }

    return res.status(200).json({
      success: true,
      repoUrl: repo.html_url,
      owner: user.login,
      repo: repo.name,
    });
  } catch (error) {
    console.error('GitHub export error:', error);
    return res.status(500).json({
      error: 'UPLOAD_FAILED',
      message: error.message || 'Failed to export repository to GitHub',
    });
  }
};

// @desc    Check GitHub connection status
// @route   GET /api/github/status
export const getGitHubStatus = async (req, res) => {
  try {
    const hasToken = !!(req.user?.githubToken || process.env.GITHUB_TOKEN);
    return res.status(200).json({ connected: hasToken });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Status check failed' });
  }
};

// @desc    Save GitHub token to user profile
// @route   POST /api/github/token
export const saveGitHubToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token || !token.trim()) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify token with GitHub
    const octokit = new Octokit({ auth: token.trim() });
    const userRes = await octokit.users.getAuthenticated();

    if (req.user) {
      req.user.githubToken = token.trim();
      await req.user.save();
    }

    return res.status(200).json({
      success: true,
      username: userRes.data.login,
    });
  } catch (error) {
    console.error('Save GitHub token error:', error);
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Token verification failed. Please ensure the token has "repo" scope.',
    });
  }
};

