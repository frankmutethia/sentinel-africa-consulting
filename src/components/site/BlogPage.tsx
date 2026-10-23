import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Search, X } from "lucide-react";
import postIndex from "@/content/blog-index.json";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { blogPage, blogPost, homeSection } from "./navigation";
import { Reveal } from "./Reveal";
import "./blog.css";

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  author: string;
  categories: string[];
  excerpt: string;
  image: string | null;
  imageAlt: string;
  readingMinutes: number;
}

const posts = postIndex as PostSummary[];

// Article bodies were imported from the published blog and sanitised at import time
// (safe tags only, local images, links to the old site re-pointed or removed).
// Each body is its own chunk, loaded when the article is opened.
const bodies = import.meta.glob<{ html: string }>("../../content/blog/*.json", {
  import: "default",
});

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function PostMeta({ post }: { post: PostSummary }) {
  return (
    <p className="blog-meta">
      <span>
        <CalendarDays size={14} aria-hidden="true" />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </span>
      <span>
        <Clock size={14} aria-hidden="true" />
        {post.readingMinutes} min read
      </span>
    </p>
  );
}

function PostCard({ post, featured = false }: { post: PostSummary; featured?: boolean }) {
  return (
    <article className={`blog-card ${featured ? "is-featured" : ""}`}>
      <a href={blogPost(post.slug)} className="blog-card-image" tabIndex={-1} aria-hidden="true">
        {post.image && <img src={post.image} alt="" loading="lazy" />}
      </a>
      <div className="blog-card-body">
        {post.categories.length > 0 && (
          <ul className="blog-tags" aria-label="Categories">
            {post.categories.slice(0, 2).map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        )}
        <h3>
          <a href={blogPost(post.slug)}>{post.title}</a>
        </h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <PostMeta post={post} />
      </div>
    </article>
  );
}

function BlogIndex() {
  const [query, setQuery] = useState("");
  const [latest, ...rest] = posts as [PostSummary, ...PostSummary[]];
  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return rest;
    return posts.filter((post) => {
      const text = `${post.title} ${post.excerpt} ${post.categories.join(" ")}`.toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [query, rest]);

  return (
    <>
      <PageHero
        trail={["Resources"]}
        eyebrow="Insights"
        title="Blog"
        lead={
          <p>
            Perspectives from our consultants on information security, data protection, business
            continuity and risk management across Africa.
          </p>
        }
        actions={
          <>
            <a href="#articles" className="button">
              Browse articles <ArrowRight size={16} />
            </a>
            <a href={homeSection("/", "contact")} className="text-link">
              Talk to our consultants <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="blog-hero-feature">
            <p className="eyebrow">Latest article</p>
            <PostCard post={latest} featured />
          </div>
        }
      />

      <section id="articles" className="svc-section" aria-labelledby="articles-title">
        <div className="site-container">
          <div className="blog-toolbar">
            <div>
              <p className="eyebrow">All articles</p>
              <h2 id="articles-title">
                Expertise, <span className="blue-text">shared.</span>
              </h2>
            </div>
            <div className="blog-search">
              <Search size={18} aria-hidden="true" />
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <input
                id="blog-search"
                type="search"
                placeholder="Search articles, e.g. ISO 27001, Rwanda"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <p className="blog-count" aria-live="polite">
            {query
              ? `${results.length} article${results.length === 1 ? "" : "s"} matching “${query}”`
              : `${posts.length} articles`}
          </p>
          {results.length > 0 ? (
            <ul className="blog-grid">
              {results.map((post, index) => (
                <li key={post.slug}>
                  <Reveal delay={(index % 3) * 60} className="blog-grid-item">
                    <PostCard post={post} />
                  </Reveal>
                </li>
              ))}
            </ul>
          ) : (
            <p className="blog-empty">
              No articles match your search. Try another word, or{" "}
              <button type="button" onClick={() => setQuery("")}>
                show all articles
              </button>
              .
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function BlogArticle({ post }: { post: PostSummary }) {
  const [html, setHtml] = useState<string | null>(null);
  const index = posts.indexOf(post);
  const related = [...posts.slice(index + 1), ...posts.slice(0, index)].slice(0, 3);

  useEffect(() => {
    document.title = `${post.title} — Sentinel Africa Consulting`;
    let active = true;
    bodies[`../../content/blog/${post.slug}.json`]?.().then((body) => {
      if (active) setHtml(body.html);
    });
    return () => {
      active = false;
    };
  }, [post]);

  return (
    <>
      <section id="top" className="blog-article-head" aria-labelledby="article-title">
        <div className="hero-grid-pattern" aria-hidden="true" />
        <div className="site-container blog-article-head-inner">
          <nav aria-label="Breadcrumb" className="page-breadcrumb">
            <a href={homeSection("/", "top")}>Home</a>
            <span>
              <span aria-hidden="true">/</span> Resources
            </span>
            <span>
              <span aria-hidden="true">/</span> <a href={blogPage}>Blog</a>
            </span>
          </nav>
          {post.categories.length > 0 && (
            <ul className="blog-tags" aria-label="Categories">
              {post.categories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
          )}
          <h1 id="article-title">{post.title}</h1>
          <PostMeta post={post} />
        </div>
      </section>

      <div className="site-container blog-article-layout">
        <article className="blog-article">
          {post.image && (
            <img className="blog-article-image" src={post.image} alt={post.imageAlt} />
          )}
          {html === null ? (
            <p className="blog-loading" role="status">
              Loading article…
            </p>
          ) : (
            <div className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} />
          )}
          <a href={blogPage} className="text-link blog-back">
            <ArrowLeft size={17} /> Back to all articles
          </a>
        </article>
        <aside className="blog-sidebar" aria-label="More from the blog">
          <div className="blog-sidebar-cta">
            <p className="eyebrow">Need guidance?</p>
            <p>Our consultants can help you put these ideas into practice.</p>
            <a href={homeSection("/", "contact")} className="button">
              Request a free callback <ArrowRight size={17} />
            </a>
          </div>
          <div className="blog-related">
            <p className="eyebrow">Keep reading</p>
            <ul>
              {related.map((item) => (
                <li key={item.slug}>
                  <a href={blogPost(item.slug)}>
                    {item.image && <img src={item.image} alt="" loading="lazy" />}
                    <span>
                      <strong>{item.title}</strong>
                      <small>{formatDate(item.date)}</small>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}

/** Lists the articles, or shows one when the address has `?post=<slug>`. */
export default function BlogPage() {
  const slug = new URLSearchParams(window.location.search).get("post");
  const post = slug ? posts.find((item) => item.slug === slug) : undefined;
  return (
    <InnerPage>
      {post ? <BlogArticle post={post} /> : <BlogIndex />}
      <PageCta />
    </InnerPage>
  );
}
