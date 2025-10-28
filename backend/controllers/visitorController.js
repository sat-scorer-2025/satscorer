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

// Get real client IP behind proxy
const getClientIp = (req) => {
  let ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
           || req.headers['x-real-ip']
           || req.connection?.remoteAddress
           || req.socket?.remoteAddress
           || req.ip;

  if (ip.includes('::ffff:')) ip = ip.replace('::ffff:', '');
  if (ip === '::1') ip = '127.0.0.1';

  console.log('Detected IP:', ip); // Debug in production
  return ip;
};

export const logVisitor = async (req, res) => {
  try {
    const ip = getClientIp(req);
    if (!ip || ip === '127.0.0.1') {
      return res.status(400).json({ message: 'Invalid IP' });
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const existing = await Visitor.findOne({ ip });

    if (!existing || existing.lastVisit < oneDayAgo) {
      await Visitor.findOneAndUpdate(
        { ip },
        { lastVisit: now },
        { upsert: true, new: true }
      );
    }

    const totalCount = await Visitor.countDocuments();
    console.log(`Visitor logged: ${ip}, Total: ${totalCount}`);

    res.status(200).json({ totalCount });
  } catch (error) {
    console.error('Error in logVisitor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getVisitorCount = async (req, res) => {
  try {
    const totalCount = await Visitor.countDocuments();
    res.status(200).json({ totalCount });
  } catch (error) {
    console.error('Error in getVisitorCount:', error);
    res.status(500).json({ message: 'Server error' });
  }
};