document.addEventListener('DOMContentLoaded', function () {
  const accordionToggle = document.querySelector('.accordion-toggle');
  const accordionContent = document.querySelector('.accordion-content');
  const form = document.getElementById('testDriveForm');
  const modal = document.getElementById('successModal');
  const closeModalBtn = document.querySelector('.close-modal');

  // Открытие / закрытие аккордеона
  accordionToggle.addEventListener('click', () => {
    accordionContent.classList.toggle('active');
  });

  // Настройка минимальной даты
  const dateInput = document.getElementById('datePicker');
  const timeInput = document.getElementById('timePicker');

  const today = new Date();
  dateInput.min = today.toISOString().split('T')[0];

  // Блокировка воскресений
  dateInput.addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    if (selectedDate.getDay() === 0) {
      this.value = '';
      document.getElementById('dateError').innerText = 'Воскресенье недоступно для записи!';
    } else {
      document.getElementById('dateError').innerText = '';
    }
  });

  // Ограничение времени
  timeInput.addEventListener('input', function () {
    const timeValue = this.value;
    if (timeValue < '10:00' || timeValue > '19:00') {
      this.value = '';
      document.getElementById('timeError').innerText = 'Время доступно с 10:00 до 19:00.';
    } else {
      document.getElementById('timeError').innerText = '';
    }
  });

  // Валидация и отправка формы
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    document.querySelectorAll('.field-error-message').forEach(el => el.innerText = '');
    document.querySelectorAll('input').forEach(el => el.classList.remove('input-error'));

    let hasError = false;

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const date = form.date.value;
    const time = form.time.value;

    if (!/^[а-яА-ЯёЁ\s]+$/.test(name)) {
      document.getElementById('nameError').innerText = 'Введите корректное ФИО (русские буквы).';
      form.name.classList.add('input-error');
      hasError = true;
    }

    if (!/^\+?[0-9\s\-]{10,15}$/.test(phone)) {
      document.getElementById('phoneError').innerText = 'Введите корректный номер.';
      form.phone.classList.add('input-error');
      hasError = true;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById('emailError').innerText = 'Введите корректный email.';
      form.email.classList.add('input-error');
      hasError = true;
    }

    if (!date) {
      document.getElementById('dateError').innerText = 'Выберите дату.';
      form.date.classList.add('input-error');
      hasError = true;
    }

    if (!time) {
      document.getElementById('timeError').innerText = 'Выберите время.';
      form.time.classList.add('input-error');
      hasError = true;
    }

    if (hasError) return;

    // AJAX отправка
    const formData = new FormData(form);
    fetch('/php/send.php', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(response => {
        if (response.status === 'success') {
          modal.classList.add('active');
          accordionContent.classList.remove('active');
          form.reset();
        } else {
          alert('Ошибка: ' + response.message);
        }
      })
      .catch(error => {
        alert('Ошибка соединения: ' + error);
      });
  });

  closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
});
