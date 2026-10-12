import { useEffect, useMemo, useState } from "react";
import DataEditor from "./components/DataEditor";
import { buildOrgChart, type Employee } from "./data/orgChartData";
import { dataManager } from "./data/dataManager";
import { loadEmployeesFromCanonical } from "./data/canonicalAdapter";
import { Settings, History, X, Filter } from "lucide-react";
import { HEADER_HEIGHT } from "@/components/AppHeader";
/*
 * Kendali Vismap memakai komponen design system Prodigy (Button/ActionIcon
 * adalah re-export Mantine). Di sana "Ghost" = variant="subtle", jadi jangan
 * menulis tombol sendiri dengan style inline: warna, tinggi, radius, dan state
 * hover-nya sudah dikunci di theme.
 */
import { ActionIcon, Tooltip as DsTooltip, Indicator } from "@mantine/core";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { TooltipProvider } from "./components/ui/tooltip";
import DataVisibilityModal from "./components/DataVisibilityModal";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import HeatmapSettings, { type HeatmapConfig } from "./components/HeatmapSettings";
import VismapV2 from "./v2/VismapV2";
import { LAYER_REQUIRES, isLayerLocked, type LayerId } from "./v2/layers";

/**
 * Layer yang menyala untuk sebuah nilai `?tab=`.
 *
 * Tautan dari Beranda (banner insight) membuka Vismap dengan `?tab=succession-risk`
 * atau `?tab=need-develop`. Di tampilan lama itu memilih tab heatmap; di sini tab
 * tidak ada lagi, jadi padanannya adalah menyalakan layer yang sama — supaya orang
 * yang mengklik "lihat risiko suksesi" tetap mendarat di peta yang menampilkannya.
 */
function layersForTab(param: string | null | undefined): Set<LayerId> {
  if (param === "succession-risk" || param === "need-successors-copy") {
    // Succession Risk dihitung dari kesiapan penerus, jadi % Ready ikut menyala.
    return new Set<LayerId>(["succession-risk", "ready-to-promote"]);
  }
  if (param === "need-develop" || param === "need-development") {
    return new Set<LayerId>(["need-development"]);
  }
  return new Set<LayerId>();
}

const DEFAULT_HEATMAP_CONFIG: HeatmapConfig = {
  needDevelop: [
    { color: "#fe0d00", min: 0, max: 65 },
    { color: "#F59B02", min: 66, max: 75 },
    { color: "#f0dc02", min: 76, max: 85 },
    { color: "#9de20f", min: 86, max: 92 },
    { color: "#0de627", min: 93, max: 100 },
  ],
  readinessScore: [
    { color: "#DE350B", min: 0, max: 65 },
    { color: "#FD9F28", min: 66, max: 80 },
    { color: "#00875A", min: 81, max: 100 },
  ],
};

function loadHeatmapConfig(): HeatmapConfig {
  const saved = localStorage.getItem("heatmapConfig");
  const version = localStorage.getItem("heatmapConfigVersion");

  // Setelan lama dibuang kalau versinya sudah usang atau belum ada.
  if (version !== "2.0") {
    localStorage.setItem("heatmapConfigVersion", "2.0");
    localStorage.setItem("heatmapConfig", JSON.stringify(DEFAULT_HEATMAP_CONFIG));
    return DEFAULT_HEATMAP_CONFIG;
  }

  if (saved) {
    const parsed = JSON.parse(saved);
    // Migrasi setelan lama: needSuccessors → readinessScore.
    if (parsed.needSuccessors && !parsed.readinessScore) {
      parsed.readinessScore = DEFAULT_HEATMAP_CONFIG.readinessScore;
      delete parsed.needSuccessors;
    }
    // readinessScore harus tepat 3 tingkat.
    if (parsed.readinessScore && parsed.readinessScore.length !== 3) {
      parsed.readinessScore = DEFAULT_HEATMAP_CONFIG.readinessScore;
    }
    return parsed;
  }
  return DEFAULT_HEATMAP_CONFIG;
}

export default function App({ initialTab }: { initialTab?: string } = {}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isDataEditorOpen, setIsDataEditorOpen] = useState(false);
  const [isHeatmapSettingsOpen, setIsHeatmapSettingsOpen] = useState(false);
  const [isVariableDialogOpen, setIsVariableDialogOpen] = useState(false);

  // Data opsional yang dicetak di kartu (modal "Filter Card Data").
  const [visibleColumns, setVisibleColumns] = useState({
    gender: false,
    city: false,
    maritalStatus: false,
    performance: false,
    iq: false,
    capability: false,
    commitment: false,
    contribution: false,
  });
  const visibleFieldCount = Object.values(visibleColumns).filter(Boolean).length;

  const [heatmapConfig, setHeatmapConfig] = useState<HeatmapConfig>(loadHeatmapConfig);

  // Layer yang menyala; asalnya `?tab=` bila ada (lihat layersForTab).
  const [v2Layers, setV2Layers] = useState<Set<LayerId>>(() => layersForTab(initialTab));
  /*
   * Navigasi sisi klien dari Beranda tidak me-mount ulang komponen ini, jadi
   * perubahan `?tab=` harus diikuti di sini. Memakai pola "sesuaikan state saat
   * prop berubah" (membandingkan saat render) alih-alih efek, supaya tidak ada
   * satu render yang sempat menampilkan layar dengan layer lama.
   */
  const [appliedTab, setAppliedTab] = useState(initialTab);
  if (initialTab !== appliedTab) {
    setAppliedTab(initialTab);
    setV2Layers(layersForTab(initialTab));
  }

  // Mode riwayat: kanvas penuh layar + timeline peristiwa di bawah.
  const [orgHistoryMode, setOrgHistoryMode] = useState(false);

  const toggleV2Layer = (id: LayerId) => {
    setV2Layers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        // Layer yang sedang dikunci layer lain tidak bisa dimatikan sendiri —
        // matikan dulu layer yang menyalakannya (lihat LAYER_REQUIRES).
        if (isLayerLocked(id, prev)) return prev;
        next.delete(id);
      } else {
        next.add(id);
        const required = LAYER_REQUIRES[id];
        if (required) next.add(required);
      }
      return next;
    });
  };

  // Data dimuat dari store kanonik saat dibuka; kalau gagal, jatuh ke penyimpanan lokal.
  useEffect(() => {
    loadEmployeesFromCanonical()
      .then(setEmployees)
      .catch((err) => {
        console.error("Failed to load employees, falling back to localStorage:", err);
        setEmployees(dataManager.getEmployees());
      })
      .finally(() => setIsLoadingData(false));
  }, []);

  // Dipanggil editor data setelah ada perubahan.
  const handleDataChange = () => {
    setEmployees(dataManager.getEmployees());
  };

  const handleHeatmapConfigSave = (newConfig: HeatmapConfig) => {
    setHeatmapConfig(newConfig);
    localStorage.setItem("heatmapConfig", JSON.stringify(newConfig));
    toast.success("Heatmap settings saved successfully!");
  };

  const orgChart = useMemo(() => buildOrgChart(employees), [employees]);

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8f9fa]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#016699] border-t-transparent rounded-full animate-spin" />
          <span className="font-['Open_Sans',_sans-serif] text-[14px] text-[#6c757d]">Loading employee data...</span>
        </div>
      </div>
    );
  }

  if (orgChart.length === 0) {
    return <div className="size-full flex items-center justify-center">No org chart data available</div>;
  }

  return (
    <TooltipProvider>
      <Toaster position="top-center" />

      <VismapV2
        orgChart={orgChart}
        heatmapConfig={heatmapConfig}
        activeLayers={v2Layers}
        historyMode={orgHistoryMode}
        visibleColumns={visibleColumns}
        onToggleLayer={toggleV2Layer}
        top={HEADER_HEIGHT}
      />

      {/*
        Bilah kendali di pojok kanan atas kanvas.

        `fixed`, jadi digeser turun setinggi header aplikasi — kalau tetap di top:0
        ia menutupi header dan judul menunya tidak terlihat. Mode riwayat menutupi
        sidebar dan header, jadi bilahnya ikut pindah ke pojok layar dan naik di atas
        kanvas riwayat (z-index 70).

        Tanpa latar putih dan `pointer-events: none`: bilah yang selebar layar untuk
        beberapa tombol cuma memotong kanvas, dan bilah tak terlihat yang masih
        menangkap klik akan memakan geseran kanvas di jalurnya. Kendali di dalamnya
        menyalakan kembali pointer-events-nya sendiri.
      */}
      <div
        data-no-drag
        className="fixed right-0 px-4 flex flex-col"
        style={{
          left: orgHistoryMode ? 0 : "var(--sidebar-w, 220px)",
          top: orgHistoryMode ? 0 : HEADER_HEIGHT,
          zIndex: orgHistoryMode ? 70 : 50,
          pointerEvents: "none",
        }}
      >
        <div className="flex items-center justify-end py-2">
          <div className="flex gap-2 items-center" style={{ pointerEvents: "auto" }}>
            {/* Filter Card Data — di mode riwayat disembunyikan: layarnya sedang
                dipakai menonton pergerakan kartu. Tombol ikon, karena barisnya berdiri
                di atas kanvas dan tiap teks memakan lebar peta; jumlah kolom aktif
                tetap terbaca lewat Indicator dan label tooltip-nya. */}
            {!orgHistoryMode && (
              <DsTooltip
                label={`Filter Card Data${visibleFieldCount > 0 ? ` — ${visibleFieldCount} data aktif` : ""}`}
              >
                <Indicator label={visibleFieldCount} size={16} disabled={visibleFieldCount === 0} color="primary">
                  <ActionIcon
                    data-no-drag
                    variant="subtle"
                    size="lg"
                    aria-label="Filter Card Data"
                    onClick={() => setIsVariableDialogOpen(true)}
                  >
                    <Filter className="w-4 h-4" />
                  </ActionIcon>
                </Indicator>
              </DsTooltip>
            )}

            {/* Org History — Ghost = variant "subtle"; saat modenya aktif jadi
                "filled" supaya keadaan menyala/mati terbaca tanpa warna buatan sendiri. */}
            <DsTooltip label={orgHistoryMode ? "Keluar dari Org History" : "Org History — riwayat perubahan struktur"}>
              <ActionIcon
                data-no-drag
                variant={orgHistoryMode ? "filled" : "subtle"}
                size="lg"
                aria-label={orgHistoryMode ? "Keluar dari Org History" : "Org History"}
                onClick={() => setOrgHistoryMode((v) => !v)}
              >
                {orgHistoryMode ? <X className="w-4 h-4" /> : <History className="w-4 h-4" />}
              </ActionIcon>
            </DsTooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Tombol ikon tanpa teks → ActionIcon (design system mewajibkan
                    aria-label). Tooltip-nya pakai atribut title: Radix dan Mantine
                    sama-sama meminta ref pada anak tunggal ini, dan menumpuk
                    keduanya membuat menu dropdown berhenti terbuka. */}
                <ActionIcon data-no-drag variant="subtle" size="lg" title="Settings" aria-label="Settings">
                  <Settings className="w-4 h-4" />
                </ActionIcon>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="font-['Open_Sans',_sans-serif]">
                <DropdownMenuItem onClick={() => setIsDataEditorOpen(true)}>Setting Employee Data</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsHeatmapSettingsOpen(true)}>Setting Heatmap Condition</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <DataEditor
        isOpen={isDataEditorOpen}
        onClose={() => setIsDataEditorOpen(false)}
        onDataChange={handleDataChange}
        visibleColumns={visibleColumns}
      />

      <HeatmapSettings
        isOpen={isHeatmapSettingsOpen}
        onClose={() => setIsHeatmapSettingsOpen(false)}
        currentConfig={heatmapConfig}
        onSave={handleHeatmapConfigSave}
      />

      <DataVisibilityModal
        open={isVariableDialogOpen}
        onOpenChange={setIsVariableDialogOpen}
        visibleColumns={visibleColumns}
        onApply={setVisibleColumns}
      />
    </TooltipProvider>
  );
}
