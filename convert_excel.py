import pandas as pd

excel_file = "Database PS Sarpen 2021_2023 - v2.xlsx"
sheet_name = "Imp Ps_Sarpen_21_sd_23"

# Header sebenarnya berada di baris ke-3 Excel
# sehingga header=2
df = pd.read_excel(
    excel_file,
    sheet_name=sheet_name,
    header=2
)

# Kolom yang kita gunakan
columns = [
    "Strategic Bisnis Unit",
    "Jenis PoP",
    "Lokasi",
    "POP Name",
    "POP ID",
    "Lat",
    "Long",
    "Perangkat",
    "Tahun",
    "Jumlah",
    "BAPS",
    "BASMP"
]

# Ambil hanya kolom yang dibutuhkan
df = df[columns]

# Ubah nama kolom agar lebih mudah digunakan di React
df = df.rename(columns={
    "Strategic Bisnis Unit": "strategic_bisnis_unit",
    "Jenis PoP": "jenis_pop",
    "Lokasi": "lokasi",
    "POP Name": "pop_name",
    "POP ID": "pop_id",
    "Lat": "lat",
    "Long": "long",
    "Perangkat": "perangkat",
    "Tahun": "tahun",
    "Jumlah": "jumlah",
    "BAPS": "baps",
    "BASMP": "basmp"
})

# Ubah NaN menjadi null
df = df.where(pd.notna(df), None)

# Lokasi file JSON
output_file = "src/data/sites.json"

# Simpan menjadi JSON
df.to_json(
    output_file,
    orient="records",
    indent=2,
    force_ascii=False
)

print("===================================")
print("BERHASIL!")
print("===================================")
print(f"Jumlah data : {len(df)}")
print(f"File JSON   : {output_file}")
print("===================================")