export interface Hero {
  profileImageUrl: string | null;
  name: string;
  jobTitle: string;
  subtitle: string;
}

export interface About {
  description: string;
}

export interface Social {
  linkedin?: string;
  github?: string;
  twitter?: string;
  stackoverflow?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  twitch?: string;
  medium?: string;
}

export interface Contact {
  title: string;
  email: string;
  phone: string;
  social: Social;
}

export interface Experience {
  position: string;
  company: string;
  duration: string;
  description: string;
  logoUrl: string | null;
  technologies: string[];
}

export interface Project {
  name: string;
  description: string;
  imageUrl: string | null;
  projectLink: string;
  technologies: string[];
}

export interface Writing {
  year: number;
  title: string;
  writingLink: string;
  imageUrl: string | null;
}

export interface PortfolioData {
  hero: Hero;
  about: About;
  contact: Contact;
  experience: Experience[];
  projects: Project[];
  writing: Writing[];
}

export type PortfolioSection = keyof PortfolioData;
