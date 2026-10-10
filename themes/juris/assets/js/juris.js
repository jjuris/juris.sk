(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const progress = document.querySelector(".reading-progress");
  const header = document.querySelector(".site-header");
  const updateHeaderHeight = () => {
    document.documentElement.style.setProperty("--header-height", `${header.getBoundingClientRect().height}px`);
  };
  updateHeaderHeight();
  if ("ResizeObserver" in window) {
    new ResizeObserver(updateHeaderHeight).observe(header);
  }
  window.addEventListener("resize", updateHeaderHeight);
  const isHome = document.body.classList.contains("is-home");
  const contact = isHome ? document.getElementById("contact") : null;
  const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
  const sections = sectionLinks
    .map((link) => document.getElementById(link.dataset.sectionLink))
    .filter(Boolean);
  let scheduled = false;
  let scrollAnimation = null;
  const disclosureClosers = [];

  const updateProgress = () => {
    if (scrollAnimation === null) {
      disclosureClosers.forEach((closeOutsideViewport) => closeOutsideViewport());
    }
    if (isHome) {
      const atContact = contact && contact.getBoundingClientRect().top <= 1;
      header.classList.toggle(
        "is-visible",
        !atContact && (window.scrollY > 32 || header.contains(document.activeElement)),
      );
    }
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
    if (progress) {
      progress.style.transform = `scaleX(${fraction})`;
    }
    let currentSection = null;
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 180) {
        currentSection = section.id;
      }
    });
    sectionLinks.forEach((link) => {
      if (link.dataset.sectionLink === currentSection) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    scheduled = false;
  };

  const scheduleProgress = () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    }
  };

  window.addEventListener("scroll", scheduleProgress, { passive: true });
  window.addEventListener("resize", scheduleProgress);
  window.addEventListener("load", scheduleProgress);
  window.addEventListener("pageshow", scheduleProgress);
  header.addEventListener("focusin", scheduleProgress);
  header.addEventListener("focusout", scheduleProgress);
  document.querySelectorAll("details").forEach((detail) => {
    detail.addEventListener("toggle", scheduleProgress);
  });
  updateProgress();

  document.querySelectorAll(".disclosure-details").forEach((detail) => {
    const summary = detail.querySelector("summary");
    const body = detail.querySelector(".disclosure-body");
    if (!summary || !body) {
      return;
    }
    let expansion = null;
    let expansionFrame = null;
    let targetOpen = detail.open;

    const stopExpansion = () => {
      if (expansion) {
        expansion.onfinish = null;
        expansion.cancel();
        expansion = null;
      }
      if (expansionFrame !== null) {
        window.cancelAnimationFrame(expansionFrame);
        expansionFrame = null;
      }
    };

    const finishExpansion = () => {
      stopExpansion();
      detail.open = targetOpen;
      body.style.removeProperty("height");
      body.style.removeProperty("overflow");
      body.inert = false;
      scheduleProgress();
    };

    disclosureClosers.push(() => {
      if (!detail.open) {
        return;
      }
      const card = detail.closest(".disclosure-card");
      const bounds = card.getBoundingClientRect();
      const aboveViewport = bounds.bottom <= header.getBoundingClientRect().height;
      if (!aboveViewport && bounds.top < window.innerHeight) {
        return;
      }
      const scrollBefore = window.scrollY;
      targetOpen = false;
      finishExpansion();
      if (aboveViewport) {
        // Preserve the position of the content being read below this card.
        const removedHeight = bounds.height - card.getBoundingClientRect().height;
        window.scrollTo({ top: Math.max(0, scrollBefore - removedHeight), behavior: "instant" });
      }
    });

    const trackExpansion = () => {
      scheduleProgress();
      if (expansion) {
        expansionFrame = window.requestAnimationFrame(trackExpansion);
      }
    };

    summary.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        reducedMotion.matches ||
        typeof body.animate !== "function"
      ) {
        return;
      }
      event.preventDefault();
      const startHeight = detail.open ? body.getBoundingClientRect().height : 0;
      targetOpen = expansion ? !targetOpen : !detail.open;
      stopExpansion();
      // Keep native details open until the closing animation completes.
      detail.open = true;
      body.inert = !targetOpen;
      body.style.height = `${startHeight}px`;
      body.style.overflow = "hidden";
      const endHeight = targetOpen ? body.scrollHeight : 0;
      expansion = body.animate([{ height: `${startHeight}px` }, { height: `${endHeight}px` }], {
        duration: targetOpen ? 845 : 585,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
      expansion.onfinish = finishExpansion;
      trackExpansion();
    });

    window.addEventListener("resize", () => {
      if (expansion) {
        finishExpansion();
      }
    });
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches && expansion) {
        finishExpansion();
      }
    });
  });

  const cancelScroll = () => {
    if (scrollAnimation !== null) {
      window.cancelAnimationFrame(scrollAnimation);
      scrollAnimation = null;
    }
  };

  window.addEventListener("wheel", cancelScroll, { passive: true });
  window.addEventListener("touchstart", cancelScroll, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", "Escape", " "].includes(event.key)) {
      cancelScroll();
    }
  });
  window.addEventListener("popstate", cancelScroll);

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const target = document.getElementById(link.hash.slice(1));
    if (!target || reducedMotion.matches) {
      return;
    }
    event.preventDefault();
    cancelScroll();
    const start = window.scrollY;
    const headerHeight = header.getBoundingClientRect().height;
    const anchorOffset = target === contact ? 0 : headerHeight;
    const destination = Math.max(
      0,
      Math.min(
        start + target.getBoundingClientRect().top - anchorOffset,
        document.documentElement.scrollHeight - window.innerHeight,
      ),
    );
    const distance = destination - start;
    const duration = Math.min(2200, 1000 + Math.abs(distance) * 0.12);
    const startedAt = performance.now();
    if (location.hash !== link.hash) {
      history.pushState(null, "", link.hash);
    }

    const step = (now) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = elapsed < 0.5 ? 4 * elapsed ** 3 : 1 - (-2 * elapsed + 2) ** 3 / 2;
      window.scrollTo({ top: start + distance * eased, behavior: "instant" });
      if (elapsed < 1) {
        scrollAnimation = window.requestAnimationFrame(step);
      } else {
        scrollAnimation = null;
        scheduleProgress();
        // Preserve normal keyboard navigation after jumping to a section.
        const alreadyFocusable = target.hasAttribute("tabindex");
        if (!alreadyFocusable) {
          target.setAttribute("tabindex", "-1");
        }
        target.focus({ preventScroll: true });
        if (!alreadyFocusable) {
          target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
        }
      }
    };
    scrollAnimation = window.requestAnimationFrame(step);
  });

  if (!("IntersectionObserver" in window) || reducedMotion.matches) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    // Content already visible at load should never flash or wait for animation.
    if (element.getBoundingClientRect().top < window.innerHeight) {
      return;
    }
    element.classList.add("reveal-ready");
    observer.observe(element);
  });

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      cancelScroll();
      observer.disconnect();
      document.querySelectorAll(".reveal-ready").forEach((element) => {
        element.classList.add("is-visible");
      });
    }
  });
})();
