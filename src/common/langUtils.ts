const langPack = {
  navbar_root: 'Главная',
  navbar_game: 'Играть',
  navbar_game_levels: 'Уровни',
  navbar_leaderboard: 'Рейтинг',
  navbar_forum: 'Форум',
  navbar_account: 'Профиль',
};

export const getLang = (key: keyof typeof langPack): string => langPack[key];
