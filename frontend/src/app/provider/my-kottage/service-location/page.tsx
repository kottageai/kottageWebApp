"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import { saveAddresses, loadAddresses, Address } from '@/lib/services';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

const Card = ({ title, children, enabled, onToggle }: { title: string, children: React.ReactNode, enabled: boolean, onToggle: (enabled: boolean) => void }) => {
  return (
    <div style={{
      backgroundColor: '#f9fafb',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #e5e7eb',
      opacity: enabled ? 1 : 0.6,
      transition: 'opacity 0.2s ease-in-out',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h2>
        <ToggleSwitch enabled={enabled} onChange={onToggle} />
      </div>
      {enabled && <div>{children}</div>}
    </div>
  );
};

type NewAddressData = {
  line1: string;
  line2: string;
  city: string;
  zip: string;
  country: string;
  isHome: boolean;
  radius?: number;
}

const AddressModal = ({ onSave, onClose, addressToEdit, showIsHome }: { onSave: (data: NewAddressData) => void, onClose: () => void, addressToEdit: Address | null, showIsHome: boolean }) => {
  const [searchAddress, setSearchAddress] = useState('');
  const [manualAddress, setManualAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    zip: '',
    country: '',
  });
  const [isHome, setIsHome] = useState(false);
  const [radius, setRadius] = useState<number | undefined>(undefined);
  const isEditing = !!addressToEdit;

  useEffect(() => {
    if (addressToEdit) {
      setManualAddress({
        line1: addressToEdit.line1,
        line2: addressToEdit.line2,
        city: addressToEdit.city,
        zip: addressToEdit.zip,
        country: addressToEdit.country,
      });
      setIsHome(addressToEdit.isHome);
      setRadius(addressToEdit.radius);
    }
  }, [addressToEdit]);

  const handleSave = () => {
    let data: NewAddressData;
    const isManualEntry = manualAddress.line1.trim() || manualAddress.city.trim() || manualAddress.zip.trim() || manualAddress.country.trim();

    if (isEditing || isManualEntry) {
      if (!manualAddress.line1.trim() || !manualAddress.city.trim() || !manualAddress.zip.trim() || !manualAddress.country.trim()) return;
      data = { ...manualAddress, isHome, radius };
    } else if (searchAddress.trim()) {
      data = {
        line1: searchAddress.trim(),
        line2: '', city: '', zip: '', country: '',
        isHome: isHome,
        radius,
      };
    } else {
      return;
    }
    
    onSave(data);
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }
  };
  
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, width: '90%', maxWidth: 500 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 24 }}>{isEditing ? 'Edit address' : 'Add a new address'}</h2>
        
        {!isEditing && (
          <>
            <input
              type="text"
              placeholder="Search your address (to be implemented)"
              value={searchAddress}
              onChange={e => setSearchAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <span style={{ margin: '0 16px', color: '#6b7280', fontSize: '0.875rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>
          </>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isEditing && <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Enter Manually</h3>}
          <input name="line1" value={manualAddress.line1} onChange={handleManualChange} onKeyDown={handleKeyDown} placeholder="Address line 1" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}/>
          <input name="line2" value={manualAddress.line2} onChange={handleManualChange} onKeyDown={handleKeyDown} placeholder="Address line 2 (optional)" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}/>
          <div style={{ display: 'flex', gap: 16 }}>
            <input name="city" value={manualAddress.city} onChange={handleManualChange} onKeyDown={handleKeyDown} placeholder="City" style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}/>
            <input name="zip" value={manualAddress.zip} onChange={handleManualChange} onKeyDown={handleKeyDown} placeholder="ZIP / Postal code" style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}/>
          </div>
          <input name="country" value={manualAddress.country} onChange={handleManualChange} onKeyDown={handleKeyDown} placeholder="Country" style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}/>
        </div>

        {!showIsHome && (
          <div style={{marginTop: 24}}>
            <label htmlFor="radius" style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block', marginBottom: 8 }}>Radius you are willing to travel to (in miles)</label>
            <input
                id="radius"
                name="radius"
                type="number"
                value={radius || ''}
                onChange={(e) => setRadius(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 10"
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}
            />
          </div>
        )}

        {showIsHome && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0 8px 0' }}>
              <input type="checkbox" id="modalIsHome" checked={isHome} onChange={e => setIsHome(e.target.checked)} style={{width: 16, height: 16}} />
              <label htmlFor="modalIsHome" style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                This is my home address.
              </label>
            </div>
            {isHome && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: 24, paddingLeft: 24 }}>
                    Your full address is only shown to your client when they make a booking in your home.
                </p>
            )}
          </>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: showIsHome ? (isHome ? 0 : 16) : 24 }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', backgroundColor: '#1a1a1a', color: 'white', cursor: 'pointer' }}>{isEditing ? 'Save' : 'Add address'}</button>
        </div>
      </div>
    </div>
  );
};

export default function ServiceLocationPage() {
  const router = useRouter();
  const [clientsCome, setClientsCome] = useState(true);
  const [travelToClients, setTravelToClients] = useState(false);
  
  // State for "Clients travel to you"
  const [locationAddresses, setLocationAddresses] = useState<Address[]>([]);
  const [expandedLocationAddressId, setExpandedLocationAddressId] = useState<number | null>(null);
  
  // State for "You travel to clients"
  const [travelAddresses, setTravelAddresses] = useState<Address[]>([]);
  const [expandedTravelAddressId, setExpandedTravelAddressId] = useState<number | null>(null);

  // Modal and editing state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [editingTarget, setEditingTarget] = useState<'location' | 'travel' | null>(null);

  useEffect(() => {
    const { locationAddresses, travelAddresses } = loadAddresses();
    setLocationAddresses(locationAddresses);
    setTravelAddresses(travelAddresses);
  }, []);

  const handleSaveLocationAddress = (data: NewAddressData) => {
    let updatedAddresses;
    if (addressToEdit) {
      updatedAddresses = locationAddresses.map(addr =>
        addr.id === addressToEdit.id ? { ...addr, ...data } : addr
      );

      if (data.isHome) {
        updatedAddresses = updatedAddresses.map(addr =>
          addr.id === addressToEdit.id ? addr : { ...addr, isHome: false }
        );
      }
    } else {
      const newAddress: Address = {
        id: Date.now(), ...data, enabled: true,
      };
      const allAddresses = data.isHome 
        ? locationAddresses.map(addr => ({ ...addr, isHome: false })) 
        : locationAddresses;
      updatedAddresses = [...allAddresses, newAddress];
    }
    setLocationAddresses(updatedAddresses);
    saveAddresses(updatedAddresses, travelAddresses);
  };
  
  const handleSaveTravelAddress = (data: NewAddressData) => {
    const addressData = { ...data, isHome: false }; // isHome is not applicable here
    let updatedAddresses;
    if (addressToEdit) {
       updatedAddresses = travelAddresses.map(addr =>
        addr.id === addressToEdit.id ? { ...addr, ...addressData } : addr
      );
    } else {
      const newAddress: Address = {
        id: Date.now(), ...addressData, enabled: true,
      };
      updatedAddresses = [...travelAddresses, newAddress];
    }
    setTravelAddresses(updatedAddresses);
    saveAddresses(locationAddresses, updatedAddresses);
  };

  const handleToggleLocationAddress = (id: number) => {
    const updatedAddresses = locationAddresses.map(addr => 
        addr.id === id ? { ...addr, enabled: !addr.enabled } : addr
    );
    setLocationAddresses(updatedAddresses);
    saveAddresses(updatedAddresses, travelAddresses);
  };
  
  const handleToggleTravelAddress = (id: number) => {
    const updatedAddresses = travelAddresses.map(addr => 
        addr.id === id ? { ...addr, enabled: !addr.enabled } : addr
    );
    setTravelAddresses(updatedAddresses);
    saveAddresses(locationAddresses, updatedAddresses);
  };

  const handleToggleIsHome = (id: number) => {
    const isMakingHome = !locationAddresses.find(a => a.id === id)?.isHome;
    const updatedAddresses = locationAddresses.map(addr => {
      if (addr.id === id) {
        return { ...addr, isHome: isMakingHome };
      }
      if (isMakingHome) {
        return { ...addr, isHome: false };
      }
      return addr;
    });
    setLocationAddresses(updatedAddresses);
    saveAddresses(updatedAddresses, travelAddresses);
  };

  const handleDeleteLocationAddress = (id: number) => {
    const updatedAddresses = locationAddresses.filter(addr => addr.id !== id);
    setLocationAddresses(updatedAddresses);
    saveAddresses(updatedAddresses, travelAddresses);
  };
  
  const handleDeleteTravelAddress = (id: number) => {
    const updatedAddresses = travelAddresses.filter(addr => addr.id !== id);
    setTravelAddresses(updatedAddresses);
    saveAddresses(locationAddresses, updatedAddresses);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{ maxWidth: 768, margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Where will your services be provided?</h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card title="Clients travel to your specified location" enabled={clientsCome} onToggle={setClientsCome}>
              {locationAddresses.map(addr => (
                <div key={addr.id} style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 12, border: '1px solid #e5e7eb', opacity: addr.enabled ? 1 : 0.6 }}>
                  <div 
                    style={{ position: 'relative', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }}
                    onClick={() => setExpandedLocationAddressId(expandedLocationAddressId === addr.id ? null : addr.id)}
                  >
                    <div style={{ paddingRight: 24 /* space for icon */ }}>
                      <p>{addr.line1}</p>
                      <p>{addr.line2}</p>
                      <p>{addr.city} {addr.zip}</p>
                      <p>{addr.country}</p>
                    </div>
                    <ToggleSwitch
                      enabled={addr.enabled}
                      onChange={() => handleToggleLocationAddress(addr.id)}
                    />
                    {addr.isHome && (
                      <div style={{ position: 'absolute', right: 20, bottom: 12 }}>
                        <Image src="/home.svg" alt="Home" width={18} height={18} />
                      </div>
                    )}
                  </div>
                  {expandedLocationAddressId === addr.id && (
                    <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input
                            type="checkbox"
                            id={`is-home-${addr.id}`}
                            checked={addr.isHome}
                            onChange={() => handleToggleIsHome(addr.id)}
                          />
                          <label htmlFor={`is-home-${addr.id}`} style={{fontSize: '0.875rem', color: '#6b7280'}}>This is my home address.</label>
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <button 
                            style={{ all: 'unset', cursor: 'pointer', fontWeight: 500 }}
                            onClick={(e) => { e.stopPropagation(); setAddressToEdit(addr); setEditingTarget('location'); setIsModalOpen(true); }}
                          >
                            Edit
                          </button>
                          <button 
                            style={{ all: 'unset', cursor: 'pointer', fontWeight: 500, color: '#ef4444' }}
                            onClick={() => handleDeleteLocationAddress(addr.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => { setEditingTarget('location'); setIsModalOpen(true); }} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer', marginTop: 12 }}>
                + Add address
              </button>
            </Card>

            <Card title="You travel to clients' specified location" enabled={travelToClients} onToggle={setTravelToClients}>
              {travelAddresses.map(addr => (
                <div key={addr.id} style={{ backgroundColor: 'white', borderRadius: 12, marginBottom: 12, border: '1px solid #e5e7eb', opacity: addr.enabled ? 1 : 0.6 }}>
                  <div 
                    style={{ position: 'relative', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }}
                    onClick={() => setExpandedTravelAddressId(expandedTravelAddressId === addr.id ? null : addr.id)}
                  >
                    <div>
                      <p>{addr.line1}</p>
                      {addr.radius !== undefined && <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: 4 }}>Within {addr.radius} miles</p>}
                    </div>
                    <ToggleSwitch
                      enabled={addr.enabled}
                      onChange={() => handleToggleTravelAddress(addr.id)}
                    />
                  </div>
                  {expandedTravelAddressId === addr.id && (
                    <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
                        <button 
                          style={{ all: 'unset', cursor: 'pointer', fontWeight: 500 }}
                          onClick={(e) => { e.stopPropagation(); setAddressToEdit(addr); setEditingTarget('travel'); setIsModalOpen(true); }}
                        >
                          Edit
                        </button>
                        <button 
                          style={{ all: 'unset', cursor: 'pointer', fontWeight: 500, color: '#ef4444' }}
                          onClick={() => handleDeleteTravelAddress(addr.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={() => { setEditingTarget('travel'); setIsModalOpen(true); }} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer', marginTop: 12 }}>
                + Add address
              </button>
            </Card>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40 }}>
            <button 
              onClick={() => router.push('/provider/my-kottage')} 
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                borderRadius: 8, 
                border: 'none',
                fontSize: 16,
                fontWeight: 500
              }}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </main>
      {isModalOpen && <AddressModal onSave={editingTarget === 'location' ? handleSaveLocationAddress : handleSaveTravelAddress} onClose={() => { setIsModalOpen(false); setAddressToEdit(null); setEditingTarget(null); }} addressToEdit={addressToEdit} showIsHome={editingTarget === 'location'} />}
    </div>
  );
} 