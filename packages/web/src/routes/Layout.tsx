import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MakaPrompt } from "@/components/cosmos/MakaPrompt";
import CommandBridge from "@/components/cosmos/CommandBridge";
import { useRealm } from "@/lib/RealmContext";
import { useUniverse } from "@/lib/UniverseContext";
import { WindowManager } from "@/components/window/WindowManager";
import { DesktopRobot } from "@/components/cosmos/DesktopRobot";
import { KineticRippleManager } from "@/components/cosmos/KineticRippleManager";
import { CinematicMount } from "@/components/cosmos/CinematicMount";
import { GlobalCrisisCanvas } from "@/components/cosmos/GlobalCrisisCanvas";
import { PortalTransition } from "@/components/cosmos/PortalTransition";
import { checkSessionTimeout } from "@/lib/session-security";
import { Glass } from "@/components/aether/Glass";
import { MatrixOverlay } from "@/components/cosmos/MatrixOverlay";
import { UniversalSearch } from "@/components/cosmos/UniversalSearch";
import { ThemeSelector } from "@/components/cosmos/ThemeSelector";
import { UltimateCaptureSuite } from "@/components/cosmos/UltimateCaptureSuite";
import { RealmNavigationHUD } from "@/components/cosmos/RealmNavigationHUD";

const layoutSpring = {
  type: "spring",
  damping: 25,
  stiffness: 300,
};

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { realmId, realm } = useRealm();
  const { isUniverseStable, energy, universeState } = useUniverse();

  useEffect(() => {
    // Check session timeout on mount
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity && checkSessionTimeout(parseInt(lastActivity))) {
      localStorage.removeItem("lastActivity");
      navigate("/login");
    }

    // Update last activity
    localStorage.setItem("lastActivity", Date.now().toString());
  }, [navigate]);

  return (
    <div
      className="min-h-screen bg-[var(--theme-background)] text-[var(--theme-text)] font-sans transition-colors duration-700 selection:bg-[var(--theme-primary)] selection:text-white"
      data-theme={realmId}
      data-realm={realmId}
    >
      {/* Immersive Realm Ambient Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Realm Background Material */}
        <motion.div
          initial={false}
          animate={{ background: realm.ambient }}
          transition={{ duration: 1 }}
          className="absolute inset-0 opacity-40"
        />

        {/* Primary Gradient Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--theme-primary)]/10 blur-[150px] rounded-full animate-pulse-slow" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--theme-accent,var(--theme-primary))]/5 blur-[150px] rounded-full animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />

        {/* Dynamic Realm Particles */}
        <div className="absolute inset-0">
          {realm.particles.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.2, 0],
                y: [0, -1000],
                x: `${(i * 13) % 100}%`,
              }}
              transition={{
                duration: 10 + ((i * 7) % 15),
                repeat: Infinity,
                delay: (i * 2) % 10,
              }}
              className="absolute bottom-0 text-xl"
            >
              {p}
            </motion.div>
          ))}
        </div>

        {/* Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              realmId === "ironman-nano"
                ? `linear-gradient(var(--theme-text) 1px, transparent 1px), linear-gradient(90deg, var(--theme-text) 1px, transparent 1px)`
                : "none",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Intelligent AI Prompt Overlay */}
      <MakaPrompt />

      <CommandBridge />
      <RealmNavigationHUD />
      <UltimateCaptureSuite />

      <DesktopRobot />
      <KineticRippleManager />
      <GlobalCrisisCanvas />

      <PortalTransition />

      <AnimatePresence>
        {universeState !== "idle" && <MatrixOverlay />}
      </AnimatePresence>

      <UniversalSearch />
      <MakaPrompt />

      {/* ─── UNIVERSE MONITOR (HUD) ─── */}
      <div className="fixed top-8 right-8 z-50 flex flex-col gap-3 items-end pointer-events-none">
        <ThemeSelector />
        <Glass className="px-4 py-2 flex items-center gap-4 bg-black/20 backdrop-blur-xl border-white/5 pointer-events-auto">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
              Universe Core
            </span>
            <span className="text-sm font-mono font-bold text-[var(--theme-primary)]">
              {Math.floor(energy)}%
            </span>
          </div>
          <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${energy}%` }}
              className="h-full bg-[var(--theme-primary)] shadow-[0_0_10px_var(--theme-primary)]"
            />
          </div>
        </Glass>

        <div className="flex items-center gap-2 pr-2">
          <div
            className={`w-2 h-2 rounded-full ${isUniverseStable ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-amber-500 animate-pulse shadow-[0_0_10px_#f59e0b]"}`}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
            {universeState === "shifting"
              ? "Dimensional Shift"
              : universeState === "active"
                ? "Neural Processing"
                : "System Stable"}
          </span>
        </div>
      </div>

      {/* ─── UNIVERSE RIPPLE FEEDBACK ─── */}
      <AnimatePresence>
        {!isUniverseStable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center"
          >
            <div className="w-[80vw] h-[80vw] border-[2px] border-[var(--theme-primary)]/10 rounded-full animate-ping-slow opacity-20" />
            <div
              className="absolute w-[60vw] h-[60vw] border-[1px] border-[var(--theme-primary)]/5 rounded-full animate-ping-slow opacity-10"
              style={{ animationDelay: "0.5s" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-28 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
            transition={layoutSpring}
            className="w-full"
          >
            <CinematicMount isVisible={true}><Outlet /></CinematicMount>
          </motion.div>
        </AnimatePresence>
      </main>

      <WindowManager />
    </div>
  );
}
