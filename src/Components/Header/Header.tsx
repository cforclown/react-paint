import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FaRedo, FaUndo } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ChangeCanvasSize } from '../../Reducer/Actions';

const Container = styled.div`
  height: 80px;
  background-color: #636e72;
  padding: 12px 16px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  > * {
    margin: 0 12px 0 0 !important;
    font-weight: bold;
  }
  > input {
    font-weight: normal;
    width: 100px;
  }
  > .separator {
    background-color: #80808080;
    width: 1px;
    height: 100%;
  }
`;

interface IHeader {
  undo: () => void;
  redo: () => void;
}

function Header({ undo, redo }: IHeader):JSX.Element {
  const dispatch = useDispatch();
  const [canvasSize, setCanvasSize] = useState({
    width: 800,
    height: 600,
  });

  return (
    <Container>
      <Button onClick={undo}>
        <FaUndo />
      </Button>
      <Button onClick={redo}>
        <FaRedo />
      </Button>
      <div className="separator" />
      <p>Canvas size</p>
      <Form.Control type="number" onChange={(e) => setCanvasSize({ ...canvasSize, width: e.target.value as unknown as number })} value={canvasSize.width} />
      <Form.Control type="number" onChange={(e) => setCanvasSize({ ...canvasSize, height: e.target.value as unknown as number })} value={canvasSize.height} />
      <Button onClick={() => dispatch(ChangeCanvasSize(canvasSize))}>
        Apply
      </Button>
      <div className="separator" />
    </Container>
  );
}

export default Header;
