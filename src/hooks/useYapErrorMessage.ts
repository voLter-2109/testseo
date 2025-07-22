import { FieldErrors } from 'react-hook-form';

/**
 *
 * @returns специальный хук возвращает обьект с ошибкой из reacthookform по параметре name
 * @example
 * const InputForPhone: FC<IInputForPhone> = ({
  label,
  onUpdate,
  name = 'telnumber',
  ...InputHTMLAttributes
}) => {
  const {
    register,
    formState: { errors, defaultValues },
    trigger,
    watch,
    resetField,
    setFocus,
  } = useFormContext();
  const errorMessage = useYapErrorMessage(errors, name);
 */
function useYapErrorMessage(
  errors: FieldErrors,
  fieldName: string
): string | undefined {
  // Function to recursively extract error messages
  const extractErrors = (currentError: any, errorMessages: string[] = []) => {
    if (currentError?.message && typeof currentError.message === 'string') {
      // Base case: error has a message, add it to the array
      errorMessages.push(currentError.message);
    } else if (typeof currentError === 'object' && currentError !== null) {
      // Recursive case: error is an object, dig deeper
      Object.values(currentError).forEach((value) => {
        if (Array.isArray(value) || typeof value === 'object') {
          extractErrors(value, errorMessages);
        }
      });
    }
    return errorMessages;
  };

  // Main logic to find and extract error messages
  const getErrorMessageByName = (name: string): string | undefined => {
    // Split the field name into parts (e.g., ['specializations', '0', 'certificate'])
    const parts = name.split(/[.[\]]/).filter(Boolean);

    // Reduce over the parts to navigate through the errors object
    const fieldError = parts.reduce((acc: any, part) => acc?.[part], errors);

    // Use the helper function to extract error messages from the fieldError
    const errorMessages = extractErrors(fieldError);

    // Join multiple error messages with a comma and space
    return errorMessages.length > 0 ? errorMessages.join(', ') : undefined;
  };

  // Use the function with the provided fieldName and errors
  return getErrorMessageByName(fieldName);
}

export default useYapErrorMessage;
