import { ref, get, update, push, set } from "firebase/database";
import { db } from "./firebase";
import type { Gallery, Exhibits, GrantAward, Exhibit } from "../types/exhibits";

/**
 * Fetches the exhibits data once from the Realtime Database.
 * @returns {Promise<any>} The parsed exhibits data payload
 */
export async function getExhibits() {
  try {
    // 1. Create a reference pointing to the 'exhibits' node
    const exhibitsRef = ref(db, "exhibits");

    // 2. Fetch a single snapshot of the data
    const snapshot = await get(exhibitsRef);

    if (snapshot.exists()) {
      return snapshot.val(); // Extract the actual JSON data
    } else {
      console.warn("No exhibits data found at this path.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching exhibits:", error);
    throw error;
  }
}

export async function saveGalleries(
  galleries: Record<string, Gallery>,
): Promise<void> {
  const updatedGalleries: Partial<Exhibits> = { galleries };

  await update(ref(db, "exhibits"), updatedGalleries);
}

export async function createGalleryItem(gallery: Gallery) {
  const galleriesListRef = ref(db, "exhibits/galleries");
  const newRef = push(galleriesListRef);
  await set(newRef, gallery);
  return newRef.key;
}

export async function updateGalleryItem(key: string, gallery: Gallery) {
  const itemRef = ref(db, `exhibits/galleries/${key}`);
  await update(itemRef, gallery);
}

export async function saveGrantAwards(
  grantsAndAwards: Record<string, GrantAward>,
): Promise<void> {
  const updatedGrantsAndAwards: Partial<Exhibits> = { grantsAndAwards };

  await update(ref(db, "exhibits"), updatedGrantsAndAwards);
}

export async function createGrantAwardItem(grantAward: GrantAward) {
  const grantsAndAwardsListRef = ref(db, "exhibits/grantsAndAwards");
  const newRef = push(grantsAndAwardsListRef);
  await set(newRef, grantAward);
  return newRef.key;
}

export async function updateGrantAwardItem(
  key: string,
  grantAward: GrantAward,
) {
  const itemRef = ref(db, `exhibits/grantsAndAwards/${key}`);
  await update(itemRef, grantAward);
}

export async function saveSoloExhibits(
  solo: Record<string, Exhibit>,
): Promise<void> {
  const updatedSolo: Partial<Exhibits> = { solo };

  await update(ref(db, "exhibits"), updatedSolo);
}

export async function createSoloExhibitItem(solo: Exhibit) {
  const soloListRef = ref(db, "exhibits/solo");
  const newRef = push(soloListRef);
  await set(newRef, solo);
  return newRef.key;
}

export async function updateSoloExhibitItem(key: string, solo: Exhibit) {
  const itemRef = ref(db, `exhibits/solo/${key}`);
  await update(itemRef, solo);
}

export async function saveJuriedExhibits(
  juried: Record<string, Exhibit>,
): Promise<void> {
  const updatedJuried: Partial<Exhibits> = { juried };

  await update(ref(db, "exhibits"), updatedJuried);
}

export async function createJuriedExhibitItem(juried: Exhibit) {
  const juriedListRef = ref(db, "exhibits/juried");
  const newRef = push(juriedListRef);
  await set(newRef, juried);
  return newRef.key;
}

export async function updateJuriedExhibitItem(key: string, juried: Exhibit) {
  const itemRef = ref(db, `exhibits/juried/${key}`);
  await update(itemRef, juried);
}
