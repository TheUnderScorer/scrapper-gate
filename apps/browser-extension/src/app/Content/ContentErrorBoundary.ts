import { Component, ErrorInfo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ContentErrorBoundary extends Component<any, any> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error);
    console.error(errorInfo);
  }

  render() {
    return this.props.children;
  }
}
