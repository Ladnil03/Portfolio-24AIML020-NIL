import { cva } from "class-variance-authority";
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  // Hard offset shadow that collapses on press — the whole physical feel.
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border-[3px] border-ink uppercase tracking-[0.06em] brutal-press select-none outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-coral focus-visible:outline-offset-[3px] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary CTA
        default: "bg-coral text-ink shadow-brutal hover:bg-coral",
        secondary: "bg-sky text-ink shadow-brutal hover:bg-sky",
        accent: "bg-yellow text-ink shadow-brutal hover:bg-yellow",
        // Outlined — sits on paper
        outline: "bg-paper text-ink shadow-brutal hover:bg-ink hover:text-paper",
        // No shadow: for use on top of another block
        ghost: "border-transparent bg-transparent text-ink hover:border-ink hover:bg-yellow",
        link: "h-auto border-0 bg-transparent p-0 text-ink underline decoration-[3px] underline-offset-4 hover:decoration-coral",
        destructive: "bg-coral text-ink shadow-brutal hover:bg-ink hover:text-coral",
      },
      size: {
        default: "h-12 px-6 text-sm",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        icon: "size-12",
        "icon-sm": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  )
}

// buttonVariants is the standard shadcn export shape; nothing imports it yet.
// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
