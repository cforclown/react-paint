import { TypeElement } from '../../Utils/Element/Element.service';

interface ILayers {
  elements: TypeElement[];
  selectedElement?: TypeElement | null;
  onLayerClick: (element: TypeElement) => void;
  className?: string;
}

function LayersBase({
  elements, selectedElement, onLayerClick, className,
}: ILayers): JSX.Element {
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
              {element.id + 1}
              {' '}
              {element.type}
            </div>
          )).reverse()
        }
      </div>
    </div>
  );
}

export default LayersBase;
