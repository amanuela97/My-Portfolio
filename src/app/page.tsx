import { getPortfolioData } from "./lib/api";
import { PortfolioData } from "./lib/types";
import { Sidebar } from "./components/sidebar";
import { About } from "./components/about";
import { Experience } from "./components/experience";
import { Projects } from "./components/projects";
import { Writings } from "./components/writings";

export const revalidate = 60; // Revalidate every minute

async function getInitialData(): Promise<Partial<PortfolioData>> {
  try {
    return await getPortfolioData();
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return {};
  }
}

export default async function HomePage() {
  const data = await getInitialData();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950 text-slate-200 font-inter">
      {/* Fixed sidebar on desktop, top section on mobile */}
      <div className="lg:w-[400px] lg:fixed lg:inset-y-0">
        <Sidebar hero={data.hero} contact={data.contact} />
      </div>

      {/* Main content - scrollable on desktop */}
      <main className="flex-1 lg:ml-[400px] p-6 lg:p-12">
        <div className="max-w-3xl mx-auto">
          <About about={data.about} />
          <Experience experience={data.experience} />
          <Projects projects={data.projects} />
          <Writings writings={data.writing} />
        </div>
      </main>
    </div>
  );
}
