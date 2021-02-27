import './app-error-boundary.css';
import React, { Component, ErrorInfo } from 'react';
import b_ from 'b_';
import { getText } from '../../common/langUtils';
import { ROUTES } from '../../common/constants';

const block = b_.lock('app-error-boundary');

interface State {
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class AppErrorBoundary extends Component<unknown, State> {
  constructor(props: unknown) {
    super(props);

    this.state = {

    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const { error, errorInfo } = this.state;
    const { children } = this.props;

    if (error || errorInfo) {
      return (
        <div className={block()}>
          <h1 className={block('header')}>
            {getText('global_error')}
          </h1>

          <a href={ROUTES.ROOT} className={block('link')}>
            {getText('error_boundary_go_to_main_page')}
          </a>

          <code className={block('message')}>
            {error &&
              <p className={block('message-header')}>
                {error.toString()}
              </p>
            }

            {errorInfo &&
              <p className={block('message-trace')}>
                {errorInfo.componentStack.trim()}
              </p>
            }
          </code>
        </div>
      );
    }

    return children;
  }
}
