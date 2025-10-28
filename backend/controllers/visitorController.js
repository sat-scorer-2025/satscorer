// controllers/visitorController.js
import Visitor from '../models/VisitorModel.js';

const getClientIp = (req) => {
  let ip = null;

  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(',')[0].trim();
  }
  if (!ip && req.headers['x-real-ip']) {
    ip = req.headers['x-real-ip'].trim();
  }
  if (!ip && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress.replace('::ffff:', '');
  }

  if (!ip || ip === '127.0.0.1' || ip === '::1') return null;
  return ip;
};

export const logVisitor = async (req, res) => {
  try {
    const ip = getClientIp(req);
    if (!ip) {
      console.warn('No valid IP detected');
      return res.status(400).json({ message: 'IP not found' });
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let shouldCount = false;
    const existing = await Visitor.findOne({ ip });

    if (!existing) {
      shouldCount = true;
    } else if (existing.lastVisit < oneDayAgo) {
      shouldCount = true;
    }

    if (shouldCount) {
      try {
        await Visitor.findOneAndUpdate(
          { ip },
          { lastVisit: now },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`New/returning visitor: ${ip}`);
      } catch (upsertError) {
        if (upsertError.code === 11000) {
          // Duplicate key → already exists → just update timestamp
          await Visitor.updateOne({ ip }, { lastVisit: now });
          console.log(`Updated existing visitor: ${ip}`);
        } else {
          throw upsertError;
        }
      }
    }

    const totalCount = await Visitor.countDocuments();
    console.log(`Total unique visitors: ${totalCount}`);
    res.json({ totalCount });
  } catch (error) {
    console.error('logVisitor error:', error.message || error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getVisitorCount = async (req, res) => {
  try {
    const totalCount = await Visitor.countDocuments();
    console.log(`getVisitorCount → ${totalCount}`);
    res.json({ totalCount });
  } catch (error) {
    console.error('getVisitorCount error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};