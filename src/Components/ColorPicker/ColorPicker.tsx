import { HexColorPicker } from 'react-colorful';

interface IColorPicker {
  current: string;
  setColor: (pickedColor: string) => void;
}
const ColorPicker = ({ current, setColor }: IColorPicker): JSX.Element => <HexColorPicker color={current} onChange={setColor} />;

export default ColorPicker;
