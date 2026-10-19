import { useEffect, useMemo } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// ========================================
// ICON DEFAULT LEAFLET
// ========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ========================================
// FUNGSI WARNA MARKER
// ========================================

function getMarkerColor(jenisPop) {

  const value = String(jenisPop || "").toLowerCase();

  if (value.includes("core")) {
    return "#2563eb";
  }

  if (value.includes("access")) {
    return "#16a34a";
  }

  if (value.includes("distribution")) {
    return "#f59e0b";
  }

  if (value.includes("pop")) {
    return "#9333ea";
  }

  return "#64748b";
}


// ========================================
// CUSTOM MARKER
// ========================================

function createCustomIcon(color) {

  return L.divIcon({

    className: "custom-gis-marker",

    html: `
      <div
        style="
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          background: ${color};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <div
          style="
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: white;
          "
        ></div>
      </div>
    `,

    iconSize: [30, 30],

    iconAnchor: [15, 30],

    popupAnchor: [0, -30],

  });

}


// ========================================
// MAP CONTROLLER
// ========================================

function MapController({ selectedSite }) {
  const map = useMap();

  // Menyesuaikan ukuran peta ketika browser di-zoom
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => clearTimeout(timer);
  }, [map]);

  // Memindahkan peta ke site yang dipilih
  useEffect(() => {
    if (
      selectedSite &&
      selectedSite.lat !== null &&
      selectedSite.long !== null &&
      !isNaN(Number(selectedSite.lat)) &&
      !isNaN(Number(selectedSite.long))
    ) {
      map.flyTo(
        [Number(selectedSite.lat), Number(selectedSite.long)],
        14,
        { duration: 1.5 }
      );
    }
  }, [selectedSite, map]);

  return null;
}


// ========================================
// LEGEND
// ========================================

function MapLegend() {
  return (
    <div className="map-legend">
      <div className="map-legend-title">
        Jenis POP
      </div>

      <div className="map-legend-item">
        <span className="legend-dot"></span>
        <span>ODC</span>
      </div>

      <div className="map-legend-item">
        <span className="legend-dot"></span>
        <span>Building</span>
      </div>

      <div className="map-legend-item">
        <span className="legend-dot"></span>
        <span>Shelter</span>
      </div>

      <div className="map-legend-item">
        <span className="legend-dot"></span>
        <span>mini pop</span>
      </div>

      <div className="map-legend-item">
        <span className="legend-dot"></span>
        <span>Lainnya</span>
      </div>
    </div>
  );
}


// ========================================
// MAP VIEW
// ========================================

function MapView({
  sites,
  selectedSite = null,
}) {

  // ======================================
  // VALID DATA
  // ======================================

  const validSites = sites.filter(
    (site) =>
      site.lat !== null &&
      site.long !== null &&
      !isNaN(Number(site.lat)) &&
      !isNaN(Number(site.long))
  );


  // ======================================
  // JENIS POP
  // ======================================

  const jenisPopList = useMemo(() => {

    return Array.from(
      new Set(
        validSites
          .map((site) => site.jenis_pop)
          .filter(Boolean)
      )
    ).slice(0, 5);

  }, [validSites]);


  return (

    <div
      style={{
        position: "relative",
        width: "100%",
        height: "550px",
      }}
    >

      {/* ================================= */}
      {/* MAP */}
      {/* ================================= */}

      <MapContainer
        center={[-2.5, 118]}
        zoom={5}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      >

        <MapController
          selectedSite={selectedSite}
        />


        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* =============================== */}
        {/* MARKER */}
        {/* =============================== */}

        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
          removeOutsideVisibleBounds={true}
        >

          {validSites.map((site, index) => {

            const color =
              getMarkerColor(
                site.jenis_pop
              );


            return (

              <Marker
                key={`${site.pop_id}-${index}`}
                position={[
                  Number(site.lat),
                  Number(site.long),
                ]}
                icon={createCustomIcon(color)}
              >

                <Popup>

                  <div className="site-popup">

                    <h3>
                      {site.pop_name ||
                        "Nama POP tidak tersedia"}
                    </h3>


                    <div className="popup-row">

                      <span>
                        POP ID
                      </span>

                      <strong>
                        {site.pop_id || "-"}
                      </strong>

                    </div>


                    <div className="popup-row">

                      <span>
                        SBU
                      </span>

                      <strong>
                        {site.strategic_bisnis_unit ||
                          "-"}
                      </strong>

                    </div>


                    <div className="popup-row">

                      <span>
                        Jenis POP
                      </span>

                      <strong>
                        {site.jenis_pop || "-"}
                      </strong>

                    </div>


                    <div className="popup-row">

                      <span>
                        Lokasi
                      </span>

                      <strong>
                        {site.lokasi || "-"}
                      </strong>

                    </div>


                    <div className="popup-row">

                      <span>
                        Perangkat
                      </span>

                      <strong>
                        {site.perangkat || "-"}
                      </strong>

                    </div>


                    <div className="popup-row">

                      <span>
                        Tahun
                      </span>

                      <strong>
                        {site.tahun || "-"}
                      </strong>

                    </div>


                    <div className="popup-row">

                      <span>
                        Jumlah
                      </span>

                      <strong>
                        {site.jumlah || "-"}
                      </strong>

                    </div>


                    <div className="popup-row">

                      <span>
                        BAPS
                      </span>

                      <strong>
                        {site.baps || "-"}
                      </strong>

                    </div>


                    <div className="popup-row">

                      <span>
                        BASMP
                      </span>

                      <strong>
                        {site.basmp || "-"}
                      </strong>

                    </div>


                    <div className="popup-coordinate">

                      {Number(site.lat).toFixed(6)}
                      {", "}
                      {Number(site.long).toFixed(6)}

                    </div>

                  </div>

                </Popup>

              </Marker>

            );

          })}

        </MarkerClusterGroup>

      </MapContainer>


      {/* ================================= */}
      {/* LEGEND */}
      {/* ================================= */}

      <MapLegend
        jenisPopList={jenisPopList}
      />


      {/* ================================= */}
      {/* INFO JUMLAH SITE */}
      {/* ================================= */}

      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "15px",
          zIndex: 1000,
          background: "white",
          padding: "10px 14px",
          borderRadius: "8px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.15)",
          fontSize: "13px",
        }}
      >

        <strong>
          {validSites.length}
        </strong>

        {" "}site memiliki koordinat

      </div>

    </div>

  );

}

export default MapView;