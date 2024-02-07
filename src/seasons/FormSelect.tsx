import { UseFormRegister } from 'react-hook-form';
import { ChangeEventHandler } from 'react';
import { FieldNames, FormValues } from './seasonTypes';

type FormSelectProps = {
  label: string;
  fieldName: FieldNames;
  register: UseFormRegister<FormValues>;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  choices: string[];
  errorMessage?: string;
};

export const FormSelect = ({
  label,
  fieldName,
  register,
  onChange,
  choices,
  errorMessage,
}: FormSelectProps) => {
  return (
    <div className='form-group'>
      <label htmlFor={fieldName}>{label}: </label>
      <select
        className='form-input-select'
        id={fieldName}
        {...register(fieldName, { required: true })}
        onChange={onChange}
      >
        {choices.map((choice, index) => (
          <option key={index} value={choice}>
            {choice}
          </option>
        ))}
      </select>
      {errorMessage && <span className='error-message'>{errorMessage}</span>}
    </div>
  );
};
