<?php
// Подключаем PHPMailer
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Данные БД
$db_host = 'localhost';
$db_user = 'root';
$db_password = 'SergSup228';  // твой пароль к БД
$db_base = 'bmw_db';
$db_table = 'test_drives';

// Подключаемся к БД
try {
  $db = new PDO("mysql:host=$db_host;dbname=$db_base;charset=utf8", $db_user, $db_password);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo json_encode(['status' => 'error', 'message' => 'Ошибка БД: ' . $e->getMessage()]);
  exit;
}

// Получаем данные из формы
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $name = htmlspecialchars(trim($_POST['name'] ?? ''));
  $phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
  $email = htmlspecialchars(trim($_POST['email'] ?? ''));
  $date = htmlspecialchars(trim($_POST['date'] ?? ''));
  $time = htmlspecialchars(trim($_POST['time'] ?? ''));

  // Простая валидация
  if (empty($name) || empty($phone) || empty($email) || empty($date) || empty($time)) {
    echo json_encode(['status' => 'error', 'message' => 'Заполните все поля!']);
    exit;
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Некорректный Email!']);
    exit;
  }

  // Сохраняем в БД
  try {
    $stmt = $db->prepare("INSERT INTO $db_table (name, phone, email, date, time) VALUES (:name, :phone, :email, :date, :time)");
    $stmt->execute([
      ':name' => $name,
      ':phone' => $phone,
      ':email' => $email,
      ':date' => $date,
      ':time' => $time
    ]);
  } catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка записи в БД: ' . $e->getMessage()]);
    exit;
  }

  // Отправляем email
  $mail = new PHPMailer(true);

  try {
    // Настройки SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.mail.ru'; // или smtp.gmail.com, smtp.yandex.ru
    $mail->SMTPAuth = true;
    $mail->Username = 'sergs12345@bk.ru';    // Твоя почта
    $mail->Password = 'Frdq5Zcyg9LB3iHrv6Ue';   // Пароль или App Password
    $mail->SMTPSecure = 'ssl';                   // 'ssl' или 'tls'
    $mail->Port = 465;                     // 465 (SSL) или 587 (TLS)


    $mail->CharSet = 'UTF-8';// <--- ЭТО ОБЯЗАТЕЛЬНО ДЛЯ КИРИЛЛИЦЫ
    $mail->Encoding = 'base64';// <--- кодировка контента


    // От кого и кому
    $mail->setFrom('sergs12345@bk.ru', 'BMW Test Drive');
    $mail->addAddress($email, $name); // клиенту
    $mail->addAddress('sergs12345@bk.ru');     // себе на почту копию

    // Контент письма
    $mail->isHTML(true);
    $mail->Subject = 'Запись на тест-драйв BMW M5 G90';
    $mail->Body = "
    <h2>Спасибо за заявку, $name!</h2>
    <p>Вы записались на тест-драйв BMW M5 G90.</p>
    <p><strong>Дата:</strong> $date</p>
    <p><strong>Время:</strong> $time</p>
    <p>Мы свяжемся с вами по телефону $phone для подтверждения.</p>
    ";

    // Отправляем письмо
    if ($mail->send()) {
      echo json_encode(['status' => 'success', 'message' => 'Заявка успешно отправлена!']);
    } else {
      echo json_encode(['status' => 'error', 'message' => 'Ошибка при отправке письма.']);
    }

  } catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка: ' . $mail->ErrorInfo]);
  }

} else {
  echo json_encode(['status' => 'error', 'message' => 'Неверный метод отправки формы.']);
}
?>