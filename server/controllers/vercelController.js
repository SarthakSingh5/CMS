import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import { getFilesFromTemplate, getFilesFromSandbox } from '../utils/exportFiles.js';

// @desc    Deploy portfolio project to Vercel
// @route   POST /api/vercel/deploy
export const deployToVercel = async (req, res) => {
  try {
    const {
      projectName,
      templateId,
      portfolioData,
      sandboxId,
      source = 'template',
      token: directToken,
      saveToken = false,
      teamId: reqTeamId,
    } = req.body;

    if (!projectName || !templateId) {
      return res.status(400).json({ error: 'Missing required fields: projectName and templateId' });
    }

    // Resolve Vercel token
    let token = directToken || req.user?.vercelToken || process.env.VERCEL_TOKEN;
    const teamId = reqTeamId || req.user?.vercelTeamId || process.env.VERCEL_TEAM_ID;

    if (!token) {
      return res.status(403).json({
        error: 'NO_VERCEL_ACCOUNT',
        message: 'No Vercel API token found. Please enter your Vercel personal access token.',
      });
    }

    token = token.trim();

    // Persist token if requested
    if (saveToken && req.user && directToken) {
      req.user.vercelToken = token;
      if (teamId) req.user.vercelTeamId = teamId;
      await req.user.save();
    }

    // Collect files
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

      // Ensure PortfolioProps annotation is present on page.tsx
      const pageTsx = files.get('app/page.tsx');
      if (pageTsx && !pageTsx.includes('PortfolioProps')) {
        const patched = pageTsx
          .replace(
            /^(import .+ from .+;\n)/m,
            '$1import type { PortfolioProps } from "./PortfolioTypes";\n'
          )
          .replace(/const data = /, 'const data: PortfolioProps = ');
        files.set('app/page.tsx', patched);
      }
    } else {
      if (!portfolioData) {
        return res.status(400).json({ error: 'portfolioData is required for template deploy' });
      }
      files = await getFilesFromTemplate(templateId, portfolioData);
    }

    // Convert Map to Vercel inline files array
    const vercelFiles = Array.from(files.entries()).map(([filePath, content]) => ({
      file: filePath,
      data: content,
      encoding: 'utf-8',
    }));

    const sanitizedName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'forged-portfolio';

    const url = teamId
      ? `https://api.vercel.com/v13/deployments?teamId=${teamId}&skipAutoDetectionConfirmation=1`
      : 'https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: sanitizedName,
        target: 'production',
        projectSettings: {
          framework: 'nextjs',
          nodeVersion: '20.x',
        },
        files: vercelFiles,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return res.status(403).json({
          error: 'TOKEN_EXPIRED',
          message: 'Your Vercel token is invalid or expired. Please enter a valid token.',
        });
      }
      return res.status(500).json({
        error: 'DEPLOYMENT_FAILED',
        message: data.error?.message || `Deployment failed with status ${response.status}`,
      });
    }

    // Save to user's portfolio in MongoDB Atlas if authenticated
    if (req.user) {
      await Portfolio.findOneAndUpdate(
        { user: req.user._id, templateId },
        {
          vercelProjectId: data.projectId || '',
          deploymentUrl: `https://${data.url}`,
        },
        { upsert: false }
      );
    }

    return res.status(200).json({
      success: true,
      deploymentId: data.id,
      url: data.url,
      projectId: data.projectId || '',
    });
  } catch (error) {
    console.error('Vercel deployment error:', error);
    return res.status(500).json({
      error: 'DEPLOYMENT_FAILED',
      message: error.message || 'Failed to create Vercel deployment',
    });
  }
};

// @desc    Check Vercel connection or poll deployment status
// @route   GET /api/vercel/status
export const getVercelStatus = async (req, res) => {
  try {
    const { check, deploymentId, token: directToken } = req.query;
    const token = directToken || req.user?.vercelToken || process.env.VERCEL_TOKEN;

    if (check === 'connection') {
      return res.status(200).json({ connected: !!token });
    }

    if (!deploymentId) {
      return res.status(400).json({ error: 'Missing deploymentId' });
    }

    if (!token) {
      return res.status(403).json({
        error: 'NO_VERCEL_ACCOUNT',
        message: 'No Vercel account connected.',
      });
    }

    const response = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return res.status(403).json({
          error: 'TOKEN_EXPIRED',
          message: 'Vercel token expired or revoked.',
        });
      }
      return res.status(500).json({
        error: 'STATUS_CHECK_FAILED',
        message: `Failed checking status (${response.status})`,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      readyState: data.readyState,
      url: data.url,
      alias: data.alias || [],
      errorMessage: data.error?.message,
    });
  } catch (error) {
    console.error('Vercel status error:', error);
    return res.status(500).json({
      error: 'STATUS_CHECK_FAILED',
      message: error.message || 'Failed to poll deployment status',
    });
  }
};

// @desc    Validate and save Vercel token
// @route   POST /api/vercel/token
export const saveVercelToken = async (req, res) => {
  try {
    const { token, teamId } = req.body;
    if (!token || !token.trim()) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Verify token with Vercel API
    const verifyRes = await fetch('https://api.vercel.com/v2/user', {
      headers: { Authorization: `Bearer ${token.trim()}` },
    });

    if (!verifyRes.ok) {
      return res.status(401).json({
        error: 'INVALID_TOKEN',
        message: 'This token is invalid or expired. Please generate a new one from vercel.com/account/tokens.',
      });
    }

    const userData = await verifyRes.json();

    if (req.user) {
      req.user.vercelToken = token.trim();
      if (teamId) req.user.vercelTeamId = teamId.trim();
      await req.user.save();
    }

    return res.status(200).json({
      success: true,
      user: userData.user?.username || userData.user?.name,
    });
  } catch (error) {
    console.error('Save Vercel token error:', error);
    return res.status(500).json({
      error: 'SAVE_FAILED',
      message: error.message || 'Failed to verify and save Vercel token',
    });
  }
};

