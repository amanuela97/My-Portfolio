"use client";

import Image from "next/image";
import { Hero, Contact } from "../lib/types";
import { useActiveSection } from "../hooks/use-active-section";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaStackOverflow,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaTwitch,
  FaMedium,
} from "react-icons/fa";

interface SidebarProps {
  hero?: Hero;
  contact?: Contact;
}

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "writing", label: "Writing" },
];

export function Sidebar({ hero, contact }: SidebarProps) {
  const activeSection = useActiveSection();
  if (!hero || !contact) return null;

  const socialIcons = [
    { icon: FaLinkedin, url: contact.social.linkedin, label: "LinkedIn" },
    { icon: FaGithub, url: contact.social.github, label: "GitHub" },
    { icon: FaTwitter, url: contact.social.twitter, label: "Twitter" },
    {
      icon: FaStackOverflow,
      url: contact.social.stackoverflow,
      label: "Stack Overflow",
    },
    { icon: FaFacebook, url: contact.social.facebook, label: "Facebook" },
    { icon: FaInstagram, url: contact.social.instagram, label: "Instagram" },
    { icon: FaYoutube, url: contact.social.youtube, label: "YouTube" },
    { icon: FaTiktok, url: contact.social.tiktok, label: "TikTok" },
    { icon: FaTwitch, url: contact.social.twitch, label: "Twitch" },
    { icon: FaMedium, url: contact.social.medium, label: "Medium" },
  ].filter((icon) => icon.url); // Only show icons with URLs

  return (
    <aside className="lg:h-screen bg-slate-900 p-6 lg:p-8 flex flex-col">
      <div className="flex flex-col items-center text-center">
        <Image
          src={hero.profileImageUrl || "/placeholder.webp"}
          alt={hero.name}
          width={140}
          height={140}
          className="rounded-full w-40 h-40 object-cover"
          priority
        />
        <h1 className="text-4xl font-bold text-purple-400 mt-4">{hero.name}</h1>
        <h2 className="text-xl text-slate-300 mt-1">{hero.jobTitle}</h2>
        <p className="text-slate-400 text-sm mt-2">{hero.subtitle}</p>

        <nav className="hidden lg:block w-full mt-8">
          <ul className="space-y-3 text-sm font-bold">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`transition-all duration-200 border-l-2 pl-4 block ${
                    activeSection === item.id
                      ? "text-purple-400 border-purple-400"
                      : "text-slate-400 hover:text-purple-400 border-slate-800 hover:border-purple-400"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-auto pt-8 lg:pt-6">
        <div className="text-center text-sm space-y-1">
          <a
            href={`mailto:${contact.email}`}
            className="text-slate-400 hover:text-purple-400 transition-colors block"
          >
            {contact.email}
          </a>
          <a
            href={`tel:${contact.phone}`}
            className="text-slate-400 hover:text-purple-400 transition-colors block"
          >
            {contact.phone}
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {socialIcons.map(({ icon: Icon, url, label }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-purple-400 transition-colors"
              title={label}
            >
              <Icon className="w-5 h-5" />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
