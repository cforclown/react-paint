import styled from 'styled-components';
import HeaderBase from './Header';

const Header = styled(HeaderBase)`
  height: 50px;
  background-color: #6c5ce7;
  padding: 12px 16px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  box-shadow: 0 2px 3px #00000040;
  font-size: 0.9rem;

  > * {
    margin: 0 12px 0 0 !important;
    font-weight: bold;
    font-size: 0.9rem;
  }
  > input {
    font-weight: normal;
    width: 100px;
    padding: 0.15rem 0.4rem;
  }

  button {
    padding: 0.1rem 0.5rem 0.25rem 0.5rem;
  }

  > .separator {
    background-color: #80808080;
    width: 1px;
    height: 100%;
  }

  .options-container {
    background-color: #a29bfe;
  }

`;
Header.displayName = 'Header';

export default Header;
