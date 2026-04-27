import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { initializeApp } from "firebase/app";

// 👇 حط الإعدادات هنا
const firebaseConfig = {
  apiKey: "AIzaSyCTu3ib6pZwWwT7flbdBad7EdZq8lLiNts",
  authDomain: "protofile-bf398.firebaseapp.com",
  projectId: "protofile-bf398",
  storageBucket: "protofile-bf398.firebasestorage.app",
  messagingSenderId: "983735884513",
  appId: "1:983735884513:web:6e92215931bf2cf6efb5a0",
  measurementId: "G-VWMR1M6RT8"
};

// 👇 تهيئة Firebase مرة واحدة بس
initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
