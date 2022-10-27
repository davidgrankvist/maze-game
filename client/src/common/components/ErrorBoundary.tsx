import React from "react";
import { ErrorPage } from "./ErrorPage";

export class ErrorBoundary extends React.Component<any, any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  private promiseRejectionHandler = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    this.setState({
        error: event.reason,
        hasError: true
    });
  }

  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ error, errorInfo })
  }

  componentDidMount() {
    // Add an event listener to the window to catch unhandled promise rejections & stash the error in the state
    window.addEventListener('unhandledrejection', this.promiseRejectionHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.promiseRejectionHandler);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />
    }

    return this.props.children; 
  }
}
