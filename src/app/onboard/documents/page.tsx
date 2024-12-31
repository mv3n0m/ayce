'use client'
import Image from 'next/image'
import Link from 'next/link';
import SideMenu from '../../components/SideMenu'
import Bitcoin from 'src/public/icons/bitcoin.svg'
import Usd from 'src/public/icons/usd.svg'
import SecondaryButton from '../../components/SecondaryButton';
import Upload from 'src/public/icons/upload.svg'
import Close from 'src/public/icons/close.svg'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DocumentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [govId, setGovId] = useState(null);
  const [proofOfBusiness, setProofOfBusiness] = useState(null);
  const [additionalDocuments, setAdditionalDocuments] = useState(null);

  const handleGovIdChange = (e) => {
    setGovId(e.target.files[0]);
  }
  
  const handleProofOfBusinessChange = (e) => {
    setProofOfBusiness(e.target.files[0]);
  }
  
  const handleAdditionalDocumentsChange = (e) => {
    setAdditionalDocuments(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('govId', govId);
    formData.append('proofOfBusiness', proofOfBusiness);
    formData.append('additionalDocuments', additionalDocuments);
  
    // Access the token from the session data
    const token = session?.token;
  
    try {
      const response = await axios.post(
        'https://api.ayce.express/user/profile/kyc/documents',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
            'Authorization': `Bearer ${token}`, 
          },
        }
      );
  
      console.log(response.data);
     
      

    } catch (error) {
      console.error(error);
      router.push(`/onboard/settlement-billing`);
    }
  }
  return (
    
    <div className='flex flex-col mt-32 pl-18 w-full sidemenu-margin'>
        <h4 className='mb-6'>Documents upload</h4>
        <form className='w-1/2' onSubmit={handleSubmit}>

          <div className='bg-background rounded-3xl w-full py-5 px-6 mb-2 document-upload-hover relative'>
            <div className='flex justify-between items-start'>
              <div className='flex flex-col'>
                <p className='body text-title-active'>Government issued ID</p>

                <div className='flex items-center'>
                <p className='body-xs text-body-primary max-w-fit'>DriverLicense_Front.png</p>
                <button>
                <Close className='text-primary-default h-4 w-4 ml-3'/>
                </button>
                </div>

                <div className='flex items-center'>
                <p className='body-xs text-body-primary max-w-fit'>DL_Back.png</p>
                <button>
                <Close className='text-primary-default h-4 w-4 ml-3'/>
                </button>
                </div>

              </div>
              <input 
              id='gov'
              type="file" 
              onChange={handleGovIdChange}
              className='hidden'
               />
              <label htmlFor="gov">
              <Upload className='text-primary-default cursor-pointer'/>
              </label>
            </div>
            <div className='document-upload-hover-message'>
              <p className='text-body-secondary body-xs'>Max file size: 4MB
                <br/> Allowed file types: JPEG, PNG</p>
            </div>
          </div>

          <div className='bg-background rounded-3xl w-full py-5 px-6 mb-2 document-upload-hover relative'>
            <div className='flex justify-between items-start'>
              <div className='flex flex-col'>
                <p className='body text-title-active'>Proof of busines</p>
                <p className='body-xs text-body-primary max-w-fit'>No file chosen</p>
              </div>
              <input 
              id='gov'
              type="file" 
              onChange={handleProofOfBusinessChange}
              className='hidden'
               />
              <label htmlFor="gov">
              <Upload className='text-primary-default cursor-pointer'/>
              </label>
            </div>
            <div className='document-upload-hover-message'>
              <p className='text-body-secondary body-xs'>Max file size: 4MB
                <br/> Allowed file types: JPEG, PNG</p>
            </div>
          </div>

          <div className='bg-background rounded-3xl w-full py-5 px-6 mb-6 document-upload-hover relative'>
            <div className='flex justify-between items-start'>
              <div className='flex flex-col'>
                <p className='body text-title-active'>Additional documents</p>
                <p className='body-xs text-body-primary max-w-fit'>No file chosen</p>
              </div>
              <input 
              id='gov'
              type="file" 
              onChange={handleAdditionalDocumentsChange}
              className='hidden'
               />
              <label htmlFor="gov">
              <Upload className='text-primary-default cursor-pointer'/>
              </label>
            </div>
            <div className='document-upload-hover-message'>
              <p className='text-body-secondary body-xs'>Max file size: 4MB
                <br/> Allowed file types: JPEG, PNG</p>
            </div>
          </div>


          <div className='body font-bold mb-6'>
            <SecondaryButton text='Continue'/>
          </div>

          <p className='body-sm mb-26 text-body-primary text-center'>Need help submitting documents? <br/> Visit our <span className='text-primary-default'><Link href=''>help center</Link></span>.</p>
        </form>
    </div>
  )
}
