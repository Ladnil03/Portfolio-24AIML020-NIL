import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/tasks", label: "Tasks" },
  { to: "/contact", label: "Contact" },
];


function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={theme === "dark"}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="grid size-11 shrink-0 place-items-center border-[3px] border-ink bg-yellow text-ink brutal-press"
    >
      <span aria-hidden="true" className="font-display text-base leading-none">
        {theme === "light" ? "☾" : "☀"}
      </span>
    </button>
  );
}

function Header({ theme, toggleTheme, user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 pb-2 sm:px-6 sm:pt-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:border-[3px] focus:border-ink focus:bg-yellow focus:px-4 focus:py-2 focus:label-mono"
      >
        Skip to content
      </a>

      {/* Floating rectangular brutalist navigation bar */}
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between border-[3px] border-ink bg-paper px-4 py-2.5 shadow-brutal sm:px-6">
        {/* Wordmark & Developer Identity */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Nil Lad — home"
          >
            <span className="grid size-10 place-items-center border-[3px] border-ink bg-coral font-display text-base leading-none text-ink shadow-brutal-xs brutal-press">
              NL
            </span>
            <div className="flex flex-col">
              <span className="font-display text-base leading-tight tracking-tight uppercase sm:text-lg">
                Nil Lad
              </span>
              <span className="label-mono hidden text-[0.6rem] text-ink/60 sm:inline-block">
                AI &amp; ML Engineer
              </span>
            </div>
          </NavLink>

          <span className="hidden items-center gap-1.5 border-2 border-ink bg-yellow px-2.5 py-0.5 label-mono text-[0.625rem] text-ink lg:inline-flex shadow-brutal-xs">
            <span className="size-1.5 animate-blink bg-ink" aria-hidden="true" />
            24AIML020
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav aria-label="Primary" className="hidden items-center gap-2 md:flex lg:gap-3">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "border-2 border-transparent px-3 py-1.5 label-mono transition-all",
                  isActive
                    ? "border-ink bg-ink text-paper shadow-brutal-xs"
                    : "hover:border-ink hover:bg-yellow hover:text-ink hover:shadow-brutal-xs"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="ml-2 flex items-center gap-2 border-l-2 border-ink pl-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Badge variant="yellow" className="text-xs">
                  {user.name || user.email}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild size="sm" className="shadow-brutal-xs">
                <NavLink to="/login">Login</NavLink>
              </Button>
            )}

            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Open menu"
                className="[&_svg]:size-5 shadow-brutal-xs"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="square"
                >
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center border-[3px] border-ink bg-coral font-display text-xs text-ink shadow-brutal-xs">
                    NL
                  </span>
                  <SheetTitle>Navigation</SheetTitle>
                </div>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-3 p-6 pt-4">
                <div className="mb-2 flex items-center gap-2 border-2 border-ink bg-yellow px-3 py-1.5 label-mono text-xs">
                  <span className="size-2 animate-blink bg-coral" />
                  STATUS: 24AIML020 / OPEN FOR WORK
                </div>
                {LINKS.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "border-[3px] border-ink px-4 py-3.5 label-mono shadow-brutal brutal-press flex items-center justify-between",
                          isActive ? "bg-coral text-ink font-bold" : "bg-paper text-ink hover:bg-yellow"
                        )
                      }
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true">→</span>
                    </NavLink>
                  </SheetClose>
                ))}

                <div className="mt-4 border-t-[3px] border-ink pt-4">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <Badge variant="yellow" className="self-start">
                        {user.name || user.email}
                      </Badge>
                      <SheetClose asChild>
                        <Button variant="outline" onClick={handleLogout} className="w-full">
                          Logout
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Button asChild className="w-full shadow-brutal">
                        <NavLink to="/login">Login / Sign In →</NavLink>
                      </Button>
                    </SheetClose>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;