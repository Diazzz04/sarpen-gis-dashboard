import { supabase } from "../lib/supabase";

export async function getSites() {
  const batchSize = 1000;
  let allSites = [];
  let from = 0;

  while (true) {
    const to = from + batchSize - 1;

    const { data, error } = await supabase
      .from("sites")
      .select("*")
      .order("id", { ascending: true })
      .range(from, to);

    if (error) {
      console.error("Gagal mengambil data site:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      break;
    }

    allSites = [...allSites, ...data];

    console.log(
      `Mengambil data site: ${from + 1}-${from + data.length}`
    );

    if (data.length < batchSize) {
      break;
    }

    from += batchSize;
  }

  console.log("Total site dari Supabase:", allSites.length);

  return allSites;
}


// ========================================
// TAMBAH SITE
// ========================================

export async function addSite(site) {
  const { data, error } = await supabase
    .from("sites")
    .insert([site])
    .select()
    .single();

  if (error) {
    console.error("Gagal menambahkan site:", error);
    throw error;
  }

  return data;
}


// ========================================
// EDIT SITE
// ========================================

export async function updateSite(id, site) {
  const { data, error } = await supabase
    .from("sites")
    .update(site)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Gagal mengubah site:", error);
    throw error;
  }

  return data;
}


// ========================================
// HAPUS SITE
// ========================================

export async function deleteSite(id) {
  const { error } = await supabase
    .from("sites")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Gagal menghapus site:", error);
    throw error;
  }

  return true;
}