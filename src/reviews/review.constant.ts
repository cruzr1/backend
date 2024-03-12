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
