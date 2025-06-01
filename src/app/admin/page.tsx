"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import {
  getPortfolioData,
  updatePortfolioSection,
  uploadImage,
} from "../lib/api";
import {
  PortfolioData,
  PortfolioSection,
  Hero,
  About,
  Contact,
  Experience,
  Project,
  Writing,
} from "../lib/types";
import { DocumentData } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { toast } from "sonner";
import Loading from "./loading";
import Image from "next/image";

const TechnologyInput = ({
  technologies,
  onChange,
}: {
  technologies: string[];
  onChange: (technologies: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        const newTech = inputValue.trim();
        if (!technologies.includes(newTech)) {
          onChange([...technologies, newTech]);
        }
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue) {
      onChange(technologies.slice(0, -1));
    }
  };

  const removeTechnology = (indexToRemove: number) => {
    onChange(technologies.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white min-h-[42px]">
        {technologies.map((tech, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {tech}
            <button
              type="button"
              onClick={() => removeTechnology(index)}
              className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow min-w-[100px] outline-none border-none focus:ring-0 text-gray-900 p-0.5"
          placeholder={
            technologies.length === 0
              ? "Type and press Enter to add technologies"
              : ""
          }
        />
      </div>
      <p className="text-sm text-gray-500">
        Press Enter or comma to add a technology
      </p>
    </div>
  );
};

const AboutSection = ({
  data,
  onInputChange,
}: {
  data: About;
  onInputChange: (field: string, value: unknown) => void;
}) => {
  const [selectedText, setSelectedText] = useState<{
    text: string;
    start: number;
    end: number;
  } | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const text = selection.toString().trim();
    if (!text) return;

    // Get the textarea element
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    // Get the start and end positions relative to the textarea
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (text && start !== end) {
      setSelectedText({ text, start, end });
      setShowLinkInput(true);
    }
  };

  const addLink = () => {
    if (!selectedText || !linkUrl) return;

    const newLinks = [
      ...(data.links || []),
      {
        text: selectedText.text,
        url: linkUrl,
        startIndex: selectedText.start,
        endIndex: selectedText.end,
      },
    ].sort((a, b) => a.startIndex - b.startIndex);

    onInputChange("links", newLinks);
    setShowLinkInput(false);
    setSelectedText(null);
    setLinkUrl("");
  };

  const removeLink = (index: number) => {
    const newLinks = [...(data.links || [])];
    newLinks.splice(index, 1);
    onInputChange("links", newLinks);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          onMouseUp={handleTextSelect}
          onKeyUp={handleTextSelect}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 whitespace-pre-wrap font-mono"
          placeholder="Enter your description here...&#10;&#10;Select text to add links. Use line breaks to create paragraphs.&#10;The spacing will be preserved when displayed."
        />
      </div>

      {showLinkInput && selectedText && (
        <div className="mt-2 p-4 bg-white rounded-md shadow-lg border">
          <p className="text-sm text-gray-600 mb-2">
            Add link for: &quot;{selectedText.text}&quot;
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
            <button
              type="button"
              onClick={addLink}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setSelectedText(null);
                setLinkUrl("");
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {data.links && data.links.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Added Links
          </h3>
          <div className="space-y-2">
            {data.links.map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
              >
                <div>
                  <p className="text-sm text-gray-900">{link.text}</p>
                  <p className="text-xs text-blue-600">{link.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-2 text-sm text-gray-500">
        Select text to add links. Press Enter twice to create a new paragraph.
        Line breaks will be preserved.
      </p>
    </div>
  );
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState<PortfolioSection>("hero");
  const [formData, setFormData] = useState<PortfolioData>({
    hero: {
      profileImageUrl: null,
      name: "",
      jobTitle: "",
      subtitle: "",
    },
    about: {
      description: "",
      links: [],
    },
    contact: {
      title: "",
      email: "",
      phone: "",
      social: {
        linkedin: "",
        github: "",
        twitter: "",
      },
    },
    experience: [],
    projects: [],
    writing: [],
    resumeUrl: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/auth/verify");
        const data = await response.json();

        if (!data.isValid) {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        router.replace("/login");
      }
    };

    verifySession();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPortfolioData();
        setFormData({
          hero: data.hero || formData.hero,
          about: {
            description: data.about?.description || "",
            links: data.about?.links || [],
          },
          contact: data.contact || formData.contact,
          experience: Array.isArray(data.experience) ? data.experience : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          writing: Array.isArray(data.writing) ? data.writing : [],
          resumeUrl: data.resumeUrl || formData.resumeUrl,
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to fetch portfolio data");
        }
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = async (file: File, section: string) => {
    try {
      const imageUrl = await uploadImage(file, section);
      return imageUrl;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to upload image");
      }
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sectionData = formData[activeSection as keyof typeof formData];
    if (!sectionData) return;

    setIsSubmitting(true);
    try {
      if (activeSection === "resume") {
        await updatePortfolioSection("resume", {
          resumeUrl: formData.resumeUrl || "",
        });
      } else if (
        activeSection === "experience" ||
        activeSection === "projects" ||
        activeSection === "writing"
      ) {
        await updatePortfolioSection(activeSection, {
          items: sectionData,
        });
      } else if (
        activeSection === "hero" ||
        activeSection === "about" ||
        activeSection === "contact"
      ) {
        await updatePortfolioSection(
          activeSection,
          sectionData as DocumentData
        );
      }
      toast.success("Section updated successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update section");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => {
      if (field === "resumeUrl") {
        return {
          ...prev,
          resumeUrl: value as string | null,
        };
      }
      if (
        field === "experience" ||
        field === "projects" ||
        field === "writing"
      ) {
        return {
          ...prev,
          [field]: value,
        };
      }
      if (activeSection === "resume") {
        return prev;
      }
      return {
        ...prev,
        [activeSection]: {
          ...prev[activeSection as keyof Omit<PortfolioData, "resumeUrl">],
          [field]: value,
        },
      };
    });
  };

  const handleRemoveItem = (index: number, section: PortfolioSection) => {
    if (section === "resume") return;
    const data = formData[section as keyof Omit<PortfolioData, "resumeUrl">];
    if (!Array.isArray(data)) return;

    const newData = [...data.slice(0, index), ...data.slice(index + 1)];
    handleInputChange(section, newData);
  };

  const handleAddItem = (section: PortfolioSection) => {
    if (section === "resume") return;
    const data = formData[section as keyof Omit<PortfolioData, "resumeUrl">];
    if (!Array.isArray(data)) return;

    let newItem;
    switch (section) {
      case "experience":
        newItem = {
          position: "",
          company: "",
          duration: "",
          description: "",
          logoUrl: "/placeholder.webp?height=50&width=50",
          technologies: [],
        };
        break;
      case "projects":
        newItem = {
          name: "",
          description: "",
          imageUrl: "/placeholder.svg?height=300&width=500",
          projectLink: "",
          technologies: [],
        };
        break;
      case "writing":
        newItem = {
          year: new Date().getFullYear(),
          title: "",
          writingLink: "",
          imageUrl: "/placeholder.svg?height=200&width=350",
        };
        break;
      default:
        return;
    }

    handleInputChange(section, [...data, newItem]);
  };

  const renderForm = () => {
    if (activeSection === "resume") {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Resume PDF
            </label>
            <div className="mt-1 flex items-center space-x-4">
              {formData.resumeUrl ? (
                <a
                  href={formData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Current Resume
                </a>
              ) : (
                <span className="text-gray-500">No resume uploaded</span>
              )}
              <input
                type="file"
                accept=".pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const resumeUrl = await uploadImage(file, "resume");
                      handleInputChange("resumeUrl", resumeUrl);
                      // Save the resume URL to Firestore immediately after upload
                      await updatePortfolioSection("resume", {
                        resumeUrl: resumeUrl,
                      });
                      toast.success("Resume uploaded successfully");
                    } catch (error: unknown) {
                      console.error("Resume upload error:", error);
                      toast.error("Failed to upload resume");
                    }
                  }
                }}
                className="text-gray-900"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Upload your resume in PDF format
            </p>
          </div>
        </div>
      );
    }

    const sectionData =
      formData[activeSection as keyof Omit<PortfolioData, "resumeUrl">];
    if (!sectionData) {
      switch (activeSection) {
        case "experience":
        case "projects":
        case "writing":
          handleInputChange(activeSection, []);
          break;
      }
      return null;
    }

    switch (activeSection) {
      case "hero": {
        const data = formData.hero as Hero;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <Image
                  src={data.profileImageUrl || "/placeholder.webp"}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                  width={80}
                  height={80}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = await handleImageUpload(file, "hero");
                      handleInputChange("profileImageUrl", imageUrl);
                    }
                  }}
                  className="text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                value={data.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subtitle
              </label>
              <input
                type="text"
                value={data.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>
        );
      }

      case "about": {
        const data = formData.about as About;
        return <AboutSection data={data} onInputChange={handleInputChange} />;
      }

      case "contact": {
        const data = formData.contact as Contact;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Social Links
              </h3>
              <div>
                <label className="block text-sm text-gray-600">LinkedIn</label>
                <input
                  type="url"
                  value={data.social.linkedin}
                  onChange={(e) =>
                    handleInputChange("social", {
                      ...data.social,
                      linkedin: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">GitHub</label>
                <input
                  type="url"
                  value={data.social.github}
                  onChange={(e) =>
                    handleInputChange("social", {
                      ...data.social,
                      github: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Twitter</label>
                <input
                  type="url"
                  value={data.social.twitter}
                  onChange={(e) =>
                    handleInputChange("social", {
                      ...data.social,
                      twitter: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>
        );
      }

      case "experience": {
        const data = formData.experience as Experience[];
        return (
          <div className="space-y-6">
            {data.map((exp, index) => (
              <div
                key={index}
                className="space-y-4 p-4 border rounded-md relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index, "experience")}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => {
                      const newExperience = [...data];
                      newExperience[index] = {
                        ...exp,
                        position: e.target.value,
                      };
                      handleInputChange("experience", newExperience);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExperience = [...data];
                      newExperience[index] = {
                        ...exp,
                        company: e.target.value,
                      };
                      handleInputChange("experience", newExperience);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => {
                      const newExperience = [...data];
                      newExperience[index] = {
                        ...exp,
                        duration: e.target.value,
                      };
                      handleInputChange("experience", newExperience);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExperience = [...data];
                      newExperience[index] = {
                        ...exp,
                        description: e.target.value,
                      };
                      handleInputChange("experience", newExperience);
                    }}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logo
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <Image
                      src={exp.logoUrl || "/placeholder.webp"}
                      alt={`${exp.company} logo`}
                      className="h-12 w-12 object-contain"
                      width={48}
                      height={48}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const imageUrl = await handleImageUpload(
                            file,
                            "experience"
                          );
                          const newExperience = [...data];
                          newExperience[index] = {
                            ...exp,
                            logoUrl: imageUrl,
                          };
                          handleInputChange("experience", newExperience);
                        }
                      }}
                      className="text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Technologies
                  </label>
                  <TechnologyInput
                    technologies={exp.technologies}
                    onChange={(newTechnologies) => {
                      const newExperience = [...data];
                      newExperience[index] = {
                        ...exp,
                        technologies: newTechnologies,
                      };
                      handleInputChange("experience", newExperience);
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem("experience")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Experience
            </button>
          </div>
        );
      }

      case "projects": {
        const data = formData.projects as Project[];
        return (
          <div className="space-y-6">
            {data.map((project, index) => (
              <div
                key={index}
                className="space-y-4 p-4 border rounded-md relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index, "projects")}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => {
                      const newProjects = [...data];
                      newProjects[index] = { ...project, name: e.target.value };
                      handleInputChange("projects", newProjects);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => {
                      const newProjects = [...data];
                      newProjects[index] = {
                        ...project,
                        description: e.target.value,
                      };
                      handleInputChange("projects", newProjects);
                    }}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Image
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <Image
                      src={project.imageUrl || "/placeholder.svg"}
                      alt={project.name}
                      className="h-24 w-40 object-cover rounded"
                      width={160}
                      height={80}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const imageUrl = await handleImageUpload(
                            file,
                            "projects"
                          );
                          const newProjects = [...data];
                          newProjects[index] = {
                            ...project,
                            imageUrl: imageUrl,
                          };
                          handleInputChange("projects", newProjects);
                        }
                      }}
                      className="text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Link
                  </label>
                  <input
                    type="url"
                    value={project.projectLink}
                    onChange={(e) => {
                      const newProjects = [...data];
                      newProjects[index] = {
                        ...project,
                        projectLink: e.target.value,
                      };
                      handleInputChange("projects", newProjects);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Technologies
                  </label>
                  <TechnologyInput
                    technologies={project.technologies}
                    onChange={(newTechnologies) => {
                      const newProjects = [...data];
                      newProjects[index] = {
                        ...project,
                        technologies: newTechnologies,
                      };
                      handleInputChange("projects", newProjects);
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem("projects")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Project
            </button>
          </div>
        );
      }

      case "writing": {
        const data = formData.writing as Writing[];
        return (
          <div className="space-y-6">
            {data.map((writing, index) => (
              <div
                key={index}
                className="space-y-4 p-4 border rounded-md relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index, "writing")}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="number"
                    value={writing.year}
                    onChange={(e) => {
                      const newWriting = [...data];
                      newWriting[index] = {
                        ...writing,
                        year: parseInt(e.target.value),
                      };
                      handleInputChange("writing", newWriting);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={writing.title}
                    onChange={(e) => {
                      const newWriting = [...data];
                      newWriting[index] = { ...writing, title: e.target.value };
                      handleInputChange("writing", newWriting);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Writing Link
                  </label>
                  <input
                    type="url"
                    value={writing.writingLink}
                    onChange={(e) => {
                      const newWriting = [...data];
                      newWriting[index] = {
                        ...writing,
                        writingLink: e.target.value,
                      };
                      handleInputChange("writing", newWriting);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Image
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <Image
                      src={writing.imageUrl || "/placeholder.svg"}
                      alt={writing.title}
                      className="h-24 w-40 object-cover rounded"
                      width={160}
                      height={80}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const imageUrl = await handleImageUpload(
                            file,
                            "writing"
                          );
                          const newWriting = [...data];
                          newWriting[index] = {
                            ...writing,
                            imageUrl: imageUrl,
                          };
                          handleInputChange("writing", newWriting);
                        }
                      }}
                      className="text-gray-900"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddItem("writing")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Writing
            </button>
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // If no user and not loading, redirect to login
    window.location.href = "/login";
    return <Loading />;
  }

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear session cookie through the API
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to clear session");
      }

      // Redirect to login page
      window.location.href = "/login";
    } catch (error: unknown) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Portfolio Admin
              </h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Section
              </label>
              <select
                value={activeSection}
                onChange={(e) =>
                  setActiveSection(e.target.value as PortfolioSection)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              >
                <option value="hero">Hero</option>
                <option value="about">About</option>
                <option value="contact">Contact</option>
                <option value="experience">Experience</option>
                <option value="projects">Projects</option>
                <option value="writing">Writing</option>
                <option value="resume">Resume</option>
              </select>
            </div>

            <form onSubmit={handleSubmit}>
              {renderForm()}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
