import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-white shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/' className='font-bold text-xl text-blue-600 transition duration-300 hover:text-blue-500'>
          Real Estate
        </Link>
        <form
          onSubmit={handleSubmit}
          className='flex items-center border border-gray-300 rounded-full shadow-sm overflow-hidden'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none p-2 w-40 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type='submit'
            className='bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition duration-200'
          >
            <FaSearch />
          </button>
        </form>
        <nav>
          <ul className='flex gap-6 items-center'>
            <Link to='/' className='text-gray-700 transition duration-300 hover:text-blue-600'>
              Home
            </Link>
            <Link to='/about' className='text-gray-700 transition duration-300 hover:text-blue-600'>
              About
            </Link>
            <Link to='/profile' className='flex items-center'>
              {currentUser ? (
                <img
                  className='rounded-full h-8 w-8 object-cover border border-gray-300'
                  src={currentUser.avatar}
                  alt='profile'
                />
              ) : (
                <span className='text-gray-700 transition duration-300 hover:text-blue-600'>Sign in</span>
              )}
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}
