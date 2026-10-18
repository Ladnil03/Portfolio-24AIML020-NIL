import { useState } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Arrow, CornerMarks } from "@/components/Decor";

const MAX = 250;

const FIELD =
  "w-full border-[3px] border-ink bg-paper px-4 py-3 font-sans text-base text-ink placeholder:text-ink/40 transition-colors focus:bg-yellow/10 focus-visible:outline-none focus-visible:ring-0 shadow-brutal-xs";

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="label-mono mb-2 block font-bold text-xs text-ink">
      {children}
    </label>
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(
      `✓ Thank you, ${formData.name}! Your message has been prepared for transmission.\n\nMessage Payload:\n${message}`
    );
    setFormData({ name: "", email: "" });
    setMessage("");
  };

  const atLimit = message.length >= MAX;
  const progressPercent = Math.min(100, Math.round((message.length / MAX) * 100));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">FULL NAME *</Label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="name"
            placeholder="e.g. Alex Turing"
            className={FIELD}
          />
        </div>
        <div>
          <Label htmlFor="contact-email">EMAIL ADDRESS *</Label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="e.g. alex@example.com"
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="contact-message">TRANSMISSION MESSAGE *</Label>
          <span
            className={cn(
              "label-mono text-xs font-bold",
              atLimit ? "text-coral" : "text-ink/60"
            )}
          >
            {message.length} / {MAX} CHARACTERS
          </span>
        </div>

        <textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          maxLength={MAX}
          rows={5}
          placeholder="Brief description of project, role, internship or collaboration..."
          className={cn(FIELD, "resize-y")}
        />

        {/* Character Progress Meter */}
        <div className="mt-2 h-2 w-full border-2 border-ink bg-paper overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-200",
              atLimit ? "bg-coral" : progressPercent > 75 ? "bg-yellow" : "bg-sky"
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto shadow-brutal brutal-press"
        >
          Send Transmission <Arrow />
        </Button>
        <span className="label-mono text-[0.625rem] text-ink/50 text-center sm:text-right">
          AUTHENTIC PORTFOLIO FORM // VERIFIED BY GITHUB
        </span>
      </div>

      {message && (
        <div className="relative border-[3px] border-ink bg-coral p-5 shadow-brutal animate-rise">
          <CornerMarks />
          <div className="mb-2 flex items-center justify-between border-b-2 border-ink pb-2">
            <span className="label-mono font-bold text-xs text-ink">
              LIVE BUFFER PREVIEW
            </span>
            <span className="label-mono text-[0.625rem] bg-ink text-paper px-1.5 py-0.5">
              BUFFER ACTIVE
            </span>
          </div>
          <p className="whitespace-pre-wrap font-sans text-sm text-ink font-medium leading-relaxed">
            {message}
          </p>
        </div>
      )}
    </form>
  );
}