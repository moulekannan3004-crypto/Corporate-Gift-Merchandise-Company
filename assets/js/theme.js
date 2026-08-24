/**
 * Theme & Language Management System
 * Handles Light/Dark mode toggling, RTL switching, and persistence in localStorage
 */

(function () {
  'use strict';

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Initialize text direction (RTL/LTR)
  const savedDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);

  window.addEventListener('DOMContentLoaded', () => {
    updateThemeIcons(savedTheme);
    updateDirUI(savedDir);
    bindThemeTriggers();
  });

  function bindThemeTriggers() {
    // Theme toggle buttons
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);

        // Dispatch custom event for Chart.js update
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
      });
    });

    // LTR / RTL Arrow Toggle Buttons
    const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');
    rtlButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        window.toggleDirection();
      });
    });

    // Language / RTL selectors fallback
    const langSelects = document.querySelectorAll('.lang-select');
    langSelects.forEach(select => {
      select.addEventListener('change', (e) => {
        const val = e.target.value;
        const newDir = val === 'ar' || val === 'he' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', newDir);
        localStorage.setItem('dir', newDir);
        localStorage.setItem('lang', val);
        updateDirUI(newDir);
      });
    });
  }

  function updateThemeIcons(theme) {
    const icons = document.querySelectorAll('.theme-toggle-btn i');
    icons.forEach(icon => {
      if (theme === 'dark') {
        icon.className = 'bi bi-sun-fill text-warning';
      } else {
        icon.className = 'bi bi-moon-stars-fill text-slate-700';
      }
    });
  }

  function updateDirUI(dir) {
    const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
    rtlBtns.forEach(btn => {
      if (dir === 'rtl') {
        btn.innerHTML = `<span class="opacity-60 text-slate-400">LTR</span> <i class="bi bi-arrow-left-right text-amber-500 font-extrabold transition-transform duration-300 transform rotate-180"></i> <span class="text-amber-500 font-extrabold">RTL</span>`;
      } else {
        btn.innerHTML = `<span class="text-amber-500 font-extrabold">LTR</span> <i class="bi bi-arrow-left-right text-amber-500 font-extrabold transition-transform duration-300"></i> <span class="opacity-60 text-slate-400">RTL</span>`;
      }
    });

    const langSelects = document.querySelectorAll('.lang-select');
    const lang = localStorage.getItem('lang') || (dir === 'rtl' ? 'ar' : 'en');
    langSelects.forEach(select => {
      select.value = lang;
    });
  }

  window.toggleDirection = function() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem('dir', newDir);
    localStorage.setItem('lang', newDir === 'rtl' ? 'ar' : 'en');
    updateDirUI(newDir);
  };

  window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
  };

  window.toggleRTL = window.toggleDirection;
})();
