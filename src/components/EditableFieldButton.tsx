type FieldNameToValueType = {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  dob: string;
  phone: string;
  wins: number;
  losses: number;
};

type EditableFieldButtonProps<K extends keyof FieldNameToValueType> = {
  fieldName: K;
  fieldValue: FieldNameToValueType[K];
};

export const EditableFieldButton = <K extends keyof FieldNameToValueType>({
  fieldName,
  fieldValue,
}: EditableFieldButtonProps<K>) => {
  let promptText = `Enter new value for ${fieldName}`;

  const validateFieldValue = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'email':
        promptText =
          'Caution!  Changing email will delete the old past player document and create a new one';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'dob':
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
      case 'phone':
        return /^\d{3}[-\s]?\d{3}[-\s]?\d{4}$/.test(value);
      case 'wins':
      case 'losses': {
        const numericValue = Number(value);
        promptText = `${fieldName} must be a number`;
        return !isNaN(numericValue) && Number.isInteger(Number(value));
      }
      default:
        return typeof value === 'string' && value.trim() !== '';
    }
  };
  const handleClick = () => {
    const newValue = prompt(promptText, fieldValue.toString());
    if (newValue !== null && newValue !== fieldValue.toString()) {
      validateFieldValue(fieldName, newValue);
      //update firebase
      alert(`updated ${fieldName} to ${newValue}`);
    }
  };
  return (
    <button className='grid-value text-button' onClick={handleClick}>
      {fieldValue}
    </button>
  );
};
