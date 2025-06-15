
export interface Element {
  id: string;
  type: 'text' | 'heading' | 'button' | 'image' | 'divider' | 'card';
  content: string;
  styles: {
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    border?: string;
    width?: string;
    height?: string;
    cursor?: string;
  };
  position: {
    x: number;
    y: number;
  };
}
