"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';

// A generic Icon component that can be replaced with a proper library
const Icon = ({ src, alt }: { src: string; alt: string }) => (
    <Image src={src} alt={alt} width={20} height={20} />
);

const NavItem = ({ href, iconSrc, label, active, onClick }: { href: string; iconSrc: string; label: string; active?: boolean; onClick?: () => void }) => {
    if (onClick) {
        return (
            <button
                onClick={onClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: '#374151',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                }}
            >
                <Icon src={iconSrc} alt={label} />
                <span>{label}</span>
            </button>
        );
    }

    return (
        <Link href={href}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: active ? '#eef2ff' : 'transparent',
                color: active ? '#4f46e5' : '#374151',
                fontWeight: active ? 600 : 500,
            }}>
                <Icon src={iconSrc} alt={label} />
                <span>{label}</span>
            </div>
        </Link>
    );
};


export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, signOut } = useAuth();
    const myKottagePath = '/provider/my-kottage';
    const isMyKottageActive = pathname.startsWith(myKottagePath);

    const handleSignOut = async () => {
        await signOut();
        router.push('/auth/login');
    };

    return (
        <aside style={{
            width: '280px',
            backgroundColor: '#f9fafb',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid #e5e7eb',
        }}>
            <div>
                <div style={{ padding: '0 16px', marginBottom: '24px' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>kottage</h1>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <NavItem href="/provider/dashboard" iconSrc="/window.svg" label="Dashboard" active={pathname === '/provider/dashboard'} />
                    <NavItem href="/provider/bookings" iconSrc="/file.svg" label="Bookings" active={pathname === '/provider/bookings'} />
                    <NavItem href="/provider/calendar" iconSrc="/globe.svg" label="Calendar" active={pathname === '/provider/calendar'} />
                    <NavItem href={myKottagePath} iconSrc="/window.svg" label="My Kottage" active={isMyKottageActive} />
                    <NavItem href="/provider/payments" iconSrc="/file.svg" label="Payments" active={pathname === '/provider/payments'} />
                </nav>
            </div>
            <div>
                {/* User info */}
                {user && (
                    <div style={{
                        padding: '12px 16px',
                        borderTop: '1px solid #e5e7eb',
                        marginBottom: '12px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#3b82f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 600
                            }}>
                                {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '14px', 
                                    fontWeight: 600, 
                                    color: '#1f2937',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {user.user_metadata?.full_name || 'User'}
                                </p>
                                <p style={{ 
                                    margin: 0, 
                                    fontSize: '12px', 
                                    color: '#6b7280',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                <NavItem href="#" iconSrc="/globe.svg" label="Settings" />
                <NavItem href="#" iconSrc="/home.svg" label="Sign Out" onClick={handleSignOut} />
            </div>
        </aside>
    );
} 