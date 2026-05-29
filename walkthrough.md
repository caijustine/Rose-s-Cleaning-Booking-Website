# Rose's Cleaning & Janitorial Botanical Walkthrough

We have successfully rebuilt the website for **Rose's Cleaning and Janitorial** using an elevated, nature-inspired luxury spa aesthetic. 

The site shifts from pink-dominance to a palette of **soft sage greens, muted dusty blues, warm cream, and blush nude**, using rose tones strictly as refined details. We also integrated a custom scroll-motion and layout engine.

---

## File Map

The core files in the workspace:
1. **[index.html](file:///Users/cai/personal_projects/roses_cleaning/index.html)**: Reorganized semantic grids with custom character-reveal headings, floating botanical SVGs, checkmarks, pricing cards, and accessible forms.
2. **[style.css](file:///Users/cai/personal_projects/roses_cleaning/style.css)**: Holds the spa variables, transition configurations, keyframe offsets, glassmorphic inputs, and spacing.
3. **[app.js](file:///Users/cai/personal_projects/roses_cleaning/app.js)**: Holds the scroll-observation engine, mouse coordinate-triggers for parallax offsets, drag slider listeners, form check logic, and calculator calculations.
4. **[task.md](file:///Users/cai/personal_projects/roses_cleaning/task.md)**: Progress chart.

---

## Educational Deep Dive: The Motion Systems

As a software development student, here is how the two animation architectures operate:

### 1. Scroll-Reveal (Intersection Observer API)
Traditional scroll animations required listening to scroll events and checking `element.getBoundingClientRect()` repeatedly, which slowed down browser rendering. 

Instead, we use the modern **Intersection Observer API** in [app.js](file:///Users/cai/personal_projects/roses_cleaning/app.js):
```javascript
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-active');
      observer.unobserve(entry.target); // Stop tracking once animated
    }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
```
* **CSS Alignment**: In [style.css](file:///Users/cai/personal_projects/roses_cleaning/style.css), `.reveal-item` is set to `opacity: 0; transform: translateY(35px); filter: blur(4px); transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);`. When `.reveal-active` is appended, it transitions to `opacity: 1; transform: translateY(0); filter: blur(0);`.

### 2. Scroll Parallax (Botanical Drift)
In the background, we placed floating botanical SVGs representing eucalyptus/rose leaves. To make them feel like they float in 3D space, we drift them at different speeds relative to the page scroll:
```javascript
window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;
  floatingLeaves.forEach(leaf => {
    const depth = parseFloat(leaf.getAttribute('data-depth')) || 0.1;
    const translateY = scrollY * depth;
    const rotate = scrollY * 0.03;
    leaf.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
  });
}, { passive: true }); // passive: true optimization prevents scroll blocking
```
* **Depth Attribute**: Each leaf has a `data-depth` (e.g. `0.15` or `0.25`). Slower-moving elements feel further away, and faster-moving elements feel closer, creating a layered depth effect as the user scrolls.

---

## How to Test Locally

1. Open your terminal.
2. Navigate to your project directory: `cd /Users/cai/personal_projects/roses_cleaning`
3. Start the server on port **8001** to avoid port conflicts:
   ```bash
   python3 -m http.server 8001
   ```
4. Open your browser and go to: **[http://localhost:8001](http://localhost:8001)**
5. Alternatively, you can double-click **[index.html](file:///Users/cai/personal_projects/roses_cleaning/index.html)** in Finder.
