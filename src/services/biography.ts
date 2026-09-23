import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { get, push, ref, set, update } from "firebase/database";
import { db, storage } from "./firebase";
import type { Biography, EducationItem } from "../types/biography";

/**
 * Fetches the biography data once from the Realtime Database.
 * @returns {Promise<any>} The parsed biography data payload
 */
export async function getBiography(): Promise<Biography | null> {
  try {
    // 1. Create a reference pointing to the 'biography' node
    const biographyRef = ref(db, "biography");

    // 2. Fetch a single snapshot of the data
    const snapshot = await get(biographyRef);

    if (snapshot.exists()) {
      return snapshot.val(); // Extract the actual JSON data
    } else {
      console.warn("No biography data found at this path.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching biography:", error);
    throw error;
  }
}

export async function saveBiographySummary(
  summary: string,
  picture?: File,
): Promise<void> {
  const biography: Partial<Biography> = { summary };

  if (picture) {
    const pictureRef = storageRef(storage, `biography/${picture.name}`);
    const uploadedPicture = await uploadBytes(pictureRef, picture);
    biography.pictureUrl = await getDownloadURL(uploadedPicture.ref);
  }

  await update(ref(db, "biography"), biography);
}

export async function saveBiographyEducation(
  education: Record<string, EducationItem>,
): Promise<void> {
  const updatedEducation: Partial<Biography> = { education };

  await update(ref(db, "biography"), updatedEducation);
}

export async function createEducationItem(education: EducationItem) {
  const educationListRef = ref(db, "biography/education");
  const newRef = push(educationListRef);
  await set(newRef, education);
  return newRef.key;
}

export async function updateEducationItem(
  key: string,
  education: Record<string, EducationItem>,
) {
  const itemRef = ref(db, `biography/education/${key}`);
  await update(itemRef, education);
}
