import gql from 'graphql-tag';

export const durationSchema = gql`
  type Duration {
    ms: Float!
    seconds: Float!
    minutes: Float!
    hours: Float!
    enteredUnit: DurationUnit!
  }

  input DurationInput {
    ms: Float!
  }

  enum DurationUnit {
    Milliseconds
    Seconds
    Minutes
    Hours
  }
`;
