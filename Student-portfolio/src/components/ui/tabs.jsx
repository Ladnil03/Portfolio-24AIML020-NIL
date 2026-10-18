import { cn } from "cn"
import { Tabs as TabsPrimitive } from "radix-ui"

function Tabs({ className, orientation = "horizontal", ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-5 data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  );
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        // Physical row of pressable blocks; wraps instead of scrolling on mobile.
        "flex w-full flex-wrap items-stretch gap-2 sm:w-fit",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "brutal-press inline-flex flex-1 items-center justify-center gap-2 border-[3px] border-ink bg-paper px-4 py-3 label-mono text-ink shadow-brutal-xs sm:flex-none",
        "hover:bg-yellow data-[state=active]:bg-coral data-[state=active]:translate-x-[3px] data-[state=active]:translate-y-[3px] data-[state=active]:shadow-none",
        "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-coral disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
