import { ref, get } from "firebase/database";
import { db } from "./firebase";

/**
 * Fetches the biography data once from the Realtime Database.
 * @returns {Promise<any>} The parsed biography data payload
 */
export async function getBiography() {
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
