export interface SealStyle {
  id: string;
  label: string;
  background: string;
  border: string;
  shape: 'square' | 'circle' | 'rounded' | 'pill';
}

export interface SealFormState {
  guestName: string;
  message: string;
  styleId: string;
  backgroundColor: string;
  backgroundImage: string;
  backgroundMode: 'color' | 'image';
  textColor: string;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
}
