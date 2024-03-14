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

export const REVIEW_NOT_FOUND = 'Review does not exist';
export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_LIST_REQUEST_COUNT = 50;
