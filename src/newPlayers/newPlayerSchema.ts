import * as Yup from 'yup';

const minimumAge = new Date();
minimumAge.setFullYear(minimumAge.getFullYear() - 10);
export type FormValues = {
  firstName: string;
  lastName: string;
  nickname: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  dob: string;
};

export const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(20, 'Name must be less than 20 characters')
    .required('First Name is required'),
  lastName: Yup.string()
    .max(20, 'Name must be less than 20 characters')
    .required('Last Name is required'),
  nickname: Yup.string()
    .max(12, 'Nickname must be less than 12 characters')
    .required('Nickname is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip: Yup.string().required('Zip is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  dob: Yup.string()
    .required('Date of birth is required')
    .test('isOfAge', 'You must be at least 10 years old', (value) => {
      const dob = new Date(value);
      return dob >= minimumAge;
    }),
});

export const formFieldNames = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'nickname', label: 'Nickname' },
  { name: 'address', label: 'Address' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'zip', label: 'Zip' },
  { name: 'phone', label: 'Phone' },
  { name: 'email', label: 'Email' },
  { name: 'dob', label: 'Birth Date' },
];
