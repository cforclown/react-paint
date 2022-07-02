import styled from 'styled-components';
import LayersBase from './Layers';

const Layers = styled(LayersBase)`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
  width: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  background-color: #FFFFFF88;
  max-height: 400px;
  box-shadow: 0 0px 6px #00000044;
  border-radius: 8px;
  padding: 0 0 0 0.8rem;

  .layers-title {
    color: #6c5ce7;
    font-weight: 800;
    text-align: center;
    margin: 0.4rem 0.8rem 0.4rem 0;
  }

  .layers-wrapper {
    padding: 0.8rem 0.8rem 0.8rem 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: #6c5ce7 #e0e0e0;

    .layer-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      margin: 0 0 8px 8px;
      cursor: pointer;
      padding: 0.4rem 0.6rem;
      color: white;
      border-radius: 8px;
      scroll-margin: 0 0.6rem 0 0;

      :hover {
        outline: 4px solid #00000044;
        text-shadow: 0px 0px 12px white;
      }
    }
  }

  
`;
Layers.displayName = 'Layers';

export default Layers;
