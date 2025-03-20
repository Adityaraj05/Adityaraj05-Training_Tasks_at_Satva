import { useState,useRef, ChangeEvent, FormEvent } from 'react';

// TypeScript interfaces
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  country: string;
  hobbies: string[];
  skills: string[];
  bio: string;
  profilePicture: File | null;
  password: string;
  termsAccepted: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const ProfileForm = () => {
  // Initial form state
  const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    country: '',
    hobbies: [],
    skills: [],
    bio: '',
    profilePicture: null,
    password: '',
    termsAccepted: false,
  };

  

  // State hooks
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
 
  const [profilePreview, setProfilePreview] = useState<string>('');

  // Options for dropdowns
  const countries = ['USA', 'UK', 'Canada', 'Australia', 'India'];
  const hobbiesList = ['Reading', 'Gaming', 'Cooking', 'Traveling', 'Music'];
  const skillsList = ['React', 'Node.js', 'JavaScript', 'Python', 'TypeScript'];

  // Calculate age function
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };




  // Handle checkbox changes
  const handleCheckboxChange = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(item => item !== skill)
        : [...prev.skills, skill]
    }));
  };

  // Handle multi-select changes
  const handleMultiSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      hobbies: values
    }));
  };
  const [submittedProfilePic, setSubmittedProfilePic] = useState<string>('');

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.country) newErrors.country = 'Country selection is required';
    if (formData.hobbies.length === 0) newErrors.hobbies = 'Select at least one hobby';
    if (formData.skills.length === 0) newErrors.skills = 'Select at least one skill';
    if (!formData.termsAccepted) newErrors.terms = 'You must accept the terms';


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmittedData(formData);
      setSubmittedProfilePic(profilePreview); // Store the profile picture before resetting
  
      setFormData(initialFormData); // Reset form fields
      setProfilePreview(''); // Reset preview image
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input field
      }
    }
  };
  
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Profile Form</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                   {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    className={`form-control ${errors.dob ? 'is-invalid' : ''}`}
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Gender</label>
                  <div>
                    {['Male', 'Female', 'Other'].map((option) => (
                      <div className="form-check form-check-inline" key={option}>
                        <input
                          className={`form-check-input ${errors.gender ? 'is-invalid' : ''}`}
                          type="radio"
                          name="gender"
                          id={option.toLowerCase()}
                          value={option.toLowerCase()}
                          checked={formData.gender === option.toLowerCase()}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor={option.toLowerCase()}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.gender && <div className="text-danger">{errors.gender}</div>}
                </div>
              </div>
            </div>

            {/* Country and Hobbies */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                      className={`form-select ${errors.country ? 'is-invalid' : ''}`}
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  {errors.country && <div className="text-danger">{errors.country}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="hobbies">Hobbies</label>
                  <select
                    multiple
                    className={`form-select ${errors.country ? 'is-invalid' : ''}`}
                    id="hobbies"
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleMultiSelect}
                  >
                    {hobbiesList.map(hobby => (
                      <option key={hobby} value={hobby}>{hobby}</option>
                    ))}
                  </select>
                  {errors.hobbies && <div className="text-danger">{errors.hobbies}</div>}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-3">
  <label>Skills</label>
  <div className="row">
    {skillsList.map((skill) => (
      <div className="col-md-4" key={skill}>
        <div className="form-check">
          <input
            className={`form-check-input ${errors.skills ? 'is-invalid' : ''}`}
            type="checkbox"
            id={skill}
            checked={formData.skills.includes(skill)}
            onChange={() => handleCheckboxChange(skill)}
          />
          <label className="form-check-label" htmlFor={skill}>
            {skill}
          </label>
        </div>
      </div>
    ))}
  </div>
  {errors.skills && <div className="text-danger">{errors.skills}</div>}
</div>


            {/* Bio */}
            <div className="mb-3">
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  className="form-control"
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Profile Picture */}
            <div className="mb-3">
              <div className="form-group">
                <label htmlFor="profilePicture">Profile Picture</label>
                <input
                  type="file"
                  className="form-control"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef} 
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                  id="terms"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                />
                <label className="form-check-label" htmlFor="terms">
                  I accept the terms and conditions
                </label>
                {errors.terms && <div className="invalid-feedback">{errors.terms}</div>}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Display submitted data */}
      {submittedData && (
  <div className="card mt-4">
    <div className="card-header">
      <h3 className="card-title">Submitted Profile</h3>
    </div>
    <div className="card-body">
      <div className="row">
        {submittedProfilePic && (
          <div className="col-12 mb-3">
            <img
              src={submittedProfilePic}
              alt="Profile"
              className="rounded-circle"
              style={{ width: '128px', height: '128px', objectFit: 'cover' }}
            />
          </div>
        )}
        <div className="col-md-6">
          <p><strong>Name:</strong> {submittedData.firstName} {submittedData.lastName}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Phone:</strong> {submittedData.phone}</p>
          <p><strong>Age:</strong> {calculateAge(submittedData.dob)}</p>
        </div>
        <div className="col-md-6">
          <p><strong>Gender:</strong> {submittedData.gender}</p>
          <p><strong>Country:</strong> {submittedData.country}</p>
          <p><strong>Hobbies:</strong> {submittedData.hobbies.join(', ')}</p>
          <p><strong>Skills:</strong> {submittedData.skills.join(', ')}</p>
        </div>
        <div className="col-12">
          <p><strong>Bio:</strong> {submittedData.bio}</p>
          
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;