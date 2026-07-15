import { ref, get } from "firebase/database";
import { db } from "./firebase";

/**
 * Fetches the series data once from the Realtime Database.
 * @returns {Promise<any>} The parsed series data payload
 */
export async function getSeries() {
  try {
    // 1. Create a reference pointing to the 'series' node
    const seriesRef = ref(db, "series");

    // 2. Fetch a single snapshot of the data
    const snapshot = await get(seriesRef);

    if (snapshot.exists()) {
      return snapshot.val(); // Extract the actual JSON data
    } else {
      console.warn("No series data found at this path.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching series:", error);
    throw error;
  }
}
