'use client'
import SecondaryButton from '../../components/SecondaryButton';
import axios from 'axios';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ArrowDown from 'src/public/icons/arrow-down.svg'

export default function SettlementBillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [ibanSwift, setIbanSwift] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankAccountType, setBankAccountType] = useState('');
  const [settlementCurrency, setSettlementCurrency] = useState('');
  const [desiredSettlementCurrency, setDesiredSettlementCurrency] = useState('');

  const handleBankAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBankAccountName(event.target.value);
  };
  
  const handleBankNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBankName(event.target.value);
  };
  
  const handleIbanSwiftChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIbanSwift(event.target.value);
  };
  
  const handleRoutingNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoutingNumber(event.target.value);
  };
  
  const handleAccountNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNumber(event.target.value);
  };
  
  const handleBankAccountTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBankAccountType(event.target.value);
  };
  
  const handleSettlementCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSettlementCurrency(event.target.value);
  };
  
  const handleDesiredSettlementCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesiredSettlementCurrency(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = session?.token;

    try {
      const response = await axios.post(
        'https://api.ayce.express/user/profile/settlement/billing',
        {
          bank_account_name: bankAccountName,
          bank_name: bankName,
          iban_swift: ibanSwift,
          routing_number: routingNumber,
          account_number: accountNumber,
          bank_account_type: bankAccountType,
          settlement_currency: settlementCurrency,
          desired_settlement_currency: desiredSettlementCurrency
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      console.log(response);
      if (response) {
        router.push(`/onboard/business-rep`);
      } else {
        console.error;
      }
  
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='flex flex-col mt-32 pl-18 w-full sidemenu-margin text-title-active'>
        <h4 className='mb-6'>Settlement/Billing</h4>
        <form className='w-1/2' onSubmit={handleSubmit}>
          <div className='mb-6'>
            <p className='font-bold text-title-active mb-2'>Bank information</p>

            <label className='hidden'>Name on the bank account</label>
            <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                type="name"
                required
                placeholder="Name on the bank account"
                value={bankAccountName}
                onChange={handleBankAccountNameChange}
            />
            <label className='hidden'>Bank name</label>
            <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                type="name"
                required
                placeholder="Bank name"
                value={bankName}
                onChange={handleBankNameChange}
            />
            <label className='hidden'>IBAN number/Swift code</label>
            <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                type="name"
                required
                placeholder="IBAN number/Swift code"
                value={ibanSwift}
                onChange={handleIbanSwiftChange}
            />
            <label className='hidden'>Routing number</label>
            <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                type="name"
                required
                placeholder="Routing number"
                value={routingNumber}
                onChange={handleRoutingNumberChange}
            />
            <label className='hidden'>Account number</label>
            <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                type="name"
                required
                placeholder="Account number"
                value={accountNumber}
                onChange={handleAccountNumberChange}
            />

            <div className='mb-6'>
              <label className='hidden'>Bank account type</label>
              <div className='relative'>
              <select 
              name="country" 
              className='bg-background p-4 w-full body rounded-2xl text-title-active'
              value={bankAccountType}
              onChange={handleBankAccountTypeChange}
              >
              <option value="" disabled selected>Bank account type</option>
              <option value="checkings">checking</option>
              <option value="savings">savings</option>
              </select>
              <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
              </div>
            </div>

          </div>

          <div className='mb-4'>
            <p className='font-bold text-title-active mb-2'>Settlement currency</p>
            <label className='hidden'>Settlement currency</label>
            <div className='relative'>
            <select 
            name="country" 
            className='bg-background p-4 w-full body rounded-2xl text-title-active'
            value={settlementCurrency}
            onChange={handleSettlementCurrencyChange}
            >
            <option value="" disabled selected>Settlement currency</option>
            <option value="USD">USD</option>
            <option value="SGD">SGD</option>
            <option value="MYR">MYR</option>
            </select>
            <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
            </div>
          </div>

          <p className='body-sm text-body-primary mb-2'>Don&#8217;t see your currency? Tell us what currency you&#8217;re using and we&#8217;ll reach out when we expand.</p>

          <label className='hidden'>Settlement Currency</label>
            <input className='bg-background p-4 w-full body rounded-2xl mb-6'
                type="name"
                required
                placeholder="Settlement Currency"
                value={desiredSettlementCurrency}
                onChange={handleDesiredSettlementCurrencyChange}
            />
          <div className='body font-bold mb-26'>
            <SecondaryButton text='Continue'/>
          </div>
        </form>
    </div>
  )
}
