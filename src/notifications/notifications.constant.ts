export const NotificationValidationParams = {
  Description: {
    Length: {
      Minimum: 10,
      Maximum: 140,
    },
  },
};

export const NOTIFICATION_NOT_FOUND = 'Notificaiton not found';

export const USER_FORBIDDEN = 'User may delete only own notificaitons';

export const EMAIL_ADD_USER_SUBJECT = 'Регистрация нового пользователя';
export const NEW_TRAINING_SUBJECT = 'Уведомление о новой тренировке';
export const APPLICATION_CREATED_SUBJECT =
  'Новая заявка на персональную тренировку';
export const APPLICATION_ACCEPTED_SUBJECT =
  'Заявка на персональную тренировку принята';
export const ADDED_TO_FRIENDS_SUBJECT = 'Вы добавлены в друзья';

export const USER_TEMPLATE_PATH = './add-user';
export const NEW_TRAINING_TEMPLATE_PATH = './new-training';
export const APPLICATION_CREATED_TEMPLATE_PATH = './application-created';
export const APPLICATION_ACCEPTED_TEMPLATE_PATH = './application-accepted';
export const ADDED_TO_FRIENDS_TEMPLATE_PATH = './added-to-friends';
export const NOTIFICATIONS_QUEUE = 'notifications';
