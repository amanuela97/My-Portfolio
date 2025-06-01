import { DocumentData, WithFieldValue } from "firebase-admin/firestore";
import { adminFirestore } from "./firebase-admin";
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
  resumeUrl: null,
};

// Initialize portfolio data if it doesn't exist
export const initializePortfolioData = async () => {
  try {
    const sections = Object.keys(initialPortfolioData) as PortfolioSection[];
    for (const section of sections) {
      const docRef = adminFirestore.doc(`${PORTFOLIO_COLLECTION}/${section}`);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        const data = JSON.parse(
          JSON.stringify(initialPortfolioData[section as keyof PortfolioData])
        );
        await docRef.set(data);
        console.log(`Initialized ${section} section`);
      }
    }
  } catch (error) {
    console.error("Error initializing portfolio data:", error);
    throw error;
  }
};

export const getPortfolioData = async (): Promise<Partial<PortfolioData>> => {
  try {
    const collectionRef = adminFirestore.collection(PORTFOLIO_COLLECTION);

    try {
      const snapshot = await collectionRef.limit(1).get();

      if (snapshot.empty) {
        console.log("No documents found, initializing portfolio data...");
        await initializePortfolioData();
        // Fetch again after initialization
        const querySnapshot = await collectionRef.get();
        const portfolioData: Partial<PortfolioData> = {};
        querySnapshot.forEach((doc) => {
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
              portfolioData[section] = data.items as Experience[];
              break;
            case "projects":
              portfolioData[section] = data.items as Project[];
              break;
            case "writing":
              portfolioData[section] = data.items as Writing[];
              break;
            case "resume":
              portfolioData.resumeUrl = data.resumeUrl || data.url || null;
              break;
          }
        });
        return portfolioData;
      } else {
        console.log("Documents found, returning data...");
        const querySnapshot = await collectionRef.get();
        const portfolioData: Partial<PortfolioData> = {};
        querySnapshot.forEach((doc) => {
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
              portfolioData[section] = data.items as Experience[];
              break;
            case "projects":
              portfolioData[section] = data.items as Project[];
              break;
            case "writing":
              portfolioData[section] = data.items as Writing[];
              break;
            case "resume":
              portfolioData.resumeUrl = data.resumeUrl || data.url || null;
              break;
          }
        });
        return portfolioData;
      }
    } catch (error) {
      console.error("Error accessing Firestore:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error getting portfolio data:", error);
    throw error;
  }
};

export const updatePortfolioSection = async <T>(
  section: PortfolioSection,
  data: T
) => {
  try {
    const docRef = adminFirestore.doc(`${PORTFOLIO_COLLECTION}/${section}`);
    await docRef.set(data as WithFieldValue<DocumentData>);
  } catch (error) {
    console.error(`Error updating ${section}:`, error);
    throw error;
  }
};
