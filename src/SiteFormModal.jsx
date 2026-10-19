import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
  strategic_bisnis_unit: "",
  jenis_pop: "",
  lokasi: "",
  pop_name: "",
  pop_id: "",
  lat: "",
  long: "",
  perangkat: "",
  tahun: "",
  jumlah: "",
  baps: "",
  basmp: "",
};

function SiteFormModal({
  mode,
  site,
  saving,
  sites,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(emptyForm);

  const sbuOptions = Array.from(
  new Set(
    (sites || [])
      .map((item) => item.strategic_bisnis_unit)
      .filter(Boolean)
  )
).sort();

const jenisPopOptions = Array.from(
  new Set(
    (sites || [])
      .map((item) => item.jenis_pop)
      .filter(Boolean)
  )
).sort();

  useEffect(() => {
    if (mode === "edit" && site) {
      setForm({
        strategic_bisnis_unit:
          site.strategic_bisnis_unit ?? "",
        jenis_pop: site.jenis_pop ?? "",
        lokasi: site.lokasi ?? "",
        pop_name: site.pop_name ?? "",
        pop_id: site.pop_id ?? "",
        lat: site.lat ?? "",
        long: site.long ?? "",
        perangkat: site.perangkat ?? "",
        tahun: site.tahun ?? "",
        jumlah: site.jumlah ?? "",
        baps: site.baps ?? "",
        basmp: site.basmp ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [mode, site]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      strategic_bisnis_unit:
        form.strategic_bisnis_unit || null,

      jenis_pop:
        form.jenis_pop || null,

      lokasi:
        form.lokasi || null,

      pop_name:
        form.pop_name || null,

      pop_id:
        form.pop_id || null,

      lat:
        form.lat === ""
          ? null
          : Number(form.lat),

      long:
        form.long === ""
          ? null
          : Number(form.long),

      perangkat:
        form.perangkat || null,

      tahun:
        form.tahun === ""
          ? null
          : Number(form.tahun),

      jumlah:
        form.jumlah === ""
          ? null
          : Number(form.jumlah),

      baps:
        form.baps || null,

      basmp:
        form.basmp || null,
    };

    onSave(payload);
  };

  return (
    <div
      className="crud-modal-overlay"
      onClick={onClose}
    >
      <div
        className="crud-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="crud-modal-header">
          <div>
            <h2>
              {mode === "add"
                ? "Tambah Site"
                : "Edit Site"}
            </h2>

            <p>
              {mode === "add"
                ? "Tambahkan data site baru"
                : "Perbarui informasi site"}
            </p>
          </div>

          <button
            type="button"
            className="crud-close-button"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>


        <form
          className="crud-form"
          onSubmit={handleSubmit}
        >

          <div className="crud-form-grid">

            <div className="crud-field">
              <label>
                POP Name
              </label>

              <input
                name="pop_name"
                value={form.pop_name}
                onChange={handleChange}
                placeholder="Nama POP"
              />
            </div>


            <div className="crud-field">
              <label>
                POP ID
              </label>

              <input
                name="pop_id"
                value={form.pop_id}
                onChange={handleChange}
                placeholder="POP ID"
              />
            </div>


<div className="crud-field">
  <label>
    Strategic Bisnis Unit
  </label>

  <select
    name="strategic_bisnis_unit"
    value={form.strategic_bisnis_unit}
    onChange={handleChange}
  >
    <option value="">
      Pilih Strategic Bisnis Unit
    </option>

    {sbuOptions.map((sbu) => (
      <option
        key={sbu}
        value={sbu}
      >
        {sbu}
      </option>
    ))}
  </select>
</div>

<div className="crud-field">
  <label>
    Jenis POP
  </label>

  <select
    name="jenis_pop"
    value={form.jenis_pop}
    onChange={handleChange}
  >
    <option value="">
      Pilih Jenis POP
    </option>

    {jenisPopOptions.map((jenis) => (
      <option
        key={jenis}
        value={jenis}
      >
        {jenis}
      </option>
    ))}
  </select>
</div>


            <div className="crud-field crud-field-full">
              <label>
                Lokasi
              </label>

              <input
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                placeholder="Lokasi"
              />
            </div>


            <div className="crud-field">
              <label>
                Perangkat
              </label>

              <input
                name="perangkat"
                value={form.perangkat}
                onChange={handleChange}
                placeholder="Perangkat"
              />
            </div>


            <div className="crud-field">
              <label>
                Tahun
              </label>

              <input
                type="number"
                name="tahun"
                value={form.tahun}
                onChange={handleChange}
                placeholder="Tahun"
              />
            </div>


            <div className="crud-field">
              <label>
                Jumlah
              </label>

              <input
                type="number"
                name="jumlah"
                value={form.jumlah}
                onChange={handleChange}
                placeholder="Jumlah"
              />
            </div>


            <div className="crud-field">
              <label>
                BAPS
              </label>

              <input
                name="baps"
                value={form.baps}
                onChange={handleChange}
                placeholder="BAPS"
              />
            </div>


            <div className="crud-field">
              <label>
                BASMP
              </label>

              <input
                name="basmp"
                value={form.basmp}
                onChange={handleChange}
                placeholder="BASMP"
              />
            </div>


            <div className="crud-field">
              <label>
                Latitude
              </label>

              <input
                type="number"
                step="any"
                name="lat"
                value={form.lat}
                onChange={handleChange}
                placeholder="Latitude"
              />
            </div>


            <div className="crud-field">
              <label>
                Longitude
              </label>

              <input
                type="number"
                step="any"
                name="long"
                value={form.long}
                onChange={handleChange}
                placeholder="Longitude"
              />
            </div>

          </div>


          <div className="crud-modal-footer">

            <button
              type="button"
              className="crud-cancel-button"
              onClick={onClose}
              disabled={saving}
            >
              Batal
            </button>

            <button
              type="submit"
              className="crud-save-button"
              disabled={saving}
            >
              {saving
                ? "Menyimpan..."
                : mode === "add"
                  ? "Tambah Site"
                  : "Simpan Perubahan"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default SiteFormModal;