import * as SeparatorPrimitive from "radix-ui"
import { cn } from "cn"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-ink",
        orientation === "horizontal" ? "h-[3px] w-full" : "h-full w-[3px]",
        className
      )}
      {...props} />
  )
}

export { Separator }
