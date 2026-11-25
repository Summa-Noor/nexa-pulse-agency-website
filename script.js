document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  const setMenuIcon = (isOpen) => {
    const icon = mobileToggle?.querySelector('i');
    if (!icon) return;
    icon.classList.toggle('fa-xmark', isOpen);
    icon.classList.toggle('fa-bars', !isOpen);
  };

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('active');
      setMenuIcon(isOpen);
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        setMenuIcon(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        navLinks.classList.remove('active');
        setMenuIcon(false);
      }
    });
  }

  // 2. Active Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (
      window.innerHeight + scrollY >= document.documentElement.scrollHeight - 20 &&
      sections.length > 0
    ) {
      current = sections[sections.length - 1].getAttribute('id');
    }

    navItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // 3. Custom Dropdown Setup for #service Select
  const nativeSelect = document.getElementById('service');
  let customTextEl = null;
  let customOptionEls = [];

  if (nativeSelect) {
    nativeSelect.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';

    customTextEl = document.createElement('span');
    customTextEl.className = 'custom-select-text placeholder';
    customTextEl.textContent = nativeSelect.options[0]?.textContent || 'Select a service...';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-chevron-down custom-select-icon';

    trigger.appendChild(customTextEl);
    trigger.appendChild(icon);

    const optionsList = document.createElement('ul');
    optionsList.className = 'custom-select-options';

    Array.from(nativeSelect.options).forEach((opt) => {
      if (!opt.value) return; // Skip placeholder option
      const li = document.createElement('li');
      li.className = 'custom-option';
      li.textContent = opt.textContent;
      li.dataset.value = opt.value;

      li.addEventListener('click', (e) => {
        e.stopPropagation();
        nativeSelect.value = opt.value;
        customTextEl.textContent = opt.textContent;
        customTextEl.classList.remove('placeholder');

        customOptionEls.forEach((el) => el.classList.remove('selected'));
        li.classList.add('selected');
        wrapper.classList.remove('open');
      });

      optionsList.appendChild(li);
      customOptionEls.push(li);
    });

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      wrapper.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('open');
      }
    });

    wrapper.appendChild(trigger);
    wrapper.appendChild(optionsList);
    nativeSelect.parentNode.insertBefore(wrapper, nativeSelect.nextSibling);
  }

  // 4. Contact Form Submission
  const agencyForm = document.getElementById('agencyForm');
  if (agencyForm) {
    agencyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (nativeSelect && !nativeSelect.value) {
        alert('Please select a required service.');
        agencyForm.querySelector('.custom-select-trigger')?.focus();
        return;
      }

      const submitBtn = agencyForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Thank you! Your inquiry has been received. We will get back to you shortly.');
        agencyForm.reset();

        // Reset custom dropdown UI
        if (customTextEl && nativeSelect) {
          customTextEl.textContent = nativeSelect.options[0]?.textContent || 'Select a service...';
          customTextEl.classList.add('placeholder');
          customOptionEls.forEach((el) => el.classList.remove('selected'));
        }

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

});