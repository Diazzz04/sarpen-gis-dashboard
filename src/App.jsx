import { useMemo, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { supabase } from "./lib/supabase";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  LayoutDashboard,
  Map as MapIcon,
  Database,
  BarChart3,
  Search,
  MapPin,
  Server,
  Package,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  UserCircle,
  ChevronDown,
  LogOut,
} from "lucide-react";

import {
  getSites,
  addSite,
  updateSite,
  deleteSite,
} from "./services/sitesService";
import MapView from "./MapView";
import DataTable from "./DataTable";
import SiteFormModal from "./SiteFormModal";

import "./App.css";

function AuthScreen() {
  const [authPage, setAuthPage] =
    useState("login");


  if (authPage === "register") {
    return (
      <Register
        onLogin={() =>
          setAuthPage("login")
        }
      />
    );
  }


  if (authPage === "forgot") {
    return (
      <ForgotPassword
        onBackToLogin={() =>
          setAuthPage("login")
        }
      />
    );
  }


  if (authPage === "reset") {
    return (
      <ResetPassword
        onBackToLogin={() =>
          setAuthPage("login")
        }
      />
    );
  }


  return (
    <Login
      onRegister={() =>
        setAuthPage("register")
      }

      onForgotPassword={() =>
        setAuthPage("forgot")
      }
    />
  );
}

function DashboardApp() {
  const { user, loading, logout, profile } = useAuth();
  const [sites, setSites] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [sitesError, setSitesError] = useState(null);

  useEffect(() => {
    const loadSites = async () => {
    try {
      setSitesLoading(true);
      setSitesError(null);

      const data = await getSites();

      setSites(data);
    } catch (error) {
      console.error("Gagal memuat data site:", error);
      setSitesError(error.message || "Gagal memuat data site.");
    } finally {
      setSitesLoading(false);
    }
  };

  loadSites();
    }, []);


  const isAdmin = profile?.role === "admin";


  // KODE DASHBOARD LAMA KAMU LANJUT DI SINI

  // ========================================
  // STATE
  // ========================================

  const [activePage, setActivePage] = useState("dashboard");

  const [selectedMapSite, setSelectedMapSite] = useState(null);

  const [search, setSearch] = useState("");

  const [crudModalOpen, setCrudModalOpen] = useState(false);
const [crudMode, setCrudMode] = useState("add");
const [editingSite, setEditingSite] = useState(null);
const [crudSaving, setCrudSaving] = useState(false);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [selectedSbu, setSelectedSbu] = useState("Semua");

  const [selectedJenisPop, setSelectedJenisPop] =
    useState("Semua");

  const [selectedTahun, setSelectedTahun] =
    useState("Semua");


  // ========================================
  // OPTION FILTER
  // ========================================

  const sbuOptions = useMemo(() => {

    const values = sites
      .map((site) => site.strategic_bisnis_unit)
      .filter(Boolean);

    return [
      "Semua",
      ...Array.from(new Set(values)).sort(),
    ];

  }, [sites]);


  const jenisPopOptions = useMemo(() => {

    const values = sites
      .map((site) => site.jenis_pop)
      .filter(Boolean);

    return [
      "Semua",
      ...Array.from(new Set(values)).sort(),
    ];

  }, [sites]);


  const tahunOptions = useMemo(() => {

    const values = sites
      .map((site) => site.tahun)
      .filter(Boolean);

    return [
      "Semua",
      ...Array.from(
        new Set(values.map(String))
      ).sort(),
    ];

  }, [sites]);


  // ========================================
  // FILTER DATA
  // ========================================

  const filteredSites = useMemo(() => {

    return sites.filter((site) => {

      const keyword =
        search.toLowerCase().trim();

      const matchesSearch =
        !keyword ||
        String(site.pop_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(site.pop_id || "")
          .toLowerCase()
          .includes(keyword) ||
        String(site.lokasi || "")
          .toLowerCase()
          .includes(keyword);


      const matchesSbu =
        selectedSbu === "Semua" ||
        site.strategic_bisnis_unit === selectedSbu;


      const matchesJenisPop =
        selectedJenisPop === "Semua" ||
        site.jenis_pop === selectedJenisPop;


      const matchesTahun =
        selectedTahun === "Semua" ||
        String(site.tahun) === String(selectedTahun);


      return (
        matchesSearch &&
        matchesSbu &&
        matchesJenisPop &&
        matchesTahun
      );

    });

  }, [
    sites,
    search,
    selectedSbu,
    selectedJenisPop,
    selectedTahun,
  ]);


  // ========================================
  // RESET FILTER
  // ========================================

  const resetFilter = () => {

    setSearch("");

    setSelectedSbu("Semua");

    setSelectedJenisPop("Semua");

    setSelectedTahun("Semua");

  };


  // ========================================
  // STATISTIK
  // ========================================

  const totalSite = filteredSites.length;

  const totalWithCoordinate = filteredSites.filter(
  (site) =>
    site.lat !== null &&
    site.long !== null &&
    !isNaN(Number(site.lat)) &&
    !isNaN(Number(site.long))
  ).length;

  const totalWithoutCoordinate =
  totalSite - totalWithCoordinate;

  const totalPerangkat = filteredSites.reduce(
    (total, site) =>
      total + (Number(site.jumlah) || 0),
    0
  );

  const totalSbu = new Set(
    filteredSites
      .map(
        (site) =>
          site.strategic_bisnis_unit
      )
      .filter(Boolean)
  ).size;


  // ========================================
  // LIHAT SITE DI PETA
  // ========================================

  const handleViewMap = (site) => {

    setSelectedMapSite(site);

    setActivePage("map");

  };

  const handleAddSite = () => {
  if (!isAdmin) return;

  setCrudMode("add");
  setEditingSite(null);
  setCrudModalOpen(true);
};

const handleEditSite = (site) => {
  if (!isAdmin) return;

  setCrudMode("edit");
  setEditingSite(site);
  setCrudModalOpen(true);
};

const handleDeleteSite = async (site) => {
  if (!isAdmin) return;

  const confirmed = window.confirm(
    `Apakah Anda yakin ingin menghapus site "${site.pop_name || site.pop_id || "ini"}"?`
  );

  if (!confirmed) return;

  try {
    await deleteSite(site.id);

    const data = await getSites();
    setSites(data);

    alert("Site berhasil dihapus.");
  } catch (error) {
    console.error("Gagal menghapus site:", error);
    alert(
      `Gagal menghapus site: ${
        error.message || "Terjadi kesalahan."
      }`
    );
  }
};

const handleSaveSite = async (formData) => {
  if (!isAdmin) return;

  try {
    setCrudSaving(true);

    if (crudMode === "add") {
      await addSite(formData);
      alert("Site berhasil ditambahkan.");
    } else {
      await updateSite(editingSite.id, formData);
      alert("Site berhasil diperbarui.");
    }

    const data = await getSites();
    setSites(data);

    setCrudModalOpen(false);
    setEditingSite(null);
  } catch (error) {
    console.error("Gagal menyimpan site:", error);

    alert(
      `Gagal menyimpan site: ${
        error.message || "Terjadi kesalahan."
      }`
    );
  } finally {
    setCrudSaving(false);
  }
};

  // ========================================
  // DATA STATISTIK
  // ========================================

  const statisticsBySbu = useMemo(() => {

  const result = {};

  filteredSites.forEach((site) => {

    const name =
      site.strategic_bisnis_unit ||
      "Tidak diketahui";

    result[name] =
      (result[name] || 0) + 1;

  });

  return Object.entries(result)
    .map(([name, total]) => ({
      name,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  }, [filteredSites]);

  const statisticsBySbuTahun = useMemo(() => {
  const result = {};

  filteredSites.forEach((site) => {
    const sbu =
      site.strategic_bisnis_unit || "Tidak diketahui";

    const tahun = String(site.tahun ?? "");

    if (!result[sbu]) {
      result[sbu] = {
        name: sbu,
        tahun2021: 0,
        tahun2022: 0,
        tahun2023: 0,
      };
    }

    if (tahun === "2021") {
      result[sbu].tahun2021 += 1;
    } else if (tahun === "2022") {
      result[sbu].tahun2022 += 1;
    } else if (tahun === "2023") {
      result[sbu].tahun2023 += 1;
    }
  });

  return Object.values(result).sort(
    (a, b) =>
      b.tahun2021 +
      b.tahun2022 +
      b.tahun2023 -
      (a.tahun2021 + a.tahun2022 + a.tahun2023)
  );
}, [filteredSites]);


  const statisticsByJenisPop = useMemo(() => {

  const result = {};

  filteredSites.forEach((site) => {

    const name =
      site.jenis_pop ||
      "Tidak diketahui";

    result[name] =
      (result[name] || 0) + 1;

  });

  return Object.entries(result)
    .map(([name, total]) => ({
      name,
      total,
    }))
    .sort((a, b) => b.total - a.total);

  }, [filteredSites]);


  const statisticsByTahun = useMemo(() => {

  const result = {};

  filteredSites.forEach((site) => {

    const name =
      site.tahun ||
      "Tidak diketahui";

    result[name] =
      (result[name] || 0) + 1;

  });

  return Object.entries(result)
    .map(([name, total]) => ({
      name: String(name),
      total,
    }))
    .sort((a, b) =>
      Number(a.name) - Number(b.name)
    );

  }, [filteredSites]);


  // ========================================
  // MENU
  // ========================================

  const menuItems = [

    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      id: "map",
      label: "Peta GIS",
      icon: MapIcon,
    },

    {
      id: "data",
      label: "Data Site",
      icon: Database,
    },

    {
      id: "stats",
      label: "Statistik",
      icon: BarChart3,
    },

  ];


  // ========================================
  // RENDER
  // ========================================

  if (sitesLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          color: "#64748b",
        }}
      >
        Memuat data site...
      </div>
    );
  }

  if (sitesError) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          fontSize: "14px",
          color: "#64748b",
        }}
      >
        <strong>Gagal memuat data site</strong>
        <span>{sitesError}</span>
      </div>
    );
  }

  return (

    <div className="app">

      {/* ================================= */}
      {/* SIDEBAR */}
      {/* ================================= */}

      <aside className="sidebar">


        <div className="menu">

          <p className="menu-title">
            MENU
          </p>


          {menuItems.map((item) => {

            const Icon = item.icon;

            return (

              <button
                key={item.id}
                className={`menu-item ${
                  activePage === item.id
                    ? "active"
                    : ""
                }`}
                onClick={() => {

                  setActivePage(item.id);

                  if (item.id !== "map") {
                    setSelectedMapSite(null);
                  }

                }}
              >

                <Icon size={20} />

                <span>
                  {item.label}
                </span>

              </button>

            );

          })}

        </div>

      </aside>


      {/* ================================= */}
      {/* MAIN */}
      {/* ================================= */}

      <main className="main">


        {/* HEADER */}

  <header className="header">

  <div>
    <h1>
      {activePage === "dashboard" && "Dashboard GIS"}
      {activePage === "map" && "Peta GIS"}
      {activePage === "data" && "Data Site"}
      {activePage === "stats" && "Statistik Site"}
    </h1>
  </div>

  <div className="header-right">

    {/* SEARCH */}
    <div className="header-search">

      <Search size={18} />

      <input
        type="text"
        placeholder="POP Name, POP ID atau lokasi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </div>


    {/* PROFILE */}
    <div className="profile-menu">

      <button
        className="profile-button"
        onClick={() =>
          setProfileMenuOpen(!profileMenuOpen)
        }
      >

        <UserCircle size={22} />

        <div className="profile-button-info">

          <strong>
            {profile?.full_name || user?.email || "User"}
          </strong>

          <span>
            {profile?.role === "admin"
              ? "Administrator"
              : "User"}
          </span>

        </div>

        <ChevronDown
          size={16}
          className={
            profileMenuOpen
              ? "profile-chevron open"
              : "profile-chevron"
          }
        />

      </button>


      {/* DROPDOWN */}
      {profileMenuOpen && (

        <div className="profile-dropdown">

          <div className="profile-dropdown-header">

            <div className="profile-avatar">
              <UserCircle size={28} />
            </div>

            <div>

              <strong>
                {profile?.full_name || "User"}
              </strong>

              <span>
                {user?.email}
              </span>

            </div>

          </div>


          <div className="profile-divider" />


          <div className="profile-detail">

            <span>Role</span>

            <strong>
              {profile?.role === "admin"
                ? "Administrator"
                : "User"}
            </strong>

          </div>


          <button
            className="logout-button"
            onClick={async () => {

              try {
                await logout();
              } catch (error) {
                console.error(
                  "Gagal logout:",
                  error
                );
              }

            }}
          >

            <LogOut size={17} />

            <span>Logout</span>

          </button>

        </div>

      )}

    </div>

  </div>

  </header>


        {/* CONTENT */}

        <section className="content">


          {/* ================================= */}
          {/* FILTER */}
          {/* ================================= */}

          {(activePage === "dashboard" ||
            activePage === "map" ||
            activePage === "data")}


          {/* ================================= */}
          {/* HASIL FILTER */}
          {/* ================================= */}

          {(activePage === "dashboard" ||
            activePage === "map" ||
            activePage === "data") && (

            <div className="result-info">

            </div>

          )}


          {/* ================================= */}
          {/* DASHBOARD */}
          {/* ================================= */}

  {activePage === "dashboard" && (
  <div className="dashboard-page">

    {/* STATISTICS */}
    <div className="stats">

      <div className="stat-card">
        <div className="stat-icon">
          <MapPin size={20} />
        </div>

        <div>
          <span>Total Site</span>
          <br/>
          <strong>{totalSite}</strong>
        </div>
      </div>




      <div className="stat-card">
        <div className="stat-icon">
          <Package size={20} />
        </div>

        <div>
          <span>Total Perangkat</span>
          <br/>
          <strong>{totalPerangkat}</strong>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <Server size={20} />
        </div>

        <div>
          <span>Total SBU</span>
          <br/>
          <strong>{totalSbu}</strong>
        </div>
      </div>


       <div className="dashboard-card">
  <div className="dashboard-card-header">

      <h2>Site berdasarkan Tahun</h2>

  </div>

  <div className="dashboard-chart dashboard-donut-chart">
    <ResponsiveContainer width="100%" height="100%">
      
      <PieChart>
<Pie
  data={statisticsByTahun}
  dataKey="total"
  nameKey="name"
  cx="40%"
  cy="50%"
  innerRadius={25}
  outerRadius={55}
  paddingAngle={3}
>
  {statisticsByTahun.map((entry, index) => (
    <Cell
      key={`tahun-${entry.name}`}
      fill={["#2563eb", "#10b981", "#f59e0b"][index % 3]}
    />
  ))}
</Pie>

<Tooltip />

<Legend
  layout="vertical"
  align="right"
  verticalAlign="middle"
  iconType="square"
/>


      </PieChart>
    </ResponsiveContainer>
  </div>
</div>

    </div>

   

    {/* DASHBOARD SUMMARY */}
    <div className="dashboard-grid">

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <div>
            <h2>Distribusi Site berdasarkan SBU</h2>
            <p>Jumlah site pada setiap Strategic Bisnis Unit</p>
          </div>
        </div>

        <div className="dashboard-chart">
          <ResponsiveContainer width="100%" height="100%">

<BarChart
  data={statisticsBySbuTahun}
  margin={{
    top: 10,
    right: 20,
    left: 10,
    bottom: 10,
  }}
  barGap={4}
  barCategoryGap="18%"
>
  <CartesianGrid strokeDasharray="3 3" />

  <XAxis
    dataKey="name"
    tick={{ fontSize: 11 }}
    interval={0}
  />

  <YAxis />

  <Tooltip />

  <Legend />

  <Bar
    dataKey="tahun2021"
    name="2021"
    fill="#2563eb"
    radius={[4, 4, 0, 0]}
  />

  <Bar
    dataKey="tahun2022"
    name="2022"
    fill="#10b981"
    radius={[4, 4, 0, 0]}
  />

  <Bar
    dataKey="tahun2023"
    name="2023"
    fill="#f59e0b"
    radius={[4, 4, 0, 0]}
  />
</BarChart>

          </ResponsiveContainer>
        </div>
      </div>



    </div>


  </div>
  )}


          {/* ================================= */}
          {/* PETA GIS */}
          {/* ================================= */}

  {activePage === "map" && (
  <div className="gis-page">

    <div className="gis-header">


      <div className="gis-header-info">
        {filteredSites.length} site
      </div>
    </div>

    <div className="gis-map-wrapper">

      <div className="gis-filter-panel">

        <select
          value={selectedSbu}
          onChange={(e) => setSelectedSbu(e.target.value)}
        >
          {sbuOptions.map((item) => (
            <option key={item} value={item}>
              {item === "Semua" ? "Semua SBU" : item}
            </option>
          ))}
        </select>

        <select
          value={selectedJenisPop}
          onChange={(e) => setSelectedJenisPop(e.target.value)}
        >
          {jenisPopOptions.map((item) => (
            <option key={item} value={item}>
              {item === "Semua" ? "Semua Jenis POP" : item}
            </option>
          ))}
        </select>

        <select
          value={selectedTahun}
          onChange={(e) => setSelectedTahun(e.target.value)}
        >
          {tahunOptions.map((item) => (
            <option key={item} value={item}>
              {item === "Semua" ? "Semua Tahun" : item}
            </option>
          ))}
        </select>

        <button
          className="gis-reset-button"
          onClick={resetFilter}
        >
          <RotateCcw size={15} />
          Reset
        </button>

      </div>



      <div className="gis-map">
        <MapView
          sites={filteredSites}
          selectedSite={selectedMapSite}
        />
      </div>

    </div>

  </div>
)}

          {/* ================================= */}
          {/* DATA SITE */}
          {/* ================================= */}

          {activePage === "data" && (

          <DataTable
            sites={filteredSites}
            onViewMap={handleViewMap}
            isAdmin={isAdmin}
            onAdd={handleAddSite}
            onEdit={handleEditSite}
            onDelete={handleDeleteSite}
          />

          

          )}

          {crudModalOpen && (
  <SiteFormModal
    mode={crudMode}
    site={editingSite}
    saving={crudSaving}
    sites={sites}
    onClose={() => {
      setCrudModalOpen(false);
      setEditingSite(null);
    }}
    onSave={handleSaveSite}
  />
)}


          {/* ================================= */}
          {/* STATISTIK */}
          {/* ================================= */}

          {activePage === "stats" && (

  <div className="statistics-page">

    {/* ================================= */}
    {/* GRAFIK SBU */}
    {/* ================================= */}

    <div className="chart-card">

      <div className="chart-header">

        <div>

          <h2>
            Site Berdasarkan SBU
          </h2>

          <p>
            Jumlah site berdasarkan
            Strategic Bisnis Unit
          </p>

        </div>

      </div>


      <div className="chart-container">

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart
            data={statisticsBySbu}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 70,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              interval={0}
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#2563eb"
              name="Jumlah Site"
              radius={[5, 5, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>


    {/* ================================= */}
    {/* GRAFIK JENIS POP */}
    {/* ================================= */}

    <div className="chart-card">

      <div className="chart-header">

        <div>

          <h2>
            Site Berdasarkan Jenis POP
          </h2>

          <p>
            Distribusi site berdasarkan
            jenis POP
          </p>

        </div>

      </div>


      <div className="chart-container">

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart
            data={statisticsByJenisPop}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 70,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              interval={0}
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#2563eb"
              name="Jumlah Site"
              radius={[5, 5, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>


    {/* ================================= */}
    {/* GRAFIK TAHUN */}
    {/* ================================= */}

    <div className="chart-card">

      <div className="chart-header">

        <div>

          <h2>
            Site Berdasarkan Tahun
          </h2>

          <p>
            Jumlah site berdasarkan
            tahun data
          </p>

        </div>

      </div>


      <div className="chart-container">

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart
            data={statisticsByTahun}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 30,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#2563eb"
              name="Jumlah Site"
              radius={[5, 5, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>

  )}

  {crudModalOpen && (
  <SiteFormModal
    mode={crudMode}
    site={editingSite}
    saving={crudSaving}
    sites={sites}
    onClose={() => {
      setCrudModalOpen(false);
      setEditingSite(null);
    }}
    onSave={handleSaveSite}
  />
)}

        </section>

      </main>

    </div>

  );

  }

  function App() {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            color: "#64748b",
          }}
        >
          Memuat aplikasi...
        </div>
      );
    }


    // Halaman reset password
    if (
      window.location.pathname ===
      "/reset-password"
    ) {
      return (
        <ResetPassword
          onBackToLogin={async () => {
            await supabase.auth.signOut();

            window.history.replaceState(
              {},
              "",
              "/"
            );

            window.location.reload();
          }}
        />
      );
    }


    if (!user) {
      return <AuthScreen />;
    }


    return <DashboardApp />;
  }


export default App;