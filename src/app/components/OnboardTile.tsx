'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import Close from 'src/public/icons/close.svg'

const OnboardTile = ({}) => {
    return (
        <div className='fixed z-10 backdrop-blur-md'>
            <div className='h-full flex items-center border-b w-screen'>
                <Link href="/dashboard/overview">
                <Close className="m-7 text-primary-default h-6 w-6"/>
                </Link>
                <p className='body-sm text-title-active'>Onboarding</p>
            </div>
        </div>
  );
};

export default OnboardTile;