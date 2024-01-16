import { Names } from '../assets/types';

export const nameFields: Array<{ fieldName: keyof Names; name: string }> = [
  {
    fieldName: 'firstName',
    name: 'First Name',
  },
  {
    fieldName: 'lastName',
    name: 'Last Name',
  },
  {
    fieldName: 'nickname',
    name: 'Nickname',
  },
];

export const pastPlayerFields = [
  {
    fieldName: 'phone',
    name: 'Phone',
  },
  {
    fieldName: 'address',
    name: 'Address',
  },
  {
    fieldName: 'city',
    name: 'City',
  },
  {
    fieldName: 'zip',
    name: 'Zip',
  },
  {
    fieldName: 'dob',
    name: 'Birthday',
  },
];
