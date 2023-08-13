import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement, useEffect, useState } from "react";

import { usePrevious } from "./reactUtils";

interface WrapperProps {
  value: boolean;
}

let extPrevious: boolean | undefined = undefined;

const UsePreviousWrapper = ({ value }: WrapperProps): ReactElement => {
  const previous = usePrevious<boolean>(value);
  useEffect(() => {
    extPrevious = previous;
  }, [previous]);

  return <div />;
};

const TestComponent = (): ReactElement => {
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

    await userEvent.click(button);
    expect(extPrevious).toBe(false);

    await userEvent.click(button);
    expect(extPrevious).toBe(true);
  });
});
