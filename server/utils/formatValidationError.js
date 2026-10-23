export function formatValidationError(error) {
  const validationErrors = error?.errors ?? {}

  return {
    error: 'Validation failed',
    details: Object.entries(validationErrors).map(([field, validationError]) => ({
      field: validationError.path || field,
      message: validationError.message,
    })),
  }
}
