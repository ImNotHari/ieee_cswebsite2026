import { Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { lazyWithPreload } from './utils/lazyWithPreload';
import ErrorBoundary from './components/ErrorBoundary';
import PageSkeleton from './components/PageSkeleton';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import './App.css';

// Lazy load pages with preload capability
export const HomePage = lazyWithPreload(() => import('./pages/HomePage'));
export const LoginPage = lazyWithPreload(() => import('./pages/LoginPage'));
export const MemberDashboard = lazyWithPreload(() => import('./pages/MemberDashboard'));
export const EventsPage = lazyWithPreload(() => import('./pages/EventsPage'));
export const MembershipPage = lazyWithPreload(() => import('./pages/MembershipPage'));
export const BlogPage = lazyWithPreload(() => import('./pages/BlogPage'));

const App = () => {
  return (
    <div className="app-container">
      <HashRouter>
        <Suspense fallback={<PageSkeleton />}>
          <ErrorBoundary>
            <Routes>
              {/* Main Layout routes with Navbar */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/blog" element={<BlogPage />} />
              </Route>
              
              {/* Auth Layout routes without Navbar */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<MemberDashboard />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </HashRouter>
    </div>
  );
};

export default App;
