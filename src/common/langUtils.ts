const langPack = {
  'signin_page_header': 'Вход',
  'signin_form_login_label': 'Логин',
  'signin_form_password_label': 'Пароль',
  'signin_form_submit_button': 'Войти',
  'signin_form_no_account_button': 'Нет аккаунта?',
};

export const getLang = (key: keyof typeof langPack): string => langPack[key];
