import styled from 'styled-components';
import Canvas from './Components/Canvas/Canvas';
import Sidebar from './Components/Sidebar/Sidebar';

const Container = styled.div`
  background-color: #a29bfe;
  overflow: hidden;
  margin: 0px;
  padding: 0px;
  width: 100vw;
  height: 100vh;

  display: flex;
`;

function App(): JSX.Element {
  return (
    <Container>
      <Sidebar />
      <Canvas />
    </Container>
  );
}

export default App;
