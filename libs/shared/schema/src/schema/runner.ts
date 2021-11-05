import gql from 'graphql-tag';

export const runnerSchema = gql`
  enum RunState {
    Pending
    InProgress
    Completed
    Failed
    Cancelled
    Skipped
  }

  enum RunnerTrigger {
    Manual
    Scheduled
    Retry
  }

  type RunnerPerformanceEntry {
    duration: Duration
  }

  type RunnerError implements ErrorObjectInterface {
    name: String!
    message: String
    date: Date!
    stepId: ID
  }

  interface Runnable {
    startedAt: Date
    endedAt: Date
    # Indicates current run progress in percentage
    progress: Float
    error: RunnerError
  }
`;
