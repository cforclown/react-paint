import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Canvas from './Components/Canvas/Canvas';
import ColorPicker from './Components/ColorPicker/ColorPicker';
import Header from './Components/Header/Header';
import Sidebar from './Components/Sidebar/Sidebar';
import { useHistory } from './Hooks/UseHistory';
import { ChangeColor, ShowOrHideColorPicker } from './Reducer/Actions';
import { IState } from './Reducer/Reducer';

const Container = styled.div`
  background-color: #a29bfe;
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  width: 100vw;
  height: 100vh;

  display: flex;

  .content {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

function App(): JSX.Element {
  const { showColorModal, color }: IState = useSelector<IState>((state) => state) as IState;
  const dispatch = useDispatch();
  const [
    elements,
    setElements,
    undo,
    redo,
  ] = useHistory([]);

  const handleColorModalClose = (): void => {
    dispatch(ShowOrHideColorPicker(false));
  };
  const handleSetColor = (pickedColor: string): void => {
    dispatch(ChangeColor(pickedColor));
  };

  return (
    <Container>
      <Sidebar />
      <div className="content">
        <Header undo={undo} redo={redo} />
        <Canvas elements={elements} setElements={setElements} undo={undo} redo={redo} />
        <Modal show={showColorModal} onHide={handleColorModalClose}>
          <Modal.Header closeButton>
            <Modal.Title className="font-weight-bold">Color Picker</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ColorPicker current={color} setColor={handleSetColor} />
          </Modal.Body>
        </Modal>
      </div>
    </Container>
  );
}

export default App;
