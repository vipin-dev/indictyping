'use client';

import { getApp, getApps, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCDdeUKiNYqauNEu1vXXct_iDH-Wbz5ha4',
  authDomain: 'indictyping-72862.firebaseapp.com',
  projectId: 'indictyping-72862',
  storageBucket: 'indictyping-72862.firebasestorage.app',
  messagingSenderId: '362745574228',
  appId: '1:362745574228:web:4669a6e6c9888945fa8ec1',
  measurementId: 'G-3ERLNHEGE8',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

let analyticsPromise: Promise<Analytics | null> | null = null;

export const initAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') return null;
  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
      .catch(() => null);
  }
  return analyticsPromise;
};
