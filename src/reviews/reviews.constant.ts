export const ReviewValidationParams = {
  Rating: {
    Value: {
      Minimum: 1,
      Maximum: 5,
    },
  },
  Comment: {
    Length: {
      Minimum: 100,
      Maximum: 1024,
    },
  },
};

export const REVIEW_ALREADY_EXISTS =
  'User may not make multiple reviews for one training';
