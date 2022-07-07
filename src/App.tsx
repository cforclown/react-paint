import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import rough from 'roughjs/bin/rough';
import { useEffect, useMemo, useState } from 'react';
import Canvas from './Components/Canvas/Canvas.style';
import ColorPicker from './Components/ColorPicker/ColorPicker';
import Header from './Components/Header/Header.style';
import Sidebar from './Components/Sidebar/Sidebar.style';
import { useHistory } from './Hooks/UseHistory';
import { ChangeColor, ChangeTool, ShowOrHideColorPicker } from './Reducer/Actions';
import { IState } from './Reducer/Reducer';
import Layers from './Components/Layers/Layers.style';
import { IRect } from './Utils/Common';
import Element from './Utils/Element/Element';
import { generateElement, generateElementId, generateElementName } from './Utils/Element/Element.service';

const generator = rough.generator();

function App({ className }: { className?: string}): JSX.Element {
  const {
    tool, toolOptions, showColorModal, color,
  }: IState = useSelector<IState>((state) => state) as IState;
  const dispatch = useDispatch();
  const [
    elements,
    setElements,
    undo,
    redo,
  ] = useHistory([]);
  const [selectedElement, setSelectedElement] = useState<Element | undefined>(undefined);

  useEffect(() => {
    if (tool !== 'selection') {
      setSelectedElement(undefined);
    }
  }, [tool]);

  const handleColorModalClose = (): void => {
    dispatch(ShowOrHideColorPicker(false));
  };

  const handleSetColor = (pickedColor: string): void => {
    dispatch(ChangeColor(pickedColor));
  };

  const handleInsertImage = (image: string | ArrayBuffer, position: IRect): void => {
    const imageElement = generateElement({
      id: generateElementId(),
      name: generateElementName(elements, 'image'),
      type: 'image',
      roughGenerator: generator,
      image,
      rect: position,
      color,
      options: toolOptions.image,
    });
    setElements((prevElements: any) => [...prevElements, imageElement]);
  };

  const handleDeleteElement = (element: Element): void => {
    // remove element and adjust the id (index)
    const currentElements = elements.filter((e) => e.id !== element.id);
    currentElements.forEach((e, i) => { e.id = i; });
    setElements(currentElements);
    if (selectedElement && selectedElement.id === element.id) {
      setSelectedElement(undefined);
    }
  };

  const handleLayerClick = (element: Element): void => {
    setSelectedElement(element);
    dispatch(ChangeTool('selection'));
  };

  const images = useMemo(() => elements.filter((e) => e.type === 'image').map((e, i) => (
    <img key={i} id={`image-${e.id}`} src={e.image} alt={e.image} onLoad={() => setElements((prevElements: any) => [...prevElements])} />
  )), [elements]);

  return (
    <div className={className}>
      <Sidebar insertImage={handleInsertImage} />
      <div className="content">
        <Header undo={undo} redo={redo} selectedElement={selectedElement} />
        <Canvas
          roughGenerator={generator}
          elements={elements}
          setElements={setElements}
          undo={undo}
          redo={redo}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
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
      <Layers
        elements={elements}
        selectedElement={selectedElement}
        onLayerClick={handleLayerClick}
        onDeleteElement={handleDeleteElement}
      />
      <div className="images-container">
        {images}
      </div>
    </div>
  );
}

export default App;
