import { User, Review } from 'src/shared/libs/types';

export type AuthorDataType = Review & Pick<User, 'id' | 'avatar' | 'name'>;
