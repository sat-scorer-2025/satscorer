import Visitor from '../models/VisitorModel.js';

let totalVisitsCache = 0; // in-memory cache to reduce DB reads

// Function to get client IP
const getClientIp = (req) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] 
           || req.connection.remoteAddress 
           || req.socket.remoteAddress 
           || req.ip;
  return ip.replace('::ffff:', ''); // clean IPv4 format
};

// POST /api/visitor — log new visitor if not seen recently
export const logVisitor = async (req, res) => {
  try {
    const ip = getClientIp(req);
    if (!ip) return res.status(400).json({ message: 'IP not found' });

    const existingVisitor = await Visitor.findOne({ ip });

    // Allow counting again only if last visit > 24 hours ago
    const now = new Date();
    const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (!existingVisitor || existingVisitor.lastVisit < threshold) {
      await Visitor.findOneAndUpdate(
        { ip },
        { lastVisit: now },
        { upsert: true, new: true }
      );
      totalVisitsCache++;
    }

    const totalCount = await Visitor.countDocuments();
    res.status(200).json({ totalCount });
  } catch (error) {
    console.error('Error logging visitor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/visitor/count — retrieve total visitor count
export const getVisitorCount = async (req, res) => {
  try {
    const totalCount = await Visitor.countDocuments();
    res.status(200).json({ totalCount });
  } catch (error) {
    console.error('Error fetching count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
