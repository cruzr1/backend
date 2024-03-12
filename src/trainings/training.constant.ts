export const TrainingValidationParams = {
  Name: {
    Length: {
      Minimum: 1,
      Maximum: 15,
    },
  },
  Image: {
    Regex: RegExp(/(.png$|.jpg$|.jpeg$)/i),
  },
  Price: {
    Value: {
      Minimum: 0,
    },
  },
  Calories: {
    Value: {
      Minimum: 1000,
      Maximum: 5000,
    },
  },
  Video: {
    Regex: RegExp(/(.mov$|.avi$|.mp4$)/i),
  },
  Description: {
    Length: {
      Minimum: 10,
      Maximum: 140,
    },
  },
} as const;
