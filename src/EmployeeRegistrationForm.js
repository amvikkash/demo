import React, { useState, useEffect, useRef } from 'react';
import './EmployeeRegistrationForm.css';

function EmployeeRegistrationForm() {
  const initialFormData = {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    maritalStatus: 'Single',
    contactNumber: '',
    email: '',
    permanentAddress: '',
    currentAddress: '',
    isCurrentAddressSameAsPermanent: false,
    nationality: '',
    hasDisability: 'no', // Set default to "no"
    disabilityDetails: '',
    workPermitCountry: '',
    workPermitExpiry: '',
    emergencyContactName: '',
    emergencyRelationship: '',
    emergencyContactNumber: '',
    bankName: '',
    bankBranch: '',
    accountNumber: '',
    ifscCode: '',
    highestQualification: '',
    otherQualification: '',
    fieldOfStudy: '',
    previousExperience: '',
    previousEmployer: '',
    previousDesignation: '',
    yearsOfExperience: '',
    currentDesignation: '',
    department: '',
    employeeId: '',
    dateOfJoining: '',
    agreedTerms: false,
    declarationDate: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [fadingErrors, setFadingErrors] = useState({});
  const [shakeFields, setShakeFields] = useState({});
  const [zoomClass, setZoomClass] = useState('');
  const firstNameRef = useRef(null);
  const middleNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emergencyContactNameRef = useRef(null);
  const emergencyRelationshipRef = useRef(null);
  const bankNameRef = useRef(null);
  const bankBranchRef = useRef(null);
  const accountNumberRef = useRef(null);
  const nationalityRef = useRef(null);
  const workPermitCountryRef = useRef(null);
  const otherQualificationRef = useRef(null);
  const previousDesignationRef = useRef(null);
  const previousEmployerRef = useRef(null);
  const fieldOfStudyRef = useRef(null);



  // For DOB: User must be at least 18 years old
  const today = new Date();
  const year = today.getFullYear() - 18;
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const maxDob = `${year}-${month}-${day}`;

  //date after declaration minimum present day
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

  useEffect(() => {
    setTimeout(() => setZoomClass('zoom-in-done'), 10);
    if (firstNameRef.current) firstNameRef.current.focus();
  }, []);

   useEffect(() => {
        if (
          window.performance &&
          typeof window.performance.getEntriesByType === "function"
        ) {
          const navEntries = window.performance.getEntriesByType("navigation");
          if (navEntries.length > 0 && navEntries[0].type === "reload") {
            setTimeout(() => {
              alert('You have reloaded the page. All unsaved data may be lost.');
            }, 300);
          }
        }
      }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
  // Only shake when a new error appears (not if it persists)
  Object.keys(errors).forEach((name) => {
    if (errors[name] && !shakeFields[name]) {
      setShakeFields((prev) => ({ ...prev, [name]: true }));
      setTimeout(() => {
        setShakeFields((prev) => ({ ...prev, [name]: false }));
      }, 500);
    }
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [errors]);

  const triggerFadeOut = (name) => {
    if (errors[name]) {
      setFadingErrors((prev) => ({ ...prev, [name]: true }));
      setTimeout(() => {
        setFadingErrors((prev) => ({ ...prev, [name]: false }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
        setShakeFields((prev) => ({ ...prev, [name]: false }));
      }, 500);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle "Same as Permanent Address"
    if (type === 'checkbox' && name === 'isCurrentAddressSameAsPermanent') {
      setFormData((prev) => {
        const next = { ...prev, [name]: checked };
        if (checked) next.currentAddress = prev.permanentAddress;
        return next;
      });
      if (checked && errors.currentAddress) {
        triggerFadeOut('currentAddress');
      }
      return;
    }

    // When permanentAddress changes and checkbox is checked, update currentAddress & clear error
    if (name === 'permanentAddress' && formData.isCurrentAddressSameAsPermanent) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: value,
        currentAddress: value,
      }));
      if (errors.currentAddress) {
        triggerFadeOut('currentAddress');
      }
      triggerFadeOut(name);
      return;
    }

    // Fade-out for other fields
    triggerFadeOut(name);

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    let validationErrors = {};

    // Personal Details
    if (!(formData.firstName || '').trim()) {
      validationErrors.firstName = "First name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.firstName)) {
      validationErrors.firstName = "First name must contain only letters.";
    }

    if (formData.middleName && !/^[A-Za-z\s]+$/.test(formData.middleName)) {
      validationErrors.middleName = "Middle name must contain only letters.";
    }

    if (!(formData.lastName || '').trim()) {
      validationErrors.lastName = "Last name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.lastName)) {
      validationErrors.lastName = "Last name must contain only letters.";
    }

    if (!formData.dateOfBirth) {
      validationErrors.dateOfBirth = "Date of birth is required.";
    } else {
      const dob = new Date(formData.dateOfBirth);
      const minDate = new Date("1995-01-01");
      const maxDate = new Date("2008-12-31");
  
      if (dob < minDate || dob > maxDate) {
        validationErrors.dateOfBirth = "Provide a valid Date Of Birth.";
      }
    }

    if (!formData.gender) validationErrors.gender = "Gender is required.";

    if (!formData.maritalStatus) validationErrors.maritalStatus = "Marital status is required.";

    if (!formData.email || !String(formData.email).match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      validationErrors.email = "Enter a valid email address.";
    }

    if (!formData.contactNumber || !String(formData.contactNumber).match(/^\d{10}$/)) {
      validationErrors.contactNumber = "Enter a valid 10-digit contact number.";
    }

    if (formData.hasDisability === "yes" && !(formData.disabilityDetails || '').trim())
      validationErrors.disabilityDetails = "Disability details are required.";

    if (!(formData.permanentAddress || '').trim())
      validationErrors.permanentAddress = "Permanent address is required.";

    if (!formData.isCurrentAddressSameAsPermanent) {
      if (!(formData.currentAddress || '').trim()) {
        validationErrors.currentAddress = "Current address is required.";
      }
    }

    if (!(formData.nationality || '').trim())
      validationErrors.nationality = "Nationality is required.";

    // Emergency Contacts
    if (!(formData.emergencyContactName || '').trim()) {
      validationErrors.emergencyContactName = "Emergency contact name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.emergencyContactName)) {
      validationErrors.emergencyContactName = "Must contain only letters.";
    }
    if (!(formData.emergencyRelationship || '').trim()) {
      validationErrors.emergencyRelationship = "Emergency contact relationship is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.emergencyRelationship)) {
      validationErrors.emergencyRelationship = "Must contain only letters.";
    }
    if (!formData.emergencyContactNumber || !String(formData.emergencyContactNumber).match(/^\d{10}$/)) {
      validationErrors.emergencyContactNumber = "Enter a valid 10-digit emergency contact number.";
    }
    if (formData.contactNumber === formData.emergencyContactNumber) {
     validationErrors.emergencyContactNumber = "Emergency contact number cannot be the same as your contact number.";
    }

    // Bank Details
    if (!(formData.bankName || '').trim()) {
      validationErrors.bankName = "Bank name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.bankName)) {
      validationErrors.bankName = "Bank name must contain only letters.";
    }
    if (!(formData.bankBranch || '').trim()) {
      validationErrors.bankBranch = "Branch is required.";
    } else if (!/^[A-Za-z\s]+$/.test(formData.bankBranch)) {
      validationErrors.bankBranch = "Branch name must contain only letters.";
    }
    if (!formData.accountNumber || !String(formData.accountNumber).match(/^\d{9,18}$/))
      validationErrors.accountNumber = "Enter a valid account number.";
    
   if (!formData.ifscCode) {
      validationErrors.ifscCode = "Enter a valid IFSC code.";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      validationErrors.ifscCode = "Enter a valid IFSC code (only uppercase letters and numbers, e.g., ABCD0E12345).";
    }

    // Education
    if (!(formData.highestQualification || '').trim())
      validationErrors.highestQualification = "Highest qualification is required.";
    if (formData.highestQualification === "Other" && !(formData.otherQualification || '').trim())
      validationErrors.otherQualification = "Other qualification is required.";
    if (!formData.fieldOfStudy || !(formData.fieldOfStudy || '').trim())
      validationErrors.fieldOfStudy = "Field of study is required.";

    // Professional
    if (!formData.previousExperience)
      validationErrors.previousExperience = "Previous experience is required.";
    if (formData.previousExperience === "Yes") {
      if (!(formData.previousEmployer || '').trim())
        validationErrors.previousEmployer = "Previous employer is required.";
      if (!(formData.previousDesignation || '').trim())
        validationErrors.previousDesignation = "Previous designation is required.";
      if (!(formData.yearsOfExperience || '').trim())
        validationErrors.yearsOfExperience = "Years of experience is required.";
      // if (!(formData.fieldOfExpertise || '').trim())
      //   validationErrors.fieldOfExpertise = "Field of expertise is required.";
    }

    // Declaration
    if (!formData.agreedTerms)
      validationErrors.agreedTerms = "You must agree to terms and conditions.";
    

    return validationErrors;
  };

  const getFinalQualification = () => {
    if (formData.highestQualification === "Other") {
      return formData.otherQualification;
    }
    return formData.highestQualification;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setFadingErrors({});
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = document.querySelector('.input-error');
      if (firstErrorField) firstErrorField.focus();
      alert("Please correct the highlighted errors.");
      return;
    }
    const submissionData = { ...formData };
    submissionData.highestQualification = getFinalQualification();

     try {
      const response = await fetch("https://backend-yqvp.onrender.com/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
      
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      await response.json();
      alert("Form submitted successfully!");
      setFormData(initialFormData);
      setErrors({});
      setFadingErrors({});
      if (firstNameRef.current) firstNameRef.current.focus();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again later.");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure to reset the form?")) {
      setFormData(initialFormData);
      setErrors({});
      setFadingErrors({});
      setTimeout(() => {
        if (firstNameRef.current) firstNameRef.current.focus();
      }, 100);
      alert("Form has been reset!");
    }
  };

  const RequiredStar = () => <span className="required">*</span>;

  const bankPolicy =
    "Company Policy: Your bank details are confidential and will only be used for salary disbursement and statutory compliance. Please do not share your bank credentials (like internet banking passwords or OTPs) with anyone, including HR staff. For any doubts, contact the finance department.";



  return (
    <div className="page-bg">
      <img src="https://www.ascentware.in/images/logo.png" alt="Company Logo" className="company-logo" />
      <div className={`form-container form-container-zoom ${zoomClass}`}>
        <h2 className="form-title">EMPLOYEE JOINING FORM</h2>
        <div className="form-inner">
          {/* PERSONAL DETAILS */}
          <h3 className="section-title">Personal Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">
                First Name:<RequiredStar />
              </label>
             <input id="firstName"
                ref={firstNameRef}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, firstName: filtered }));
                  triggerFadeOut('firstName');
                }}
                className={`${errors.firstName ? "input-error" : formData.firstName ? "input-valid" : ""} ${shakeFields.firstName ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.firstName &&
                <span className={`error validation-msg${fadingErrors.firstName ? " fade-out" : ""}`}>
                  {errors.firstName}
                </span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="middleName">
                Middle Name (Optional):
              </label>
              <input id='middleName'
                ref={middleNameRef}
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, middleName: filtered }));
                  triggerFadeOut('middleName');
                }}
                className={`${errors.middleName ? "input-error" : formData.middleName ? "input-valid" : ""} ${shakeFields.middleName ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.middleName &&
                <span className={`error validation-msg${fadingErrors.middleName ? " fade-out" : ""}`}>
                  {errors.middleName}
                </span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="lastName">
                Last Name: <RequiredStar />
              </label>
             <input id="lastName"
                ref={lastNameRef}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, lastName: filtered }));
                  triggerFadeOut('lastName');
                }}
                className={`${errors.lastName ? "input-error" : formData.lastName ? "input-valid" : ""} ${shakeFields.lastName ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.lastName &&
                <span className={`error validation-msg${fadingErrors.lastName ? " fade-out" : ""}`}>
                  {errors.lastName}
                </span>
              }
            </div>


            <div className="form-group">
            <label htmlFor="dateOfBirth">
              Date of Birth: <RequiredStar />
            </label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              min="1996-01-01" 
              max={maxDob}
              className={`${errors.dateOfBirth ? "input-error" : formData.dateOfBirth ? "input-valid" : ""} ${shakeFields.dateOfBirth ? 'shake' : ''}`}
            />
            {errors.dateOfBirth &&
              <span className={`error validation-msg${fadingErrors.dateOfBirth ? " fade-out" : ""}`}>
                {errors.dateOfBirth}
              </span>
            }
          </div>
            
            <div className="form-group gender-group">
              <label htmlFor="gender">
                Gender
              </label>
              <div className="gender-options">
                <label>
                  <input id="genderMale"
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                  /> Male
                </label>
                <label>
                  <input
                    id="genderFemale"
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                  /> Female
                </label>
                <label>
                  <input id='genderOther'
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === "Other"}
                    onChange={handleChange}
                  /> Other
                </label>
              </div>
              {errors.gender &&
                <span className={`error validation-msg${fadingErrors.gender ? " fade-out" : ""}`}>
                  {errors.gender}
                </span>
              }
            </div>

              <div className="form-group">
                <label htmlFor="maritalStatus">
                  Marital Status: 
                </label>
                <div className="radio-row">
                  <label>
                    <input id="maritalStatusSingle"
                      type="radio"
                      name="maritalStatus"
                      value="Single"
                      checked={formData.maritalStatus === "Single"}
                      onChange={handleChange}
                    /> Single
                  </label>
                  <label>
                    <input
                      id="maritalStatusMarried"
                      type="radio"
                      name="maritalStatus"
                      value="Married"
                      checked={formData.maritalStatus === "Married"}
                      onChange={handleChange}
                    /> Married
                  </label>
                  <label>
                    <input
                      id="maritalStatusOthers"
                      type="radio"
                      name="maritalStatus"
                      value="Others"
                      checked={formData.maritalStatus === "Others"}
                      onChange={handleChange}
                    /> Others
                  </label>
                </div>
                {errors.maritalStatus &&
                  <span className={`error validation-msg${fadingErrors.maritalStatus ? " fade-out" : ""}`}>
                    {errors.maritalStatus}
                  </span>
                }
              </div>

            <div className="form-group">
              <label htmlFor="contactNumber">
                Contact Number: <RequiredStar />
              </label>
              <input  id="contactNumber"
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^\d]/g, "");
                  setFormData(prev => ({ ...prev, contactNumber: filtered }));
                  triggerFadeOut('contactNumber');
                }}
                maxLength={10}
                className={`${errors.contactNumber ? "input-error" : formData.contactNumber ? "input-valid" : ""} ${shakeFields.contactNumber ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.contactNumber &&
                <span className={`error validation-msg${fadingErrors.contactNumber ? " fade-out" : ""}`}>
                  {errors.contactNumber}
                </span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="email">
                Email ID: <RequiredStar />
              </label>
              <input id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="abc@xyz.com"
                className={`${errors.email ? "input-error" : formData.email ? "input-valid" : ""} ${shakeFields.email ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.email &&
                <span className={`error validation-msg${fadingErrors.email ? " fade-out" : ""}`}>
                  {errors.email}
                </span>
              }
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="permanentAddress">
                Permanent Address: <RequiredStar />
              </label>
              <textarea id='permanentAddress'
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                className={`address-field ${errors.permanentAddress ? "input-error" : formData.permanentAddress ? "input-valid" : ""} ${shakeFields.permanentAddress ? 'shake' : ''}`}
              />
              {errors.permanentAddress &&
                <span className={`error validation-msg${fadingErrors.permanentAddress ? " fade-out" : ""}`}>
                  {errors.permanentAddress}
                </span>
              }
            </div>
          </div>
          <div className="form-group full-width checkbox-row">
            <label>
              <input id="isCurrentAddressSameAsPermanent"
                type="checkbox"
                name="isCurrentAddressSameAsPermanent"
                checked={formData.isCurrentAddressSameAsPermanent}
                onChange={handleChange}
                style={{ marginRight: "7px" }}
              />
              Is the current address same as permanent address?
            </label>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="currentAddress">
                Current Address:
              </label>
              <textarea id='currentAddress'
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                disabled={formData.isCurrentAddressSameAsPermanent}
                className={`address-field ${errors.currentAddress ? "input-error" : formData.currentAddress ? "input-valid" : ""} ${shakeFields.currentAddress ? 'shake' : ''}`}
              />
              {errors.currentAddress &&
                <span className={`error validation-msg${fadingErrors.currentAddress ? " fade-out" : ""}`}>
                  {errors.currentAddress}
                </span>
              }
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="nationality">
              Nationality: <RequiredStar />
            </label>
            <input id='nationality'
                ref={nationalityRef}
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, nationality: filtered }));
                  triggerFadeOut('nationality');
                }}
                className={`${errors.nationality ? "input-error" : formData.nationality ? "input-valid" : ""} ${shakeFields.nationality ? 'shake' : ''}`}
                autoComplete="off"
              />
            {errors.nationality &&
              <span className={`error validation-msg${fadingErrors.nationality ? " fade-out" : ""}`}>
                {errors.nationality}
              </span>
            }
          </div>

           {/* DISABILITY STATUS */}
          <div className="form-group full-width">
          <label htmlFor="hasDisability">
            PWD (Person with Disability) Status: <RequiredStar />
          </label>
          <div>
            <label>
              <input id="hasDisabilityYes"
                type="radio"
                name="hasDisability"
                value="yes"
                checked={formData.hasDisability === "yes"}
                onChange={handleChange}
              /> Yes
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                id="hasDisabilityNo"
                type="radio"
                name="hasDisability"
                value="no"
                checked={formData.hasDisability === "no"}
                onChange={handleChange}
              /> No
            </label>
          </div>
          {formData.hasDisability === "yes" && (
            <div className="disability-info">
              Please provide a valid disability documents with details and % of disability.
            </div>
          )}
          {errors.hasDisability &&
            <span className={`error validation-msg${fadingErrors.hasDisability ? " fade-out" : ""}`}>
              {errors.hasDisability}
            </span>
          }
        </div>
          {/* WORK PERMIT DETAILS */}
          <h3 className="section-title">Work Permit Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="workPermitCountry">
                Work Permit Available Country: <RequiredStar />
              </label>
              <input id='workPermitCountry'
                ref={workPermitCountryRef}
                type="text"
                name="workPermitCountry"
                value={formData.workPermitCountry}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, workPermitCountry: filtered }));
                  triggerFadeOut('workPermitCountry');
                }}
                className={`${errors.workPermitCountry ? "input-error" : formData.workPermitCountry ? "input-valid" : ""} ${shakeFields.workPermitCountry ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.workPermitCountry &&
                <span className={`error validation-msg${fadingErrors.workPermitCountry ? " fade-out" : ""}`}>
                  {errors.workPermitCountry}
                </span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="workPermitExpiry">
                Work Permit Expiry Date: 
              </label>
              <input id='workPermitExpiry'
                type="date"
                name="workPermitExpiry"
                value={formData.workPermitExpiry}
                onChange={handleChange}
                 min={todayStr}
                className={`${errors.workPermitExpiry ? "input-error" : formData.workPermitExpiry ? "input-valid" : ""} ${shakeFields.workPermitExpiry ? 'shake' : ''}`}
              />
              {errors.workPermitExpiry &&
                <span className={`error validation-msg${fadingErrors.workPermitExpiry ? " fade-out" : ""}`}>
                  {errors.workPermitExpiry}
                </span>
              }
            </div>
          </div>
          {/* EMERGENCY CONTACTS */}
          <h3 className="section-title">Emergency Contact Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="emergencyContactName">
                Emergency Contact Name: 
              </label>
              <input id='emergencyContactName'
                ref={emergencyContactNameRef}
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, emergencyContactName: filtered }));
                  triggerFadeOut('emergencyContactName');
                }}
                className={`${errors.emergencyContactName ? "input-error" : formData.emergencyContactName ? "input-valid" : ""} ${shakeFields.emergencyContactName ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.emergencyContactName &&
                <span className={`error validation-msg${fadingErrors.emergencyContactName ? " fade-out" : ""}`}>
                  {errors.emergencyContactName}
                </span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="emergencyRelationship">
                Relationship: 
              </label>
              <input id='emergencyRelationship'
                ref={emergencyRelationshipRef}
                type="text"
                name="emergencyRelationship"
                value={formData.emergencyRelationship}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, emergencyRelationship: filtered }));
                  triggerFadeOut('emergencyRelationship');
                }}
                className={`${errors.emergencyRelationship ? "input-error" : formData.emergencyRelationship ? "input-valid" : ""} ${shakeFields.emergencyRelationship ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.emergencyRelationship &&
                <span className={`error validation-msg${fadingErrors.emergencyRelationship ? " fade-out" : ""}`}>
                  {errors.emergencyRelationship}
                </span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="emergencyContactNumber">
                Emergency Contact Number: <RequiredStar />
              </label>
              <input id='emergencyContactNumber'
                  type="tel"
                  name="emergencyContactNumber"
                  value={formData.emergencyContactNumber}
                  onChange={e => {
                    const filtered = e.target.value.replace(/[^\d]/g, "");
                    setFormData(prev => ({ ...prev, emergencyContactNumber: filtered }));
                    triggerFadeOut('emergencyContactNumber');
                  }}
                  maxLength={10}
                  className={`${errors.emergencyContactNumber ? "input-error" : formData.emergencyContactNumber ? "input-valid" : ""} ${shakeFields.emergencyContactNumber ? 'shake' : ''}`}
                  autoComplete="off"
                />
              {errors.emergencyContactNumber &&
                <span className={`error validation-msg${fadingErrors.emergencyContactNumber ? " fade-out" : ""}`}>
                  {errors.emergencyContactNumber}
                </span>
              }
            </div>
          </div>
          
          {/* BANK DETAILS */}
          <h3 className="section-title">
            Bank & Salary Details
            <span className="tooltip-container">
              <span className="tooltip-icon" tabIndex={0}> ⓘ
                <span className="tooltip-text">{bankPolicy}</span>
              </span>
            </span>
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="bankName">
                Bank Name: <RequiredStar />
              </label>
              <input id='bankName'
                ref={bankNameRef}
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, bankName: filtered }));
                  triggerFadeOut('bankName');
                }}
                className={`${errors.bankName ? "input-error" : formData.bankName ? "input-valid" : ""} ${shakeFields.bankName ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.bankName &&
                <span className={`error validation-msg${fadingErrors.bankName ? " fade-out" : ""}`}>
                  {errors.bankName}
                </span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="bankBranch">
                Branch: <RequiredStar />
              </label>
              <input id='bankBranch'
                ref={bankBranchRef}
                type="text"
                name="bankBranch"
                value={formData.bankBranch}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, bankBranch: filtered }));
                  triggerFadeOut('bankBranch');
                }}
                className={`${errors.bankBranch ? "input-error" : formData.bankBranch ? "input-valid" : ""} ${shakeFields.bankBranch ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.bankBranch &&
                <span className={`error validation-msg${fadingErrors.bankBranch ? " fade-out" : ""}`}>
                  {errors.bankBranch}
                </span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="accountNumber">
                Account Number: <RequiredStar />
              </label>
             <input id='accountNumber'
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={e => {
                  // Only allow letters
                  const filtered = e.target.value.replace(/[^\d]/g, "");
                  setFormData(prev => ({ ...prev, accountNumber: filtered }));
                  triggerFadeOut('accountNumber')
                }}
                className={`${errors.accountNumber ? "input-error" : formData.accountNumber ? "input-valid" : ""} ${shakeFields.accountNumber ? 'shake' : ''}`}
                autoComplete="off"
                maxLength={18} // Assuming max length for account number is 18 digits
              />
             
              {errors.accountNumber &&
                <span className={`error validation-msg${fadingErrors.accountNumber ? " fade-out" : ""}`}>
                  {errors.accountNumber}
                </span>
              }
            </div>
            <div className="form-group">
              <label htmlFor="ifscCode">
                IFSC Code: <RequiredStar />
              </label>
              <input id='ifscCode'
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={e => {
                    const filtered = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                    setFormData(prev => ({ ...prev, ifscCode: filtered }));
                    triggerFadeOut('ifscCode');
                  }}
                  maxLength={11}
                  className={`${errors.ifscCode ? "input-error" : formData.ifscCode ? "input-valid" : ""} ${shakeFields.ifscCode ? 'shake' : ''}`}
                  autoComplete="off"
                />
              {errors.ifscCode &&
                <span className={`error validation-msg${fadingErrors.ifscCode ? " fade-out" : ""}`}>
                  {errors.ifscCode}
                </span>
              }
            </div>
          </div>
          {/* EDUCATION DETAILS */}
          <h3 className="section-title">Educational Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="highestQualification">
                Highest Qualification: <RequiredStar />
              </label>
              <select id='highestQualification'
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleChange}
                className={`${errors.highestQualification ? "input-error" : formData.highestQualification ? "input-valid" : ""} ${shakeFields.highestQualification ? 'shake' : ''}`}
              >
                <option value="">-- Select Qualification --</option>
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate/Ph.D.">Doctorate/Ph.D.</option>
                <option value="Other">Other (Please specify below)</option>
              </select>
              {errors.highestQualification &&
                <span className={`error validation-msg${fadingErrors.highestQualification ? " fade-out" : ""}`}>
                  {errors.highestQualification}
                </span>
              }
              {formData.highestQualification === "Other" && (
                <>
                  <input  id='otherQualification'
                ref={otherQualificationRef}
                type="text"
                name="otherQualification"
                value={formData.otherQualification}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, otherQualification: filtered }));
                  triggerFadeOut('otherQualification');
                }}
                className={`${errors.otherQualification ? "input-error" : formData.otherQualification ? "input-valid" : ""} ${shakeFields.otherQualification ? 'shake' : ''}`}
                autoComplete="off"
              />
                  {errors.otherQualification &&
                    <span className={`error validation-msg${fadingErrors.otherQualification ? " fade-out" : ""}`}>
                      {errors.otherQualification}
                    </span>
                  }
                </>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="fieldOfStudy">
                Field of Study: 
              </label>
              <input id='fieldOfStudy'
                ref={fieldOfStudyRef}
                type="text"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, fieldOfStudy: filtered }));
                  triggerFadeOut('fieldOfStudy');
                }}
                className={`${errors.fieldOfStudy ? "input-error" : formData.fieldOfStudy ? "input-valid" : ""} ${shakeFields.fieldOfStudy ? 'shake' : ''}`}
                autoComplete="off"
              />
              {errors.fieldOfStudy &&
                <span className={`error validation-msg${fadingErrors.fieldOfStudy ? " fade-out" : ""}`}>
                  {errors.fieldOfStudy}
                </span>
              }
            </div>
          </div>
          {/* PROFESSIONAL DETAILS */}
          <h3 className="section-title">Professional Details</h3>
          <div className="form-group">
            <label htmlFor="previousExperience">
              Do you have any prior experience? <RequiredStar />
            </label>
            <div className="radio-row">
              <label>
                <input id="previousExperienceYes"
                  type="radio"
                  name="previousExperience"
                  value="Yes"
                  checked={formData.previousExperience === "Yes"}
                  onChange={handleChange}
                /> Yes
              </label>
              <label>
                <input id="previousExperienceNo"
                  type="radio"
                  name="previousExperience"
                  value="No"
                  checked={formData.previousExperience === "No"}
                  onChange={handleChange}
                /> No
              </label>
            </div>
            {errors.previousExperience &&
              <span className={`error validation-msg${fadingErrors.previousExperience ? " fade-out" : ""} ${shakeFields.previousExperience ? 'shake' : ''}`} style={{ marginLeft: 8 }}>
                {errors.previousExperience}
              </span>
            }
          </div>
          {formData.previousExperience === 'Yes' && (
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="previousEmployer">
                  Previous Employer: 
                </label>
                <input id='previousEmployer'
                ref={previousEmployerRef}
                type="text"
                name="previousEmployer"
                value={formData.previousEmployer}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, previousEmployer: filtered }));
                  triggerFadeOut('previousEmployer');
                }}
                className={`${errors.previousEmployer ? "input-error" : formData.previousEmployer ? "input-valid" : ""} ${shakeFields.previousEmployer ? 'shake' : ''}`}
                autoComplete="off"
              />
                {errors.previousEmployer &&
                  <span className={`error validation-msg${fadingErrors.previousEmployer ? " fade-out" : ""}`}>
                    {errors.previousEmployer}
                  </span>
                }
              </div>
              <div className="form-group">
                <label htmlFor="previousDesignation">
                  Previous Designation: <RequiredStar />
                </label>
                <input id='previousDesignation'
                ref={previousDesignationRef}
                type="text"
                name="previousDesignation"
                value={formData.previousDesignation}
                onChange={e => {
                  const filtered = e.target.value.replace(/[^A-Za-z\s]/g, "");
                  setFormData(prev => ({ ...prev, previousDesignation: filtered }));
                  triggerFadeOut('previousDesignation');
                }}
                className={`${errors.previousDesignation ? "input-error" : formData.previousDesignation ? "input-valid" : ""} ${shakeFields.previousDesignation ? 'shake' : ''}`}
                autoComplete="off"
              />
                {errors.previousDesignation &&
                  <span className={`error validation-msg${fadingErrors.previousDesignation ? " fade-out" : ""}`}>
                    {errors.previousDesignation}
                  </span>
                }
              </div>
              <div className="form-group">
                <label htmlFor="yearsOfExperience">
                  Years of Experience: <RequiredStar />
                </label>
                <input id='yearsOfExperience'
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className={`${errors.yearsOfExperience ? "input-error" : formData.yearsOfExperience ? "input-valid" : ""} ${shakeFields.yearsOfExperience ? 'shake' : ''}`}
                  autoComplete="off"
                />
                {errors.yearsOfExperience &&
                  <span className={`error validation-msg${fadingErrors.yearsOfExperience ? " fade-out" : ""}`}>
                    {errors.yearsOfExperience}
                  </span>
                }
              </div>
            </div>
          )}

          {/* JOINING & EMPLOYEE DETAILS (Auto-generated by HR) */}
          <h3 className="section-title">Joining & Employee Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="currentDesignation">Designation: <span className="text-placeholder">(To be filled by HR)</span></label>
              <input id="currentDesignation"
                type="text"
                name="currentDesignation"
                value={formData.currentDesignation}
                readOnly
                disabled
                placeholder="Auto-generated by HR"
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department: <span className="text-placeholder">(To be filled by HR)</span></label>
              <input id="department"
                type="text"
                name="department"
                value={formData.department}
                readOnly
                disabled
                placeholder="Auto-generated by HR"
              />
            </div>
            <div className="form-group">
              <label htmlFor="employeeId">Employee ID: <span className="text-placeholder">(To be filled by HR)</span></label>
              <input id="employeeId"
                type="text"
                name="employeeId"
                value={formData.employeeId}
                readOnly
                disabled
                placeholder="Auto-generated by HR"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfJoining">Date of Joining: <span className="text-placeholder">(To be filled by HR)</span></label>
              <input id="dateOfJoining"
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                readOnly
                disabled
                placeholder="Auto-generated by HR"
              />
            </div>
          </div>
          {/* DECLARATION */}
          <h3 className="section-title">Declaration</h3>
          <div className="form-group">
            <label htmlFor="declaration">
              I, {formData.firstName} {formData.lastName}, confirm that the above-provided details are true and accurate. I agree to abide by the company policies and procedures.
            </label>
        
          </div>
          <div className="form-group">
            <label htmlFor="agreedTerms">
              <input id="agreedTerms"
                  type="checkbox"
                  name="agreedTerms"
                  checked={formData.agreedTerms}
                  onChange={e => {
                    handleChange(e);
                    if (e.target.checked) {
                      alert("By checking the box you're agreeing to the terms and conditions of the company");
                    }
                  }}
                /> "I Agree" <RequiredStar />
            </label>
            {errors.agreedTerms &&
              <span className={`error validation-msg${fadingErrors.agreedTerms ? " fade-out" : ""} ${shakeFields.agreedTerms ? 'shake' : ''}`}>
                {errors.agreedTerms}
              </span>
            }
          </div>
         <div className="form-group" style={{ maxWidth: 200 }}>
          <label htmlFor="declarationDate">Date:</label>
          <input
            id="declarationDate"
            type="date"
            name="declarationDate"
            value={todayStr}
            readOnly
            style={{ background: "#f5f5f5", width: "100%" }}
          />
        </div>
          
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24 }}>
            <button type="submit" className="submit-btn" onClick={handleSubmit}>Submit</button>
            <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeRegistrationForm;
