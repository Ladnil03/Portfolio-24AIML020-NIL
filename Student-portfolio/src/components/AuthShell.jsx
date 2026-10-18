import { Cross, CornerMarks, Barcode } from "@/components/Decor";

const FIELD =
  "w-full border-[3px] border-ink bg-paper px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:bg-yellow/10 focus-visible:outline-none shadow-brutal-xs";

export function AuthField({ id, label, hint, type = "text", value, onChange, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="label-mono mb-2 block font-bold text-xs text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={FIELD}
        {...props}
      />
      {hint && <p className="label-mono mt-2 text-ink/50 text-[0.625rem]">{hint}</p>}
    </div>
  );
}

/** Shared chrome for /login and /register so the two forms can't drift apart. */
export default function AuthShell({ index, title, lede, error, children, footer }) {
  return (
    <section className="relative overflow-hidden border-b-[3px] border-ink bg-paper">
      <div aria-hidden="true" className="grid-paper pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-12 lg:gap-12 lg:px-12">
        {/* Statement rail */}
        <div className="lg:col-span-5">
          <p className="label-mono flex items-center gap-2">
            <span className="border-2 border-ink bg-ink px-2 py-1 text-paper font-bold shadow-brutal-xs">
              {index}
            </span>
            <span className="text-ink/60">/ SECURE_ACCESS</span>
          </p>
          <h1 className="text-section mt-5 text-ink">{title}</h1>
          <p className="mt-5 max-w-sm leading-relaxed text-ink/85 font-medium border-l-[3px] border-coral pl-4">
            {lede}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Barcode className="h-5 text-ink hidden sm:flex" />
            <span className="label-mono text-xs text-ink/60">MONGODB ATLAS // NODE.JS REST</span>
          </div>
          <Cross
            aria-hidden="true"
            className="mt-8 hidden text-5xl text-coral lg:block select-none"
          >
            +
          </Cross>
        </div>

        {/* Form card */}
        <div className="lg:col-span-7 xl:col-span-6">
          <div className="relative border-[3px] border-ink bg-paper p-6 shadow-brutal-xl sm:p-9">
            <CornerMarks />
            {error && (
              <div
                role="alert"
                className="mb-6 border-[3px] border-ink bg-coral px-4 py-3 shadow-brutal-xs"
              >
                <span className="label-mono font-bold text-xs text-ink">ERROR // {error}</span>
              </div>
            )}

            <div className="flex flex-col gap-6">{children}</div>

            <p className="label-mono mt-7 border-t-[3px] border-ink pt-5 text-ink/60">
              {footer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}