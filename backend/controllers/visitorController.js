import Visitor from '../models/VisitorModel.js';

/**
 * Track a visitor
 * POST /api/visitor/track
 */
export const trackVisitor = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Visitor ID is required' 
      });
    }

    // Get user agent and IP address from request
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';

    // Check if visitor already exists
    let visitor = await Visitor.findOne({ visitorId });

    if (visitor) {
      // Update existing visitor
      visitor.lastVisit = new Date();
      visitor.visitCount += 1;
      visitor.userAgent = userAgent;
      visitor.ipAddress = ipAddress;
      await visitor.save();

      return res.status(200).json({
        success: true,
        message: 'Visitor updated',
        isNewVisitor: false,
        visitCount: visitor.visitCount,
      });
    } else {
      // Create new visitor
      visitor = await Visitor.create({
        visitorId,
        userAgent,
        ipAddress,
        firstVisit: new Date(),
        lastVisit: new Date(),
        visitCount: 1,
      });

      return res.status(201).json({
        success: true,
        message: 'New visitor tracked',
        isNewVisitor: true,
        visitCount: 1,
      });
    }
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to track visitor',
      error: error.message,
    });
  }
};

/**
 * Get total unique visitors count
 * GET /api/visitor/count
 */
export const getVisitorCount = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();

    return res.status(200).json({
      success: true,
      totalVisitors,
    });
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get visitor count',
      error: error.message,
    });
  }
};

/**
 * Get visitor statistics (optional - for admin dashboard)
 * GET /api/visitor/stats
 */
export const getVisitorStats = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    
    // Get visitors from last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const visitorsLast24h = await Visitor.countDocuments({
      lastVisit: { $gte: yesterday }
    });

    // Get visitors from last 7 days
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const visitorsLast7Days = await Visitor.countDocuments({
      lastVisit: { $gte: lastWeek }
    });

    // Get visitors from last 30 days
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const visitorsLast30Days = await Visitor.countDocuments({
      lastVisit: { $gte: lastMonth }
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalVisitors,
        visitorsLast24h,
        visitorsLast7Days,
        visitorsLast30Days,
      },
    });
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get visitor statistics',
      error: error.message,
    });
  }
};
