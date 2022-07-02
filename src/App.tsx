import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import rough from 'roughjs/bin/rough';
import { useEffect, useMemo, useState } from 'react';
import Canvas from './Components/Canvas/Canvas.style';
import ColorPicker from './Components/ColorPicker/ColorPicker';
import Header from './Components/Header/Header.style';
import Sidebar from './Components/Sidebar/Sidebar.style';
import { useHistory } from './Hooks/UseHistory';
import { ChangeColor, ShowOrHideColorPicker } from './Reducer/Actions';
import { IState } from './Reducer/Reducer';
import { createElement, IRect, TypeElement } from './Utils/Element/Element.service';
import Layers from './Components/Layers/Layers.style';

const generator = rough.generator();

function App({ className }: { className?: string}): JSX.Element {
  const { tool, showColorModal, color }: IState = useSelector<IState>((state) => state) as IState;
  const dispatch = useDispatch();
  const [
    elements,
    setElements,
    undo,
    redo,
  ] = useHistory([]);
  const [currentElement, setCurrentElement] = useState<TypeElement | undefined>(undefined);

  useEffect(() => {
    if (tool !== 'selection') {
      setCurrentElement(undefined);
    }
  }, [tool]);

  const handleColorModalClose = (): void => {
    dispatch(ShowOrHideColorPicker(false));
  };
  const handleSetColor = (pickedColor: string): void => {
    dispatch(ChangeColor(pickedColor));
  };

  const handleInsertImage = (image: string | ArrayBuffer, position: IRect): void => {
    const imageElement = createElement(
      generator,
      elements.length,
      'image',
      position.x,
      position.y,
      position.x + position.width,
      position.y + position.height,
      color,
      {},
      image,
    );
    setElements((prevElements: any) => [...prevElements, imageElement]);
  };

  const handleLayerClick = (element: TypeElement): void => {
    setCurrentElement(element);
  };

  const images = useMemo(() => elements.filter((e) => e.type === 'image').map((e, i) => (
    <img key={i} id={`image-${e.id}`} src={e.image} alt={e.image} onLoad={() => setElements((prevElements: any) => [...prevElements])} />
  )), [elements]);

  return (
    <div className={className}>
      <Sidebar insertImage={handleInsertImage} />
      <div className="content">
        <Header undo={undo} redo={redo} selectedElement={currentElement} />
        <Canvas
          roughGeneratopr={generator}
          elements={elements}
          setElements={setElements}
          undo={undo}
          redo={redo}
          currentElement={currentElement}
          setCurrentElement={setCurrentElement}
        />
        <Modal show={showColorModal} onHide={handleColorModalClose}>
          <Modal.Header closeButton>
            <Modal.Title className="font-weight-bold">Color Picker</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ColorPicker current={color} setColor={handleSetColor} />
          </Modal.Body>
        </Modal>
      </div>
      <Layers elements={elements} selectedElement={currentElement} onLayerClick={handleLayerClick} />
      <div className="images-container">
        {images}
      </div>
    </div>
  );
}

export default App;
