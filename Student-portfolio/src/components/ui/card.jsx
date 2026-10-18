import { cn } from "cn"

function Card({ className, interactive = false, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col border-[3px] border-ink bg-paper text-ink",
        interactive ? "shadow-brutal brutal-press" : "shadow-brutal-sm",
        className
      )}
      {...props} />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-2 border-b-[3px] border-ink p-5", className)}
      {...props} />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-card-title text-ink", className)}
      {...props} />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn("font-sans text-sm leading-relaxed text-ink/80", className)}
      {...props} />
  )
}

function CardContent({ className, ...props }) {
  return (
    <div data-slot="card-content" className={cn("p-5", className)} {...props} />
  )
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("mt-auto flex items-center gap-3 p-5 pt-0", className)}
      {...props} />
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
