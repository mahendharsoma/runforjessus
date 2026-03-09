const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

const dropdownParents = document.querySelectorAll(".menu-item.has-dropdown");

function closeAllDropdowns() {
  for (const menuItem of dropdownParents) {
    menuItem.classList.remove("open");
  }
}

for (const item of dropdownParents) {
  const trigger = item.querySelector(":scope > a");
  if (!trigger) {
    continue;
  }

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const isOpen = item.classList.contains("open");
    closeAllDropdowns();

    if (!isOpen) {
      item.classList.add("open");
    }
  });
}

if (navLinks) {
  navLinks.addEventListener("click", (event) => {
    const clickedSubmenuLink = event.target.closest(".submenu a");
    if (!clickedSubmenuLink) {
      return;
    }

    closeAllDropdowns();
  });
}

document.addEventListener("click", (event) => {
  const clickedInsideMenu = event.target.closest(".rfj-nav");
  if (!clickedInsideMenu) {
    closeAllDropdowns();
  }
});

const testimonialSliders = document.querySelectorAll(".testimonial-slider");
for (const slider of testimonialSliders) {
  const slides = slider.querySelectorAll(".testimonial-slide");
  const dots = slider.querySelectorAll(".testimonial-dot");
  if (!slides.length || !dots.length) {
    continue;
  }

  let currentIndex = 0;
  const autoplayMs = Number(slider.getAttribute("data-autoplay-ms")) || 5500;
  let intervalId = null;

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    for (let i = 0; i < slides.length; i += 1) {
      const isActive = i === currentIndex;
      slides[i].classList.toggle("active", isActive);
      dots[i].classList.toggle("active", isActive);
      dots[i].setAttribute("aria-selected", isActive ? "true" : "false");
    }
  }

  function startAutoplay() {
    intervalId = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, autoplayMs);
  }

  function restartAutoplay() {
    if (intervalId) {
      clearInterval(intervalId);
    }
    startAutoplay();
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      restartAutoplay();
    });
  });

  goToSlide(0);
  startAutoplay();
}

const faqButtons = document.querySelectorAll(".faq-q");
for (const button of faqButtons) {
  button.addEventListener("click", () => {
    const faqItem = button.closest(".faq-item");
    if (!faqItem) {
      return;
    }

    const shouldOpen = !faqItem.classList.contains("open");

    for (const item of document.querySelectorAll(".faq-item")) {
      const itemButton = item.querySelector(".faq-q");
      const itemIcon = item.querySelector(".faq-icon");
      item.classList.remove("open");
      if (itemButton) {
        itemButton.setAttribute("aria-expanded", "false");
      }
      if (itemIcon) {
        itemIcon.textContent = "+";
      }
    }

    if (shouldOpen) {
      const icon = faqItem.querySelector(".faq-icon");
      faqItem.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      if (icon) {
        icon.textContent = "-";
      }
    }
  });
}

const countdownTarget = new Date("2026-04-04T05:45:00+05:30").getTime();
const boxes = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

function updateCountdown() {
  if (!boxes.days) {
    return;
  }

  const now = Date.now();
  const diff = countdownTarget - now;

  if (diff <= 0) {
    boxes.days.textContent = "0";
    boxes.hours.textContent = "0";
    boxes.minutes.textContent = "0";
    boxes.seconds.textContent = "0";
    return;
  }

  const dayMs = 1000 * 60 * 60 * 24;
  const hourMs = 1000 * 60 * 60;
  const minuteMs = 1000 * 60;

  const days = Math.floor(diff / dayMs);
  const hours = Math.floor((diff % dayMs) / hourMs);
  const minutes = Math.floor((diff % hourMs) / minuteMs);
  const seconds = Math.floor((diff % minuteMs) / 1000);

  boxes.days.textContent = String(days);
  boxes.hours.textContent = String(hours).padStart(2, "0");
  boxes.minutes.textContent = String(minutes).padStart(2, "0");
  boxes.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const timelineTabs = document.querySelectorAll(".timeline-tab");
if (timelineTabs.length) {
  const timelinePanels = document.querySelectorAll(".timeline-panel");
  const timelinePrev = document.querySelector(".timeline-prev");
  const timelineNext = document.querySelector(".timeline-next");

  function goToTimelineIndex(index) {
    const total = timelineTabs.length;
    const normalized = (index + total) % total;
    const activeTab = timelineTabs[normalized];
    const targetId = activeTab.getAttribute("data-target");

    for (const button of timelineTabs) {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
    }

    for (const panel of timelinePanels) {
      const isTarget = panel.id === targetId;
      panel.classList.toggle("active", isTarget);
      panel.hidden = !isTarget;
    }

    activeTab.classList.add("active");
    activeTab.setAttribute("aria-selected", "true");
  }

  function getActiveTimelineIndex() {
    for (let i = 0; i < timelineTabs.length; i += 1) {
      if (timelineTabs[i].classList.contains("active")) {
        return i;
      }
    }
    return 0;
  }

  for (const tab of timelineTabs) {
    tab.addEventListener("click", () => {
      const index = Array.from(timelineTabs).indexOf(tab);
      if (index < 0) {
        return;
      }

      goToTimelineIndex(index);
    });
  }

  if (timelinePrev) {
    timelinePrev.addEventListener("click", () => {
      goToTimelineIndex(getActiveTimelineIndex() - 1);
    });
  }

  if (timelineNext) {
    timelineNext.addEventListener("click", () => {
      goToTimelineIndex(getActiveTimelineIndex() + 1);
    });
  }
}

const counterElements = document.querySelectorAll("[data-counter]");
if (counterElements.length) {
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateCounter(element) {
    const endValue = Number(element.getAttribute("data-counter")) || 0;
    const startTime = performance.now();
    const duration = 1400;

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.round(endValue * easeOut(progress));
      element.textContent = String(value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }

      animateCounter(entry.target);
      obs.unobserve(entry.target);
    }
  }, { threshold: 0.35 });

  for (const counter of counterElements) {
    observer.observe(counter);
  }
}

const galleryMainSlides = document.querySelectorAll(".gallery-main-image");
if (galleryMainSlides.length) {
  const galleryThumbs = document.querySelectorAll(".gallery-thumb");
  const galleryPrev = document.querySelector(".gallery-nav.prev");
  const galleryNext = document.querySelector(".gallery-nav.next");
  let galleryIndex = 0;

  function showGallerySlide(index) {
    galleryIndex = (index + galleryMainSlides.length) % galleryMainSlides.length;

    for (let i = 0; i < galleryMainSlides.length; i += 1) {
      const active = i === galleryIndex;
      galleryMainSlides[i].classList.toggle("active", active);
      if (galleryThumbs[i]) {
        galleryThumbs[i].classList.toggle("active", active);
      }
    }
  }

  for (const thumb of galleryThumbs) {
    thumb.addEventListener("click", () => {
      const index = Number(thumb.getAttribute("data-index"));
      if (Number.isNaN(index)) {
        return;
      }

      showGallerySlide(index);
    });
  }

  if (galleryPrev) {
    galleryPrev.addEventListener("click", () => {
      showGallerySlide(galleryIndex - 1);
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener("click", () => {
      showGallerySlide(galleryIndex + 1);
    });
  }

  showGallerySlide(0);
}

const galleryFilterButtons = document.querySelectorAll(".gallery-filter");
if (galleryFilterButtons.length) {
  const galleryYearCards = document.querySelectorAll(".gallery-year-card");

  for (const button of galleryFilterButtons) {
    button.addEventListener("click", () => {
      const selected = button.getAttribute("data-filter");

      for (const btn of galleryFilterButtons) {
        btn.classList.remove("active");
      }

      button.classList.add("active");

      for (const card of galleryYearCards) {
        const cardYear = card.getAttribute("data-year");
        const shouldShow = selected === "all" || cardYear === selected;
        card.hidden = !shouldShow;
      }
    });
  }
}

const librarySearch = document.querySelector("#librarySearch");
const libraryFilters = document.querySelectorAll(".library-filter");
const libraryItems = document.querySelectorAll(".library-item");
const libraryCount = document.querySelector("#libraryCount");
const libraryList = document.querySelector("#libraryList");

if (libraryItems.length) {
  let activeLibraryFilter = "all";

  function updateLibraryResults() {
    const searchTerm = (librarySearch?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    for (const item of libraryItems) {
      const category = item.getAttribute("data-category") || "";
      const title = (item.getAttribute("data-title") || "").toLowerCase();
      const text = item.textContent.toLowerCase();

      const categoryMatch = activeLibraryFilter === "all" || category === activeLibraryFilter;
      const searchMatch = !searchTerm || title.includes(searchTerm) || text.includes(searchTerm);
      const show = categoryMatch && searchMatch;
      item.hidden = !show;

      if (show) {
        visibleCount += 1;
      }
    }

    if (libraryCount) {
      libraryCount.textContent = `Showing ${visibleCount} resource${visibleCount === 1 ? "" : "s"}`;
    }

    if (!libraryList) {
      return;
    }

    const oldEmpty = libraryList.querySelector(".library-empty");
    if (oldEmpty) {
      oldEmpty.remove();
    }

    if (visibleCount === 0) {
      const empty = document.createElement("p");
      empty.className = "library-empty";
      empty.textContent = "No resources match your search or selected category.";
      libraryList.appendChild(empty);
    }
  }

  for (const button of libraryFilters) {
    button.addEventListener("click", () => {
      activeLibraryFilter = button.getAttribute("data-filter") || "all";

      for (const btn of libraryFilters) {
        btn.classList.remove("active");
      }

      button.classList.add("active");
      updateLibraryResults();
    });
  }

  if (librarySearch) {
    librarySearch.addEventListener("input", updateLibraryResults);
  }

  updateLibraryResults();
}

const hydTabShells = document.querySelectorAll("[data-hyd-tabs]");
for (const shell of hydTabShells) {
  const buttons = shell.querySelectorAll(".hyd-tab-btn");
  const panels = shell.querySelectorAll(".hyd-tab-panel");
  if (!buttons.length || !panels.length) {
    continue;
  }

  for (const button of buttons) {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-target");
      if (!target) {
        return;
      }

      for (const btn of buttons) {
        btn.classList.remove("active");
      }
      button.classList.add("active");

      for (const panel of panels) {
        const isActive = panel.id === target;
        panel.classList.toggle("active", isActive);
        panel.hidden = !isActive;
      }
    });
  }
}

const hydDistrictDropdown = document.querySelector("#hydDistrictDropdown");
const hydLocationDropdown = document.querySelector("#hydLocationDropdown");
const hydDataTable = document.querySelector("#hydDataTable");
const hydDataBody = document.querySelector("#hydDataBody");
const hydClearSelections = document.querySelector("#hydClearSelections");

if (hydDistrictDropdown && hydLocationDropdown && hydDataTable && hydDataBody) {
  const hydDistrictData = {
    Hyderabad: [
      { location: "Alwal (Cord 1)", contact: "Ps. David Sudhakar", phone: "9440085626" },
      { location: "Alwal (Cord 2)", contact: "Bro. Suresh Pakalapati", phone: "9948739226" },
      { location: "BHEL - Chanda Nagar", contact: "Bro. Peter Jaipal", phone: "9848741691" },
      { location: "Central Zone", contact: "Bro. Johnson Patha", phone: "7702777767 / 8008977705" },
      { location: "Jubilee Hills", contact: "Rev. Yesuraju Sivakoti", phone: "9849132045" },
      { location: "Perzadiguda", contact: "Bishop. Veeraji", phone: "9391317211" }
    ],
    "Medchal-Malkajgiri": [
      { location: "Boduppal", contact: "Bro. Sunny", phone: "7396669091" },
      { location: "ECIL - Kapra", contact: "Rev. S Raju", phone: "8885788359" },
      { location: "Nagole", contact: "Bishop. Dayanand", phone: "9652244492" },
      { location: "Qutbullapur", contact: "Rev. Godi Shekar", phone: "9989155324" }
    ],
    Rangareddy: [
      { location: "Almasguda", contact: "Ps. Isaac", phone: "9550542651" },
      { location: "Rajendra Nagar", contact: "Bro. Nikhil", phone: "7330648447" },
      { location: "Uppal", contact: "Rev. Gona Philip", phone: "9866509573" },
      { location: "Vanasthalipuram", contact: "Ps. Jonathan", phone: "9848488827" }
    ],
    Secunderabad: [
      { location: "Balaji Nagar - Jawahar Nagar", contact: "Ps. Gera Isaac", phone: "9440393651" }
    ]
  };

  function renderHydDistricts() {
    hydDistrictDropdown.innerHTML = '<option value="">Select District</option>';
    for (const district of Object.keys(hydDistrictData)) {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      hydDistrictDropdown.appendChild(option);
    }
  }

  function resetHydLookup() {
    hydLocationDropdown.innerHTML = '<option value="">Select Location</option>';
    hydLocationDropdown.value = "";
    hydLocationDropdown.disabled = true;
    hydDataBody.innerHTML = "";
    hydDataTable.hidden = true;
  }

  hydDistrictDropdown.addEventListener("change", () => {
    const district = hydDistrictDropdown.value;
    resetHydLookup();

    if (!district) {
      return;
    }

    hydLocationDropdown.disabled = false;
    for (const row of hydDistrictData[district]) {
      const option = document.createElement("option");
      option.value = row.location;
      option.textContent = row.location;
      hydLocationDropdown.appendChild(option);
    }
  });

  hydLocationDropdown.addEventListener("change", () => {
    const district = hydDistrictDropdown.value;
    const location = hydLocationDropdown.value;
    if (!district || !location) {
      hydDataBody.innerHTML = "";
      hydDataTable.hidden = true;
      return;
    }

    const details = hydDistrictData[district].find((item) => item.location === location);
    if (!details) {
      return;
    }

    const rows = [
      ["District", district],
      ["Location", details.location],
      ["Contact Person", details.contact],
      ["Phone Number", details.phone]
    ];

    hydDataBody.innerHTML = "";
    for (const [label, value] of rows) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<th>${label}</th><td>${value}</td>`;
      hydDataBody.appendChild(tr);
    }

    hydDataTable.hidden = false;
  });

  if (hydClearSelections) {
    hydClearSelections.addEventListener("click", () => {
      hydDistrictDropdown.value = "";
      resetHydLookup();
    });
  }

  renderHydDistricts();
}

const tgSlider = document.querySelector("[data-tg-slider]");
if (tgSlider) {
  const tgSlides = tgSlider.querySelectorAll(".tg-slide");
  if (tgSlides.length > 1) {
    let tgActiveSlide = 0;

    function setTgSlide(index) {
      tgSlides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === index);
      });
    }

    setInterval(() => {
      tgActiveSlide = (tgActiveSlide + 1) % tgSlides.length;
      setTgSlide(tgActiveSlide);
    }, 3500);
  }
}

const tgDistrictDropdown = document.querySelector("#tgDistrictDropdown");
const tgLocationDropdown = document.querySelector("#tgLocationDropdown");
const tgDataTable = document.querySelector("#tgDataTable");
const tgDataBody = document.querySelector("#tgDataBody");
const tgClearSelections = document.querySelector("#tgClearSelections");

if (tgDistrictDropdown && tgLocationDropdown && tgDataTable && tgDataBody) {
  const tgDistrictData = {
    Adilabad: [
      { location: "Adilabad Town", contact: "Ps. Kishore", phone: "9440422101" },
      { location: "Nirmal", contact: "Bro. Yeshwanth", phone: "9390011455" }
    ],
    Bhadradri: [
      { location: "Kothagudem", contact: "Rev. Daniel", phone: "9440416602" },
      { location: "Bhadrachalam", contact: "Bro. Rajesh", phone: "9866939098" }
    ],
    Hyderabad: [
      { location: "Secunderabad", contact: "Rev. Vinod", phone: "9704802020" },
      { location: "Ameerpet", contact: "Bro. Stephen", phone: "9949393930" }
    ],
    Jagtial: [
      { location: "Jagtial", contact: "Ps. Prabhakar", phone: "9949426301" }
    ],
    Karimnagar: [
      { location: "Karimnagar City", contact: "Bro. Sandeep", phone: "9441022244" },
      { location: "Huzurabad", contact: "Ps. Thomas", phone: "9849221744" }
    ],
    Khammam: [
      { location: "Khammam Town", contact: "Rev. Sudhakar", phone: "9440277882" },
      { location: "Madhira", contact: "Bro. Immanuel", phone: "9848755332" }
    ],
    Mahabubnagar: [
      { location: "Mahabubnagar", contact: "Ps. John Wesley", phone: "9985151520" },
      { location: "Jadcherla", contact: "Bro. Ashok", phone: "9493999905" }
    ],
    Medak: [
      { location: "Sangareddy", contact: "Ps. Samuel", phone: "9440533770" },
      { location: "Narsapur", contact: "Bro. Paul", phone: "9701055503" }
    ],
    Nalgonda: [
      { location: "Nalgonda", contact: "Rev. Praveen", phone: "9985900700" },
      { location: "Suryapet", contact: "Bro. Manoj", phone: "9948767622" }
    ],
    Nizamabad: [
      { location: "Nizamabad", contact: "Bro. Ramesh", phone: "9440309030" },
      { location: "Bodhan", contact: "Ps. Philip", phone: "9849450887" }
    ],
    Rangareddy: [
      { location: "Shamshabad", contact: "Ps. Jonathan", phone: "9848488827" },
      { location: "Chevella", contact: "Bro. Pratap", phone: "9989882277" }
    ],
    Siddipet: [
      { location: "Siddipet", contact: "Bro. Benhur", phone: "9948962303" }
    ],
    Warangal: [
      { location: "Hanamkonda", contact: "Rev. Naveen", phone: "9849272105" },
      { location: "Warangal", contact: "Bro. Victor", phone: "9440147790" }
    ]
  };

  function renderTgDistricts() {
    tgDistrictDropdown.innerHTML = '<option value="">Select District</option>';
    for (const district of Object.keys(tgDistrictData)) {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      tgDistrictDropdown.appendChild(option);
    }
  }

  function resetTgLookup() {
    tgLocationDropdown.innerHTML = '<option value="">Select Location</option>';
    tgLocationDropdown.value = "";
    tgLocationDropdown.disabled = true;
    tgDataBody.innerHTML = "";
    tgDataTable.hidden = true;
  }

  tgDistrictDropdown.addEventListener("change", () => {
    const district = tgDistrictDropdown.value;
    resetTgLookup();

    if (!district) {
      return;
    }

    tgLocationDropdown.disabled = false;
    for (const row of tgDistrictData[district]) {
      const option = document.createElement("option");
      option.value = row.location;
      option.textContent = row.location;
      tgLocationDropdown.appendChild(option);
    }
  });

  tgLocationDropdown.addEventListener("change", () => {
    const district = tgDistrictDropdown.value;
    const location = tgLocationDropdown.value;
    if (!district || !location) {
      tgDataBody.innerHTML = "";
      tgDataTable.hidden = true;
      return;
    }

    const details = tgDistrictData[district].find((item) => item.location === location);
    if (!details) {
      return;
    }

    const rows = [
      ["District", district],
      ["Location", details.location],
      ["Contact Person", details.contact],
      ["Phone Number", details.phone]
    ];

    tgDataBody.innerHTML = "";
    for (const [label, value] of rows) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<th>${label}</th><td>${value}</td>`;
      tgDataBody.appendChild(tr);
    }

    tgDataTable.hidden = false;
  });

  if (tgClearSelections) {
    tgClearSelections.addEventListener("click", () => {
      tgDistrictDropdown.value = "";
      resetTgLookup();
    });
  }

  renderTgDistricts();
}

const apSlider = document.querySelector("[data-ap-slider]");
if (apSlider) {
  const apSlides = apSlider.querySelectorAll(".ap-slide");
  if (apSlides.length > 1) {
    let apActiveSlide = 0;

    function setApSlide(index) {
      apSlides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === index);
      });
    }

    setInterval(() => {
      apActiveSlide = (apActiveSlide + 1) % apSlides.length;
      setApSlide(apActiveSlide);
    }, 3000);
  }
}

const apDistrictDropdown = document.querySelector("#apDistrictDropdown");
const apLocationDropdown = document.querySelector("#apLocationDropdown");
const apDataTable = document.querySelector("#apDataTable");
const apDataBody = document.querySelector("#apDataBody");
const apClearSelections = document.querySelector("#apClearSelections");

if (apDistrictDropdown && apLocationDropdown && apDataTable && apDataBody) {
  const apDistrictData = {
    "Alluri Seetharama Raju (ASR)": [
      { location: "Ananthagiri", contact: "Ps. P. Samuel", phone: "7382195867" },
      { location: "Araku Valley", contact: "Ps. G. David", phone: "8500357556" },
      { location: "Dumbriguda", contact: "Mr. Jogulu", phone: "8309436953" },
      { location: "Y Ramavaram", contact: "Ps. Immanuel", phone: "9547526655" }
    ],
    Ananthapur: [
      { location: "Ananthapur", contact: "Anil Kumar Moses", phone: "9849705999" },
      { location: "Guntakal", contact: "Amruth", phone: "7680023381" },
      { location: "Hindupur", contact: "Adarsh", phone: "7981962890" },
      { location: "Tadipatri", contact: "Joel Ganesh", phone: "9848356602" }
    ],
    Chittoor: [
      { location: "Chittoor", contact: "Samuel Babu", phone: "7989180415" },
      { location: "Madanapalli", contact: "Bhaktavastalam", phone: "9440202367" },
      { location: "Tirupathi", contact: "John Paul", phone: "8686555600" }
    ],
    "East Godavari": [
      { location: "Kakinada", contact: "Samuel Akumarthi", phone: "7093136222" },
      { location: "Rajahmundry", contact: "Bisp. Samuel Raj", phone: "9908042573" },
      { location: "Mandapeta", contact: "Rev. Daniel Paul", phone: "9908799405" },
      { location: "Yeleswaram", contact: "Joseph Andrews", phone: "8341141888" }
    ],
    Guntur: [
      { location: "Guntur", contact: "Vikranth", phone: "9959952838" },
      { location: "Tenali", contact: "Rev. John Paul", phone: "9866049360" },
      { location: "Sattenapalli", contact: "Sudheer Kumar", phone: "9849799450" },
      { location: "Bapatla", contact: "F W Coal", phone: "9848043620" }
    ],
    Krishna: [
      { location: "Vijayawada", contact: "Rev. Vishwa Prasad", phone: "9866744577" },
      { location: "Machilipatnam", contact: "Nirmala", phone: "8333937951" },
      { location: "Gudiwada", contact: "Rev. Syam Babu", phone: "9949072177" },
      { location: "Nuzividu", contact: "Stalin Ranjit", phone: "9848405557" }
    ],
    Kurnool: [
      { location: "Kurnool", contact: "Sudheer", phone: "9966565317" },
      { location: "Nandyal", contact: "Ravindra Paul", phone: "9848079009" },
      { location: "Dhone", contact: "Solomon", phone: "9494216488" },
      { location: "Yemmiganur", contact: "Yacob", phone: "9550335747" }
    ],
    Nellore: [
      { location: "Nellore", contact: "Rev. Dayasagar", phone: "8501838775" },
      { location: "Kavali", contact: "P Thomas", phone: "9849586891" },
      { location: "Gudur", contact: "Rev. Solomon", phone: "9885248958" }
    ],
    Prakasam: [
      { location: "Ongole", contact: "Tella Emmanuel", phone: "9951420834" },
      { location: "Addanki", contact: "Ps. Stalin", phone: "9948353538" },
      { location: "Chirala", contact: "Ps. Kumar", phone: "7893430422" }
    ],
    Srikakulam: [
      { location: "Srikakulam", contact: "Bro. Jeevan", phone: "9440731506" },
      { location: "Ichapuram", contact: "Bro. Anvesh Sundar Raju", phone: "8899557777" },
      { location: "Palasa", contact: "Bro. DVS Kumar", phone: "9440112856" }
    ],
    "Vishakapatnam / Vizag": [
      { location: "Anakapalli", contact: "Sunny James", phone: "8886157007" },
      { location: "Gajuwaka", contact: "Ravi Babu", phone: "9490679280" },
      { location: "Madhurawada", contact: "Bhaskar Raju", phone: "9440326474" }
    ],
    Vizianagaram: [
      { location: "Vizianagaram", contact: "P Prema Nandam", phone: "9440774624" },
      { location: "Bobbili", contact: "V Ch Jayaraj", phone: "9704381082" },
      { location: "S Kota", contact: "Deva Prasad", phone: "9440255480" }
    ],
    "West Godavari": [
      { location: "Eluru", contact: "Bro. Kranthi", phone: "9948830777" },
      { location: "Tadepalligudem", contact: "Prasanna Kumar", phone: "9949269891" },
      { location: "Jangareddygudem", contact: "Ps. Moshe", phone: "9866233027" }
    ],
    "Kadapa (YSR)": [
      { location: "Kadapa", contact: "Manohar Babu", phone: "9849846877" },
      { location: "Proddutur", contact: "Ps. Rajanna", phone: "9866313279" },
      { location: "Moolavaripalli", contact: "Vijaya Kumar", phone: "8688888318" }
    ],
    "Kakinada (Old E. Godavari)": [
      { location: "Gorripudi", contact: "Rev. R Pratap Kumar", phone: "8008147804" },
      { location: "Nadakuduru", contact: "Rev. J Paul Prasad", phone: "9959462307" },
      { location: "Velangi", contact: "Rev. P Satya Prasad", phone: "9110337008" }
    ]
  };

  function renderApDistricts() {
    apDistrictDropdown.innerHTML = '<option value="">Select District</option>';
    for (const district of Object.keys(apDistrictData)) {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      apDistrictDropdown.appendChild(option);
    }
  }

  function resetApLookup() {
    apLocationDropdown.innerHTML = '<option value="">Select Location</option>';
    apLocationDropdown.value = "";
    apLocationDropdown.disabled = true;
    apDataBody.innerHTML = "";
    apDataTable.hidden = true;
  }

  apDistrictDropdown.addEventListener("change", () => {
    const district = apDistrictDropdown.value;
    resetApLookup();

    if (!district) {
      return;
    }

    apLocationDropdown.disabled = false;
    for (const row of apDistrictData[district]) {
      const option = document.createElement("option");
      option.value = row.location;
      option.textContent = row.location;
      apLocationDropdown.appendChild(option);
    }
  });

  apLocationDropdown.addEventListener("change", () => {
    const district = apDistrictDropdown.value;
    const location = apLocationDropdown.value;
    if (!district || !location) {
      apDataBody.innerHTML = "";
      apDataTable.hidden = true;
      return;
    }

    const details = apDistrictData[district].find((item) => item.location === location);
    if (!details) {
      return;
    }

    const rows = [
      ["District", district],
      ["Location", details.location],
      ["Contact Person", details.contact],
      ["Phone Number", details.phone]
    ];

    apDataBody.innerHTML = "";
    for (const [label, value] of rows) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<th>${label}</th><td>${value}</td>`;
      apDataBody.appendChild(tr);
    }

    apDataTable.hidden = false;
  });

  if (apClearSelections) {
    apClearSelections.addEventListener("click", () => {
      apDistrictDropdown.value = "";
      resetApLookup();
    });
  }

  renderApDistricts();
}

const roiStateDropdown = document.querySelector("#roiStateDropdown");
const roiDistrictDropdown = document.querySelector("#roiDistrictDropdown");
const roiLocationDropdown = document.querySelector("#roiLocationDropdown");
const roiDataTable = document.querySelector("#roiDataTable");
const roiDataBody = document.querySelector("#roiDataBody");
const roiClearSelections = document.querySelector("#roiClearSelections");

if (roiStateDropdown && roiDistrictDropdown && roiLocationDropdown && roiDataTable && roiDataBody) {
  const roiStateDistrictData = {
    Chhattisgarh: {
      "Bastar - Jagdalpu": [
        { location: "Jagdalpur Bus Stop", contact: "Simson Nag", phone: "9399734135" }
      ]
    },
    Karnataka: {
      Bangalore: [
        { location: "Amana Church, Bangalore", contact: "Ps. Raj Shekar", phone: "9399734135" },
        { location: "Bangalore", contact: "Ps. Suresh", phone: "9448683297" },
        { location: "Baptist Church, Bangalore Cord #1", contact: "Ps. Suresh", phone: "9986433898" },
        { location: "Baptist Church, Bangalore Cord #2", contact: "Ps. Daniel", phone: "9739456501" },
        { location: "Mizpah Church, Bangalore", contact: "Ps. Srimantu", phone: "9972449618" },
        { location: "UTL Bangalore", contact: "Capt. John", phone: "9880722778" }
      ],
      Bellary: [
        { location: "Bellary, Mothi Circle, Opp. Buda Complex", contact: "Kanthi Noah Wilson", phone: "8951859333" }
      ],
      "Dharwad - Hubli": [
        { location: "Hubli, DTDC Courier", contact: "Shekar Babu", phone: "9035120510" }
      ],
      Kalaburagi: [
        { location: "City Central Bus Stop, Kalaburagi", contact: "Sudhaka", phone: "9741828461 ; 7204877143 ; 7204059788" }
      ],
      Mysore: [
        { location: "VRL Transport, Mysore", contact: "Jay Kumar", phone: "9036340300" }
      ],
      Raichur: [
        { location: "Raichur Bus Stand", contact: "John Wesley", phone: "8296907430 ; 9663037430" }
      ],
      "Uttara Kannada - Dandeli": [
        { location: "Dandeli", contact: "Mathew", phone: "8971891462" },
        { location: "J N Road, Dandeli", contact: "Mathushala", phone: "8971891462" }
      ]
    },
    Maharashtra: {
      Ahmednagar: [
        { location: "Ahmednagar", contact: "Rev. Moses", phone: "8087594137" }
      ],
      Chandrapur: [
        { location: "Chandrapur (Cord #1)", contact: "Anurag Nirmal", phone: "9822460181" },
        { location: "Chandrapur (Cord #2)", contact: "Ps Rajesh Ramila", phone: "8856020937" }
      ],
      Nagpur: [
        { location: "Rambagh (Nagpur)", contact: "Amit Shinde", phone: "9890287481" }
      ],
      Nanded: [
        { location: "Hingoli Gate, Nanded Main Bus Stop (Cord #1)", contact: "Rapolu Emmanuel", phone: "9657577226" },
        { location: "Hingoli Gate, Nanded Main Bus Stop (Cord #2)", contact: "Sanjeeva Rao", phone: "8087516911" },
        { location: "Hingoli Gate, Nanded Main Bus Stop (Cord #3)", contact: "Rev. George", phone: "8806813912" }
      ],
      "Pune - Chinchol": [
        { location: "Chincholi (Hyd Delivered)", contact: "Paul", phone: "9000262829" }
      ]
    },
    Odisha: {
      Kandhamal: [
        { location: "At/Po - Nuasahi, Baliguda Courier", contact: "Anand", phone: "9437858443" }
      ]
    },
    "Tamil Nadu": {
      Chennai: [
        { location: "Chennai (Koyambedu Madavaram - Andhra Bus Stop)", contact: "Dr. Prakash", phone: "9444054937" }
      ]
    },
    "West Bengal": {
      Jalpaiguri: [
        { location: "Siliguri", contact: "Rinki Gurung", phone: "91 755-0811164" }
      ],
      Kolkata: [
        { location: "Uttarayan", contact: "Rinki Gurung", phone: "7602435148" }
      ]
    }
  };

  function renderRoiStates() {
    roiStateDropdown.innerHTML = '<option value="">Select State</option>';
    for (const state of Object.keys(roiStateDistrictData)) {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      roiStateDropdown.appendChild(option);
    }
  }

  function resetRoiDistricts() {
    roiDistrictDropdown.innerHTML = '<option value="">Select District</option>';
    roiDistrictDropdown.value = "";
    roiDistrictDropdown.disabled = true;
  }

  function resetRoiLocations() {
    roiLocationDropdown.innerHTML = '<option value="">Select Location</option>';
    roiLocationDropdown.value = "";
    roiLocationDropdown.disabled = true;
  }

  function resetRoiTable() {
    roiDataBody.innerHTML = "";
    roiDataTable.hidden = true;
  }

  function resetRoiAll() {
    resetRoiDistricts();
    resetRoiLocations();
    resetRoiTable();
  }

  roiStateDropdown.addEventListener("change", () => {
    const state = roiStateDropdown.value;
    resetRoiDistricts();
    resetRoiLocations();
    resetRoiTable();

    if (!state) {
      return;
    }

    const districts = Object.keys(roiStateDistrictData[state]);
    roiDistrictDropdown.disabled = false;
    for (const district of districts) {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      roiDistrictDropdown.appendChild(option);
    }
  });

  roiDistrictDropdown.addEventListener("change", () => {
    const state = roiStateDropdown.value;
    const district = roiDistrictDropdown.value;
    resetRoiLocations();
    resetRoiTable();

    if (!state || !district) {
      return;
    }

    roiLocationDropdown.disabled = false;
    for (const row of roiStateDistrictData[state][district]) {
      const option = document.createElement("option");
      option.value = row.location;
      option.textContent = row.location;
      roiLocationDropdown.appendChild(option);
    }
  });

  roiLocationDropdown.addEventListener("change", () => {
    const state = roiStateDropdown.value;
    const district = roiDistrictDropdown.value;
    const location = roiLocationDropdown.value;
    if (!state || !district || !location) {
      resetRoiTable();
      return;
    }

    const details = roiStateDistrictData[state][district].find((item) => item.location === location);
    if (!details) {
      return;
    }

    const rows = [
      ["State", state],
      ["District", district],
      ["Location", details.location],
      ["Contact Person", details.contact],
      ["Phone Number", details.phone]
    ];

    roiDataBody.innerHTML = "";
    for (const [label, value] of rows) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<th>${label}</th><td>${value}</td>`;
      roiDataBody.appendChild(tr);
    }

    roiDataTable.hidden = false;
  });

  if (roiClearSelections) {
    roiClearSelections.addEventListener("click", () => {
      roiStateDropdown.value = "";
      resetRoiAll();
    });
  }

  renderRoiStates();
}
