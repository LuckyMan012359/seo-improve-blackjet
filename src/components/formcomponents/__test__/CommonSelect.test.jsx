import { render } from '@testing-library/react';
import CommonSelect from '../CommonSelect';
// import CommonSelect from "./CommonSelect";

describe('CommonSelect Component', () => {
  
  test('renders the options passed as props', () => {
    const alldays = [
      { id: 1, name: 'Monday' },
      { id: 2, name: 'Tuesday' },
      { id: 3, name: 'Wednesday' },
      { id: 4, name: 'Thursday' },
      { id: 5, name: 'Friday' },
    ]

    const trigger = jest.fn();
    const register = jest.fn();
    const setValue = jest.fn();

    const value = alldays[0].name;

    const errors = {
      day: 'test error'
    }
    render(
      <CommonSelect
        trigger={trigger}
        options={alldays}
        register={register}
        setValue={setValue}
        value={''}
        name='day'
        error={errors?.day}
        placeholder='test placeholder'
        onChangeFn={() => {}}
        defaultValue={value}
        key={value}
      />,
    );

    // Check if the options are rendered
    // expect(screen.getByText("Option 1")).toBeInTheDocument();
    // expect(screen.getByText("Option 2")).toBeInTheDocument();
  });
});
