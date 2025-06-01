import { About as AboutType } from "../lib/types";

interface AboutProps {
  about?: AboutType;
}

export function About({ about }: AboutProps) {
  if (!about) return null;

  return (
    <section id="about" className="py-12 lg:py-24">
      <h2 className="text-2xl font-bold text-purple-400 mb-8">About</h2>
      <div className="text-slate-300 text-sm">
        <div className="whitespace-pre-wrap">{about.description}</div>
      </div>
    </section>
  );
}
