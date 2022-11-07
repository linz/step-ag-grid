export interface GridSubComponentProps {
  value: string;
  setValue: (value: string) => void;
  setValid: (valid: boolean) => void;
  triggerSave: () => Promise<void>;
}
