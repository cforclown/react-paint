import styled from 'styled-components';

import FormInputBase from './FormInput';

const FormInput = styled(FormInputBase)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;

  input {
    width: 100%;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-shadow: 0 0 2px 0 rgba(49, 114, 255, 0.2);
  }
  input:focus {
    box-shadow: 0 0 8px 0 rgba(49, 114, 255, 0.5);
    outline: 2px solid rgba(49, 114, 255, 0.8);
  }
  input::-webkit-input-placeholder {
    opacity: 1;
    transition: opacity 0.25s ease-out;
  }
  input:hover::-webkit-input-placeholder, 
  input:focus::-webkit-input-placeholder {
    opacity: 0;
  }
`;

export default FormInput;
