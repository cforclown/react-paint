import { FieldProps, getIn } from 'formik';
import React from 'react';

export interface IFormItem<T> extends FieldProps {
  formFieldComponent: React.ComponentType<T>;
  // Expect onChange to be called with value directly, rather than HTML event
  useValueDirectly?: boolean;
  showUntouchedErrors?: boolean; // show errors even if the field is untouched
}

const FormikFormItem = <T, >(
  {
    useValueDirectly, formFieldComponent, showUntouchedErrors, form, field, ...childProps
  }: IFormItem<T>,
): React.ReactElement => {
  const Component = formFieldComponent;
  const errorText = getIn(form.errors, field.name);
  const touched = getIn(form.touched, field.name) || form.submitCount > 0;
  // delay showing error when form is still validating value.
  const helpText = typeof errorText === 'string' && ((showUntouchedErrors && errorText !== 'Required') || touched) && !form.isValidating ? errorText : undefined;
  const validateStatus = errorText && touched && !form.isValidating ? 'error' : undefined;

  // Get the props for attaching data and events to form (value, onChange)
  const { name, value } = field;
  const { setFieldValue, setFieldTouched } = form;
  const handleChange = React.useCallback((newValue: any) => setFieldValue(name, newValue), [setFieldValue, name]);
  const handleBlur = React.useCallback(() => setFieldTouched(name), [setFieldTouched, name]);
  const dataProps = useValueDirectly
    ? {
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
    }
    : field;

  return (
    <Component
      errors={Array.isArray(errorText) && touched ? errorText : helpText && [helpText]}
      validateStatus={validateStatus}
      allowClear={false}
      {...dataProps}
      {...(childProps as unknown as T)}
    />
  );
};

export default FormikFormItem;
