import gql from 'graphql-tag';

export const runnerSchema = gql`
  enum RunState {
    Pending
    InProgress
    Completed
    Failed
    Cancelled
  }

  type RunnerPerformanceEntry {
    duration: Float
  }

  interface Runnable {
    startedAt: Date
    endedAt: Date
    # Indicates current run progress in percentage
    progress: Float
    error: ErrorObject
  }
`;
