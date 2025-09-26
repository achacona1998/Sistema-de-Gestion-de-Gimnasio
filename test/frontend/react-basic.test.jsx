import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('React Basic Tests', () => {
  it('should render a simple div', () => {
    render(<div data-testid="simple-div">Hello World</div>);
    
    expect(screen.getByTestId('simple-div')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render a component with props', () => {
    const SimpleComponent = ({ title, content }) => (
      <div data-testid="simple-component">
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
    );

    render(<SimpleComponent title="Test Title" content="Test Content" />);
    
    expect(screen.getByTestId('simple-component')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render a list of items', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    
    const ListComponent = ({ items }) => (
      <ul data-testid="item-list">
        {items.map((item, index) => (
          <li key={index} data-testid={`item-${index}`}>
            {item}
          </li>
        ))}
      </ul>
    );

    render(<ListComponent items={items} />);
    
    expect(screen.getByTestId('item-list')).toBeInTheDocument();
    expect(screen.getByTestId('item-0')).toBeInTheDocument();
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('should handle conditional rendering', () => {
    const ConditionalComponent = ({ showContent }) => (
      <div data-testid="conditional-component">
        {showContent && <p data-testid="conditional-content">Content is visible</p>}
        {!showContent && <p data-testid="no-content">No content</p>}
      </div>
    );

    const { rerender } = render(<ConditionalComponent showContent={true} />);
    
    expect(screen.getByTestId('conditional-content')).toBeInTheDocument();
    expect(screen.queryByTestId('no-content')).not.toBeInTheDocument();

    rerender(<ConditionalComponent showContent={false} />);
    
    expect(screen.queryByTestId('conditional-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('no-content')).toBeInTheDocument();
  });
});