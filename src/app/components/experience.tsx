import Image from "next/image";
import { Experience as ExperienceType } from "../lib/types";
import { Badge } from "./ui/badge";
import { ResumeLink } from "./resume-link";

interface ExperienceProps {
  experience?: ExperienceType[];
  resumeUrl?: string | null;
}

export function Experience({ experience, resumeUrl }: ExperienceProps) {
  if (!experience?.length) return null;

  return (
    <section id="experience" className="py-12">
      <h2 className="text-2xl font-bold text-purple-400 mb-8">Experience</h2>
      <div className="space-y-12">
        {experience.map((exp, index) => (
          <div
            key={index}
            className="border-l-2 border-slate-800 pl-6 relative"
          >
            <div className="absolute w-3 h-3 bg-purple-400 rounded-full -left-[7px] top-1"></div>
            <p className="text-xs text-slate-500 mb-1">{exp.duration}</p>
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={exp.logoUrl || "/placeholder.webp"}
                  alt={`${exp.company} logo`}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 flex flex-wrap items-center gap-2">
                {exp.position}
                <span className="text-purple-400">• {exp.company}</span>
              </h3>
            </div>
            <p className="mt-2 text-slate-400">{exp.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {exp.technologies.map((tech, techIndex) => (
                <Badge
                  key={techIndex}
                  variant="outline"
                  className="bg-slate-900 text-purple-300 border-purple-800 hover:bg-slate-800"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ResumeLink resumeUrl={resumeUrl} />
    </section>
  );
}
