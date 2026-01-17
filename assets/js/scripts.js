document.addEventListener("DOMContentLoaded", () => {
  
    // Get all summary elements
    const summaries = document.querySelectorAll(".accordion__quesion");
    // Add click event listener to each summary
    summaries.forEach((summary) => {
      summary.addEventListener("click", function (e) {
        // Prevent the default toggle behavior
        e.preventDefault();
  
        // Get the details element that contains this summary
        const currentDetails = this.parentElement;
  
        // Find the closest section parent
        const parentSection = currentDetails.closest("section");
  
        if (parentSection) {
          // Find all details elements within this section
          const allDetails = parentSection.querySelectorAll(
            "details.accordion__item"
          );
  
          // Close all other details elements in this section
          allDetails.forEach((details) => {
            if (details !== currentDetails) {
              details.removeAttribute("open");
            }
          });
  
          // Toggle the current details element
          if (currentDetails.hasAttribute("open")) {
            currentDetails.removeAttribute("open");
          } else {
            currentDetails.setAttribute("open", "");
          }
        }
      });
    });
  
    const embla__sliders = document.querySelectorAll(".embla");
  
    embla__sliders.forEach((embla__slider) => {
      // Data attributes
      const slidesToScroll__mobile =
        embla__slider.getAttribute("data-slides-mobile") || 1;
      const slidesToScroll__tab =
        embla__slider.getAttribute("data-slides-tab") || 1;
      const slidesToScroll__desk =
        embla__slider.getAttribute("data-slides-desk") || 1;
  
      const mobile__only = embla__slider.getAttribute("data-mobile-only") || 0;
      const embla__loop = embla__slider.hasAttribute("data-embla-loop");
      const vertical = embla__slider.hasAttribute("data-vertical");
      const center = embla__slider.hasAttribute("data-center");
      const centerScale = embla__slider.hasAttribute("data-scale-center");
      const hasProgress = embla__slider.hasAttribute("data-embla-progress");
  
      const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
      const centerScaleActive = () => centerScale && isDesktop();
      const axis = vertical ? "y" : "x";
  
      function buildOptions() {
        const scaleActive = centerScaleActive();
        const alignValue = scaleActive || center ? "center" : "start";
        const loopValue = scaleActive ? true : embla__loop;
        const scrollValue = scaleActive ? 1 : slidesToScroll__mobile;
  
        if (mobile__only == "1") {
          return {
            active: !isDesktop(),
            loop: loopValue,
            align: alignValue,
            axis,
            slidesToScroll: scrollValue,
            containScroll: "trimSnaps",
            breakpoints: {
              "(min-width: 768px)": {
                loop: loopValue,
                slidesToScroll: slidesToScroll__tab
              },
              "(min-width: 1024px)": {
                loop: loopValue,
                slidesToScroll: slidesToScroll__desk
              }
            }
          };
        }
  
        return {
          loop: loopValue,
          align: alignValue,
          axis,
          containScroll: "trimSnaps",
          slidesToScroll: scrollValue,
          breakpoints: {
            "(min-width: 768px)": {
              loop: loopValue,
              slidesToScroll: slidesToScroll__tab
            },
            "(min-width: 992px)": {
              loop: loopValue,
              slidesToScroll: slidesToScroll__desk
            }
          }
        };
      }
  
      const viewportNode = embla__slider.querySelector(".embla__viewport");
      const prevButtonNode = embla__slider.querySelector(".embla__arrow--prev");
      const nextButtonNode = embla__slider.querySelector(".embla__arrow--next");
      const dotsNode = embla__slider.querySelector(".embla__dots");
      const slideNodes = embla__slider.querySelectorAll(".embla__slide");
  
      const progressNode = embla__slider.querySelector(".embla__progress");
      const progressBarNode = embla__slider.querySelector(".embla__progress-bar");
  
      const emblaApi = EmblaCarousel(viewportNode, buildOptions());
  
      /* ===============================
       VIDEO LOGIC
    =============================== */
  
      const playAllVideos = () => {
        slideNodes.forEach((slide) => {
          const video = slide.querySelector(".embla__video");
          if (!video) return;
          video.play().catch(() => {});
        });
      };
  
      const stopAllVideos = () => {
        slideNodes.forEach((slide) => {
          const video = slide.querySelector(".embla__video");
          if (!video) return;
          video.pause();
          video.currentTime = 0;
        });
      };
  
      const playActiveMobileVideo = () => {
        if (isDesktop()) return;
  
        const selected = emblaApi.selectedScrollSnap();
  
        slideNodes.forEach((slide, index) => {
          const video = slide.querySelector(".embla__video");
          if (!video) return;
  
          if (index === selected) {
            video.play().catch(() => {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      };
  
      /* ===============================
       INTERSECTION OBSERVERS
    =============================== */
  
      let desktopObserver = null;
      let mobileObserver = null;
  
      const initDesktopObserver = () => {
        if (!isDesktop()) return;
  
        desktopObserver?.disconnect();
  
        desktopObserver = new IntersectionObserver(
          ([entry]) => {
            entry.isIntersecting ? playAllVideos() : stopAllVideos();
          },
          { threshold: 0.4 }
        );
  
        desktopObserver.observe(embla__slider);
      };
  
      const initMobileObserver = () => {
        if (isDesktop()) return;
  
        mobileObserver?.disconnect();
  
        mobileObserver = new IntersectionObserver(
          ([entry]) => {
            entry.isIntersecting ? playActiveMobileVideo() : stopAllVideos();
          },
          { threshold: 0.4 }
        );
  
        mobileObserver.observe(embla__slider);
      };
  
      /* ===============================
       UI CONTROLS
    =============================== */
  
      prevButtonNode?.addEventListener("click", emblaApi.scrollPrev);
      nextButtonNode?.addEventListener("click", emblaApi.scrollNext);
  
      const toggleArrowButtonsState = () => {
        prevButtonNode?.classList.toggle(
          "is-disabled",
          !emblaApi.canScrollPrev()
        );
        nextButtonNode?.classList.toggle(
          "is-disabled",
          !emblaApi.canScrollNext()
        );
      };
  
      let dotNodes = [];
  
      const toggleDotBtnsActive = () => {
        dotNodes.forEach((dot, i) =>
          dot.classList.toggle(
            "embla__dot--selected",
            i === emblaApi.selectedScrollSnap()
          )
        );
      };
  
      const addDotBtnsWithClickHandlers = () => {
        if (!dotsNode) return;
  
        dotsNode.innerHTML = emblaApi
          .scrollSnapList()
          .map(() => `<span class="embla__dot"></span>`)
          .join("");
  
        dotNodes = [...dotsNode.querySelectorAll(".embla__dot")];
  
        dotNodes.forEach((dot, i) =>
          dot.addEventListener("click", () => emblaApi.scrollTo(i))
        );
  
        // ✅ Fix: ensure first dot is active on init
        toggleDotBtnsActive();
      };
  
      const updateActiveSlide = () => {
        slideNodes.forEach((slide) => slide.classList.remove("active-slide"));
        if (!centerScaleActive()) return;
        slideNodes[emblaApi.selectedScrollSnap()]?.classList.add("active-slide");
      };
  
      const updateProgressBar = () => {
        if (!hasProgress || !progressBarNode) return;
        requestAnimationFrame(() => {
          progressBarNode.style.transform = `scaleX(${emblaApi.scrollProgress()})`;
        });
      };
  
      /* ===============================
       EVENTS
    =============================== */
  
      emblaApi
        .on("init", toggleArrowButtonsState)
        .on("select", toggleArrowButtonsState)
        .on("reInit", toggleArrowButtonsState)
  
        .on("init", addDotBtnsWithClickHandlers)
        .on("reInit", addDotBtnsWithClickHandlers)
        .on("select", toggleDotBtnsActive)
  
        .on("select", updateActiveSlide)
        .on("reInit", updateActiveSlide)
  
        .on("init", updateProgressBar)
        .on("scroll", updateProgressBar)
        .on("reInit", updateProgressBar)
  
        .on("init", () => {
          isDesktop() ? initDesktopObserver() : initMobileObserver();
        })
        .on("select", playActiveMobileVideo)
        .on("reInit", playActiveMobileVideo);
  
      window.addEventListener("resize", () => {
        emblaApi.reInit(buildOptions());
  
        desktopObserver?.disconnect();
        mobileObserver?.disconnect();
  
        stopAllVideos();
  
        isDesktop() ? initDesktopObserver() : initMobileObserver();
      });
    });
  });
  
  window.addEventListener("load", function () {
    document.querySelectorAll(".ys-custom-vimeo")?.forEach(function (e) {
      e.addEventListener("click", function () {
        document.querySelectorAll(".ys-custom-vimeo").forEach(function (e) {
          e.classList.remove("active");
        });
        const t = this.getAttribute("data-vimeo-id"),
          o = document.createElement("iframe"),
          l = e.querySelector(".ys-custom-vimeo__iframe-wrp");
        (o.src = "https://player.vimeo.com/video/" + t + "?autoplay=1"),
          (o.frameBorder = "0"),
          (o.allow = "autoplay; fullscreen; picture-in-picture"),
          (o.style.width = "100%"),
          (o.style.height = "100%"),
          (o.style.position = "absolute"),
          (o.style.top = "0"),
          (o.style.left = "0"),
          (o.allowFullscreen = !0),
          (l.innerHTML = ""),
          e.classList.add("active"),
          l.appendChild(o);
      });
    });
  });
  