import gql from 'graphql-tag';

export const nodesSchema = gql`
  input NodePositionInput {
    x: Float!
    y: Float!
  }

  type NodePosition {
    y: Float!
    x: Float!
  }

  interface HasStartNode {
    startNodePosition: NodePosition
  }
`;
