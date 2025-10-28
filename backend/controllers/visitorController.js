// import Visitor from '../models/VisitorModel.js';

// let totalVisitsCache = 0; // in-memory cache to reduce DB reads

// // Function to get client IP
// const getClientIp = (req) => {
//   const ip = req.headers['x-forwarded-for']?.split(',')[0] 
//            || req.connection.remoteAddress 
//            || req.socket.remoteAddress 
//            || req.ip;
//   return ip.replace('::ffff:', ''); // clean IPv4 format
// };

// // POST /api/visitor — log new visitor if not seen recently
// export const logVisitor = async (req, res) => {
//   try {
//     const ip = getClientIp(req);
//     if (!ip) return res.status(400).json({ message: 'IP not found' });

//     const existingVisitor = await Visitor.findOne({ ip });

//     // Allow counting again only if last visit > 24 hours ago
//     const now = new Date();
//     const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

//     if (!existingVisitor || existingVisitor.lastVisit < threshold) {
//       await Visitor.findOneAndUpdate(
//         { ip },
//         { lastVisit: now },
//         { upsert: true, new: true }
//       );
//       totalVisitsCache++;
//     }

//     const totalCount = await Visitor.countDocuments();
//     res.status(200).json({ totalCount });
//   } catch (error) {
//     console.error('Error logging visitor:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // GET /api/visitor/count — retrieve total visitor count
// export const getVisitorCount = async (req, res) => {
//   try {
//     const totalCount = await Visitor.countDocuments();
//     res.status(200).json({ totalCount });
//   } catch (error) {
//     console.error('Error fetching count:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



// controllers/visitorController.js
import Visitor from '../models/VisitorModel.js';

const getClientIp = (req) => {
  let ip = null;

  // 1. Trust x-forwarded-for (from Nginx)
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(',')[0].trim();
  }

  // 2. Fallback to x-real-ip
  if (!ip && req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'].trim();
  }

  // 3. Fallback to connection (only if local)
  if (!ip && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
    if (ip.includes('::ffff:')) ip = ip.replace('::ffff:', '');
  }

  if (!ip || ip === '127.0.0.1' || ip === '::1') {
    console.warn('IP detection failed, fallback to unknown');
    return 'unknown';
  }

  console.log('Client IP:', ip);
  return ip;
};

export const logVisitor = async (req, res) => {
  try {
    const ip = getClientIp(req);
    if (ip === 'unknown') {
      return res.status(400).json({ message: 'IP not detectable' });
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const existing = await Visitor.findOne({ ip });

    if (!existing || existing.lastVisit < oneDayAgo) {
      await Visitor.findOneAndUpdate(
        { ip },
        { lastVisit: now },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const totalCount = await Visitor.countDocuments();
    console.log(`New visit from ${ip} | Total: ${totalCount}`);

    res.json({ totalCount });
  } catch (error) {
    console.error('logVisitor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getVisitorCount = async (req, res) => {
  try {
    const totalCount = await Visitor.countDocuments();
    res.json({ totalCount });
  } catch (error) {
    console.error('getVisitorCount error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};