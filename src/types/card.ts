export interface CardStyle {
  id: string;
  label: string;
  background: string;
  border: string;
  shape: 'square' | 'circle' | 'rounded' | 'pill';
}

export interface CardFormState {
  guestName: string;
  message: string;
  styleId: string;
  backgroundColor: string;
  backgroundImage: string;
  backgroundMode: 'color' | 'image';
  textColor: string;
  textBackgroundColor: string;
  textBackgroundOpacity: number;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
}
