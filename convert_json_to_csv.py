import json
import pandas as pd

input_file = "src/data/sites.json"
output_file = "sites_import.csv"

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

columns = [
    "strategic_bisnis_unit",
    "jenis_pop",
    "lokasi",
    "pop_name",
    "pop_id",
    "lat",
    "long",
    "perangkat",
    "tahun",
    "jumlah",
    "baps",
    "basmp"
]

df = pd.DataFrame(data)

df = df[columns]

df.to_csv(
    output_file,
    index=False,
    encoding="utf-8-sig"
)

print("===================================")
print("BERHASIL!")
print("===================================")
print(f"Jumlah data : {len(df)}")
print(f"File CSV    : {output_file}")
print("===================================")