document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const menu = document.getElementById('menu');

  if (mobileToggle && menu) {
      mobileToggle.addEventListener('click', () => {
          menu.classList.toggle('active');
          const isExpanded = menu.classList.contains('active');
          mobileToggle.setAttribute('aria-expanded', isExpanded);
      });
  }

  // --- Theme Toggler ---
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const applyTheme = (theme) => {
      if (theme === 'dark') {
          body.classList.add('dark-theme');
          themeToggle.checked = true;
      } else {
          body.classList.remove('dark-theme');
          themeToggle.checked = false;
      }
  };

  themeToggle.addEventListener('change', () => {
      const newTheme = themeToggle.checked ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
  });

  // Load saved theme or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
      applyTheme(savedTheme);
  } else if (prefersDark) {
      applyTheme('dark');
  }


  // --- Scroll Animations ---
  const animatedSections = document.querySelectorAll('.animated-section');
  const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
          }
      });
  }, {
      rootMargin: '0px',
      threshold: 0.15
  });

  animatedSections.forEach(section => {
      sectionObserver.observe(section);
  });
  
  // --- Active Navigation Link Highlighting ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > section');

  const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              navLinks.forEach(link => {
                  link.classList.remove('active-link');
                  if (link.getAttribute('href').substring(1) === entry.target.id) {
                      link.classList.add('active-link');
                  }
              });
          }
      });
  }, {
      threshold: 0.5
  });

  sections.forEach(section => {
      if(section.id) { // Only observe sections with an ID
          navObserver.observe(section);
      }
  });


  // --- Footer Date & Time ---
  const dtEl = document.getElementById('currentDateTime');
  const yrEl = document.getElementById('year');
  function updateDateTime() {
      const now = new Date();
      if (dtEl) dtEl.textContent = now.toLocaleString();
      if (yrEl) yrEl.textContent = now.getFullYear();
  }
  updateDateTime();
  setInterval(updateDateTime, 60000);


  // --- Contact Form via EmailJS ---
  const contactForm = document.getElementById("js-contact-form");
  const statusDiv = document.getElementById("contact-status");

  if (contactForm && statusDiv) {
      contactForm.addEventListener("submit", async e => {
          e.preventDefault();
          const btn = contactForm.querySelector("button[type='submit']");
          btn.disabled = true;
          statusDiv.textContent = 'Sending…';

          const params = Object.fromEntries(new FormData(contactForm).entries());

          try {
              if (!params.user_name || !params.user_email || !params.subject || !params.message) {
                  throw new Error("All fields are required.");
              }

              await emailjs.send("service_jurpdob", "template_t6bqyl4", {
                  user_name: params.user_name,
                  user_email: params.user_email,
                  subject: params.subject,
                  message: params.message
              });

              statusDiv.textContent = '✅ Sent successfully!';
              contactForm.reset();
          } catch (err) {
              console.error('EmailJS error:', err);
              statusDiv.textContent = '❌ Failed to send. Please try again later.';
          } finally {
              btn.disabled = false;
              setTimeout(() => { statusDiv.textContent = ''; }, 7000);
          }
      });
  }

});