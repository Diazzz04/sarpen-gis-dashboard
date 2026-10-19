import { useMemo, useState } from "react";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MapPin,
  Eye,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";


function DataTable({
  sites,
  onViewMap,
  isAdmin,
  onAdd,
  onEdit,
  onDelete,
}) {

  // =========================
  // STATE
  // =========================

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [sortConfig, setSortConfig] =
    useState({
      key: null,
      direction: "asc",
    });

  const [selectedSite, setSelectedSite] =
    useState(null);


  // Jumlah data per halaman
  const itemsPerPage = 15;

  const sbuOptions = useMemo(() => {
  return Array.from(
    new Set(
      sites
        .map((site) => site.strategic_bisnis_unit)
        .filter(Boolean)
    )
  ).sort();
}, [sites]);


const jenisPopOptions = useMemo(() => {
  return Array.from(
    new Set(
      sites
        .map((site) => site.jenis_pop)
        .filter(Boolean)
    )
  ).sort();
}, [sites]);


  // =========================
  // SEARCH
  // =========================

  const searchedSites = useMemo(() => {

    const keyword = search
      .toLowerCase()
      .trim();


    if (!keyword) {
      return sites;
    }


    return sites.filter((site) => {

      return (
        String(site.pop_name || "")
          .toLowerCase()
          .includes(keyword) ||

        String(site.pop_id || "")
          .toLowerCase()
          .includes(keyword) ||

        String(site.lokasi || "")
          .toLowerCase()
          .includes(keyword) ||

        String(site.perangkat || "")
          .toLowerCase()
          .includes(keyword) ||

        String(site.strategic_bisnis_unit || "")
          .toLowerCase()
          .includes(keyword)
      );

    });

  }, [sites, search]);


  // =========================
  // SORTING
  // =========================

  const sortedSites = useMemo(() => {

    const data = [...searchedSites];


    if (!sortConfig.key) {
      return data;
    }


    data.sort((a, b) => {

      const valueA =
        String(
          a[sortConfig.key] ?? ""
        ).toLowerCase();


      const valueB =
        String(
          b[sortConfig.key] ?? ""
        ).toLowerCase();


      if (valueA < valueB) {
        return sortConfig.direction === "asc"
          ? -1
          : 1;
      }


      if (valueA > valueB) {
        return sortConfig.direction === "asc"
          ? 1
          : -1;
      }


      return 0;

    });


    return data;

  }, [searchedSites, sortConfig]);


  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    sortedSites.length / itemsPerPage
  );


  const startIndex =
    (currentPage - 1) * itemsPerPage;


  const currentSites =
    sortedSites.slice(
      startIndex,
      startIndex + itemsPerPage
    );


  // =========================
  // SORT HANDLER
  // =========================

  const handleSort = (key) => {

    setCurrentPage(1);


    setSortConfig((current) => {

      if (current.key === key) {

        return {
          key,
          direction:
            current.direction === "asc"
              ? "desc"
              : "asc",
        };

      }


      return {
        key,
        direction: "asc",
      };

    });

  };


  // =========================
  // SEARCH HANDLER
  // =========================

  const handleSearch = (value) => {

    setSearch(value);

    setCurrentPage(1);

  };


  // =========================
  // PAGE CHANGE
  // =========================

  const changePage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

  };


  // =========================
  // RESET PAGE JIKA DATA BERUBAH
  // =========================

  if (
    currentPage > totalPages &&
    totalPages > 0
  ) {

    setCurrentPage(totalPages);

  }


  return (

    <div className="data-table-section">


      {/* =========================
          TABLE HEADER
      ========================= */}

<div className="table-toolbar">

  <div>

    <h2>
      Data Site
    </h2>

    <p>
      Menampilkan{" "}
      <strong>
        {sortedSites.length}
      </strong>{" "}
      data site
    </p>

  </div>

  <div className="table-toolbar-right">

    <div className="table-search">

      <Search size={17} />

      <input
        type="text"
        placeholder="Cari site..."
        value={search}
        onChange={(e) =>
          handleSearch(e.target.value)
        }
      />

    </div>

    {isAdmin && (
      <button
        className="add-site-button"
        onClick={onAdd}
      >
        <Plus size={17} />
        Tambah Site
      </button>
    )}

  </div>

      </div>


      {/* =========================
          TABLE
      ========================= */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>
                No
              </th>


              <th
                onClick={() =>
                  handleSort("pop_name")
                }
                className="sortable"
              >
                POP Name

                <ArrowUpDown size={14} />

              </th>


              <th
                onClick={() =>
                  handleSort("pop_id")
                }
                className="sortable"
              >
                POP ID

                <ArrowUpDown size={14} />

              </th>


              <th>
                SBU
              </th>


              <th>
                Jenis POP
              </th>


              <th>
                Lokasi
              </th>


              <th>
                Perangkat
              </th>


              <th>
                Tahun
              </th>


              <th>
                Jumlah
              </th>


              <th>
                BAPS
              </th>


              <th>
                BASMP
              </th>


              <th>
                Aksi
              </th>

            </tr>

          </thead>


          <tbody>

            {currentSites.length > 0 ? (

              currentSites.map(
                (site, index) => (

                  <tr
                    key={`${site.pop_id}-${index}`}
                  >

                    <td>
                      {startIndex + index + 1}
                    </td>


                    <td className="site-name">
                      {site.pop_name || "-"}
                    </td>


                    <td>
                      {site.pop_id || "-"}
                    </td>


                    <td>
                      {site.strategic_bisnis_unit || "-"}
                    </td>


                    <td>
                      {site.jenis_pop || "-"}
                    </td>


                    <td>
                      {site.lokasi || "-"}
                    </td>


                    <td>
                      {site.perangkat || "-"}
                    </td>


                    <td>
                      {site.tahun || "-"}
                    </td>


                    <td>
                      {site.jumlah || "-"}
                    </td>


                    <td>

                      <span
                        className={
                          site.baps === "Selesai"
                            ? "status-done"
                            : "status-other"
                        }
                      >
                        {site.baps || "-"}
                      </span>

                    </td>


                    <td>

                      <span
                        className={
                          site.basmp === "Selesai"
                            ? "status-done"
                            : "status-other"
                        }
                      >
                        {site.basmp || "-"}
                      </span>

                    </td>


                    <td>

<div className="table-actions">

  <button
    className="action-button"
    title="Lihat detail"
    onClick={() =>
      setSelectedSite(site)
    }
  >
    <Eye size={15} />
  </button>

  <button
    className="action-button"
    title="Lihat di peta"
    onClick={() =>
      onViewMap(site)
    }
  >
    <MapPin size={15} />
  </button>

  {isAdmin && (
    <>
      <button
        className="action-button"
        title="Edit site"
        onClick={() =>
          onEdit(site)
        }
      >
        <Pencil size={15} />
      </button>

      <button
        className="action-button"
        title="Hapus site"
        onClick={() =>
          onDelete(site)
        }
      >
        <Trash2 size={15} />
      </button>
    </>
  )}

</div>

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="12"
                  className="empty-table"
                >
                  Data tidak ditemukan
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* =========================
          PAGINATION
      ========================= */}

      {totalPages > 0 && (

        <div className="pagination">

          <div className="pagination-info">

            Menampilkan{" "}

            <strong>
              {startIndex + 1}
            </strong>

            {" - "}

            <strong>
              {Math.min(
                startIndex + itemsPerPage,
                sortedSites.length
              )}
            </strong>

            {" dari "}

            <strong>
              {sortedSites.length}
            </strong>

          </div>


          <div className="pagination-buttons">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                changePage(currentPage - 1)
              }
            >
              <ChevronLeft size={16} />
            </button>


            <span>
              Halaman{" "}
              <strong>
                {currentPage}
              </strong>{" "}
              dari{" "}
              <strong>
                {totalPages}
              </strong>
            </span>


            <button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                changePage(currentPage + 1)
              }
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

      )}


      {/* =========================
          DETAIL MODAL
      ========================= */}

      {selectedSite && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedSite(null)
          }
        >

          <div
            className="detail-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  Detail Site
                </h2>

                <p>
                  Informasi lengkap lokasi
                </p>

              </div>


              <button
                onClick={() =>
                  setSelectedSite(null)
                }
              >
                ×
              </button>

            </div>


            <div className="detail-grid">

              <div>
                <span>
                  POP Name
                </span>

                <strong>
                  {selectedSite.pop_name || "-"}
                </strong>
              </div>


              <div>
                <span>
                  POP ID
                </span>

                <strong>
                  {selectedSite.pop_id || "-"}
                </strong>
              </div>


              <div>
                <span>
                  Strategic Bisnis Unit
                </span>

                <strong>
                  {selectedSite.strategic_bisnis_unit || "-"}
                </strong>
              </div>


              <div>
                <span>
                  Jenis POP
                </span>

                <strong>
                  {selectedSite.jenis_pop || "-"}
                </strong>
              </div>


              <div>
                <span>
                  Lokasi
                </span>

                <strong>
                  {selectedSite.lokasi || "-"}
                </strong>
              </div>


              <div>
                <span>
                  Perangkat
                </span>

                <strong>
                  {selectedSite.perangkat || "-"}
                </strong>
              </div>


              <div>
                <span>
                  Tahun
                </span>

                <strong>
                  {selectedSite.tahun || "-"}
                </strong>
              </div>


              <div>
                <span>
                  Jumlah
                </span>

                <strong>
                  {selectedSite.jumlah || "-"}
                </strong>
              </div>


              <div>
                <span>
                  BAPS
                </span>

                <strong>
                  {selectedSite.baps || "-"}
                </strong>
              </div>


              <div>
                <span>
                  BASMP
                </span>

                <strong>
                  {selectedSite.basmp || "-"}
                </strong>
              </div>


              <div>
                <span>
                  Latitude
                </span>

                <strong>
                  {selectedSite.lat || "-"}
                </strong>
              </div>


              <div>
                <span>
                  Longitude
                </span>

                <strong>
                  {selectedSite.long || "-"}
                </strong>
              </div>

            </div>


            <button
              className="modal-map-button"
              onClick={() => {

                onViewMap(selectedSite);

                setSelectedSite(null);

              }}
            >

              <MapPin size={17} />

              Lihat Lokasi di Peta

            </button>

          </div>

        </div>

      )}

    </div>

  );
}

export default DataTable;