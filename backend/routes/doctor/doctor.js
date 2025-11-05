import express from 'express';
import PreCheck from '../../middleware/pre_check.js';
import { getDatabase } from '../../database/connection.js';

const router = express.Router();

router.get('/my-availability', async (req, res) => {
  try {
    const db = getDatabase();
    const { userId } = req.user;

    // let userIdObjectId;
    // try {
    //   userIdObjectId = new ObjectId(String(userId));
    // } catch (error) {
    //   return res.status(400).json({ error: 'Invalid user ID' });
    // }

    const availability = await db
      .collection('availability')
      .findOne({ userId });

    res.status(200).json(availability);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update-availability', PreCheck.availibility, async (req, res) => {
  try {
    const db = getDatabase();
    const { availability } = req.body;

    const { userId } = req.user;

    if (await db.collection('availability').findOne({ userId })) {
      await db
        .collection('availability')
        .updateOne({ userId }, { $set: { availability } });

      return res
        .status(200)
        .json({ message: 'Availability updated successfully' });
    }

    await db.collection('availability').insertOne({
      userId,
      availability,
    });

    res.status(201).json({ message: 'Availability created successfully' });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
