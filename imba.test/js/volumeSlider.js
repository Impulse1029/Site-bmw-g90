// Получаем элементы DOM: видео, ползунок громкости и кнопку mute
const video = document.getElementById('bmwVideo');
const muteButton = document.getElementById('muteButton');
const volumeSlider = document.getElementById('volumeSlider');


// Переменная для хранения предыдущего уровня громкости (по умолчанию из ползунка или 0.5)
let previousVolume = parseFloat(volumeSlider.value) || 0.5;


// Устанавливаем начальный уровень громкости и mute-состояние
video.volume = volumeSlider.value;
video.muted = video.volume === 0;


// Функция обновления иконки на кнопке mute/unmute
const updateIcon = () => {
  const vol = video.volume;// Текущее значение громкости
  let iconClass = '';// CSS класс иконки из FontAwesome

  // Определяем класс иконки в зависимости от громкости
  if (video.muted || vol === 0) {
    iconClass = 'fas fa-volume-mute';// Нет звука
  } else {
    iconClass = 'fas fa-volume-up';//Звук
  }

  // Устанавливаем иконку на кнопку mute/unmute
  muteButton.innerHTML = `<i class="${iconClass}"></i>`;
};


// Событие изменения громкости через ползунок
volumeSlider.addEventListener('input', () => {

  // Получаем новое значение громкости из ползунка
  video.volume = parseFloat(volumeSlider.value);

  // Если громкость больше 0, убираем mute и сохраняем значение
  if (video.volume > 0) {
    video.muted = false;
    previousVolume = video.volume;// Сохраняем текущее значение как последнее нормальное
  } else {
    video.muted = true;// Если громкость 0, активируем mute
  }

  // Обновляем иконку на кнопке mute/unmute
  updateIcon();
});


// Событие клика по кнопке mute/unmute
muteButton.addEventListener('click', () => {

  // Если видео в состоянии mute или громкость 0
  if (video.muted || video.volume === 0) {
    video.muted = false;// Отключаем mute
    // Восстанавливаем предыдущее значение громкости или 0.5 по умолчанию
    video.volume = previousVolume > 0 ? previousVolume : 0.5;
  } else {
    // Включаем mute, но предварительно сохраняем текущую громкость
    previousVolume = video.volume;
    video.muted = true;
    video.volume = 0;
  }

  // Синхронизируем значение ползунка с текущей громкостью
  volumeSlider.value = video.volume;

  // Обновляем иконку на кнопке mute/unmute
  updateIcon();
});


// Инициализируем правильную иконку при загрузке страницы
updateIcon();