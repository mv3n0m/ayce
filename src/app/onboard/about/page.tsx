"use client"
import SecondaryButton from '../../components/SecondaryButton';
import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ArrowDown from 'src/public/icons/arrow-down.svg'

function AboutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [businessLocation, setBusinessLocation] = useState('US');
  const [businessType, setBusinessType] = useState('sole');
  const [legalBusinessName, setLegalBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [website, setWebsite] = useState('');
  const [productServices, setProductServices] = useState('');
  const [monthlyVolume, setMonthlyVolume] = useState('');
  const [averageTransactionSize, setAverageTransactionSize] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBusinessLocation(event.target.value);
  };

  const handleBusinessTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBusinessType(event.target.value);
  };

  const handleLegalBusinessNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLegalBusinessName(event.target.value);
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value);
  };

  const handleEmailAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailAddress(event.target.value);
  };

  const handleAddressLine1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressLine1(event.target.value);
  };
  
  const handleAddressLine2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddressLine2(event.target.value);
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setState(event.target.value);
  };

  const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZip(event.target.value);
  };

  const handleWebsiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(event.target.value);
  };

  const handleProductServicesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductServices(event.target.value);
  };

  const handleMonthlyVolumeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMonthlyVolume(event.target.value);
  };
  
  const handleAverageTransactionSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAverageTransactionSize(event.target.value);
  };

  const handleBusinessNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessNumber(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const address = `${addressLine1}, ${addressLine2}`; // concatenates the two address lines
    const token = session?.token;

    try {
      const response = await axios.post(
        'https://api.ayce.express/user/profile/business',
        {
          business_location: businessLocation,
          type_of_ownership: businessType,
          legal_business_name: legalBusinessName,
          phone_number: phoneNumber,
          email_address: emailAddress,
          address: address,
          city: city,
          state: state,
          zip: zip,
          website: website,
          product_services: productServices,
          monthly_volume: monthlyVolume,
          average_transaction_size: averageTransactionSize,
          business_number: businessNumber
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.message.includes("Kyc details add")) {
        router.push(`/onboard/documents`);
      } else {
        console.error;
      }
  
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='flex flex-col mt-32 pl-18 w-full sidemenu-margin text-title-active'>
        <h4 className='mb-6'>About your business</h4>
        <form className='w-1/2' onSubmit={handleSubmit}>

          <div className='mb-6'>
            <p className='font-bold text-title-active mb-2'>Business location</p>
            <div className='relative'>
            <select 
            name="businessLocation" 
            className='bg-background p-4 w-full body rounded-2xl mb-2 text-title-active'
            value={businessLocation}
            onChange={handleLocationChange}
            >
              <option value="US">United States</option>
              <option value="MY">Malaysia</option>
              <option value="SG">Singapore</option>
              <option value="ID">Indonesia</option>
              <option value="TH">Thailand</option>
              <option value="PH">Philippines</option>
              <option value="AU">Australia</option>
              <option value="NZ">New Zealand</option>
              <option value="MO">Macau</option>
              <option value="VN">Vietnam</option>
              <option value="HK">Hong Kong</option>
            </select>
            <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
            </div>
          </div>

          {businessLocation === 'US' && (
          <div className='mb-6'>
            <p className='font-bold text-title-active mb-2'>Type of ownership</p>
            <label className='hidden'>Type of ownership</label>
            <div className='relative'>
            <select 
            name="businessLocation" 
            className='bg-background p-4 w-full body rounded-2xl mb-2 text-title-active'
            value={businessType}
            onChange={handleBusinessTypeChange}
            >
              <option value="sole">Sole proprietorship</option>
              <option value="company-single-member-llc">Single-member LLC</option>
              <option value="company-multi-member-llc">Multi-member LLC</option>
              <option value="company-private-partnership">Private partnership</option>
              <option value="company-private-corporation">Private corporation</option>
            </select>
            <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
            </div>
          </div>
          )}

          {businessLocation === 'MY' && (
          <div className='mb-6'>
            <p className='font-bold text-title-active mb-2'>Type of ownership</p>
            <label className='hidden'>Type of ownership</label>
            <div className='relative'>
            <select 
            name="businessType" 
            className='bg-background p-4 w-full body rounded-2xl mb-2'
            value={businessType}
            onChange={handleBusinessTypeChange}
            >
              <option value="sole">Sole proprietorship</option>
              <option value="company-corporation">Corporation (Bhd / Sdn Bhd)</option>
              <option value="company-nonprofit-organization">Nonprofit organization</option>
              <option value="company-partnership">Partnership</option>
            </select>
            <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
            </div>
          </div>
          )}

          {businessLocation === 'SG' && (
          <div className='mb-6'>
            <p className='font-bold text-title-active mb-2'>Type of ownership</p>
            <label className='hidden'>Type of ownership</label>
            <div className='relative'>
            <select 
            name="businessType" 
            className='bg-background p-4 w-full body rounded-2xl mb-2 text-title-active'
            value={businessType}
            onChange={handleBusinessTypeChange}
            >
              <option value="sole">Sole proprietorship</option>
              <option value="company">Company</option>
              <option value="company-partnership">Partnership</option>
              <option value="company-charity">Charity, non-profit, club, society or other unincorporated entity</option>
            </select>
            <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
            </div>
          </div>
          )}

          {
            ['ID', 'TH', 'PH', 'AU', 'NZ', 'MO', 'VN', 'HK'].includes(businessLocation) && (
              <div className='mb-6'>
                <p className='font-bold text-title-active mb-2'>Type of ownership</p>
                <label className='hidden'>Type of ownership</label>
                <div className='relative'>
                <select 
                name="typeOfOwnership" 
                className='bg-background p-4 w-full body rounded-2xl mb-2 text-title-active'
                value={businessType}
                onChange={handleBusinessTypeChange}
                >
                  <option value="sole">Sole proprietorship</option>
                  <option value="company">Company</option>
                  <option value="company-corporation">Corporation</option>
                  <option value="company-nonprofit-organization">Nonprofit organization</option>
                  <option value="company-partnership">Partnership</option>
                </select>
                 <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
                </div>
              </div>
            )
          }

          <div className='mb-6'>
            <label className='hidden'>Legal business name</label>
            <p className='font-bold text-title-active mb-2'>Legal business name</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="Business/Person legal name"
                value={legalBusinessName}
                onChange={handleLegalBusinessNameChange}
            />
          </div>

          <div className='mb-6'>
            <label className='hidden'>Phone number</label>
            <p className='font-bold text-title-active mb-2'>Contact information</p>
            <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                type="name"
                required
                placeholder="Phone number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
            />
          </div>

          <div className='mb-6'>
            <label className='hidden'>Email address</label>
            <p className='font-bold text-title-active mb-2'>Email address</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="Email address"
                value={emailAddress}
                onChange={handleEmailAddressChange}
            />
          </div>

          <div className='mb-6'>
          <p className='font-bold text-title-active mb-2'>Business address</p>
            <label className='hidden'>Address line 1</label>
            <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                type="name"
                required
                placeholder="Address line 1"
                value={addressLine1}
                onChange={handleAddressLine1Change}
            />
            <label className='hidden'>address line 2</label>
            <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                type="name"
                required
                placeholder="Address line 2"
                value={addressLine2}
                onChange={handleAddressLine2Change}
            />

            { (businessLocation === 'SG' || businessLocation === 'MO' || businessLocation === 'HK') && (
              <>
                <label className='hidden'>postcode</label>
                <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                    type="name"
                    required
                    placeholder="Postal code"
                    value={zip}
                    onChange={handleZipChange}
                />
              </>
            )}

            {businessLocation !== 'SG' && businessLocation !== 'MO' && businessLocation !== 'HK' && (
              <>
                <label className='hidden'>city</label>
                <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                    type="name"
                    required
                    placeholder="City"
                    value={city}
                    onChange={handleCityChange}
                />
              </>
            )}

            {businessLocation === 'US' && (
            <div className='flex gap-x-2'>
              <select 
                required 
                name="stateUS" 
                className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                value={state}
                onChange={handleStateChange}
              >
                <option value="" disabled>State</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>

              <label className='hidden'>zipcode</label>
              <input className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                  type="name"
                  required
                  placeholder="Zipcode"
                  value={zip}
                  onChange={handleZipChange}
              />
            </div>
            )}

            {businessLocation === 'ID' && (
              <div className='flex gap-x-2'>
                <select 
                required 
                name="provinceID" 
                className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                value={state}
                onChange={handleStateChange}
                >
                <option value="" disabled>Province</option>
                <option value="AC">Aceh</option>
                <option value="BA">Bali</option>
                <option value="BB">Bangka Belitung</option>
                <option value="BT">Banten</option>
                <option value="BE">Bengkulu</option>
                <option value="YO">Yogyakarta</option>
                <option value="JK">Jakarta</option>
                <option value="JA">Jambi</option>
                <option value="JB">West Java</option>
                <option value="JI">East Java</option>
                <option value="KS">South Kalimantan</option>
                <option value="KT">Central Kalimantan</option>
                <option value="KI">East Kalimantan</option>
                <option value="KU">North Kalimantan</option>
                <option value="KB">West Kalimantan</option>
                <option value="LA">Lampung</option>
                <option value="MA">Maluku</option>
                <option value="MU">North Maluku</option>
                <option value="NB">West Nusa Tenggara</option>
                <option value="NT">East Nusa Tenggara</option>
                <option value="PA">Papua</option>
                <option value="PB">West Papua</option>
                <option value="RI">Riau</option>
                <option value="KR">Riau Islands</option>
                <option value="SR">West Sulawesi</option>
                <option value="SN">South Sulawesi</option>
                <option value="ST">Central Sulawesi</option>
                <option value="SG">Southeast Sulawesi</option>
                <option value="SA">North Sulawesi</option>
                <option value="SS">South Sumatra</option>
                <option value="SU">North Sumatra</option>
                <option value="SB">West Sumatra</option>
                <option value="SL">Central Java</option>
                <option value="GO">Gorontalo</option>
                </select>

                <label className='hidden'>Postcode</label>
                <input className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                type="name"
                required
                placeholder="Postal code"
                value={zip}
                onChange={handleZipChange}
                
                />
              </div>
            )}

            {businessLocation === 'MY' && (
            <div className='flex gap-x-2'>
              <select 
              required 
              name="stateMY" 
              className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
              value={state}
              onChange={handleStateChange}
              >
                <option value="" disabled>State/territories</option>
                <option value="JHR">Johor</option>
                <option value="KDH">Kehah</option>
                <option value="KTN">Kelantan</option>
                <option value="MLK">Malacca</option>
                <option value="NSN">Negeri Sembilan</option>
                <option value="PHG">Pahang</option>
                <option value="PNG">Penang</option>
                <option value="PRK">Perak</option>
                <option value="PLS">Perlis</option>
                <option value="SBH">Sabah</option>
                <option value="SWK">Sarawak</option>
                <option value="SGR">Selangor</option>
                <option value="TRG">Terengganu</option>
                <option value="KUL">Kuala Lumpur</option>
                <option value="LBN">Labuan</option>
                <option value="PJY">Putrajaya</option>
              </select>

              <label className='hidden'>zipcode</label>
              <input className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                  type="name"
                  required
                  placeholder="Postal code"
                  value={zip}
                  onChange={handleZipChange}
              />
            </div>
            )}

            {businessLocation === 'TH' && (
            <div className='flex gap-x-2'>
              <select 
                required 
                name="provinceTH" 
                className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                value={state}
                onChange={handleStateChange}
              >
                <option value="" disabled>Province</option>
                <option value="TH-37">Amnat Charoen</option>
                <option value="TH-15">Ang Thong</option>
                <option value="TH-14">Ayutthaya</option>
                <option value="TH-10">Bangkok</option>
                <option value="TH-38">Bueng Kan</option>
                <option value="TH-31">Buri Ram</option>
                <option value="TH-24">Chachoengsao</option>
                <option value="TH-18">Chai Nat</option>
                <option value="TH-36">Chaiyaphum</option>
                <option value="TH-22">Chanthaburi</option>
                <option value="TH-50">Chiang Mai</option>
                <option value="TH-57">Chiang Rai</option>
                <option value="TH-20">Chonburi</option>
                <option value="TH-86">Chumphon</option>
                <option value="TH-46">Kalasin</option>
                <option value="TH-62">Kamphaeng Phet</option>
                <option value="TH-71">Kanchanaburi</option>
                <option value="TH-40">Khon Kaen</option>
                <option value="TH-81">Krabi</option>
                <option value="TH-52">Lampang</option>
                <option value="TH-51">Lamphun</option>
                <option value="TH-42">Loei</option>
                <option value="TH-16">Lopburi</option>
                <option value="TH-58">Mae Hong Son</option>
                <option value="TH-44">Maha Sarakham</option>
                <option value="TH-49">Mukdahan</option>
                <option value="TH-26">Nakhon Nayok</option>
                <option value="TH-73">Nakhon Pathom</option>
                <option value="TH-48">Nakhon Phanom</option>
                <option value="TH-30">Nakhon Ratchasima</option>
                <option value="TH-60">Nakhon Sawan</option>
                <option value="TH-80">Nakhon Si Thammarat</option>
                <option value="TH-55">Nan</option>
                <option value="TH-96">Narathiwat</option>
                <option value="TH-39">Nong Bua Lamphu</option>
                <option value="TH-43">Nong Khai</option>
                <option value="TH-12">Nonthaburi</option>
                <option value="TH-13">Pathum Thani</option>
                <option value="TH-94">Pattani</option>
                <option value="TH-82">Phang Nga</option>
                <option value="TH-93">Phatthalung</option>
                <option value="TH-56">Phayao</option>
                <option value="TH-67">Phetchabun</option>
                <option value="TH-76">Phetchaburi</option>
                <option value="TH-66">Phichit</option>
                <option value="TH-65">Phitsanulok</option>
                <option value="TH-54">Phrae</option>
                <option value="TH-83">Phuket</option>
                <option value="TH-25">Prachinburi</option>
                <option value="TH-77">Prachuap Khiri Khan</option>
                <option value="TH-85">Ranong</option>
                <option value="TH-70">Ratchaburi</option>
                <option value="TH-21">Rayong</option>
                <option value="TH-45">Roi Et</option>
                <option value="TH-27">Sa Kaeo</option>
                <option value="TH-47">Sakon Nakhon</option>
                <option value="TH-11">Samut Prakan</option>
                <option value="TH-74">Samut Sakhon</option>
                <option value="TH-75">Samut Songkhram</option>
                <option value="TH-19">Saraburi</option>
                <option value="TH-91">Satun</option>
                <option value="TH-33">Si Sa Ket</option>
                <option value="TH-17">Sing Buri</option>
                <option value="TH-90">Songkhla</option>
                <option value="TH-64">Sukhothai</option>
                <option value="TH-72">Suphan Buri</option>
                <option value="TH-84">Surat Thani</option>
                <option value="TH-32">Surin</option>
                <option value="TH-63">Tak</option>
                <option value="TH-92">Trang</option>
                <option value="TH-23">Trat</option>
                <option value="TH-34">Ubon Ratchathani</option>
                <option value="TH-41">Udon Thani</option>
                <option value="TH-61">Uthai Thani</option>
                <option value="TH-53">Uttaradit</option>
                <option value="TH-95">Yala</option>
                <option value="TH-35">Yasothon</option>
              </select>

              <label className='hidden'>Postcode</label>
              <input className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                  type="name"
                  required
                  placeholder="Postal code"
                  value={zip}
                  onChange={handleZipChange}
              />
            </div>
            )}

            {businessLocation === 'PH' && (
              <div className='flex gap-x-2'>
                <select 
                  required 
                  name="provincePH" 
                  className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                  value={state}
                  onChange={handleStateChange}
                >
                  <option value="" disabled>Province</option>
                  <option value="ABR">Abra</option>
                  <option value="AGN">Agusan del Norte</option>
                  <option value="AGS">Agusan del Sur</option>
                  <option value="AKL">Aklan</option>
                  <option value="ALB">Albay</option>
                  <option value="ANT">Antique</option>
                  <option value="APA">Apayao</option>
                  <option value="AUR">Aurora</option>
                  <option value="BAN">Bataan</option>
                  <option value="BTN">Batanes</option>
                  <option value="BTG">Batangas</option>
                  <option value="BEN">Benguet</option>
                  <option value="BIL">Biliran</option>
                  <option value="BOH">Bohol</option>
                  <option value="BUK">Bukidnon</option>
                  <option value="BUL">Bulacan</option>
                  <option value="CAG">Cagayan</option>
                  <option value="CAN">Camarines Norte</option>
                  <option value="CAS">Camarines Sur</option>
                  <option value="CAM">Camiguin</option>
                  <option value="CAP">Capiz</option>
                  <option value="CAT">Catanduanes</option>
                  <option value="CAV">Cavite</option>
                  <option value="CEB">Cebu</option>
                  <option value="COM">Compostela Valley</option>
                  <option value="NCO">Cotabato</option>
                  <option value="DAV">Davao del Norte</option>
                  <option value="DAS">Davao del Sur</option>
                  <option value="DAC">Davao Occidental</option>
                  <option value="DAO">Davao Oriental</option>
                  <option value="DIN">Dinagat Islands</option>
                  <option value="EAS">Eastern Samar</option>
                  <option value="GUI">Guimaras</option>
                  <option value="IFU">Ifugao</option>
                  <option value="ILN">Ilocos Norte</option>
                  <option value="ILS">Ilocos Sur</option>
                  <option value="ILI">Iloilo</option>
                  <option value="ISA">Isabela</option>
                  <option value="KAL">Kalinga</option>
                  <option value="LUN">La Union</option>
                  <option value="LAG">Laguna</option>
                  <option value="LAN">Lanao del Norte</option>
                  <option value="LAS">Lanao del Sur</option>
                  <option value="LEY">Leyte</option>
                  <option value="MAG">Maguindanao</option>
                  <option value="MAD">Marinduque</option>
                  <option value="MAS">Masbate</option>
                  <option value="MSC">Misamis Occidental</option>
                  <option value="MSR">Misamis Oriental</option>
                  <option value="MOU">Mountain Province</option>
                  <option value="NEC">Negros Occidental</option>
                  <option value="NER">Negros Oriental</option>
                  <option value="NSA">Northern Samar</option>
                  <option value="NUE">Nueva Ecija</option>
                  <option value="NUV">Nueva Vizcaya</option>
                  <option value="MDC">Occidental Mindoro</option>
                  <option value="MDR">Oriental Mindoro</option>
                  <option value="PLW">Palawan</option>
                  <option value="PAM">Pampanga</option>
                  <option value="PAN">Pangasinan</option>
                  <option value="QUE">Quezon</option>
                  <option value="QUI">Quirino</option>
                  <option value="RIZ">Rizal</option>
                  <option value="ROM">Romblon</option>
                  <option value="WSA">Samar</option>
                  <option value="SAR">Sarangani</option>
                  <option value="SIQ">Siquijor</option>
                  <option value="SOR">Sorsogon</option>
                  <option value="SCO">South Cotabato</option>
                  <option value="SLE">Southern Leyte</option>
                  <option value="SUK">Sultan Kudarat</option>
                  <option value="SLU">Sulu</option>
                  <option value="SUN">Surigao del Norte</option>
                  <option value="SUR">Surigao del Sur</option>
                  <option value="TAR">Tarlac</option>
                  <option value="TAW">Tawi-Tawi</option>
                  <option value="ZMB">Zambales</option>
                  <option value="ZAN">Zamboanga del Norte</option>
                  <option value="ZAS">Zamboanga del Sur</option>
                  <option value="ZSI">Zamboanga Sibugay</option>
                </select>

                <label className='hidden'>postcode</label>
                <input className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                    type="name"
                    required
                    placeholder="Postal code"
                    value={zip}
                    onChange={handleZipChange}
                />
              </div>
            )}

            {businessLocation === 'AU' && (
              <div className='flex gap-x-2'>
                <select 
                  required 
                  name="stateAU" 
                  className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                  value={state}
                  onChange={handleStateChange}
                >
                  <option value="" disabled>State/Territory</option>
                  <option value="ACT">Australian Capital Territory</option>
                  <option value="NSW">New South Wales</option>
                  <option value="NT">Northern Territory</option>
                  <option value="QLD">Queensland</option>
                  <option value="SA">South Australia</option>
                  <option value="TAS">Tasmania</option>
                  <option value="VIC">Victoria</option>
                  <option value="WA">Western Australia</option>
                </select>

                <label className='hidden'>Postcode</label>
                <input className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                    type="name"
                    required
                    placeholder="Postal code"
                    value={zip}
                    onChange={handleZipChange}
                />
              </div>
            )}

            {businessLocation === 'NZ' && (
              <div className='flex gap-x-2'>
                <select 
                  required 
                  name="regionNZ" 
                  className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                  value={state}
                  onChange={handleStateChange}
                >
                  <option value="" disabled>Region</option>
                  <option value="NTL">Northland</option>
                  <option value="AKL">Auckland</option>
                  <option value="WKO">Waikato</option>
                  <option value="BOP">Bay of Plenty</option>
                  <option value="GIS">Gisborne</option>
                  <option value="HKB">Hawke&apos;s Bay</option>
                  <option value="TKI">Taranaki</option>
                  <option value="MWT">Manawatu-Whanganui</option>
                  <option value="WGN">Wellington</option>
                  <option value="TAS">Tasman</option>
                  <option value="NSN">Nelson</option>
                  <option value="MBH">Marlborough</option>
                  <option value="WTC">West Coast</option>
                  <option value="CAN">Canterbury</option>
                  <option value="OTA">Otago</option>
                  <option value="STL">Southland</option>
                  <option value="CHT">Chatham Islands</option>
                </select>

                <label className='hidden'>Postcode</label>
                <input className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                    type="name"
                    required
                    placeholder="Postal code"
                    value={zip}
                    onChange={handleZipChange}
                />
              </div>
            )}

            {businessLocation === 'VN' && (
              <div className='flex gap-x-2'>
                <select 
                  required 
                  name="provinceVN" 
                  className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                  value={state}
                  onChange={handleStateChange}
                >
                  <option value="" disabled>Province</option>
                  <option value="HN">Hà Nội</option>
                  <option value="HP">Hải Phòng</option>
                  <option value="DDN">Đà Nẵng</option>
                  <option value="HCM">Hồ Chí Minh City</option>
                  <option value="AC">An Giang</option>
                  <option value="BRV">Bà Rịa - Vũng Tàu</option>
                  <option value="BKH">Bắc Kạn</option>
                  <option value="BGI">Bắc Giang</option>
                  <option value="BNH">Bắc Ninh</option>
                  <option value="BDH">Bình Định</option>
                  <option value="BPC">Bình Phước</option>
                  <option value="BTN">Bình Thuận</option>
                  <option value="BLU">Bạc Liêu</option>
                  <option value="CBG">Cao Bằng</option>
                  <option value="CMU">Cà Mau</option>
                  <option value="DLK">Đắk Lắk</option>
                  <option value="DKN">Đắk Nông</option>
                  <option value="DBN">Điện Biên</option>
                  <option value="DNG">Đồng Nai</option>
                  <option value="DTP">Đồng Tháp</option>
                  <option value="GLI">Gia Lai</option>
                  <option value="HGG">Hà Giang</option>
                  <option value="HTH">Hà Tĩnh</option>
                  <option value="HDG">Hải Dương</option>
                  <option value="HUG">Hậu Giang</option>
                  <option value="HBH">Hòa Bình</option>
                  <option value="HYD">Hưng Yên</option>
                  <option value="KHM">Khánh Hòa</option>
                  <option value="KGG">Kiên Giang</option>
                  <option value="KTU">Kon Tum</option>
                  <option value="LDO">Lào Cai</option>
                  <option value="LAI">Lai Châu</option>
                  <option value="LSO">Lạng Sơn</option>
                  <option value="LCA">Long An</option>
                  <option value="NDH">Nam Định</option>
                  <option value="NBH">Ninh Bình</option>
                  <option value="NTH">Ninh Thuận</option>
                  <option value="PTO">Phú Thọ</option>
                  <option value="PYE">Phú Yên</option>
                  <option value="QBI">Quảng Bình</option>
                  <option value="QNI">Quảng Ninh</option>
                  <option value="QNG">Quảng Ngãi</option>
                  <option value="QNA">Quảng Nam</option>
                  <option value="SLA">Sóc Trăng</option>
                  <option value="SNO">Sơn La</option>
                  <option value="TTH">Thừa Thiên Huế</option>
                  <option value="TVI">Tiền Giang</option>
                  <option value="TQG">Trà Vinh</option>
                  <option value="TBH">Tuyên Quang</option>
                  <option value="TVH">Vĩnh Long</option>
                  <option value="VPH">Vĩnh Phúc</option>
                  <option value="YBI">Yên Bái</option>
                </select>

                <label className='hidden'>Postcode</label>
                <input className='bg-background p-4 w-1/2 body rounded-2xl mb-2'
                    type="name"
                    required
                    placeholder="Postal code"
                    value={zip}
                    onChange={handleZipChange}
                />
              </div>
            )}

          </div>

          <div className='mb-6'>
          <p className='font-bold text-title-active mb-2'>Other</p>
            <label className='hidden'>Website address (URL)</label>
            <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                type="name"
                required
                placeholder="Website address (URL)"
                value={website}
                onChange={handleWebsiteChange}
            />
            <label className='hidden'>Product and services</label>
            <input className='bg-background p-4 w-full body rounded-2xl mb-2'
                type="name"
                required
                placeholder="Product and services"
                value={productServices}
                onChange={handleProductServicesChange}
            />

            <label className='hidden'>Estimated monthly processing volume</label>
            <div className='relative'>
            <select 
            name="monthlyVolume" 
            className='bg-background p-4 w-full body rounded-2xl mb-2 text-title-active'
            value={monthlyVolume}
            onChange={handleMonthlyVolumeChange}
            >
              <option value="" className=''>Estimated monthly processing volume</option>
              <option value="1k">$1000</option>
              <option value="10k">$100,00</option>
              <option value="100k">$100,000</option>
              <option value="1m">$100,0000</option>
            </select>
            <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
            </div>

            <label className='hidden'>Average transaction size</label>
            <div className='relative'>
            <select 
            name="averageTransactionSize" 
            className='bg-background p-4 w-full body rounded-2xl mb-2 text-title-active'
            value={averageTransactionSize}
            onChange={handleAverageTransactionSizeChange}
            >
              <option value="">Average transaction size</option>
              <option value="1k">$1000</option>
              <option value="10k">$10,000</option>
              <option value="100k">$100,000</option>
              <option value="1m">$1000,000</option>
            </select>
            <ArrowDown className='h-6 w-6 text-title-active absolute right-4 top-4'></ArrowDown>
            </div>
          </div>

          {businessLocation === 'US' && businessType.includes('company') && (
            <div className='mb-6'>
              <label className='hidden'>Employer identification number (EIN)</label>
              <p className='font-bold text-title-active mb-2'>Employer identification number (EIN)</p>
              <input
                className='bg-background p-4 w-full body rounded-2xl'
                type='name'
                required
                placeholder='12-3456789'
                value={businessNumber}
                onChange={handleBusinessNumberChange}
              />
            </div>
          )}

          {businessLocation === 'US' && businessType === 'sole' && (
            <div className='mb-6'>
              <label className='hidden'>Social security number (SSN)</label>
              <p className='font-bold text-title-active mb-2'>Social security number (SSN)</p>
              <input
                className='bg-background p-4 w-full body rounded-2xl'
                type='name'
                required
                placeholder='123-45-6789'
                value={businessNumber}
                onChange={handleBusinessNumberChange}
              />
            </div>
          )}

          {businessLocation === 'MY' && businessType.includes('company') && (
          <div className='mb-6'>
            <label className='hidden'>Company number (MyCoID) </label>
            <p className='font-bold text-title-active mb-2'>BCompany number (MyCoID) </p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456-A"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'MY' && businessType === 'sole' && (
          <div className='mb-6'>
            <label className='hidden'>IC Number (MyKad)</label>
            <p className='font-bold text-title-active mb-2'>IC Number (MyKad)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="000101-12-3456"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'SG' && businessType === 'sole' && (
          <div className='mb-6'>
            <label className='hidden'>NRIC or FIN</label>
            <p className='font-bold text-title-active mb-2'>UNRIC or FIN</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="S1234567A"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'SG' && businessType.includes('company') && (
          <div className='mb-6'>
            <label className='hidden'>Unique Entity Number (UEN) </label>
            <p className='font-bold text-title-active mb-2'>Unique Entity Number (UEN) </p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="12345678A"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'ID' && businessType.includes('company') && (
          <div className='mb-6'>
            <label className='hidden'>Business Registration Number (NIB)</label>
            <p className='font-bold text-title-active mb-2'>Business Registration Number (NIB)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456789ABCD"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'ID' && businessType === 'sole' && (
          <div className='mb-6'>
            <label className='hidden'>NPWP or KTP</label>
            <p className='font-bold text-title-active mb-2'>NPWP or KTP</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456789ABCDEF"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'AU' && businessType.includes('company') && (
          <div className='mb-6'>
            <label className='hidden'>ABN or ACN</label>
            <p className='font-bold text-title-active mb-2'>ABN or ACN</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="12-345-678-901"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'AU' && businessType === 'sole' && (
          <div className='mb-6'>
            <label className='hidden'>Tax File Number (TFN)</label>
            <p className='font-bold text-title-active mb-2'>Tax File Number (TFN)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456789"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'TH' && businessType.includes('company') && (
          <div className='mb-6'>
            <label className='hidden'>Tax Identification Number (TIN)</label>
            <p className='font-bold text-title-active mb-2'>Tax Identification Number (TIN)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456789012"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'TH' && businessType === 'sole' && (
          <div className='mb-6'>
            <label className='hidden'>National Identification Number (NID)</label>
            <p className='font-bold text-title-active mb-2'>National Identification Number (NID)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456789012"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'HK' && businessType === 'sole' && (
          <div className='mb-6'>
            <label className='hidden'>IC Number (MyKad)</label>
            <p className='font-bold text-title-active mb-2'>IC Number (MyKad)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456789012"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'HK' && businessType.includes('company') && (
          <div className='mb-6'>
            <label className='hidden'>Business Registration Number (BRN)</label>
            <p className='font-bold text-title-active mb-2'>Business Registration Number (BRN)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="1234-56-78-9"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'MO' && businessType.includes('company') && (
          <div className='mb-6'>
            <label className='hidden'>Tax Identification Number (TIN)</label>
            <p className='font-bold text-title-active mb-2'>Tax Identification Number (TIN)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'MO' && businessType === 'sole' && (
          <div className='mb-6'>
            <label className='hidden'>Resident Identity Card Number (BIR)</label>
            <p className='font-bold text-title-active mb-2'>Resident Identity Card Number (BIR)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="12345678"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'VN' && businessType.includes('company') && (
          <div className='mb-6'>
            <label className='hidden'>Enterprise Code Number</label>
            <p className='font-bold text-title-active mb-2'>Enterprise Code Number</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="1234567890"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'VN' && businessType === 'sole' && (
          <div className='mb-6'>
            <label className='hidden'>National Citizen Identity Card Number</label>
            <p className='font-bold text-title-active mb-2'>National Citizen Identity Card Number</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456789012"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'NZ' && businessType.includes('company') && (
          <div className='mb-6'>
            <label className='hidden'>New Zealand Business Number (NZBN)</label>
            <p className='font-bold text-title-active mb-2'>New Zealand Business Number (NZBN)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="1234567890123"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'NZ' && businessType === 'sole' && (
          <div className='mb-6'>
            <label className='hidden'>Inland Revenue Department Number (IRD Number)</label>
            <p className='font-bold text-title-active mb-2'>Inland Revenue Department Number (IRD Number)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456789"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'PH' && businessType.includes('company') && (
          <div className='mb-6'>
            <label className='hidden'>Philippines Business Number</label>
            <p className='font-bold text-title-active mb-2'>Philippines Business Number</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="1234567890"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          {businessLocation === 'PH' && businessType === 'sole' && (
          <div className='mb-6'>
            <label className='hidden'>Philippine Identification System ID (PhilSys ID)</label>
            <p className='font-bold text-title-active mb-2'>Philippine Identification System ID (PhilSys ID)</p>
            <input className='bg-background p-4 w-full body rounded-2xl'
                type="name"
                required
                placeholder="123456789012"
                value={businessNumber}
                onChange={handleBusinessNumberChange}
            />
          </div>
          )}

          <div className='body font-bold mb-26'>
            <SecondaryButton text='Continue'/>
          </div>
        </form>
    </div>
  );
}

export default AboutPage;