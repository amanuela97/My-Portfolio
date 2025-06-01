import Image from "next/image";
import { Project as ProjectType } from "../lib/types";
import { Badge } from "./ui/badge";
import { ExternalLink } from "lucide-react";

interface ProjectsProps {
  projects?: ProjectType[];
}

export function Projects({ projects }: ProjectsProps) {
  if (!projects?.length) return null;

  return (
    <section id="projects" className="py-12">
      <h2 className="text-2xl font-bold text-purple-400 mb-8">Projects</h2>
      <div className="space-y-12">
        {projects.map((project, index) => (
          <div key={index} className="group">
            <a
              href={project.projectLink}
              className="block bg-slate-900 rounded-lg overflow-hidden hover:bg-slate-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative">
                <Image
                  src={project.imageUrl || "/placeholder.webp"}
                  alt={project.name}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                  {project.name}
                </h3>
                <p className="mt-2 text-slate-400 text-sm">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="outline"
                      className="bg-slate-900 text-purple-300 border-purple-800"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
