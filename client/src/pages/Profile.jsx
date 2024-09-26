import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-6 max-w-lg mx-auto'>
      <h1 className='text-4xl font-bold text-center my-7 text-gray-800'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-28 w-28 object-cover cursor-pointer self-center shadow-md hover:shadow-lg transition-all duration-300'
        />
        <p className='text-sm text-center'>
          {fileUploadError ? (
            <span className='text-red-600'>Error Image upload (image must be less than 2 MB)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-gray-600'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-600'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='Username'
          defaultValue={currentUser.username}
          id='username'
          className='border-2 p-3 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          defaultValue={currentUser.email}
          id='email'
          className='border-2 p-3 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          onChange={handleChange}
          id='password'
          className='border-2 p-3 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all'
        />
        <button
          disabled={loading}
          className='bg-blue-600 text-white rounded-lg p-3 uppercase hover:bg-blue-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed'
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
        <Link
          className='bg-green-500 text-white p-3 rounded-lg text-center uppercase hover:bg-green-600 transition-all duration-300'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-6'>
        <span onClick={handleDeleteUser} className='text-red-500 cursor-pointer hover:underline'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-500 cursor-pointer hover:underline'>
          Sign Out
        </span>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
      {updateSuccess && <p className='text-green-500 mt-5'>User updated successfully!</p>}

<div className='flex justify-center items-center mt-5'>
  <button
    onClick={handleShowListings}
    className='text-blue-600 hover:underline cursor-pointer'
    >
    Show Listings
  </button>
</div>

      {showListingsError && <p className='text-red-500 mt-5'>Error showing listings</p>}

      {userListings.length > 0 && (
        <div className='mt-6'>
          <h2 className='text-center text-2xl font-bold text-gray-800 mb-4'>Your Listings</h2>
          <div className='grid gap-4'>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border rounded-lg p-4 flex justify-between items-center shadow-md hover:shadow-lg transition-all'
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-16 w-16 object-contain rounded-md'
                  />
                </Link>
                <Link
                  className='text-gray-800 font-semibold truncate flex-1 ml-4 hover:underline'
                  to={`/listing/${listing._id}`}
                >
                  {listing.name}
                </Link>
                <div className='flex flex-col items-end'>
                  <button
                    className='text-red-600 uppercase text-sm mb-2 hover:underline'
                    onClick={() => handleListingDelete(listing._id)}
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-blue-600 uppercase text-sm hover:underline'>Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
