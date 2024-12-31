'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { CSSTransition } from 'react-transition-group';
import Dashboard from 'src/public/icons/dashboard.svg'
import Activities from 'src/public/icons/activities.svg'
import Wallets from 'src/public/icons/wallet.svg'
import Payments from 'src/public/icons/payment.svg'
import Developers from 'src/public/icons/developer.svg'
import Settings from 'src/public/icons/settings.svg'
import { usePathname} from "next/navigation";
import { useSession } from 'next-auth/react';
import Menu from 'src/public/icons/menu.svg'
import Logo from 'src/public/logos/color.svg'
import Close from 'src/public/icons/close.svg'

const SideMenu = ({}) => {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const [showMenu, setShowMenu] = useState(false);

    const displayName = session?.user?.emailaddress || 'Merchant Name';

    return (
        <div className='hide-print'>
            {/* mobile header */}
            <div className='lg:hidden fixed top-0 z-50 w-full flex justify-start bg-background items-center p-6'>
                <button onClick={() => setShowMenu(!showMenu)} className='mr-6'>
                    {showMenu ? <Close className='text-primary-default h-6 w-6'/> : <Menu className='text-primary-default h-6 w-6'/>}
                </button>
                <Logo className='text-primary-default h-8' />
            </div>
            {/* mobile menu */}
            <CSSTransition in={showMenu} timeout={200} classNames="menu" unmountOnExit>
                <div className='lg:hidden fixed top-0 left-0 h-full z-40 bg-background overflow-hidden sidemenu-mobile-width'>
                    <div className='bg-background sidemenu h-screen'>
                        <div className='pl-8 mt-20 flex items-center'>
                            <div className='h-10 w-10 rounded-full bg-line'></div>
                            <p className='ml-4 body-sm text-title-active'>{displayName}</p>
                        </div>            

                        <div className='mt-6'>
                            <Link onClick={() => setShowMenu(false)} href="/dashboard/overview" className=''>
                                <div className={pathname == "/dashboard/overview" ? "active-link" : "flex items-center pl-8 py-2"}>
                                    <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                        <Dashboard className='w-6 h-6 text-body-secondary'/>
                                    </div>
                                    <p className='ml-4 body text-title-active'>Overview</p>
                                </div>
                            </Link>

                        <Link onClick={() => setShowMenu(false)} href="/dashboard/activities" className=''>
                            <div className={pathname.includes("/dashboard/activities") ? "active-link" : "flex items-center pl-8 py-2"}>
                                <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                    <Activities className='w-6 h-6 text-body-secondary'/>
                                </div>
                                <p className='ml-4 body text-title-active'>Activities</p>
                            </div>
                        </Link>

                        <Link onClick={() => setShowMenu(false)} href="/dashboard/wallets" className=''>
                            <div className={pathname.includes("/dashboard/wallets") ? "active-link" : "flex items-center pl-8 py-2"}>
                                <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                    <Wallets className='w-6 h-6 text-body-secondary'/>
                                </div>
                                <p className='ml-4 body text-title-active'>Wallets</p>
                            </div>
                        </Link>
                
                        <div className={pathname.includes("/dashboard/payments") ? "active-link" : "flex items-center pl-8 py-2"}>
                            <Link href="/dashboard/payments" className='flex items-center w-full'>
                                <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                    <Payments className='w-6 h-6 text-body-secondary'/>
                                </div>
                                <p className='ml-4 body text-title-active'>Payments</p>
                            </Link>
                        </div>
                        {pathname.includes("/dashboard/payments") && (
                            <div className='flex flex-col pl-20 space-y-1 bg-white pb-2'>
                                <div className={pathname.includes("/dashboard/payments/billing-invoice") ? "active-sublink py-1 text-title-active" : "py-1 text-title-active"}>
                                    <Link onClick={() => setShowMenu(false)} href="/dashboard/payments/billing-invoice">Billing/Invoice</Link>
                                </div>
                                <div className={pathname == "/dashboard/payments/pos" ? "active-sublink py-1 text-title-active" : "py-1 text-title-active"}>
                                    <Link onClick={() => setShowMenu(false)} href="/dashboard/payments/pos">POS App</Link>
                                </div>
                                <div className={pathname.includes("/dashboard/payments/payment-buttons") ? "active-sublink py-1 text-title-active" : "py-1 text-title-active"}>
                                    <Link onClick={() => setShowMenu(false)} href="/dashboard/payments/payment-buttons">Payment buttons</Link>
                                </div>
                                <div className={pathname.includes("/dashboard/payments/payouts") ? "active-sublink py-1 text-title-active" : "py-1 text-title-active"}>
                                    <Link onClick={() => setShowMenu(false)} href="/dashboard/payments/payouts">Payouts</Link>
                                </div>
                            </div>
                            )}

                            <Link onClick={() => setShowMenu(false)} href="/dashboard/developers" className=''>
                                <div className={pathname == "/dashboard/developers" ? "active-link" : "flex items-center pl-8 py-2"}>
                                    <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                        <Developers className='w-6 h-6 text-body-secondary'/>
                                    </div>
                                    <p className='ml-4 body text-title-active'>Developers</p>
                                </div>
                            </Link>

                            <Link onClick={() => setShowMenu(false)} href="/dashboard/settings" className=''>
                                <div className={pathname.includes("/dashboard/settings") ? "active-link" : "flex items-center pl-8 py-2"}>
                                    <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                        <Settings className='w-6 h-6 text-body-secondary'/>
                                    </div>
                                    <p className='ml-4 body text-title-active'>Settings</p>
                                </div>
                            </Link>
                        </div>   
                    </div>
                </div>
            </CSSTransition>
            <CSSTransition in={showMenu} timeout={200} classNames="menu-overlay" unmountOnExit>
                <div className='lg:hidden fixed top-0 left-0 h-full w-full z-30 bg-black opacity-25' onClick={() => setShowMenu(false)}></div>
            </CSSTransition>

            <div className='lg:block fixed z-10 hidden bg-background sidemenu h-full min-h-screen'>
                {/* desktop side menu */}
                <div className='pt-8 pl-8 flex items-center'>
                    <div className='h-10 w-10 rounded-full bg-line'></div>
                    <p className='ml-4 body-sm text-title-active'>{displayName}</p>
                </div>            

                <div className='mt-14'>
                    <Link href="/dashboard/overview" className=''>
                        <div className={pathname == "/dashboard/overview" ? "active-link" : "flex items-center pl-8 py-2"}>
                            <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                <Dashboard className='w-6 h-6 text-body-secondary'/>
                            </div>
                            <p className='ml-4 body text-title-active'>Overview</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/activities" className=''>
                        <div className={pathname.includes("/dashboard/activities") ? "active-link" : "flex items-center pl-8 py-2"}>
                            <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                <Activities className='w-6 h-6 text-body-secondary'/>
                            </div>
                            <p className='ml-4 body text-title-active'>Activities</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/wallets" className=''>
                        <div className={pathname.includes("/dashboard/wallets") ? "active-link" : "flex items-center pl-8 py-2"}>
                            <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                <Wallets className='w-6 h-6 text-body-secondary'/>
                            </div>
                            <p className='ml-4 body text-title-active'>Wallets</p>
                        </div>
                    </Link>
                    
                    <div className={pathname.includes("/dashboard/payments") ? "active-link" : "flex items-center pl-8 py-2"}>
                        <Link href="/dashboard/payments" className='flex items-center w-full'>
                            <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                <Payments className='w-6 h-6 text-body-secondary'/>
                            </div>
                            <p className='ml-4 body text-title-active'>Payments</p>
                        </Link>
                    </div>
                    {pathname.includes("/dashboard/payments") && (
                        <div className='flex flex-col pl-20 space-y-1 bg-white pb-2'>
                            <div className={pathname.includes("/dashboard/payments/billing-invoice") ? "active-sublink py-1 text-title-active" : "py-1 text-title-active"}>
                                <Link href="/dashboard/payments/billing-invoice">Billing/Invoice</Link>
                            </div>
                            <div className={pathname == "/dashboard/payments/pos" ? "active-sublink py-1 text-title-active" : "py-1 text-title-active"}>
                                <Link href="/dashboard/payments/pos">POS App</Link>
                            </div>
                            <div className={pathname.includes("/dashboard/payments/payment-buttons") ? "active-sublink py-1 text-title-active" : "py-1 text-title-active"}>
                                <Link href="/dashboard/payments/payment-buttons">Payment buttons</Link>
                            </div>
                            <div className={pathname.includes("/dashboard/payments/payouts") ? "active-sublink py-1 text-title-active" : "py-1 text-title-active"}>
                                <Link href="/dashboard/payments/payouts">Payouts</Link>
                            </div>
                        </div>
                    )}

                    <Link href="/dashboard/developers" className=''>
                        <div className={pathname == "/dashboard/developers" ? "active-link" : "flex items-center pl-8 py-2"}>
                            <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                <Developers className='w-6 h-6 text-body-secondary'/>
                            </div>
                            <p className='ml-4 body text-title-active'>Developers</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/settings" className=''>
                        <div className={pathname.includes("/dashboard/settings") ? "active-link" : "flex items-center pl-8 py-2"}>
                            <div className='bg-white rounded-full h-8 w-8 flex justify-center items-center'>
                                <Settings className='w-6 h-6 text-body-secondary'/>
                            </div>
                            <p className='ml-4 body text-title-active'>Settings</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
