/**
 * main.js — Скрипт интерактивного взаимодействия KeyCraft
 * Контрольная работа №3: Адаптивная вёрстка и доступность
 * Реализует доступное мобильное меню (Drawer), аккордеон фильтров,
 * модальное окно (<dialog>) с ловушкой фокуса и кнопку «Наверх».
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Мобильное навигационное меню (Off-canvas Drawer)
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle-btn');
  const siteNav = document.getElementById('primary-nav');
  const menuClose = document.getElementById('menu-close-btn');
  const navOverlay = document.getElementById('nav-overlay');

  function openMobileMenu() {
    if (!siteNav) return;
    siteNav.classList.add('site-nav--open');
    if (navOverlay) navOverlay.classList.add('site-nav-overlay--visible');
    document.body.classList.add('menu-open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');

    // Перевод фокуса на кнопку закрытия или первую ссылку
    if (menuClose) {
      menuClose.focus();
    } else {
      const firstLink = siteNav.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }

  function closeMobileMenu() {
    if (!siteNav) return;
    siteNav.classList.remove('site-nav--open');
    if (navOverlay) navOverlay.classList.remove('site-nav-overlay--visible');
    document.body.classList.remove('menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = siteNav && siteNav.classList.contains('site-nav--open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  // Закрытие меню при клике на любую навигационную ссылку внутри мобильного меню
  if (siteNav) {
    siteNav.querySelectorAll('.site-nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          closeMobileMenu();
        }
      });
    });
  }

  /* ==========================================================================
     2. Адаптивные фильтры каталога (Аккордеон на мобильных экранах)
     ========================================================================== */
  const filterToggle = document.getElementById('filter-toggle-btn');
  const filterForm = document.getElementById('catalog-filters-form');

  if (filterToggle && filterForm) {
    filterToggle.addEventListener('click', () => {
      const isExpanded = filterToggle.getAttribute('aria-expanded') === 'true';
      filterToggle.setAttribute('aria-expanded', String(!isExpanded));
      filterForm.classList.toggle('catalog-filters__form--expanded');
    });
  }

  /* ==========================================================================
     3. Доступное модальное окно (<dialog>) с ловушкой фокуса (Focus Trap)
     ========================================================================== */
  const quickOrderDialog = document.getElementById('quick-order-dialog');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const closeModalButtons = document.querySelectorAll('[data-close-modal]');
  const modalProductSelect = document.getElementById('modal-product');
  let lastActiveElement = null;

  openModalButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (!quickOrderDialog) return;

      lastActiveElement = button;
      const productName = button.getAttribute('data-product');
      if (productName && modalProductSelect) {
        // Подстановка в select
        for (let i = 0; i < modalProductSelect.options.length; i++) {
          if (modalProductSelect.options[i].text.includes(productName) || 
              modalProductSelect.options[i].value.includes(productName)) {
            modalProductSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (typeof quickOrderDialog.showModal === 'function') {
        quickOrderDialog.showModal();
      } else {
        quickOrderDialog.setAttribute('open', '');
      }

      // Перемещение фокуса на первое интерактивное поле
      const firstInput = quickOrderDialog.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 50);
      }
    });
  });

  function closeDialog() {
    if (!quickOrderDialog) return;
    if (typeof quickOrderDialog.close === 'function') {
      quickOrderDialog.close();
    } else {
      quickOrderDialog.removeAttribute('open');
    }
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  closeModalButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      closeDialog();
    });
  });

  // Закрытие по клику на подложку (backdrop)
  if (quickOrderDialog) {
    quickOrderDialog.addEventListener('click', (event) => {
      const rect = quickOrderDialog.getBoundingClientRect();
      const clickInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );

      if (!clickInside) {
        closeDialog();
      }
    });

    quickOrderDialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeDialog();
    });
  }

  /* ==========================================================================
     4. Управление клавиатурой (Escape и Focus Trap)
     ========================================================================== */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (siteNav && siteNav.classList.contains('site-nav--open')) {
        closeMobileMenu();
      } else if (quickOrderDialog && quickOrderDialog.open) {
        closeDialog();
      }
    }

    // Ловушка фокуса внутри открытого меню на планшетах/смартфонах
    if (siteNav && siteNav.classList.contains('site-nav--open')) {
      const focusableElements = siteNav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (event.key === 'Tab') {
          if (event.shiftKey && document.activeElement === firstEl) {
            event.preventDefault();
            lastEl.focus();
          } else if (!event.shiftKey && document.activeElement === lastEl) {
            event.preventDefault();
            firstEl.focus();
          }
        }
      }
    }
  });

  /* ==========================================================================
     5. Кнопка плавной прокрутки «Наверх»
     ========================================================================== */
  const scrollTopButton = document.querySelector('.scroll-top-button');
  if (scrollTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopButton.classList.add('scroll-top-button--visible');
      } else {
        scrollTopButton.classList.remove('scroll-top-button--visible');
      }
    }, { passive: true });

    scrollTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
