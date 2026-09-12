'use client';

import { Component } from 'react'

interface Props { children: React.ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() { return { hasError: true } }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center bg-bg-base">
          <div className="text-center space-y-4 p-8">
            <p className="text-xl font-bold text-primary">Something went wrong</p>
            <p className="text-secondary text-sm">Please refresh the page to try again.</p>
            <button onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
              className="px-5 py-2.5 bg-orange text-white font-bold rounded-xl hover:opacity-90 transition-colors">
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
