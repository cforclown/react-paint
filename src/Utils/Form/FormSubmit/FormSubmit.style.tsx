import styled from 'styled-components';

import FormSubmitBase from './FormSubmit';

const FormSubmit = styled(FormSubmitBase)`
  button {
    border-radius: 4px;
    width: 100%;
    color: white;
    background: #6c5ce7;
    border: 0px;
    cursor: pointer;

    :hover {
      box-shadow: 0 0 8px 0 rgba(98, 80, 232, 0.5);
      background: #6250e8;
    }
    :active {
      background: #5544da;
    }
  }
`;

export default FormSubmit;
