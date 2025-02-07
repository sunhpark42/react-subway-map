import styled, { keyframes, css } from 'styled-components';
import Z_INDEX from '../../constants/zIndex';

const slideIn = keyframes`
  from {
    transform: translateY(-105%);
  }

  to {
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-105%);
  }
`;

interface ContainerProps extends React.CSSProperties {
  isAppear: boolean;
}

const Container = styled.div<ContainerProps>`
  width: 100%;
  height: 3.75rem;
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'transparent'};
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  color: ${({ color }) => color};
  z-index: ${Z_INDEX.HEADER};

  ${({ isAppear }) =>
    isAppear
      ? css`
          animation: ${slideIn} 0.2s;
          transform: translateY(0);
        `
      : css`
          animation: ${slideOut} 0.2s;
          transform: translateY(-105%);
        `};
`;

const Inner = styled.div`
  height: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export { Container, Inner };
