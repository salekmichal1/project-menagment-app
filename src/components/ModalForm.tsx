import './ModalForm.css';

import { useState, useEffect } from 'react';

interface FieldConfig {
  name: string;
  label: string;
  initialValue: string;
}

interface FormProps {
  fields: FieldConfig[];
  onSubmit: (values: { [key: string]: string }) => void;
  onReset: () => void;
}

export default function UniversalForm({
  fields,
  onSubmit,
  onReset,
}: FormProps) {
  const [values, setValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const initialValues = fields.reduce((acc, field) => {
      acc[field.name] = field.initialValue;
      return acc;
    }, {} as { [key: string]: string });
    setValues(initialValues);
  }, [fields]);

  const handleChange =
    (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues(prevValues => ({ ...prevValues, [name]: event.target.value }));
    };

  const handleSubmit = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  };

  const handleReset = function () {
    onReset();
  };

  return (
    <div className="modal-overlay">
      <form
        className="modal-form"
        onSubmit={handleSubmit}
        onReset={handleReset}>
        {fields.map(field => (
          <div key={field.name}>
            <label>{field.label}</label>
            <input
              type="text"
              value={values[field.name] || ''}
              onChange={handleChange(field.name)}
            />
          </div>
        ))}
        <button className="btn" type="submit">
          Submit
        </button>
        <button className="btn" type="reset">
          Close
        </button>
      </form>
    </div>
  );
}
