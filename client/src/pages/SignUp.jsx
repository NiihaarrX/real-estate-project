import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const checkPasswordStrength = (password) => {
    const isLongEnough = password.length >= 8;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!isLongEnough) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasLetters || !hasNumbers) {
      return "Password must contain both letters and numbers.";
    }
    return null;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });


  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = checkPasswordStrength(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 p-6 flex items-center justify-center'>
      <div className='bg-white shadow-md rounded-lg p-8 max-w-lg w-full'>
        <h1 className='text-3xl text-center font-semibold my-5 text-slate-800'>Sign Up</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Username'
            className='border p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-400'
            id='username'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='Email'
            className='border p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-400'
            id='email'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password'
            className='border p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-400'
            id='password'
            onChange={handleChange}
          />
          <button 
            disabled={loading} 
            className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 disabled:opacity-80 transition duration-300'>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
          <OAuth />
        </form>
        <div className='flex justify-center gap-2 mt-5'>
          <p className='text-slate-600'>Have an account?</p>
          <Link to={'/sign-in'}>
            <span className='text-blue-600 underline cursor-pointer'>Sign In</span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
      </div>
    </div>
  );
}
