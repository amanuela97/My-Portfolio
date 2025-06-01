import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Writing as WritingType } from "../lib/types";

interface WritingsProps {
  writings?: WritingType[];
}

export function Writings({ writings }: WritingsProps) {
  if (!writings?.length) return null;

  return (
    <section id="writing" className="py-12 pb-24">
      <h2 className="section-title">Writing</h2>
      <div className="space-y-6">
        {writings.map((article, index) => (
          <a
            key={index}
            href={article.writingLink}
            className="flex gap-6 items-center bg-slate-900 p-6 rounded-lg hover:bg-slate-800 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="relative flex-shrink-0 w-16 h-16 sm:w-24 sm:h-24">
              <Image
                src={article.imageUrl || "/placeholder.webp"}
                alt={article.title || "Article"}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <p className="text-[var(--text-sm)] text-subtitle mb-1">
                {article.year}
              </p>
              <h3 className="text-lg text-content font-medium flex items-center gap-2">
                {article.title}
                <ExternalLink className="w-5 h-5 text-purple-400" />
              </h3>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="#"
          className="inline-flex items-center text-base text-purple-400 hover:text-purple-300 transition-colors"
        >
          View Full Writing Archive
          <svg
            className="ml-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
