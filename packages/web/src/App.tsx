// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AIProvider } from './contexts/AIContext';
import { ToastProvider } from './contexts/ToastContext';
import { PluginProvider } from './contexts/PluginContext';
import { MarketplaceProvider } from './contexts/MarketplaceContext';
import { SyncProvider } from './contexts/SyncContext';
import { RealmProvider } from './lib/RealmContext';
import { UniverseProvider } from './lib/UniverseContext';
import { RobinProvider } from './lib/RobinContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { LayoutProvider } from './contexts/LayoutContext';
import { WindowProvider } from './contexts/WindowContext';
import { Layout } from './routes/Layout';

import { Skeleton } from './components/ui/Skeleton';
import { AuthProvider } from '@cosmos/core';

import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { MatrixProvider } from './cosmos-design/shared/MatrixContext';

// Pages - Lazy loaded for code splitting and performance optimization
const CaptureUniversePage = React.lazy(() => import('./routes/CaptureUniverse').then(module => ({ default: module.CaptureUniverse })));
const NexusDashboard = React.lazy(() => import('./routes/NexusDashboard').then(module => ({ default: module.NexusDashboard })));
const WorkBoard = React.lazy(() => import('./components/Work/WorkBoard').then(module => ({ default: module.WorkBoard })));
const ThinkNote = React.lazy(() => import('./components/Think/ThinkNote').then(module => ({ default: module.ThinkNote })));
const Studio = React.lazy(() => import('./routes/studio').then(module => ({ default: module.Studio })));
const LifeWellness = React.lazy(() => import('./components/Life/LifeWellness').then(module => ({ default: module.LifeWellness })));
const SignalChat = React.lazy(() => import('./components/Signal/SignalChat').then(module => ({ default: module.SignalChat })));
const LifeFinance = React.lazy(() => import('./components/Life/LifeFinance').then(module => ({ default: module.LifeFinance })));
const ShortcutBuilder = React.lazy(() => import('./components/shortcuts/ShortcutBuilder').then(module => ({ default: module.ShortcutBuilder })));
const CreativeLibrary = React.lazy(() => import('./components/library/CreativeLibrary').then(module => ({ default: module.CreativeLibrary })));
const Shopping = React.lazy(() => import('./components/shopping/Shopping').then(module => ({ default: module.Shopping })));
const UniversalTracker = React.lazy(() => import('./components/tracker/UniversalTracker').then(module => ({ default: module.UniversalTracker })));
const StudioPro = React.lazy(() => import('./components/studio-pro/StudioPro').then(module => ({ default: module.StudioPro })));
const LifeContinuity = React.lazy(() => import('./routes/LifeContinuity').then(module => ({ default: module.LifeContinuity })));
const CookbookPage = React.lazy(() => import('./routes/cookbook'));
const MusicUniversePage = React.lazy(() => import('./routes/music-universe'));
const AICardsPage = React.lazy(() => import('./routes/ai-cards'));
const DocumentUniversePage = React.lazy(() => import('./routes/document-universe'));
const GeneticsUniversePage = React.lazy(() => import('./routes/genetics-universe'));
const WorkspaceUniversePage = React.lazy(() => import('./routes/workspace-universe'));
const DataFusionPage = React.lazy(() => import('./routes/data-fusion'));
const CinemaUniversePage = React.lazy(() => import('./routes/cinema-universe'));
const RewardsEnginePage = React.lazy(() => import('./routes/rewards-engine'));
const MorningDashboardPage = React.lazy(() => import('./routes/morning-dashboard'));
const CreativeStudioPage = React.lazy(() => import('./routes/creative-studio'));
const FoodDeliveryPage = React.lazy(() => import('./routes/food-delivery'));
const PlayfulWidgetsPage = React.lazy(() => import('./routes/playful-widgets'));
const DiscPlayerPage = React.lazy(() => import('./routes/disc-player'));
const RetroInventoryPage = React.lazy(() => import('./routes/retro-inventory'));
const SkeuomorphicPage = React.lazy(() => import('./routes/skeuomorphic'));
const NewsStackPage = React.lazy(() => import('./routes/news-stack'));
const PluginsPage = React.lazy(() => import('./routes/PluginsPage'));
const Marketplace = React.lazy(() => import('./components/marketplace/Marketplace').then(module => ({ default: module.Marketplace })));
const MediaHubPage = React.lazy(() => import('./routes/media-hub'));
const WorkspaceCorePage = React.lazy(() => import('./routes/workspace-core'));
const AiCenterPage = React.lazy(() => import('./routes/ai-center'));
const PersonalSpacePage = React.lazy(() => import('./routes/personal-space'));
const NotFound = React.lazy(() => import('./routes/NotFound'));
const ArchivePage = React.lazy(() => import('./routes/ArchivePage'));
const LogisticsConsole = React.lazy(() => import('./routes/LogisticsConsole'));

// Auth Pages
const Login = React.lazy(() => import('./routes/login'));
const Register = React.lazy(() => import('./routes/register'));

import { initSentry } from './lib/sentry';
import { ApiSyncRoute } from './routes/ApiSyncRoute';

initSentry();

import './index.css';

function AppContent() {
  return (
    <React.Suspense fallback={<Skeleton />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<NexusDashboard />} />
          <Route path="capture" element={<CaptureUniversePage />} />
          <Route path="work" element={<WorkBoard />} />
          <Route path="think" element={<ThinkNote />} />
          <Route path="studio" element={<Studio />} />
          <Route path="life" element={<LifeWellness />} />
          <Route path="signal" element={<SignalChat />} />
          <Route path="money" element={<LifeFinance />} />
          <Route path="shortcuts" element={<ShortcutBuilder />} />
          <Route path="library" element={<CreativeLibrary />} />
          <Route path="shopping" element={<Shopping />} />
          <Route path="tracker" element={<UniversalTracker />} />
          <Route path="studio-pro" element={<StudioPro />} />
          <Route path="continuity" element={<LifeContinuity />} />
          <Route path="cookbook" element={<CookbookPage />} />
          <Route path="music-universe" element={<MusicUniversePage />} />
          <Route path="ai-cards" element={<AICardsPage />} />
          <Route path="document-universe" element={<DocumentUniversePage />} />
          <Route path="genetics-universe" element={<GeneticsUniversePage />} />
          <Route path="workspace-universe" element={<WorkspaceUniversePage />} />
          <Route path="data-fusion" element={<DataFusionPage />} />
          <Route path="cinema" element={<CinemaUniversePage />} />
          <Route path="rewards" element={<RewardsEnginePage />} />
          <Route path="morning-dashboard" element={<MorningDashboardPage />} />
          <Route path="creative-studio" element={<CreativeStudioPage />} />
          <Route path="food-delivery" element={<FoodDeliveryPage />} />
          <Route path="playful-widgets" element={<PlayfulWidgetsPage />} />
          <Route path="disc-player" element={<DiscPlayerPage />} />
          <Route path="retro-inventory" element={<RetroInventoryPage />} />
          <Route path="skeuomorphic" element={<SkeuomorphicPage />} />
          <Route path="news-stack" element={<NewsStackPage />} />
          <Route path="plugins" element={<PluginsPage />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="media-hub" element={<MediaHubPage />} />
          <Route path="workspace-core" element={<WorkspaceCorePage />} />
          <Route path="ai-center" element={<AiCenterPage />} />
          <Route path="archive" element={<ArchivePage />} />
          <Route path="logistics" element={<LogisticsConsole />} />
          <Route path="personal-space" element={<PersonalSpacePage />} />
          <Route path="api/focus-mode" element={<ApiSyncRoute type="focus" />} />
          <Route path="api/nfc-tap" element={<ApiSyncRoute type="nfc" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
}

export default function CosmosOS() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <RealmProvider>
            <RobinProvider>
              <UniverseProvider>
                <SyncProvider>
                  <MarketplaceProvider>
                    <PluginProvider>
                      <WorkspaceProvider>
                        <LayoutProvider>
                          <WindowProvider>
                            <AIProvider>
                              <ToastProvider>
                                <MatrixProvider>
                                  <AppContent />
                                </MatrixProvider>
                              </ToastProvider>
                            </AIProvider>
                          </WindowProvider>
                        </LayoutProvider>
                      </WorkspaceProvider>
                    </PluginProvider>
                  </MarketplaceProvider>
                </SyncProvider>
              </UniverseProvider>
            </RobinProvider>
          </RealmProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
