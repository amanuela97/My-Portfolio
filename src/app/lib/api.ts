// lib/auth.ts
import { signInWithPopup, AuthError } from "firebase/auth";
import { auth, googleProvider, storage, db } from "./firebase-client";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  PortfolioData,
  PortfolioSection,
  Hero,
  About,
  Contact,
  Experience,
  Project,
  Writing,
} from "./types";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  setDoc,
} from "firebase/firestore";

const ALLOWED_EMAILS = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(",");
const PORTFOLIO_COLLECTION = "portfolio";

// Initial data structure
const initialPortfolioData: PortfolioData = {
  hero: {
    profileImageUrl: null,
    name: "Amanuel Zewdie",
    jobTitle: "Software Engineer",
    subtitle:
      "i building dynamic, solution oriented, and user-friendly applications",
  },
  about: {
    description:
      "My name is Amanuel and I am a developer with a passion for building dynamic, solution oriented, and user-friendly applications. I am skilled in various aspects of the software development cycle, with hand-on experience in both frontend and backend development.",
  },
  contact: {
    title: "Get in Touch",
    email: "babyzewdie@gmail.com",
    phone: "+1 (123) 456-7890",
    social: {
      linkedin: "https://www.linkedin.com/in/amanuel-zewdie-ayezabu-86271a1a0/",
      github: "https://github.com/amanuela97",
      stackoverflow: "https://stackoverflow.com/users/15756133/amanuela97",
    },
  },
  experience: [],
  projects: [],
  writing: [],
};

// Initialize portfolio data if it doesn't exist
const initializePortfolioData = async () => {
  try {
    const sections = Object.keys(initialPortfolioData) as PortfolioSection[];
    for (const section of sections) {
      const docRef = doc(db, `${PORTFOLIO_COLLECTION}/${section}`);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // Convert the data to a plain object before setting
        const data = JSON.parse(JSON.stringify(initialPortfolioData[section]));
        await setDoc(docRef, data);
        console.log(`Initialized ${section} section`);
      }
    }
  } catch (error) {
    console.error("Error initializing portfolio data:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    // Configure auth settings for popup
    auth.settings.appVerificationDisabledForTesting = true;

    // Set popup configuration
    const provider = googleProvider;
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!ALLOWED_EMAILS?.includes(user.email ?? "")) {
      await auth.signOut();
      throw new Error("Access denied: unauthorized email.");
    }
    return user;
  } catch (error) {
    console.error("Google Sign-in error:", error);
    // Handle specific Firebase Auth errors
    if (error instanceof Error) {
      const authError = error as AuthError;
      if (authError.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in cancelled by user");
      } else if (authError.code === "auth/popup-blocked") {
        throw new Error(
          "Popup was blocked by the browser. Please allow popups and try again."
        );
      }
    }
    throw error;
  }
};

export const uploadImage = async (
  file: File,
  path: string
): Promise<string> => {
  const storageRef = ref(storage, `portfolio/${path}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

export const updatePortfolioSection = async <T extends DocumentData>(
  section: PortfolioSection,
  data: T
) => {
  try {
    const docRef = doc(db, `${PORTFOLIO_COLLECTION}/${section}`);
    // Wrap array data in an object for Firestore compatibility
    if (Array.isArray(data)) {
      await setDoc(docRef, { items: data });
    } else {
      await setDoc(docRef, data);
    }
  } catch (error) {
    console.error(`Error updating ${section}:`, error);
    throw error;
  }
};

export const getPortfolioData = async (): Promise<Partial<PortfolioData>> => {
  try {
    // Check if collection exists and initialize if needed
    const collectionRef = collection(db, PORTFOLIO_COLLECTION);
    try {
      const snapshot = await getDocs(collectionRef);

      if (snapshot.empty) {
        console.log("No documents found, initializing portfolio data...");
        await initializePortfolioData();
        // Fetch again after initialization
        const querySnapshot = await getDocs(collectionRef);
        const portfolioData: Partial<PortfolioData> = {};
        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
          const section = doc.id as PortfolioSection;
          const data = doc.data();
          switch (section) {
            case "hero":
              portfolioData[section] = data as Hero;
              break;
            case "about":
              portfolioData[section] = data as About;
              break;
            case "contact":
              portfolioData[section] = data as Contact;
              break;
            case "experience":
              portfolioData[section] = (data.items || []) as Experience[];
              break;
            case "projects":
              portfolioData[section] = (data.items || []) as Project[];
              break;
            case "writing":
              portfolioData[section] = (data.items || []) as Writing[];
              break;
          }
        });
        return portfolioData;
      }
      console.log("Documents found, returning data...");
      const querySnapshot = await getDocs(collectionRef);
      const portfolioData: Partial<PortfolioData> = {};
      querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        const section = doc.id as PortfolioSection;
        const data = doc.data();
        switch (section) {
          case "hero":
            portfolioData[section] = data as Hero;
            break;
          case "about":
            portfolioData[section] = data as About;
            break;
          case "contact":
            portfolioData[section] = data as Contact;
            break;
          case "experience":
            portfolioData[section] = (data.items || []) as Experience[];
            break;
          case "projects":
            portfolioData[section] = (data.items || []) as Project[];
            break;
          case "writing":
            portfolioData[section] = (data.items || []) as Writing[];
            break;
        }
      });
      return portfolioData;
    } catch (error) {
      console.error("Error accessing Firestore:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in getPortfolioData:", error);
    throw error;
  }
};

export const getPortfolioSection = async <T>(
  section: PortfolioSection
): Promise<T | null> => {
  try {
    const docRef = doc(db, `${PORTFOLIO_COLLECTION}/${section}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching ${section}:`, error);
    throw error;
  }
};
