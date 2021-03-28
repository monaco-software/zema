const langPack = {
  navbar_root: 'Главная',
  navbar_game: 'Играть',
  navbar_leaderboard: 'Рейтинг',
  navbar_forum: 'Форум',
  navbar_account: 'Профиль',
  navbar_signout: 'Выйти',
  required_field: 'Обязательное поле',
  signin_page_header: 'Вход',
  signup_page_header: 'Регистрация',
  form_login_label: 'Логин',
  form_password_label: 'Пароль',
  form_password_confirm_label: 'Пароль (еще раз)',
  signin_form_submit_button: 'Войти',
  signup_form_submit_button: 'Зарегистрироваться',
  signin_form_no_account_button: 'Нет аккаунта?',
  signup_form_no_account_button: 'Уже есть аккаунт?',
  form_email_label: 'Email',
  form_email_input_error: 'Некорректный email',
  form_login_input_error: 'Латинские буквы, цифры, от 3 символов',
  form_first_name_label: 'Имя',
  form_first_name_error: 'Только буквы, от 3 символов',
  form_second_name_label: 'Фамилия',
  form_second_name_error: 'Только буквы, от 3 символов',
  form_phone_label: 'Телефон',
  form_phone_input_error: 'Неверный формат',
  form_password_min_uppercase: 'Минимум одна заглавная буква',
  form_password_min_lowercase: 'Минимум одна строчная буква',
  form_password_min_special: 'Минимум один специальный символ',
  form_password_min_chars: 'От 8 символов',
  form_password_equal_confirm: 'Пароли должны совпадать',
  game_over_page_header: 'Игра окончена',
  game_over_to_home_button: 'На главную',
  game_over_to_game_button: 'Попробовать еще раз',
  game_over_to_levels_button: 'К списку уровней',
  leaderboard_page_header: 'Рейтинг',
  leaderboard_table_placeholder_message: 'В таблице пока что нет данных 😔️.\nПоставьте рекорд первым!',
  leaderboard_table_placeholder_cta: 'Играть',
  levels_page_header: 'Уровни игры',
  levels_page_level_word: 'Уровень',
  forum_page_header: 'Форум',
  forum_create_topic_button: 'Создать тему',
  forum_create_topic_modal_header: 'Создать тему',
  form_topic_name: 'Название',
  forum_create_topic_form_submit: 'Создать',
  forum_topic_create_date: 'Создана:',
  forum_topic_input_message_tab: 'Сообщение',
  forum_topic_input_preview_tab: 'Предпросмотр',
  forum_topic_input_markdown_support: 'С поддержкой',
  forum_topic_input_markdown: 'Markdown',
  forum_topic_input_submit: 'Отправить',
  forum_topic_send_message_button: 'Написать сообщение',

  account_form_submit_button: 'Сохранить',
  account_form_reset_button: 'Сбросить',
  account_form_display_name_label: 'Ник',
  avatar_form_success_notification: 'Аватар успешно сохранен',
  avatar_form_fail_notification: 'Не удалось сохранить аватар',
  avatar_form_image_error_notification: 'Выбери другую картинку',
  password_form_success_notification: 'Пароль успешно сохранен',
  password_form_fail_notification: 'Не удалось сохранить пароль',
  profile_form_success_notification: 'Профиль успешено сохранен',
  profile_form_fail_notification: 'Не удалось сохранить профиль',
  form_old_password_label: 'Старый пароль',
  form_new_password_label: 'Новый пароль',
  form_new_password_again_label: 'Новый пароль еще раз',
  change_password_modal_header: 'Поменять пароль',
  change_password_button: 'Поменять пароль',
  global_error: 'Что-то пошло не так 😔️',
  error_boundary_go_to_main_page: 'Вернуться на главную',

  game_messages_win: 'You are a winner',
  game_messages_fail: 'You are a looser',
  game_messages_combo: 'combo',
  game_messages_volume: 'volume',
  game_messages_pause: 'pause',
  game_messages_play: 'play',
  game_messages_mute: 'mute',
  game_messages_sound: 'sound',
  game_level_title_1: 'A long, long time ago\nsomewhere in\nsouth, south\nAmerica',
  game_level_title_2: 'Events are developing rapidly.\nNeed to do something.',
  game_level_title_3: 'Untangle\nentangled tracks\nin the desert',
  game_level_title_4: 'Swirling\nwhirlwind\nsurrounded',
  game_level_title_5: 'Desert open\nto all winds',
  game_level_title_6: 'It’s a dark night,\nbullets whistling\nthroughout the steppe',
  game_level_title_7: 'Under a\nViolet Moon',
  game_level_title_8: 'In the ancient\ntriangle pyramid',
  game_level_title_9: 'Along the road\ndead with braids standing.\nAnd silence..',
};

export const getText = (key: keyof typeof langPack): string => langPack[key];
