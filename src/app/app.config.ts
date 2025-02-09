import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, provideFirestore } from '@angular/fire/firestore';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// Register French locale
registerLocaleData(localeFr);
export const appConfig: ApplicationConfig = {
  providers: [

    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions(), withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ngmradi-3fbf1',
        appId: '1:515418117066:web:60f62067fa4b0e3a5cf533',
        storageBucket: 'ngmradi-3fbf1.firebasestorage.app',
        apiKey: 'AIzaSyDuuZwAtWTHNkzbU75QNqgPPiUbVFHWidU',
        authDomain: 'ngmradi-3fbf1.firebaseapp.com',
        messagingSenderId: '515418117066',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() =>
      initializeFirestore(getApp(), {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      })
    ),
  ],
};
