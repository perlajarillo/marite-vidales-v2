import { ref, get } from "firebase/database";
import { db } from "./firebase";

/**
 * Fetches the reviews data once from the Realtime Database.
 * @returns {Promise<any}} The parsed reviews data payload
 */
export async function getReviews() {
  try {
    // 1. Create a reference pointing to the 'reviews' node
    const reviewsRef = ref(db, "reviews");

    // 2. Fetch a single snapshot of the data
    const snapshot = await get(reviewsRef);

    if (snapshot.exists()) {
      return snapshot.val(); // Extract the actual JSON data
    } else {
      console.warn("No reviews data found at this path.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}
