import styled from 'styled-components';

const Container = styled.div`
  font-weight: bold;
`;

interface ITooltip {
  children?: React.ReactNode;
}
function TooltipContainer({ children }: ITooltip): JSX.Element {
  return (
    <Container>
      {children}
    </Container>
  );
}

export default TooltipContainer;
