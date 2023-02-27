import { screen } from "@testing-library/dom";
import { act, render } from "@testing-library/react";
import { useEffect, useState } from "react";

import { usePrevious } from "./reactUtils";

interface WrapperProps {
  value: boolean;
}

let extPrevious: boolean | undefined = undefined;

const UsePreviousWrapper = ({ value }: WrapperProps): JSX.Element => {
  const previous = usePrevious<boolean>(value);
  useEffect(() => {
    extPrevious = previous;
  }, [previous]);

  return <div />;
};

const TestComponent = (): JSX.Element => {
  const [value, setValue] = useState(false);

  const toggleValue = () => setValue((value) => !value);

  return (
    <>
      <button onClick={toggleValue}>Change value</button>
      <UsePreviousWrapper value={value} />
    </>
  );
};

describe("usePrevious", () => {
  test("usePrevious", async () => {
    render(<TestComponent />);
    const button = await screen.findByText("Change value");

    expect(extPrevious).toBeUndefined();

    act(() => button.click());
    expect(extPrevious).toBe(false);

    act(() => button.click());
    expect(extPrevious).toBe(true);
  });
});
