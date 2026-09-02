"use client";

import { Star } from "lucide-react";
import { FormEvent, useState } from "react";

type Comment = { id: string; name: string; body: string; created_at: string };
type Rating = { average: number; count: number };
type Status = { tone: "success" | "error"; message: string } | null;

export function BlogEngagement({ slug, initialComments, initialRating }: { slug: string; initialComments: Comment[]; initialRating: Rating }) {
  const [comments] = useState(initialComments);
  const [rating, setRating] = useState(initialRating);
  const [ratingStatus, setRatingStatus] = useState<Status>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [commentStatus, setCommentStatus] = useState<Status>(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  async function submitRating(value: number) {
    setSelectedRating(value);
    setSubmittingRating(true);
    setRatingStatus(null);
    try {
      const response = await fetch(`/api/blog/${encodeURIComponent(slug)}/ratings`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ rating: value }) });
      const result = await response.json() as Rating & { message?: string };
      if (!response.ok) throw new Error(result.message || "Your rating could not be saved.");
      setRating({ average: result.average, count: result.count });
      setRatingStatus({ tone: "success", message: "Thank you. Your rating has been saved." });
    } catch (error) {
      setSelectedRating(null);
      setRatingStatus({ tone: "error", message: error instanceof Error ? error.message : "Your rating could not be saved." });
    } finally { setSubmittingRating(false); }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmittingComment(true);
    setCommentStatus(null);
    try {
      const payload = Object.fromEntries(new FormData(form));
      const response = await fetch(`/api/blog/${encodeURIComponent(slug)}/comments`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Your comment could not be submitted.");
      form.reset();
      setCommentStatus({ tone: "success", message: result.message || "Your comment is awaiting moderation." });
    } catch (error) {
      setCommentStatus({ tone: "error", message: error instanceof Error ? error.message : "Your comment could not be submitted." });
    } finally { setSubmittingComment(false); }
  }

  return (
    <section className="blog-engagement" aria-labelledby="article-feedback-title">
      <div className="rating-panel">
        <div><h2 id="article-feedback-title">Was this article useful?</h2><p>{rating.count ? `${rating.average.toFixed(1)} out of 5 from ${rating.count} ${rating.count === 1 ? "rating" : "ratings"}.` : "Be the first reader to rate this article."}</p></div>
        <fieldset disabled={submittingRating}><legend className="sr-only">Rate from one to five stars</legend><div className="star-rating">{[1,2,3,4,5].map((value) => <button key={value} className={selectedRating !== null && value <= selectedRating ? "is-selected" : ""} type="button" onClick={() => submitRating(value)} aria-label={`Rate ${value} out of 5`} aria-pressed={selectedRating === value}><Star aria-hidden="true" size={21} fill={selectedRating !== null && value <= selectedRating ? "currentColor" : "none"} /></button>)}</div></fieldset>
        {ratingStatus ? <p className={`form-notice form-notice--${ratingStatus.tone}`} role="status">{ratingStatus.message}</p> : null}
      </div>
      <div className="comments-panel">
        <header className="comments-panel__header"><div><h2>Join the conversation</h2><p>Comments are reviewed before they appear. Your email is used for moderation only and is never published.</p></div><span>{comments.length} {comments.length === 1 ? "comment" : "comments"}</span></header>
        {comments.length ? <ol className="comment-list">{comments.map((comment) => <li key={comment.id}><header><strong>{comment.name}</strong><time dateTime={comment.created_at}>{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(comment.created_at))}</time></header><p>{comment.body}</p></li>)}</ol> : <div className="comment-empty" role="status">No approved comments yet. You can start the conversation.</div>}
        <form className="comment-form" onSubmit={submitComment} aria-label="Submit a comment">
          <h3>Leave a comment</h3>
          <div className="comment-form__row"><label><span>Name</span><input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label><label><span>Email <small>(not published)</small></span><input name="email" type="email" required maxLength={254} autoComplete="email" /></label></div>
          <label><span>Comment</span><textarea name="body" required minLength={2} maxLength={1500} rows={5} /></label>
          <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <button className="button" type="submit" disabled={submittingComment}>{submittingComment ? "Submitting…" : "Submit for review"}</button>
          {commentStatus ? <p className={`form-notice form-notice--${commentStatus.tone}`} role="status">{commentStatus.message}</p> : null}
        </form>
      </div>
    </section>
  );
}
