import styled from 'styled-components';
import PALETTE from '../../../constants/palette';

const List = styled.ul<React.CSSProperties>`
  max-height: ${({ maxHeight }) => maxHeight ?? '45vh'};
  overflow: auto;

  li {
    display: flex;
    align-items: center;
    height: 3rem;
    width: 100%;
    padding: 0 0.25rem;
    border-bottom: 1px solid ${PALETTE.GRAY_100};
    position: ${({ position }) => position ?? 'static'};

    p {
      display: flex;
      align-items: center;
      flex-grow: 1;
    }

    button {
      margin-left: 0.5rem;
    }

    & > *:not(:last-child) {
      margin-right: 0.5rem;
    }
  }
`;

export default List;
