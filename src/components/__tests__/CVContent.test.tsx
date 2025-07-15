import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CVContent from '../CVContent'

const mockCVData = {
  personalInfo: {
    name: 'John Britton',
    address: '123 Test St, Test City, TS 12345',
    phone: '(555) 123-4567',
    email: 'john@example.com'
  }
}

describe('CVContent', () => {
  it('renders personal information correctly', () => {
    render(<CVContent cvData={mockCVData} />)
    
    expect(screen.getByText('John Britton')).toBeInTheDocument()
    expect(screen.getByText('123 Test St, Test City, TS 12345')).toBeInTheDocument()
    expect(screen.getByText('(555) 123-4567')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('renders email as clickable link', () => {
    render(<CVContent cvData={mockCVData} />)
    
    const emailLink = screen.getByRole('link', { name: 'john@example.com' })
    expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com')
  })

  it('renders basic structure with minimal data', () => {
    const minimalData = {
      personalInfo: mockCVData.personalInfo,
      // All other fields are optional
    }
    
    render(<CVContent cvData={minimalData} />)
    
    expect(screen.getByText('John Britton')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument() // Section header shows even with no data
  })
}) 