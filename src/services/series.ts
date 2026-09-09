import { ref, get, query, orderByChild, equalTo } from "firebase/database";
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

/**
 * Fetches a series matching a specific name property.
 * @param {string} seriesName - The exact name of the series to find.
 * @returns {Promise<any>}
 */
export async function getSeriesByName(seriesName: string) {
  try {
    const seriesRef = ref(db, "series");

    // Create a query filtering by the child field "name"
    const seriesQuery = query(
      seriesRef,
      orderByChild("name"),
      equalTo(seriesName),
    );

    const snapshot = await get(seriesQuery);

    if (snapshot.exists()) {
      return snapshot.val();
      // Returns an object containing matching items: { "-Nx123...": { name: "...", ... } }
    } else {
      console.warn(`No series found with name: ${seriesName}`);
      return null;
    }
  } catch (error) {
    console.error(`Error querying series by name (${seriesName}):`, error);
    throw error;
  }
}
