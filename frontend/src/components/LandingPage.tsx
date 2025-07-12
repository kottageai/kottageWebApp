"use client";
import React from "react";
import Link from "next/link";
import styles from '../app/page.module.css';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      <div className={styles.leftPanelContent}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className={styles.title}>kottage</h1>
        </Link>
        <p style={{ marginTop: '1rem', fontSize: '1.125rem', color: '#4b5563' }}>
          A new way to build and manage your service-based business online.
          <br />
          The new shop setup experience is now available at <b>/provider</b>.
          <br />
          <a href="/provider" style={{ color: '#2563eb', fontWeight: 600, fontSize: 18 }}>Go to Shop Setup &rarr;</a>
        </p>
      </div>
    </main>
  );
} 