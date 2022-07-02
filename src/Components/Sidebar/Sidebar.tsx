import {
  ProSidebar, SidebarHeader, Menu, MenuItem,
} from 'react-pro-sidebar';
import Tooltip from 'rc-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChangeEvent, useMemo, useRef,
} from 'react';
import {
  BiSquare, BiBox, BiCircle, BiShapeTriangle,
} from 'react-icons/bi';
import {
  FaPencilAlt, FaTextHeight, FaMinus, FaEllipsisH, FaImage,
} from 'react-icons/fa';
import { IState } from '../../Reducer/Reducer';
import { ChangeTool, ShowOrHideColorPicker } from '../../Reducer/Actions';
import { IRect, isToolType, ToolType } from '../../Utils/Element/Element.service';
import TooltipContainer from '../Tooltip/Tooltip';
import SidebarItemsContainer, { ISidebarItem } from './SidebarItem';
import logo from '../../Assets/logo.png';
import 'react-pro-sidebar/dist/css/styles.css';
import { putToCenterOf } from '../Canvas/Canvas.service';

const items: ISidebarItem[] = [
  { id: 'selection', name: 'Selection', icon: <BiBox /> },
  { id: 'line', name: 'Line', icon: <FaMinus /> },
  { id: 'rectangle', name: 'Rectangle', icon: <BiSquare /> },
  { id: 'triangle', name: 'Triangle', icon: <BiShapeTriangle /> },
  { id: 'circle', name: 'Circle', icon: <BiCircle /> },
  { id: 'ellipse', name: 'Ellipse', icon: <FaEllipsisH /> },
  { id: 'pencil', name: 'Pencil', icon: <FaPencilAlt /> },
  { id: 'text', name: 'Text', icon: <FaTextHeight /> },
];

interface ISidebar {
  insertImage: (image: string | ArrayBuffer, position: IRect) => void;
  className?: string;
}
function SidebarBase({ insertImage, className }: ISidebar): JSX.Element {
  const dispatch = useDispatch();
  const { tool, color, canvasSize } = useSelector<IState>((state) => state) as IState;
  const insertImageInputRef = useRef<HTMLInputElement>(null);

  const handleItemOnClick = (item: ISidebarItem): void => {
    if (!isToolType(item.id)) {
      return;
    }
    dispatch(ChangeTool(item.id as ToolType));
  };

  const handleColorClick = (): void => {
    dispatch(ShowOrHideColorPicker(true));
  };

  const onImageSelected = (e: ChangeEvent<HTMLInputElement>): void => {
    const { files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = async (et: ProgressEvent<FileReader>) => {
        try {
          if (!et.target) {
            throw new Error('ERROR: happen when parsing image file');
          }
          const bstr = et.target.result;
          if (!bstr) {
            throw new Error('ERROR: image buffer is null');
          }

          const size = {
            width: 200,
            height: 100,
          };
          const position = putToCenterOf(size, canvasSize);
          insertImage(bstr, {
            ...position,
            ...size,
          });
        } catch (err) {
          if (err instanceof Error) {
            // eslint-disable-next-line no-console
            console.error(err.message);
          }
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const sidebarItems = useMemo(() => items.map((item, index) => (
    <SidebarItemsContainer key={index} {...item} onClick={handleItemOnClick} isActive={item.id === tool} />
  )), [tool]);

  return (
    <div className={className}>
      <ProSidebar width="240px" collapsed color="red" style={{ backgroundColor: 'red' }}>
        <SidebarHeader>
          <div style={{ textAlign: 'center', paddingTop: '0.4rem', paddingBottom: '0.2rem' }}>
            <img
              src={logo}
              style={{ width: '32px', height: '40px' }}
              alt={logo}
            />
          </div>
        </SidebarHeader>
        <Menu iconShape="round">
          {sidebarItems}

          <Tooltip overlay={<TooltipContainer>Insert image</TooltipContainer>}>
            <MenuItem
              onClick={() => insertImageInputRef?.current?.click()}
              icon={<FaImage />}
              popperarrow
            >
              Insert image
            </MenuItem>
          </Tooltip>

          <div style={{ height: '8px', marginBottom: '8px', borderBottom: '1px solid #636e7250' }} />

          <Tooltip overlay={<TooltipContainer>Color picker</TooltipContainer>}>
            <MenuItem
              onClick={handleColorClick}
              icon={<div style={{ width: '100%', height: '100%', backgroundColor: color }} />}
              popperarrow
            >
              Color picker
            </MenuItem>
          </Tooltip>
        </Menu>
      </ProSidebar>
      <input
        className="image-uploader"
        id="image-uploader"
        type="file"
        accept=".png,.jpeg,.jpg"
        multiple
        onChange={onImageSelected}
        ref={insertImageInputRef}
      />
    </div>
  );
}

export default SidebarBase;
