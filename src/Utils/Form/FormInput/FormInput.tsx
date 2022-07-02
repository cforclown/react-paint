import { ErrorMessage, Field } from 'formik';

interface ILoginFormInput {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}

function FormInputBase({
  type, name, label, placeholder, className, disabled,
}: ILoginFormInput): JSX.Element {
  return (
    <div className={`${className} mb-3 md:mb-4 sm:mb-3`}>
      <label className="font-semibold text-slate-500 mb-1.5 md:mb-2 sm:mb-1.5">{label}</label>
      <Field className="px-3.5 py-2.5 md:px-4.5 sm:px-3.5 md:py-3.5 sm:py-2.5 mb-1.5 md:mb-2 sm:mb-1.5" type={type} name={name} placeholder={placeholder} disabled={disabled} />
      <ErrorMessage name={name}>
        {(msg: string) => (
          <p className="text-left text-sm sm:text-md text-red-600 m-0 p-0">{msg}</p>
        )}
      </ErrorMessage>
    </div>
  );
}

export default FormInputBase;
