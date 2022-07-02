interface IFormSubmit {
  text: string;
  className?: string;
}

function FormSubmitBase({ text, className }: IFormSubmit): JSX.Element {
  return (
    <div className={`${className}mb-1 md:mb-2 sm:mb-1`}>
      <button type="submit" className="font-sans font-bold text-md md:text-xl sm:text-md px-4.5 md:px-5.5 sm:px-4.5 py-4 md:py-4.5 sm:py-4">
        {text}
      </button>
    </div>
  );
}

export default FormSubmitBase;
