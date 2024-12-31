'use client'
import React, { useState, useEffect, useRef } from 'react';
import User from 'src/public/icons/user.svg';
import Help from 'src/public/icons/help.svg';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const NotificationProfile = () => {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const userButtonRef = useRef(null);
  const displayEmail = session?.user?.emailaddress || 'john@examples.com';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && userButtonRef.current && !userButtonRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='absolute top-9 right-8 hidden lg:flex'>
      <div className='flex gap-x-4'>
        <button className='bg-primary-background rounded-full flex items-center justify-center h-8 w-8'>
          <Help className='h-6 w-6 text-primary-default' />
        </button>
        <button ref={userButtonRef} onClick={() => setShowDropdown(!showDropdown)} className='bg-primary-background rounded-full flex items-center justify-center h-8 w-8'>
          <User className='h-6 w-6 text-primary-default' />
        </button>
        {showDropdown && (
          <div ref={dropdownRef} className="absolute rounded-3xl bg-white box-shadow profile-dropdown border-line border z-30">
            {/* Add your dropdown elements here */}
            <div className="rounded-3xl bg-white py-4 flex flex-col">
              <div className='px-5 flex flex-col'>
                <p className='body-sm text-body-primary mb-1 font-bold'>User name</p>
                <p className='meta text-body-secondary mb-6'>{displayEmail}</p>
                <div className='border-b border-line mb-2'></div>
              </div>
              <div className='flex flex-col'>
                <Link onClick={() => setShowDropdown(false)} className='body-sm px-5 py-2 w-full text-primary-default hover:text-title-active hover:bg-background' href="/dashboard/settings/profile">Profile</Link>
                <Link onClick={() => setShowDropdown(false)} className='body-sm px-5 py-2 w-full text-primary-default hover:text-title-active hover:bg-background' href="/dashboard/overview">API Documentation</Link>
                <Link onClick={() => setShowDropdown(false)} className='body-sm px-5 py-2 w-full text-primary-default hover:text-title-active hover:bg-background' href="/login">Log Out</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationProfile;
