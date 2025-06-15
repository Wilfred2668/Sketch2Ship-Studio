
export interface Element {
  id: string;
  type: 'text' | 'heading' | 'button' | 'image' | 'divider' | 'card' | 'list' | 'link' | 'video' | 'icon' | 'spacer' | 'quote';
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
    textAlign?: string;
    textDecoration?: string;
  };
  position: {
    x: number;
    y: number;
  };
}
