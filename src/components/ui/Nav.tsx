"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoLockup } from "@/components/LogoMark";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { navLinks, site } from "@/lib/site";

const anchorIds = navLinks
  .filter((link) => link.href.startsWith("#"))
  .map((link) => link.href.slice(1));

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  // Lift the bar off the page once it is no longer at the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Light the nav item for whichever section currently owns the viewport.
  useEffect(() => {
    const sections = anchorIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Escape closes the menu; the page holds still while it is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md",
        "transition-shadow duration-300",
        scrolled ? "shadow-sm" : "shadow-none",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6">
        <a href="#top" aria-label={`${site.name}, back to top`}>
          <LogoLockup className="h-9 w-auto" />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = !link.external && active === link.href.slice(1);
            return (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                  "hover:bg-surface-hover hover:text-cyan-dark",
                  isActive ? "text-cyan-dark" : "text-text-dim",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={site.docs}
            size="sm"
            arrow
            className="hidden md:inline-flex"
          >
            Get started
          </Button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-text transition-colors duration-200 hover:bg-surface-hover md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d={open ? "M6 6 L18 18 M18 6 L6 18" : "M4 7h16 M4 12h16 M4 17h16"}
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease }}
            className="overflow-hidden border-t border-border bg-surface md:hidden"
          >
            <Container className="flex flex-col gap-1 py-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-text transition-colors duration-200 hover:bg-surface-hover hover:text-cyan-dark"
                >
                  {link.label}
                </a>
              ))}
              <Button
                href={site.docs}
                size="md"
                arrow
                className="mt-3 w-full"
                onClick={() => setOpen(false)}
              >
                Get started
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
