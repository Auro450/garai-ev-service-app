const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const crypto = require('crypto');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('\n⚠️ WARNING: MONGODB_URI is not set in .env file!');
  console.warn('The app will start, but database operations will fail until you provide a valid MongoDB connection string.\n');
}

// ==========================================
// Mongoose Schemas & Models
// ==========================================

// Helper to remove _id and __v from responses, and ensure 'id' is present
const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  }
};

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  address: { type: String, default: "" },
  email: { type: String, default: "" },
  scootyModels: [{ type: String }],
  gender: { type: String, default: "" },
  createdAt: { type: String }
}, { toJSON: toJSONOptions });

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  refNumber: { type: String },
  evBike: { type: String },
  serviceType: { type: String },
  serviceCentre: { type: String },
  date: { type: String },
  customerName: { type: String },
  customerPhone: { type: String },
  notes: { type: String },
  gstBill: { type: mongoose.Schema.Types.Mixed },
  pickupFromHome: { type: Boolean, default: false },
  pickupAddress: { type: String, default: "" },
  status: { type: String, default: "Scheduled" },
  createdAt: { type: String }
}, { toJSON: toJSONOptions });

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String },
  customerPhone: { type: String },
  issueDescription: { type: String },
  timestamp: { type: String },
  status: { type: String, default: "Open" }
}, { toJSON: toJSONOptions });

const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Ticket = mongoose.model('Ticket', ticketSchema);


// ==========================================
// Auth Endpoints (from original logic)
// ==========================================

app.post('/api/signup', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and password are required' });
  }

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'Account already exists. Please log in.' });
    }

    const newUser = new User({
      id: crypto.randomBytes(6).toString('base64url'),
      phone,
      password: password,
      createdAt: new Date().toISOString()
    });

    await newUser.save();
    
    // Return user without sending password hash
    const userResponse = newUser.toJSON();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/login', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and password are required' });
  }

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ error: 'No account exists. Please Sign Up' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Wrong Password' });
    }

    const userResponse = user.toJSON();
    delete userResponse.password;
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});


// ==========================================
// Generic CRUD helper
// ==========================================
const createCrudRoutes = (app, path, Model) => {
  // GET all
  app.get(path, async (req, res) => {
    try {
      const items = await Model.find({});
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET one
  app.get(`${path}/:id`, async (req, res) => {
    try {
      const item = await Model.findOne({ id: req.params.id });
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST create
  app.post(path, async (req, res) => {
    try {
      const newItem = new Model(req.body);
      await newItem.save();
      res.status(201).json(newItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT update (full replace, but we preserve id)
  app.put(`${path}/:id`, async (req, res) => {
    try {
      // the original logic preserved password for users on PUT/PATCH
      if (path === '/users') {
        const existingUser = await User.findOne({ id: req.params.id });
        if (existingUser && existingUser.password && !req.body.password) {
          req.body.password = existingUser.password;
        }
      }
      
      const updated = await Model.findOneAndUpdate(
        { id: req.params.id }, 
        req.body, 
        { new: true, overwrite: true }
      );
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PATCH update (partial replace)
  app.patch(`${path}/:id`, async (req, res) => {
    try {
      if (path === '/users') {
        const existingUser = await User.findOne({ id: req.params.id });
        if (existingUser && existingUser.password && !req.body.password) {
          req.body.password = existingUser.password;
        }
      }

      const updated = await Model.findOneAndUpdate(
        { id: req.params.id }, 
        { $set: req.body }, 
        { new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // DELETE
  app.delete(`${path}/:id`, async (req, res) => {
    try {
      const deleted = await Model.findOneAndDelete({ id: req.params.id });
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.json({});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

createCrudRoutes(app, '/users', User);
createCrudRoutes(app, '/bookings', Booking);
createCrudRoutes(app, '/tickets', Ticket);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
