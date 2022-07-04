import { Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { TypeElement } from '../../Utils/Element/Element.service';

interface ILayers {
  elements: TypeElement[];
  selectedElement?: TypeElement | null;
  onLayerClick: (element: TypeElement) => void;
  onDeleteElement: (element: TypeElement) => void;
  className?: string;
}

function LayersBase({
  elements, selectedElement, onLayerClick, onDeleteElement, className,
}: ILayers): JSX.Element {
  const handleDeleteElement = (event: React.MouseEvent<HTMLButtonElement>, element: TypeElement): void => {
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
                {element.id + 1}
                {' '}
                {element.type}
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
