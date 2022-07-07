import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Element from '../../Utils/Element/Element';

interface ILayers {
  elements: Element[];
  selectedElement?: Element | null;
  onLayerClick: (element: Element) => void;
  onDeleteElement: (element: Element) => void;
  className?: string;
}

function LayersBase({
  elements, selectedElement, onLayerClick, onDeleteElement, className,
}: ILayers): JSX.Element {
  const handleDeleteElement = (event: React.MouseEvent<HTMLButtonElement>, element: Element): void => {
    event.stopPropagation();
    onDeleteElement(element);
  };

  return (
    <div className={className}>
      <div className="layers-title">{elements.length ? 'Elements' : ' No element'}</div>
      <div className="layers-wrapper">
        {
          elements.map((element, index) => (
            <div
              key={index}
              className="layer-container"
              onClick={() => onLayerClick(element)}
              style={{
                backgroundColor: element.color,
                outline: selectedElement && selectedElement.id === element.id ? `4px solid ${element.color}55` : 'none',
              }}
            >
              <div className="title">
                {element.name}
              </div>
              <Button variant="danger" onClick={(e) => handleDeleteElement(e, element)}>
                <FaTrash />
              </Button>
            </div>
          )).reverse()
        }
      </div>
    </div>
  );
}

export default LayersBase;
