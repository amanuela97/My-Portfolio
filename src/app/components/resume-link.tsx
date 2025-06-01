"use client";

interface ResumeButtonProps {
  resumeUrl: string | null | undefined;
}

export function ResumeLink({ resumeUrl }: ResumeButtonProps) {
  console.log("Resume URL in ResumeLink:", resumeUrl);

  const handleResumeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!resumeUrl) {
      e.preventDefault();
      return;
    }
  };

  return (
    <div className="mt-12 text-center">
      <a
        href={resumeUrl || "#"}
        onClick={handleResumeClick}
        download="resume.pdf"
        className={`inline-flex items-center text-base ${
          resumeUrl
            ? "text-purple-400 hover:text-purple-300"
            : "text-slate-500 cursor-not-allowed"
        } transition-colors group`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Full Resume
        <svg
          className="ml-2 w-5 h-5 transform transition-transform group-hover:-translate-y-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </a>
    </div>
  );
}
