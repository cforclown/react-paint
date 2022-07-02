import styled from 'styled-components';
import AppBase from './App';

const App = styled(AppBase)`
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

  .images-container {
    display: none;
    padding: 0;
    margin: 0;
    height: 0;
    width: 0;
  }
`;
App.displayName = 'App';

export default App;
