export interface SealStyle {
  id: string;
  label: string;
  background: string;
  border: string;
}

export interface SealFormState {
  guestName: string;
  message: string;
  styleId: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
}
