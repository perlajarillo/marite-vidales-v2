import { ref, get, update, push, set } from "firebase/database";
import { db, storage } from "./firebase";
import type { Review, Reviews, ReviewsData } from "../types/reviews";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
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

export async function saveReviews(reviews: Reviews): Promise<void> {
  const updatedReviews: Partial<ReviewsData> = { reviews };

  await update(ref(db, "reviews"), updatedReviews);
}

export async function createReviewItem(review: Review) {
  const reviewsListRef = ref(db, "reviews/reviews");
  const newRef = push(reviewsListRef);
  await set(newRef, review);
  return newRef.key;
}

export async function updateReviewItem(key: string, review: Review) {
  const itemRef = ref(db, `reviews/reviews/${key}`);
  await update(itemRef, review);
}

export async function saveReviewsPhoto(picture: File): Promise<void> {
  const fileName = `${Date.now()}_${picture.name}`;
  const pictureRef = storageRef(storage, `reviews/${fileName}`);
  const uploadedPicture = await uploadBytes(pictureRef, picture);
  const pictureUrl = await getDownloadURL(uploadedPicture.ref);
  const updatedPhoto: Partial<ReviewsData> = { photo: { pictureUrl } };
  await update(ref(db, "reviews"), updatedPhoto);
}
