'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import Check from 'src/public/icons/done.svg'

const OnboardMenu = ({}) => {
    const pathname = usePathname();
    return (
        <div className='fixed pt-20'>

            <div className='sidemenu h-screen'>
                <div className='pt-12 relative'>
                    <Link href="/onboard/about" className=''>
                        <div className={pathname == "/onboard/about" ? "active-link-onboarding" : "flex items-center pl-8 py-2"}>
                            <div className={pathname == "/onboard/documents" || pathname == "/onboard/settlement-billing" || pathname == "/onboard/business-rep" || pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'relative bg-states-success rounded-full h-6 w-6 flex justify-center items-center' : 'relative bg-placeholder rounded-full h-6 w-6 flex justify-center items-center'}>
                            <p className={pathname == "/onboard/documents" || pathname == "/onboard/settlement-billing" || pathname == "/onboard/business-rep" || pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'hidden' : 'body-sm text-white'}>1
                            </p>
                            <div className='onboard-line'></div>
                            <Check className={pathname == "/onboard/documents" || pathname == "/onboard/settlement-billing" || pathname == "/onboard/business-rep" || pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'body-sm text-white h-4 w-4' : 'hidden'}/>
                            <div className='onboard-line'></div>
                            </div>
                            <p className='ml-4 body text-title-active'>About your business</p>
                        </div>
                    </Link>

                    <Link href="/onboard/documents" className=''>
                        <div className={pathname == "/onboard/documents" ? "active-link-onboarding" : "flex items-center pl-8 py-2"}>
                            <div className={pathname == "/onboard/settlement-billing" || pathname == "/onboard/business-rep" || pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'relative bg-states-success rounded-full h-6 w-6 flex justify-center items-center' : 'relative bg-placeholder rounded-full h-6 w-6 flex justify-center items-center'}>
                            <p className={pathname == "/onboard/settlement-billing" || pathname == "/onboard/business-rep" || pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'hidden' : 'body-sm text-white'}>2
                            </p>
                            <div className='onboard-line'></div>
                            <Check className={pathname == "/onboard/settlement-billing" || pathname == "/onboard/business-rep" || pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'body-sm text-white h-4 w-4' : 'hidden'}/>
                            <div className='onboard-line'></div>
                            </div>
                            <p className='ml-4 body text-title-active'>Documents</p>
                        </div>
                    </Link>

                    <Link href="/onboard/settlement-billing" className=''>
                        <div className={pathname == "/onboard/settlement-billing" ? "active-link-onboarding" : "flex items-center pl-8 py-2"}>
                            <div className={pathname == "/onboard/business-rep" || pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'relative bg-states-success rounded-full h-6 w-6 flex justify-center items-center' : 'relative bg-placeholder rounded-full h-6 w-6 flex justify-center items-center'}>
                            <p className={pathname == "/onboard/business-rep" || pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'hidden' : 'body-sm text-white'}>3
                            </p>
                            <div className='onboard-line'></div>
                            <Check className={pathname == "/onboard/business-rep" || pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'body-sm text-white h-4 w-4' : 'hidden'}/>
                            <div className='onboard-line'></div>
                            </div>
                            <p className='ml-4 body text-title-active'>Settlement/Billing</p>
                        </div>
                    </Link>

                    <Link href="/onboard/business-rep" className=''>
                        <div className={pathname == "/onboard/business-rep" ? "active-link-onboarding" : "flex items-center pl-8 py-2"}>
                            <div className={pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'relative bg-states-success rounded-full h-6 w-6 flex justify-center items-center' : 'relative bg-placeholder rounded-full h-6 w-6 flex justify-center items-center'}>
                            <p className={pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'hidden' : 'body-sm text-white'}>4
                            </p>
                            <div className='onboard-line'></div>
                            <Check className={pathname == "/onboard/owner" || pathname == "/onboard/review" ? 'body-sm text-white h-4 w-4' : 'hidden'}/>
                            <div className='onboard-line'></div>
                            </div>
                            <p className='ml-4 body text-title-active'>Business Rep</p>
                        </div>
                    </Link>

                    <Link href="/onboard/owner" className=''>
                        <div className={pathname == "/onboard/owner" ? "active-link-onboarding" : "flex items-center pl-8 py-2"}>
                            <div className={pathname == "/onboard/review" ? 'relative bg-states-success rounded-full h-6 w-6 flex justify-center items-center' : 'relative bg-placeholder rounded-full h-6 w-6 flex justify-center items-center'}>
                            <p className={pathname == "/onboard/review" ? 'hidden' : 'body-sm text-white'}>5
                            </p>
                            <div className='onboard-line'></div>
                            <Check className={pathname == "/onboard/review" ? 'body-sm text-white h-4 w-4' : 'hidden'}/>
                            <div className='onboard-line'></div>
                            </div>
                            <p className='ml-4 body text-title-active'>Owner Information</p>
                        </div>
                    </Link>

                    <Link href="/onboard/review" className=''>
                        <div className={pathname == "/onboard/review" ? "active-link-onboarding-last" : "flex items-center pl-8 py-2"}>
                            <div className='relative bg-placeholder rounded-full h-6 w-6 flex justify-center items-center'>
                                <p className='body-sm text-white w-2 h-2 bg-white rounded-full pt-1'></p>
                            </div>
                            <p className='ml-4 body text-title-active'>Summary</p>
                        </div>
                    </Link>
                </div>   
            </div>
        </div>
  );
};

export default OnboardMenu;