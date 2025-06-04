const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8070;

// Middleware
app.use(cors());
app.use(express.json());

// POST endpoint for employee registration
app.post('/', (req, res) => {
  const employeeData = req.body;
  console.log('Received employee data:', employeeData);

  // Here you can add logic to save data to a database

  res.status(201).json({ message: 'Employee registered successfully', data: employeeData });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});