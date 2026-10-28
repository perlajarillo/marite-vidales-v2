import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { ref, get, update, push, set } from "firebase/database";
import { db, storage } from "./firebase";
import type {
  Gallery,
  Exhibits,
  GrantAward,
  Exhibit,
  ExhibitPicture,
} from "../types/exhibits";

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

export async function saveGroupExhibits(
  selected: Record<string, Exhibit>,
): Promise<void> {
  const updatedGroup: Partial<Exhibits> = { selected };

  await update(ref(db, "exhibits"), updatedGroup);
}

export async function createGroupExhibitItem(selected: Exhibit) {
  const groupListRef = ref(db, "exhibits/selected");
  const newRef = push(groupListRef);
  await set(newRef, selected);
  return newRef.key;
}

export async function updateGroupExhibitItem(key: string, selected: Exhibit) {
  const itemRef = ref(db, `exhibits/selected/${key}`);
  await update(itemRef, selected);
}

export async function saveCarouselExhibits(
  carousel: Record<string, ExhibitPicture>,
): Promise<void> {
  const updatedCarousel: Partial<Exhibits> = { carousel };

  await update(ref(db, "exhibits"), updatedCarousel);
}

export async function createCarouselExhibitItem(
  carouselItem: ExhibitPicture,
  picture?: File,
) {
  if (picture) {
    const uniqueFileName = `${Date.now()}_${picture.name}`;
    const pictureRef = storageRef(storage, `exhibits/${uniqueFileName}`);
    const uploadedPicture = await uploadBytes(pictureRef, picture);
    carouselItem.url = await getDownloadURL(uploadedPicture.ref);
  }
  const groupListRef = ref(db, "exhibits/carousel");
  const newRef = push(groupListRef);
  await set(newRef, carouselItem);
  return newRef.key;
}

export async function createCarouselExhibitItems(
  carouselItems: ExhibitPicture[],
  filesArray: File[],
) {
  try {
    // 1. Map each file to an individual upload promise
    const uploadPromises = filesArray.map(async (file) => {
      // Create a unique path/filename inside your bucket
      const uniqueFileName = `${Date.now()}_${file.name}`;
      const storageImgRef = storageRef(storage, `exhibits/${uniqueFileName}`);

      // Upload the single file
      await uploadBytes(storageImgRef, file);

      // Get and return its public download URL
      const downloadURL = await getDownloadURL(storageImgRef);
      return downloadURL;
    });

    // 2. Execute all upload promises concurrently
    const uploadedImages = await Promise.all(uploadPromises);

    // 3. Prepare the multi-path block update object
    const bulkUpdateObject: Record<string, ExhibitPicture> = {};
    const itemsRef = ref(db, "exhibits/carousel");

    carouselItems.forEach((carouselItem, index) => {
      // Generate a unique, timestamp-based key via push() without writing to the db yet
      const newId = push(itemsRef).key;

      // Define the object structure combining user data and the image metadata
      const itemData = {
        ...carouselItem,
        url: uploadedImages[index],
      };
      if (newId) {
        // Construct the absolute path inside the JSON tree
        bulkUpdateObject[`/exhibits/carousel/${newId}`] = itemData;
      }
    });

    // 4. Commit all items to the Realtime Database in a single atomic block write
    await update(ref(db), bulkUpdateObject);

    console.log("Successfully saved all items in batch!", bulkUpdateObject);
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
}

export async function updateCarouselItem(
  key: string,
  carouselItem: ExhibitPicture,
) {
  const itemRef = ref(db, `exhibits/carousel/${key}`);
  await update(itemRef, carouselItem);
}
