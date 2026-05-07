import gsap from "gsap";
import { useEffect } from "react";

export function useAuthAnimation(scopeRef) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Wordmark reveal
      gsap.fromTo(
        ".auth-wordmark-line1, .auth-wordmark-line2",
        { y: 60, opacity: 0, skewY: 4 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.9, ease: "power4.out", stagger: 0.12 }
      );
      // Descriptor
      gsap.fromTo(
        ".auth-descriptor",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" }
      );
      // Stack cards
      gsap.fromTo(
        ".auth-stack-card",
        { x: -40, opacity: 0, rotateY: -15 },
        { x: 0, opacity: 1, rotateY: 0, duration: 0.7, delay: 0.5, ease: "power3.out", stagger: 0.1 }
      );
      // Form card
      gsap.fromTo(
        ".auth-form-card",
        { x: 40, opacity: 0, rotateY: 10 },
        { x: 0, opacity: 1, rotateY: 0, duration: 0.9, delay: 0.2, ease: "power3.out" }
      );
      // Floating stack animation loop
      gsap.to(".auth-stack-card", {
        y: -6, duration: 2.5, repeat: -1, yoyo: true,
        ease: "sine.inOut", stagger: 0.3,
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [scopeRef]);
}
