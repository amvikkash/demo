import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import EmployeeRegistrationForm from './EmployeeRegistrationForm';

describe('EmployeeRegistrationForm', () => {
  test('shows validation errors on submit with empty required fields', async () => {
    window.alert = jest.fn(); // isolate mock
    render(<EmployeeRegistrationForm />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
      expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/enter a valid 10-digit contact number/i)).toBeInTheDocument();
      expect(screen.getByText(/permanent address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/nationality is required/i)).toBeInTheDocument();
      expect(screen.getByText(/emergency contact name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/emergency contact relationship is required/i)).toBeInTheDocument();
      expect(screen.getByText(/enter a valid 10-digit emergency contact number/i)).toBeInTheDocument();
      expect(screen.getByText(/bank name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/branch is required/i)).toBeInTheDocument();
      expect(screen.getByText(/enter a valid account number/i)).toBeInTheDocument();
      expect(screen.getByText(/enter a valid ifsc code/i)).toBeInTheDocument();
      expect(screen.getByText(/highest qualification is required/i)).toBeInTheDocument();
      expect(screen.getByText(/field of study is required/i)).toBeInTheDocument();
      expect(screen.getByText(/previous experience is required/i)).toBeInTheDocument();
      expect(screen.getByText(/you must agree to terms and conditions/i)).toBeInTheDocument();
      expect(screen.getByText(/declaration date is required/i)).toBeInTheDocument();

      expect(window.alert).toHaveBeenCalledWith('Please correct the highlighted errors.');
    });
  });

  test('shows success alert on valid form submission', async () => {
    window.alert = jest.fn(); // isolate mock
    render(<EmployeeRegistrationForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/email id/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/^contact number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/permanent address:/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/nationality/i), { target: { value: 'Indian' } });

    fireEvent.click(screen.getByLabelText(/do you have a passport/i, { exact: false }));
    fireEvent.click(screen.getByLabelText(/do you have a work permit/i, { exact: false }));

    fireEvent.change(screen.getByLabelText(/work permit available country/i), { target: { value: 'India' } });
    fireEvent.change(screen.getByLabelText(/emergency contact name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/relationship/i), { target: { value: 'Sister' } });
    fireEvent.change(screen.getByLabelText(/^emergency contact number/i), { target: { value: '1234567890' } });

    fireEvent.change(screen.getByLabelText(/bank name/i), { target: { value: 'HDFC Bank' } });
    fireEvent.change(screen.getByLabelText(/branch/i), { target: { value: 'MG Road' } });
    fireEvent.change(screen.getByLabelText(/account number/i), { target: { value: '12345678901' } });
    fireEvent.change(screen.getByLabelText(/ifsc code/i), { target: { value: 'HDFC0123456' } });

    fireEvent.change(screen.getByLabelText(/highest qualification/i), { target: { value: "Bachelor's Degree" } });
    fireEvent.change(screen.getByLabelText(/field of study/i), { target: { value: 'Engineering' } });

    fireEvent.click(screen.getByLabelText(/do you have previous work experience/i, { exact: false }));

    fireEvent.click(screen.getByLabelText(/i agree/i));
    const today = new Date().toISOString().split('T')[0];
    fireEvent.change(screen.getByLabelText(/^date:/i), { target: { value: today } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Form submitted successfully!');
      
    });
  });
});
