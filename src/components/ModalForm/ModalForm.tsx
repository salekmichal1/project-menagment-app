import './ModalForm.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

import React, { useState, useEffect } from 'react';

interface FieldConfig {
  name: string;
  label: string;
  initialValue: string | Dayjs;
  type: 'text' | 'select' | 'date';
  options?: { value: string; label: string }[];
}

interface FormProps {
  fields: FieldConfig[];
  onSubmit: (values: { [key: string]: any }) => void;
  onReset: () => void;
}

export default function UniversalForm({
  fields,
  onSubmit,
  onReset,
}: FormProps) {
  const [values, setValues] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const initialValues = fields.reduce((acc, field) => {
      acc[field.name] = field.initialValue;
      return acc;
    }, {} as { [key: string]: any });
    setValues(initialValues);
  }, [fields]);

  // const handleChange =
  //   (name: string) =>
  //   (
  //     event:
  //       | React.ChangeEvent<HTMLInputElement>
  //       | React.ChangeEvent<HTMLSelectElement>
  //   ) => {
  //     setValues(prevValues => ({ ...prevValues, [name]: event.target.value }));
  //   };

  function handleChange(fieldName: string, newValue: any) {
    if (newValue.target) {
      const value = newValue.target.value;
      setValues(prevValues => ({ ...prevValues, [fieldName]: value }));
      return;
    } else {
      const value = newValue;
      setValues(prevValues => ({ ...prevValues, [fieldName]: value }));
      return;
    }
    // return (event: any, newValue?: any) => {
    //   const value = newValue || event.target.value;

    //   setValues(prevValues => ({
    //     ...prevValues,
    //     [fieldName]: value,
    //   }));
    //   console.log(values);
    // };
  }

  const handleSubmit = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(values);

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
        {fields.map(field => {
          if (field.type === 'select') {
            return (
              <div key={field.name}>
                <label className="modal-form__label">{field.label}:</label>
                <select
                  value={values[field.name] || ''}
                  onChange={newValue => handleChange(field.name, newValue)}>
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          if (field.type === 'text') {
            return (
              <div key={field.name}>
                <label className="modal-form__label">{field.label}:</label>
                <input
                  className="modal-form__input"
                  type="text"
                  value={values[field.name] || ''}
                  onChange={newValue => handleChange(field.name, newValue)}
                />
              </div>
            );
          }

          if (field.type === 'date') {
            return (
              <div key={field.name}>
                <label className="modal-form__label">{field.label}:</label>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      label="Pick date"
                      value={values[field.name] || dayjs(new Date())}
                      onChange={newValue => {
                        handleChange(field.name, newValue);
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            );
          }
        })}
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
