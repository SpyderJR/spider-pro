import { Outlet } from "react-router-dom";
import { Nav } from "./Nav";
import { MobileTopBar } from "./MobileTopBar";
import { TickerBar } from "./TickerBar";
import { ChatWidget } from "./chat/ChatWidget";
import { OnboardingModal } from "./onboarding/OnboardingModal";
import { BackupModal } from "./settings/BackupModal";
import { LegalConsentBanner } from "./legal/LegalConsentBanner";
import { useUiStore } from "../store/uiStore";
import { useCloudSync } from "../hooks/useCloudSync";

/** Todo lo que vive bajo /app — el dashboard interactivo (chrome + rutas anidadas). */
export function DashboardLayout() {
  const { backupModalOpen, closeBackupModal } = useUiStore();
  useCloudSync();

  return (
    <div className="flex min-h-screen">
      <Nav />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-40">
          <MobileTopBar />
          <TickerBar />
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
      <ChatWidget />
      <OnboardingModal />
      <LegalConsentBanner />
      {backupModalOpen && <BackupModal onClose={closeBackupModal} />}
    </div>
  );
}
