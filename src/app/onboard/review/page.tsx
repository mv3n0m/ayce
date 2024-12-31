'use client'
import Image from 'next/image'
import Link from 'next/link';
import SideMenu from '../../components/SideMenu'
import Bitcoin from 'src/public/icons/bitcoin.svg'
import Usd from 'src/public/icons/usd.svg'
import SecondaryButton from '../../components/SecondaryButton';
import Add from 'src/public/icons/add.svg';
import Edit from 'src/public/icons/edit.svg';
import Trash from 'src/public/icons/trash.svg';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const { data: session, status } = useSession();
  const [address, setAddress] = useState('');
  const [legal_business_name, setLegalBusinessName] = useState('');
  const [business_number, setBusinessNumber] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [email_address, setEmailAddress] = useState('');
  const [authorized_person_name, setAuthorizedPersonName] = useState('');
  const [authorized_business_number, setAuthorizedBusinessNumber] = useState('');
  const [authorized_city, setAuthorizedCity] = useState('');
  const [authorized_dob, setAuthorizedDob] = useState('');
  const [authorized_nationality, setAuthorizedNationality] = useState('');
  const [authorized_state, setAuthorizedState] = useState('');
  const [authorized_zip, setAuthorizedZip] = useState('');
  const [authorized_address, setAuthorizedAddress] = useState('');
  const [owner1_address, setOwner1Address] = useState('');
  const [owner1_city, setOwner1City] = useState('');
  const [owner1_dob, setOwner1Dob] = useState('');
  const [owner1_gov_number, setOwner1GovNumber] = useState('');
  const [owner1_nationality, setOwner1Nationality] = useState('');
  const [owner1_ownership_percentage, setOwner1OwnershipPercentage] = useState('');
  const [owner1_state, setOwner1State] = useState('');
  const [owner1_zip, setOwner1Zip] = useState('');
  const [owner1_name, setOwner1Name] = useState('');


  useEffect(() => {
    const token = session?.token;
    axios.get('https://api.ayce.express/user/profile/business', {
      headers: {
        'Authorization': `Bearer ${token}`,
        // other headers as needed
      }
    })
    .then((response) => {
      console.log(response.data);
      setAddress(response.data.address);
      setLegalBusinessName(response.data.legal_business_name);
      setBusinessNumber(response.data.business_number);
      setPhoneNumber(response.data.phone_number);
      setEmailAddress(response.data.email_address);
      setAuthorizedPersonName(response.data.authorized_person_name);
      setAuthorizedBusinessNumber(response.data.authorized_business_number);
      setAuthorizedCity(response.data.authorized_city);
      setAuthorizedDob(response.data.authorized_dob);
      setAuthorizedNationality(response.data.authorized_nationality);
      setAuthorizedState(response.data.authorized_state);
      setAuthorizedZip(response.data.authorized_zip);
      setAuthorizedAddress(response.data.authorized_address);
      setOwner1Address(response.data.owner1_address);
      setOwner1City(response.data.owner1_city);
      setOwner1Dob(response.data.owner1_dob);
      setOwner1GovNumber(response.data.owner1_gov_number);
      setOwner1Nationality(response.data.owner1_nationality);
      setOwner1OwnershipPercentage(response.data.owner1_ownership_percentage);
      setOwner1State(response.data.owner1_state);
      setOwner1Zip(response.data.owner1_zip);
      setOwner1Name(response.data.owner1_name);
    })
    .catch((error) => {
      console.error(`There was an error retrieving the data: ${error}`);
    });
  }, [session?.token]);

  return (
    <div className='flex flex-col mt-32 pl-18 w-1/2 sidemenu-margin'>
        <h4 className='mb-2'>Summary</h4>
        <p className='mb-6 text-body-primary'>Please check all of the information below to make sure it&apos;s correct and make any necessary changes.</p>
        <p className='body-lg font-bold text-title-active'>About your business</p>

        <form >

          <div className='flex flex-col w-full border-b-2 border-line py-3'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Legal business name</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div>
              <p className='body-sm text-body-primary'>{legal_business_name}</p>
            </div>
          </div>

          <div className='flex flex-col w-full border-b-2 border-line py-3'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Business registration number</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div>
              <p className='body-sm text-body-primary'>{business_number}</p>
            </div>
          </div>

          <div className='flex flex-col w-full border-b-2 border-line py-3'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Contact information</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>{phone_number}</p>
              <p className='body-sm text-body-primary'>{email_address}</p>
            </div>
          </div>

          <div className='flex flex-col w-full border-b-2 border-line py-3 mb-8'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Business address</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>{address}</p>
            </div>
          </div>

          <p className='body-lg font-bold text-title-active'>Documents</p>

          <div className='flex flex-col w-full border-b-2 border-line py-3'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Government issued ID</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div>
              <p className='body-sm text-body-primary'>DriverLicense_front.png</p>
            </div>
          </div>

          <div className='flex flex-col w-full border-b-2 border-line py-3'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Proof of business</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div>
              <p className='body-sm text-body-primary'>Document name</p>
            </div>
          </div>

          <div className='flex flex-col w-full border-b-2 border-line py-3 mb-8'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Additional documents</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>document name</p>
            </div>
          </div>

          <p className='body-lg font-bold text-title-active'>Settlement/Billing</p>

          <div className='flex flex-col w-full border-b-2 border-line py-3'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Bank information</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>Name</p>
              <p className='body-sm text-body-primary'>Bank name</p>
              <p className='body-sm text-body-primary'>IBAN number/Swift code</p>
              <p className='body-sm text-body-primary'>Routing number</p>
              <p className='body-sm text-body-primary'>Account number</p>
              <p className='body-sm text-body-primary'>Bank account type</p>
            </div>
          </div>

          <div className='flex flex-col w-full border-b-2 border-line py-3 mb-8'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Settlement currency</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>USD</p>
            </div>
          </div>

          <p className='body-lg font-bold text-title-active'>Authorized representative</p>

          <div className='flex flex-col w-full border-b-2 border-line py-3'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Business representative</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>{authorized_person_name}</p>
              <p className='body-sm text-body-primary'>{authorized_dob}</p>
              <p className='body-sm text-body-primary'>{authorized_nationality}</p>
            </div>
          </div>

          <div className='flex flex-col w-full border-b-2 border-line py-3'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Business address</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>{authorized_address}</p>
              <p className='body-sm text-body-primary'>{authorized_city}, {authorized_state}, {authorized_zip}</p>
              <p className='body-sm text-body-primary'>Country</p>
            </div>
          </div>

          <div className='flex flex-col w-full border-b-2 border-line py-3 mb-8'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>ID number</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>{authorized_business_number}</p>
            </div>
          </div>

          <p className='body-lg font-bold text-title-active'>Beneficial owner</p>

          <div className='flex flex-col w-full border-b-2 border-line py-3'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Owner information</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>{owner1_name}</p>
              <p className='body-sm text-body-primary'>{owner1_dob}</p>
              <p className='body-sm text-body-primary'>{owner1_nationality}</p>
              <p className='body-sm text-body-primary'>Ownership percentage {owner1_ownership_percentage}</p>
            </div>
          </div>

          <div className='flex flex-col w-full border-b-2 border-line py-3'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>Home address</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>{owner1_address}</p>
              <p className='body-sm text-body-primary'>{owner1_city}, {owner1_state}, {owner1_zip}</p>
              <p className='body-sm text-body-primary'>{owner1_nationality}</p>
            </div>
          </div>

          <div className='flex flex-col w-full border-b-2 border-line py-3 mb-8'>
            <div className='flex justify-between items-center'>
              <p className='body font-bold text-title-active'>ID number</p>
              <button>
              <Edit className='text-primary-default h-5 w-5 ml-auto' />
              </button>
            </div>
            {/* placeholder */}
            <div className='flex flex-col'>
              <p className='body-sm text-body-primary'>{owner1_gov_number}</p>
            </div>
          </div>

          <div className='mb-8 flex items-start justify-start'>
          <input type="checkbox" className='check h-full' id='myCheckbox' />
          <label className='terms' htmlFor="myCheckbox"></label>
          <p className='meta text-body-secondary'>By clicking below, you acknowledge that you have read, understood, and agree to be bound by the provisions of this application, including the Terms and Conditions and Resolutions for this Account following this section, and that you certify all items that apply to your type of entity and registration are true; that all information provided on this application is true, accurate, and complete; that you make all authorizations indicated; and you affirm that you are authorized to make those representations.</p>

          </div>

          <div className='body font-bold mb-6'>
          {/* <SecondaryButton text='Submit'/> */}
          <Link href="/dashboard/overview" className='bg-primary-default font-bold text-white py-2 px-6 w-full flex justify-center noshadow-button'>Submit</Link>
        </div>


        </form>

    </div>
  )
}
