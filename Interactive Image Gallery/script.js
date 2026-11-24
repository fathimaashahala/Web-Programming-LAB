
const pets = [
  {
    name: "Sleepy Kitten",
    type: "cat",
    emoji: "🐱",
    description: "A tiny kitten with the sweetest little face.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=90"
  },
  {
    name: "Fluffy Puppy",
    type: "dog",
    emoji: "🐶",
    description: "A playful puppy ready to become your best friend.",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=90"
  },
  {
    name: "Baby Bunny",
    type: "small",
    emoji: "🐰",
    description: "A soft little bunny with adorable ears.",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1000&q=90"
  },
  {
    name: "Cute Hamster",
    type: "small",
    emoji: "🐹",
    description: "A tiny ball of fluff with little paws.",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=1000&q=90"
  },
  {
    name: "Polar Bear",
    type: "wild",
    emoji: "🐻‍❄️",
    description: "A magnificent fluffy friend from the snowy Arctic.",
    image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=1600&q=95"
  },
  {
    name: "Curious Kitty",
    type: "cat",
    emoji: "😺",
    description: "A curious cat who loves exploring everything.",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1000&q=90"
  },
  {
    name: "Golden Bestie",
    type: "dog",
    emoji: "🐕",
    description: "A happy dog with a heart full of love.",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1000&q=90"
  },
  {
    name: "Little Fox",
    type: "wild",
    emoji: "🦊",
    description: "A beautiful fox with a fluffy tail.",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1000&q=90"
  }
];

const gallery = document.getElementById("gallery");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById("lightboxDescription");
const slideCounter = document.getElementById("slideCounter");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playBtn = document.getElementById("playBtn");

let visiblePets = [...pets];
let currentIndex = 0;
let slideshowTimer = null;

const categoryNames = {
  cat: "Kitten",
  dog: "Puppy",
  small: "Tiny Friend",
  wild: "Wild Friend"
};

function renderGallery(filter = "all") {
  const filteredPets = filter === "all"
    ? pets
    : pets.filter(pet => pet.type === filter);

  visiblePets = filteredPets;
  gallery.innerHTML = "";

  visiblePets.forEach((pet, index) => {
    const card = document.createElement("article");
    card.className = "pet-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${pet.name} photo`);

    const imageWrap = document.createElement("div");
    imageWrap.className = "pet-image-wrap";

    const img = document.createElement("img");
    img.src = pet.image;
    img.alt = pet.name;
    img.loading = "lazy";
    img.onerror = () => {
      img.alt = `${pet.name} image could not be loaded`;
      img.style.display = "none";
      imageWrap.textContent = `${pet.emoji} Image unavailable`;
      imageWrap.style.display = "grid";
      imageWrap.style.placeItems = "center";
      imageWrap.style.color = "#794c7d";
    };

    const info = document.createElement("div");
    info.className = "pet-info";

    const title = document.createElement("h2");
    title.textContent = `${pet.emoji} ${pet.name}`;

    const description = document.createElement("p");
    description.textContent = pet.description;

    const tag = document.createElement("span");
    tag.className = "pet-tag";
    tag.textContent = categoryNames[pet.type];

    imageWrap.appendChild(img);
    info.append(title, description, tag);
    card.append(imageWrap, info);

    card.addEventListener("click", () => openLightbox(index));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });

    gallery.appendChild(card);
  });
}

function openLightbox(index) {
  if (!visiblePets.length) return;

  currentIndex = index;
  updateLightbox();

  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeBtn.focus();
}

function updateLightbox() {
  const pet = visiblePets[currentIndex];

  lightboxImage.src = pet.image;
  lightboxImage.alt = pet.name;
  lightboxTitle.textContent = `${pet.emoji} ${pet.name}`;
  lightboxDescription.textContent = pet.description;
  slideCounter.textContent =
    `${currentIndex + 1} of ${visiblePets.length}`;
}

function closeLightbox() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  stopSlideshow();
}

function showNext() {
  if (!visiblePets.length) return;
  currentIndex = (currentIndex + 1) % visiblePets.length;
  updateLightbox();
}

function showPrevious() {
  if (!visiblePets.length) return;
  currentIndex =
    (currentIndex - 1 + visiblePets.length) % visiblePets.length;
  updateLightbox();
}

function startSlideshow() {
  if (visiblePets.length < 2) return;

  stopSlideshow();

  slideshowTimer = setInterval(showNext, 2500);
  playBtn.textContent = "⏸ Pause Slideshow";
}

function stopSlideshow() {
  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }

  playBtn.textContent = "▶ Start Slideshow";
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    renderGallery(button.dataset.filter);

    if (lightbox.classList.contains("show")) {
      closeLightbox();
    }
  });
});

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", showNext);
prevBtn.addEventListener("click", showPrevious);

playBtn.addEventListener("click", () => {
  if (slideshowTimer) {
    stopSlideshow();
  } else {
    startSlideshow();
  }
});

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("show")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrevious();
});

renderGallery();
