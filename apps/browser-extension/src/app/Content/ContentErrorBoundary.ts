import { Component, ErrorInfo } from 'react';

export class ContentErrorBoundary extends Component<any, any> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log({
      error,
      errorInfo,
    });
  }

  render() {
    return this.props.children;
  }
}
