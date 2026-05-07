import gsap from "gsap";
import { useEffect } from "react";

export function useWorkspaceAnimation(enabled) {
  useEffect(() => {
    if (!enabled) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".anim-1",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.42, ease: "power2.out" }
      ).fromTo(
        ".anim-2",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.34, ease: "power2.out", stagger: 0.04 },
        "-=0.22"
      ).fromTo(
        ".anim-3, .anim-4, .anim-5, .anim-6",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out", stagger: 0.05 },
        "-=0.16"
      );

      gsap.to(".metric-orb", {
        boxShadow: "0 18px 42px rgba(25,126,164,0.12)",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.6,
      });
    });

    return () => ctx.revert();
  }, [enabled]);
}
