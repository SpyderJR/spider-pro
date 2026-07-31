import { Routes, Route } from "react-router-dom";
import { useGlobalClickSound } from "./hooks/useGlobalClickSound";
import { Nav } from "./components/Nav";
import { MobileTopBar } from "./components/MobileTopBar";
import { TickerBar } from "./components/TickerBar";
import { ChatWidget } from "./components/chat/ChatWidget";
import { SpiderIntelligencePage } from "./sections/SpiderIntelligencePage";
import { BitcoinPage } from "./sections/BitcoinPage";
import { TronPage } from "./sections/TronPage";
import { AnalisisTecnicoPage } from "./sections/AnalisisTecnicoPage";
import { TradingToolsPage } from "./sections/TradingToolsPage";
import { VelasJaponesasPage } from "./sections/VelasJaponesasPage";
import { EstrategiasPage } from "./sections/EstrategiasPage";
import { HalvingsPage } from "./sections/HalvingsPage";
import { M2VsMercadoPage } from "./sections/M2VsMercadoPage";
import { StablecoinsPage } from "./sections/StablecoinsPage";
import { CrashesPage } from "./sections/CrashesPage";
import { RoadmapPage } from "./sections/RoadmapPage";
import { JustinSunPage } from "./sections/JustinSunPage";
import { CalculadoraPage } from "./sections/CalculadoraPage";

export default function App() {
  useGlobalClickSound();

  return (
    <div className="flex min-h-screen">
      <Nav />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-40">
          <MobileTopBar />
          <TickerBar />
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Routes>
            <Route path="/" element={<SpiderIntelligencePage />} />
            <Route path="/bitcoin" element={<BitcoinPage />} />
            <Route path="/tron" element={<TronPage />} />
            <Route path="/analisis-tecnico" element={<AnalisisTecnicoPage />} />
            <Route path="/radar-de-trading" element={<TradingToolsPage />} />
            <Route path="/velas-japonesas" element={<VelasJaponesasPage />} />
            <Route path="/estrategias" element={<EstrategiasPage />} />
            <Route path="/halvings" element={<HalvingsPage />} />
            <Route path="/m2-vs-mercado" element={<M2VsMercadoPage />} />
            <Route path="/stablecoins" element={<StablecoinsPage />} />
            <Route path="/crashes" element={<CrashesPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/justin-sun" element={<JustinSunPage />} />
            <Route path="/calculadora" element={<CalculadoraPage />} />
          </Routes>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}
