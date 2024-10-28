const Participant = require('../models/Participant');

const registerParticipant = async (req, res) => {
  const { name, email, competition } = req.body;

  if (!name || !email || !competition) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const participant = new Participant({ name, email, competition });
    await participant.save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    console.error('Error saving participant:', error);
    res.status(500).json({ message: 'Registration failed', error });
  }
};

module.exports = registerParticipant;
