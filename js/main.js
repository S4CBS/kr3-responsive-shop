// Скрипт минимального управления модальным окном и интерфейсом
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация модального окна быстрого заказа (<dialog>)
  const quickOrderDialog = document.getElementById('quick-order-dialog');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const closeModalButtons = document.querySelectorAll('[data-close-modal]');
  const modalProductSelect = document.getElementById('modal-product');

  // Открытие диалогового окна
  openModalButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (!quickOrderDialog) return;

      const productName = button.getAttribute('data-product');
      if (productName && modalProductSelect) {
        modalProductSelect.value = productName;
      }

      if (typeof quickOrderDialog.showModal === 'function') {
        quickOrderDialog.showModal();
      } else {
        quickOrderDialog.setAttribute('open', '');
      }
    });
  });

  // Закрытие диалогового окна
  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!quickOrderDialog) return;

      if (typeof quickOrderDialog.close === 'function') {
        quickOrderDialog.close();
      } else {
        quickOrderDialog.removeAttribute('open');
      }
    });
  });

  // Закрытие по клику вне содержимого модального окна (на подложку)
  if (quickOrderDialog) {
    quickOrderDialog.addEventListener('click', (event) => {
      const rect = quickOrderDialog.getBoundingClientRect();
      const clickInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );

      if (!clickInside && typeof quickOrderDialog.close === 'function') {
        quickOrderDialog.close();
      }
    });
  }

  // Кнопка плавной прокрутки «Наверх»
  const scrollTopButton = document.querySelector('.scroll-top-button');
  if (scrollTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopButton.classList.add('scroll-top-button--visible');
      } else {
        scrollTopButton.classList.remove('scroll-top-button--visible');
      }
    });

    scrollTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
