import { Link } from 'react-router-dom';
import { MdLocationOn, MdKingBed, MdBathtub } from 'react-icons/md'; // Added bed and bath icons for better visuals

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-sm hover:shadow-lg transition-shadow rounded-xl overflow-hidden w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        {/* Image Section */}
        <div className='relative group'>
          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt='listing cover'
            className='h-[320px] sm:h-[220px] w-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'
          />
          {/* Tag for Offer */}
          {listing.offer && (
            <span className='absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded'>
              Offer
            </span>
          )}
        </div>

        {/* Content Section */}
        <div className='p-4 flex flex-col gap-2 w-full'>
          {/* Title */}
          <p className='truncate text-xl font-semibold text-gray-800'>
            {listing.name}
          </p>

          {/* Location */}
          <div className='flex items-center gap-1 text-gray-600'>
            <MdLocationOn className='h-5 w-5 text-red-500' />
            <p className='text-sm truncate'>
              {listing.address}
            </p>
          </div>

          {/* Description */}
          <p className='text-sm text-gray-500 line-clamp-2'>
            {listing.description}
          </p>

          {/* Price Section */}
          <div className='mt-2'>
            <p className='text-lg font-semibold text-green-600'>
              $
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
          </div>

          {/* Bed and Bath Information */}
          <div className='text-gray-700 flex gap-6 mt-2'>
            <div className='flex items-center gap-1'>
              <MdKingBed className='h-5 w-5 text-blue-500' />
              <span className='font-medium text-sm'>
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <MdBathtub className='h-5 w-5 text-blue-500' />
              <span className='font-medium text-sm'>
                {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : '1 Bath'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
