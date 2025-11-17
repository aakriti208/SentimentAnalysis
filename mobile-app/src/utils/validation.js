/**
 * Validates if a string is a valid email address
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a password meets requirements:
 * - At least 6 characters
 * - Contains at least one letter
 * - Contains at least one number
 */
export const isValidPassword = (password) => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter) {
    return {
      isValid: false,
      message: 'Password must contain at least one letter',
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  return {
    isValid: true,
    message: 'Password is valid',
  };
};

/**
 * Validates if a name is valid (not empty and reasonable length)
 */
export const isValidName = (name) => {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return {
      isValid: false,
      message: 'Name cannot be empty',
    };
  }

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      message: 'Name must be at least 2 characters',
    };
  }

  if (trimmedName.length > 50) {
    return {
      isValid: false,
      message: 'Name must be less than 50 characters',
    };
  }

  return {
    isValid: true,
    message: 'Name is valid',
  };
};
