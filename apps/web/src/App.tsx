import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useGlobalClickSound } from "./hooks/useGlobalClickSound";
import { useAcademyProgressStore } from "./store/academyProgressStore";
import { DashboardLayout } from "./components/DashboardLayout";
import { LandingPage } from "./sections/LandingPage";
import { TerminosPage } from "./sections/legal/TerminosPage";
import { PrivacidadPage } from "./sections/legal/PrivacidadPage";
import { RiesgoPage } from "./sections/legal/RiesgoPage";
import { LEGACY_DASHBOARD_PATHS } from "./lib/sections";
import { SpiderIntelligencePage } from "./sections/SpiderIntelligencePage";
import { AcademyPage } from "./sections/AcademyPage";
import { AcademyLevelPage } from "./sections/AcademyLevelPage";
import { ArcadePage } from "./sections/ArcadePage";
import { BitcoinPage } from "./sections/BitcoinPage";
import { TronPage } from "./sections/TronPage";
import { AnalisisTecnicoPage } from "./sections/AnalisisTecnicoPage";
import { TradingToolsPage } from "./sections/TradingToolsPage";
import { TerminalPage } from "./sections/TerminalPage";
import { BacktesterPage } from "./sections/BacktesterPage";
import { RiskManagementPage } from "./sections/RiskManagementPage";
import { DiarioPage } from "./sections/DiarioPage";
import { VelasJaponesasPage } from "./sections/VelasJaponesasPage";
import { FractalesEstructuraPage } from "./sections/FractalesEstructuraPage";
import { OnChainPage } from "./sections/OnChainPage";
import { EstrategiasPage } from "./sections/EstrategiasPage";
import { ContratosPage } from "./sections/ContratosPage";
import { HalvingsPage } from "./sections/HalvingsPage";
import { MacroAnalysisPage } from "./sections/MacroAnalysisPage";
import { StablecoinsPage } from "./sections/StablecoinsPage";
import { CrashesPage } from "./sections/CrashesPage";
import { RoadmapPage } from "./sections/RoadmapPage";
import { JustinSunPage } from "./sections/JustinSunPage";
import { CalculadoraPage } from "./sections/CalculadoraPage";
import { GlosarioPage } from "./sections/GlosarioPage";

export default function App() {
  useGlobalClickSound();
  const touchVisit = useAcademyProgressStore((s) => s.touchVisit);
  useEffect(() => {
    touchVisit();
  }, [touchVisit]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/terminos" element={<TerminosPage />} />
      <Route path="/privacidad" element={<PrivacidadPage />} />
      <Route path="/riesgo" element={<RiesgoPage />} />

      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<SpiderIntelligencePage />} />
        <Route path="academia" element={<AcademyPage />} />
        <Route path="academia/:levelId" element={<AcademyLevelPage />} />
        <Route path="arcade" element={<ArcadePage />} />
        <Route path="bitcoin" element={<BitcoinPage />} />
        <Route path="tron" element={<TronPage />} />
        <Route path="analisis-tecnico" element={<AnalisisTecnicoPage />} />
        <Route path="radar-de-trading" element={<TradingToolsPage />} />
        <Route path="terminal" element={<TerminalPage />} />
        <Route path="backtester" element={<BacktesterPage />} />
        <Route path="gestion-de-riesgo" element={<RiskManagementPage />} />
        <Route path="diario" element={<DiarioPage />} />
        <Route path="velas-japonesas" element={<VelasJaponesasPage />} />
        <Route path="fractales-estructura" element={<FractalesEstructuraPage />} />
        <Route path="on-chain" element={<OnChainPage />} />
        <Route path="estrategias" element={<EstrategiasPage />} />
        <Route path="contratos" element={<ContratosPage />} />
        <Route path="halvings" element={<HalvingsPage />} />
        <Route path="analisis-macro" element={<MacroAnalysisPage />} />
        <Route path="m2-vs-mercado" element={<Navigate to="/app/analisis-macro" replace />} />
        <Route path="stablecoins" element={<StablecoinsPage />} />
        <Route path="crashes" element={<CrashesPage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="justin-sun" element={<JustinSunPage />} />
        <Route path="calculadora" element={<CalculadoraPage />} />
        <Route path="glosario" element={<GlosarioPage />} />
      </Route>

      {/* Redirects desde las rutas planas donde vivía el dashboard antes del Bloque 11.1 */}
      {LEGACY_DASHBOARD_PATHS.map((path) => (
        <Route key={path} path={path} element={<Navigate to={`/app${path}`} replace />} />
      ))}
    </Routes>
  );
}
