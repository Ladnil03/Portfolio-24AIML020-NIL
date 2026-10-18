import { Slot } from "radix-ui"
import { cn } from "cn"

function Badge({ className, variant = "default", asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(
        // Pills are the one place radius is welcome; everything else stays square.
        "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border-2 border-ink px-3 py-1 label-mono",
        {
          "bg-paper text-ink": variant === "default",
          "bg-coral text-ink": variant === "coral",
          "bg-sky text-ink": variant === "sky",
          "bg-yellow text-ink": variant === "yellow",
          "bg-ink text-paper": variant === "inverted",
        },
        className
      )}
      {...props} />
  )
}

export { Badge }
