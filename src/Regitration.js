import React, { useState } from 'react';

const EmployeeForm = () => {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');

  // Error state
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    salary: ''
  });

  // Validation function
  const validateForm = () => {
    let errors = {};

    if (!name) {
      errors.name = 'Name is required';
    }

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = 'Phone number should be 10 digits';
    }

    if (!position) {
      errors.position = 'Position is required';
    }

    if (!salary) {
      errors.salary = 'Salary is required';
    } else if (isNaN(salary)) {
      errors.salary = 'Salary must be a number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Submit the form (e.g., call API or update state)
      alert('Form submitted successfully');
    }
  };

  // Handle blur (on field focus loss)
  const handleBlur = (field) => {
    validateForm();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur('name')}
          className={formErrors.name ? 'error' : ''}
        />
        {formErrors.name && <div className="error-message">{formErrors.name}</div>}
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          className={formErrors.email ? 'error' : ''}
        />
        {formErrors.email && <div className="error-message">{formErrors.email}</div>}
      </div>

      <div>
        <label>Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => handleBlur('phone')}
          className={formErrors.phone ? 'error' : ''}
        />
        {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
      </div>

      <div>
        <label>Position</label>
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          onBlur={() => handleBlur('position')}
          className={formErrors.position ? 'error' : ''}
        />
        {formErrors.position && <div className="error-message">{formErrors.position}</div>}
      </div>

      <div>
        <label>Salary</label>
        <input
          type="text"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          onBlur={() => handleBlur('salary')}
          className={formErrors.salary ? 'error' : ''}
        />
        {formErrors.salary && <div className="error-message">{formErrors.salary}</div>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default EmployeeForm;
