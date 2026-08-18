import { ref, get } from "firebase/database";
import { db } from "./firebase";

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
