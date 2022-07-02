import { useMemo, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FaRedo, FaUndo } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeCanvasSize } from '../../Reducer/Actions';
import { IState } from '../../Reducer/Reducer';
import { ElementType, isElementType, TypeElement } from '../../Utils/Element/Element.service';
import { ElementOptionConfigs } from '../../Utils/Element/ElementOption/ElementOption.service';

interface IHeader {
  undo: () => void;
  redo: () => void;
  selectedElement?: TypeElement | null;
  className?: string;
}

function HeaderBase({
  undo, redo, selectedElement, className,
}: IHeader):JSX.Element {
  const dispatch = useDispatch();
  const { tool, toolOptions } = useSelector<IState>((state) => state) as IState;
  const [canvasSize, setCanvasSize] = useState({
    width: 800,
    height: 600,
  });

  const currentOptionType = selectedElement ? selectedElement.type as ElementType : isElementType(tool) ? tool : null;
  const currentOptions = currentOptionType && toolOptions[currentOptionType];
  const optionsFields = useMemo(() => {
    if (!currentOptionType) {
      return null;
    }
    return ElementOptionConfigs[currentOptionType];
  }, [currentOptionType]);

  return (
    <div className={className}>
      <HeaderBtn onClick={undo}>
        <FaUndo />
      </HeaderBtn>
      <HeaderBtn onClick={redo}>
        <FaRedo />
      </HeaderBtn>
      <div className="separator" />
      <p>Canvas size</p>
      <Form.Control type="number" onChange={(e) => setCanvasSize({ ...canvasSize, width: e.target.value as unknown as number })} value={canvasSize.width} />
      <Form.Control type="number" onChange={(e) => setCanvasSize({ ...canvasSize, height: e.target.value as unknown as number })} value={canvasSize.height} />
      <HeaderBtn onClick={() => dispatch(ChangeCanvasSize(canvasSize))}>
        Apply
      </HeaderBtn>
      <div className="separator" />
    </div>
  );
}

const HeaderBtn = ({ children, ...props }: any): JSX.Element => <Button variant="dark" {...props}>{children}</Button>;
const OptionsFormBtn = ({ children, ...props }: any): JSX.Element => <Button variant="success" {...props}>{children}</Button>;

export default HeaderBase;
