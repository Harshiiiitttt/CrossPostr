import { useState } from "react";
import type { LinkedInPosts, SeoBlog } from "@/lib/types";

interface Page3Props {
  onBack: () => void;
}

const TABS: Array<{ key: keyof LinkedInPosts; label: string }> = [
  { key: "safeBet", label: "Safe Bet" },
  { key: "cleanLabel", label: "Clean-Label" },
  { key: "microStory", label: "Micro-Story" },
];

export default function Page3({ onBack }: Page3Props) {
  const [topic, setTopic] = useState("");
  const [blog, setBlog] = useState<SeoBlog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [posts, setPosts] = useState<LinkedInPosts | null>(null);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<keyof LinkedInPosts>("safeBet");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setPosts(null);
    setPostsError(null);
    try {
      const res = await fetch("/api/generate-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setBlog(data.blog);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const generateLinkedInPosts = async () => {
    if (!blog) return;
    setPostsLoading(true);
    setPostsError(null);
    try {
      const res = await fetch("/api/generate-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blog }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setPosts(data.posts);
      setActiveTab("safeBet");
    } catch (err) {
      setPostsError((err as Error).message);
    } finally {
      setPostsLoading(false);
    }
  };

  const copyActivePost = async () => {
    if (!posts) return;
    await navigator.clipboard.writeText(posts[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const exportAsText = (b: SeoBlog) => {
    const sectionBlocks = b.sections
      .map((s) => {
        const paragraphBlock = (s.paragraphs ?? []).join("\n\n");
        const bulletBlock = (s.bullets ?? []).map((item) => `- ${item}`).join("\n");
        const subtopicBlock = (s.subtopics ?? [])
          .map((st) => `### ${st.subheading}\n\n${st.paragraphs.join("\n\n")}`)
          .join("\n\n");
        return [`## ${s.heading}`, paragraphBlock, bulletBlock, subtopicBlock]
          .filter(Boolean)
          .join("\n\n");
      })
      .join("\n\n");

    const faqBlock = b.faqs.map((f) => `**${f.question}**\n${f.answer}`).join("\n\n");
    const full = [
      `# ${b.title}`,
      b.intro.join("\n\n"),
      sectionBlocks,
      b.vetCta,
      `## Conclusion`,
      b.conclusion.join("\n\n"),
      `## FAQs`,
      faqBlock,
    ].join("\n\n");

    const blobUrl = URL.createObjectURL(new Blob([full], { type: "text/markdown" }));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${b.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div>
      <span className="badge">Step 3 of 3</span>
      <h1 className="page-title">SEO blog generator</h1>
      <p className="page-sub">
        Describe a topic and get a ~1200-word blog with an intro, subheadings, and 5 FAQs.
        Leave this blank to finish without generating a blog.
      </p>

      <div className="card">
        <label>Blog topic</label>
        <input
          type="text"
          placeholder="e.g. Cloudy eyes in dogs"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button className="primary" onClick={generate} disabled={loading || !topic.trim()}>
          {loading ? "Generating..." : "Generate blog"}
        </button>

        {error && <div className="result-item error">{error}</div>}

        {blog && (
          <div className="result-item">
            <strong>{blog.title}</strong> - ~{blog.approxWordCount} words
            <div className="blog-block">
              {blog.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              {blog.sections.map((s) => (
                <div key={s.heading}>
                  <strong>{s.heading}</strong>
                  {(s.paragraphs ?? []).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {(s.bullets?.length ?? 0) > 0 && (
                    <ul>
                      {s.bullets!.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                  {(s.subtopics?.length ?? 0) > 0 &&
                    s.subtopics!.map((st) => (
                      <div key={st.subheading} style={{ marginLeft: 12 }}>
                        <em>{st.subheading}</em>
                        {st.paragraphs.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                    ))}
                </div>
              ))}

              <p>{blog.vetCta}</p>

              <strong>Conclusion</strong>
              {blog.conclusion.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <strong>Frequently Asked Questions</strong>
              {blog.faqs.map((f, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <strong>{f.question}</strong>
                  <p>{f.answer}</p>
                </div>
              ))}
            </div>
            <button onClick={() => exportAsText(blog)} style={{ marginTop: 8 }}>
              Export .md
            </button>

            <div className="linkedin-section">
              {!posts && (
                <button
                  className="primary"
                  onClick={generateLinkedInPosts}
                  disabled={postsLoading}
                >
                  {postsLoading ? "Generating..." : "Generate LinkedIn Posts"}
                </button>
              )}

              {postsError && <div className="result-item error">{postsError}</div>}

              {posts && (
                <div>
                  <div className="tab-row">
                    {TABS.map((tab) => (
                      <button
                        key={tab.key}
                        className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="linkedin-post-block">{posts[activeTab]}</div>

                  <button onClick={copyActivePost} style={{ marginTop: 10 }}>
                    {copied ? "Copied" : "Copy post"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="nav-row">
        <button onClick={onBack}>Back</button>
        <span />
      </div>
    </div>
  );
}