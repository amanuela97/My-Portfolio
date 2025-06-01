import { About as AboutType } from "../lib/types";

interface AboutProps {
  about?: AboutType;
}

export function About({ about }: AboutProps) {
  if (!about) return null;

  const renderTextWithLinks = (text: string, links: AboutType["links"]) => {
    if (!links?.length) {
      return text.split("\n").map((line, i) => (
        <p key={i} className="mb-4">
          {line}
        </p>
      ));
    }

    // Split text into paragraphs first
    const paragraphs = text.split("\n");

    return paragraphs.map((paragraph, paragraphIndex) => {
      const result = [];
      let lastIndex = 0;

      // Find links that belong to this paragraph
      const paragraphStart =
        text.split("\n").slice(0, paragraphIndex).join("\n").length +
        (paragraphIndex > 0 ? 1 : 0);
      const paragraphEnd = paragraphStart + paragraph.length;

      const paragraphLinks = links.filter((link) => {
        const linkStart = link.startIndex;
        const linkEnd = link.endIndex;
        return linkStart >= paragraphStart && linkEnd <= paragraphEnd;
      });

      // Process links within this paragraph
      for (const link of paragraphLinks) {
        const relativeStart = link.startIndex - paragraphStart;
        const relativeEnd = link.endIndex - paragraphStart;

        // Add text before the link
        if (relativeStart > lastIndex) {
          result.push(paragraph.slice(lastIndex, relativeStart));
        }

        // Add the link
        result.push(
          <a
            key={`link-${link.startIndex}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            {link.text}
          </a>
        );

        lastIndex = relativeEnd;
      }

      // Add remaining text after the last link
      if (lastIndex < paragraph.length) {
        result.push(paragraph.slice(lastIndex));
      }

      return (
        <p key={paragraphIndex} className="mb-4">
          {result}
        </p>
      );
    });
  };

  return (
    <section id="about" className="py-12">
      <h2 className="text-2xl font-bold text-purple-400 mb-8">About</h2>
      <div className="text-slate-400 space-y-4">
        {renderTextWithLinks(about.description, about.links)}
      </div>
    </section>
  );
}
