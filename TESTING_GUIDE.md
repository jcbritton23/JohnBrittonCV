# 🧪 CV Website Testing Guide

## Overview

This guide covers comprehensive testing strategies for John Britton's CV website, including unit tests, integration tests, and end-to-end testing using modern testing frameworks.

## 🎯 Testing Philosophy

### Testing Pyramid
1. **Unit Tests** (70%) - Fast, isolated component testing
2. **Integration Tests** (20%) - Component interaction testing  
3. **End-to-End Tests** (10%) - Full user journey testing

### Key Principles
- **Test behavior, not implementation**
- **Write tests that provide confidence**
- **Maintain tests as living documentation**
- **Focus on user-centric scenarios**

---

## 🛠️ Testing Stack

### Core Testing Framework
- **Vitest** - Fast unit test runner (Vite-native)
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment simulation
- **@testing-library/jest-dom** - Custom matchers

### Additional Tools
- **@testing-library/user-event** - User interaction simulation
- **MSW** (Mock Service Worker) - API mocking
- **Playwright** - End-to-end testing
- **@vitest/ui** - Visual test runner

---

## 📋 Test Scripts

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test CVContent.test.tsx

# Run tests matching pattern
npm run test navigation
```

---

## 🧪 Unit Testing

### Component Testing Strategy

#### 1. CVContent Component Tests

```typescript
// src/components/__tests__/CVContent.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CVContent from '../CVContent'

const mockCVData = {
  personalInfo: {
    name: 'John Britton',
    address: '123 Test St, Test City, TS 12345',
    phone: '(555) 123-4567',
    email: 'john@example.com'
  },
  education: [{
    degree: 'Test Degree',
    institution: 'Test University',
    location: 'Test City, TS',
    date: '2024',
    details: 'Test details'
  }],
  // ... other required fields
}

describe('CVContent', () => {
  it('renders personal information correctly', () => {
    render(<CVContent cvData={mockCVData} />)
    
    expect(screen.getByText('John Britton')).toBeInTheDocument()
    expect(screen.getByText('123 Test St, Test City, TS 12345')).toBeInTheDocument()
    expect(screen.getByText('(555) 123-4567')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('renders education section when data exists', () => {
    render(<CVContent cvData={mockCVData} />)
    
    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.getByText('Test Degree')).toBeInTheDocument()
    expect(screen.getByText('Test University, Test City, TS')).toBeInTheDocument()
  })

  it('handles missing optional sections gracefully', () => {
    const minimalData = {
      personalInfo: mockCVData.personalInfo,
      // All other fields are optional
    }
    
    render(<CVContent cvData={minimalData} />)
    
    expect(screen.getByText('John Britton')).toBeInTheDocument()
    expect(screen.queryByText('Education')).not.toBeInTheDocument()
  })

  it('renders email as clickable link', () => {
    render(<CVContent cvData={mockCVData} />)
    
    const emailLink = screen.getByRole('link', { name: 'john@example.com' })
    expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com')
  })
})
```

#### 2. LeftNav Component Tests

```typescript
// src/components/__tests__/LeftNav.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LeftNav from '../LeftNav'

const mockSections = [
  { id: 'education', title: 'Education', icon: 'graduation-cap', order: 1 },
  { id: 'experience', title: 'Experience', icon: 'briefcase', order: 2 },
]

describe('LeftNav', () => {
  it('renders all navigation sections', () => {
    const mockOnSectionClick = vi.fn()
    
    render(
      <LeftNav 
        sections={mockSections}
        activeSection="education"
        onSectionClick={mockOnSectionClick}
      />
    )
    
    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
  })

  it('highlights active section', () => {
    const mockOnSectionClick = vi.fn()
    
    render(
      <LeftNav 
        sections={mockSections}
        activeSection="education"
        onSectionClick={mockOnSectionClick}
      />
    )
    
    const activeButton = screen.getByRole('button', { name: /education/i })
    expect(activeButton).toHaveClass('bg-primary-blue')
  })

  it('calls onSectionClick when section is clicked', () => {
    const mockOnSectionClick = vi.fn()
    
    render(
      <LeftNav 
        sections={mockSections}
        activeSection="education"
        onSectionClick={mockOnSectionClick}
      />
    )
    
    fireEvent.click(screen.getByText('Experience'))
    expect(mockOnSectionClick).toHaveBeenCalledWith('experience')
  })

  it('shows mobile menu when hamburger is clicked', () => {
    const mockOnSectionClick = vi.fn()
    
    render(
      <LeftNav 
        sections={mockSections}
        activeSection="education"
        onSectionClick={mockOnSectionClick}
      />
    )
    
    const hamburgerButton = screen.getByLabelText('Toggle navigation menu')
    fireEvent.click(hamburgerButton)
    
    // Mobile menu should be visible
    expect(screen.getByText('CV Navigation')).toBeInTheDocument()
  })
})
```

#### 3. App Component Tests

```typescript
// src/__tests__/App.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

// Mock CV data
vi.mock('../cv_json_data.json', () => ({
  default: {
    personalInfo: {
      name: 'John Britton',
      address: '123 Test St',
      phone: '555-1234',
      email: 'test@example.com'
    },
    education: []
  }
}))

describe('App', () => {
  it('renders header with name and download button', () => {
    render(<App />)
    
    expect(screen.getByText('John Britton')).toBeInTheDocument()
    expect(screen.getByText('Clinical Psychology Doctoral Student')).toBeInTheDocument()
    expect(screen.getByText('Download PDF')).toBeInTheDocument()
  })

  it('handles PDF download click', () => {
    const mockPrint = vi.fn()
    window.print = mockPrint
    
    render(<App />)
    
    fireEvent.click(screen.getByText('Download PDF'))
    expect(mockPrint).toHaveBeenCalled()
  })

  it('renders navigation and CV content', () => {
    render(<App />)
    
    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.getByText('John Britton')).toBeInTheDocument()
  })

  it('handles navigation section clicks', () => {
    const mockScrollTo = vi.fn()
    window.scrollTo = mockScrollTo
    
    render(<App />)
    
    fireEvent.click(screen.getByText('Education'))
    expect(mockScrollTo).toHaveBeenCalled()
  })
})
```

---

## 🔄 Integration Testing

### Component Interaction Tests

```typescript
// src/__tests__/integration/Navigation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../../App'

describe('Navigation Integration', () => {
  it('updates active section when scrolling', async () => {
    const mockIntersectionObserver = vi.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })
    
    window.IntersectionObserver = mockIntersectionObserver
    
    render(<App />)
    
    // Simulate intersection observer callback
    const callback = mockIntersectionObserver.mock.calls[0][0]
    callback([
      { target: { id: 'education' }, isIntersecting: true }
    ])
    
    // Check that education section is highlighted
    expect(screen.getByRole('button', { name: /education/i }))
      .toHaveClass('bg-primary-blue')
  })

  it('scrolls to section when navigation item is clicked', () => {
    const mockScrollTo = vi.fn()
    window.scrollTo = mockScrollTo
    
    render(<App />)
    
    fireEvent.click(screen.getByText('Education'))
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth'
    })
  })
})
```

### Data Flow Tests

```typescript
// src/__tests__/integration/DataFlow.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CVContent from '../../components/CVContent'

describe('CV Data Flow', () => {
  it('renders all CV sections when data is complete', () => {
    const completeData = {
      personalInfo: { /* ... */ },
      education: [{ /* ... */ }],
      supervisedClinicalExperience: [{ /* ... */ }],
      presentations: [{ /* ... */ }],
      // ... all sections
    }
    
    render(<CVContent cvData={completeData} />)
    
    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.getByText('Supervised Clinical Experience')).toBeInTheDocument()
    expect(screen.getByText('Conference & Professional Presentations')).toBeInTheDocument()
  })

  it('handles partial data gracefully', () => {
    const partialData = {
      personalInfo: { /* ... */ },
      education: [{ /* ... */ }],
      // Missing other sections
    }
    
    render(<CVContent cvData={partialData} />)
    
    expect(screen.getByText('Education')).toBeInTheDocument()
    expect(screen.queryByText('Supervised Clinical Experience')).not.toBeInTheDocument()
  })
})
```

---

## 🎭 End-to-End Testing

### Playwright Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3003',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3003',
    reuseExistingServer: !process.env.CI,
  },
})
```

### E2E Test Examples

```typescript
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('CV Navigation', () => {
  test('should navigate between sections', async ({ page }) => {
    await page.goto('/')
    
    // Click on education section
    await page.click('text=Education')
    
    // Verify education section is visible
    await expect(page.locator('#education')).toBeInViewport()
    
    // Click on experience section
    await page.click('text=Supervised Clinical Experience')
    
    // Verify experience section is visible
    await expect(page.locator('#supervisedClinicalExperience')).toBeInViewport()
  })

  test('should highlight active section in navigation', async ({ page }) => {
    await page.goto('/')
    
    // Scroll to education section
    await page.locator('#education').scrollIntoViewIfNeeded()
    
    // Check that education nav item is highlighted
    await expect(page.locator('button:has-text("Education")')).toHaveClass(/bg-primary-blue/)
  })

  test('should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Open mobile menu
    await page.click('[aria-label="Toggle navigation menu"]')
    
    // Click on a section
    await page.click('text=Education')
    
    // Verify section is visible
    await expect(page.locator('#education')).toBeInViewport()
  })
})
```

```typescript
// tests/e2e/cv-content.spec.ts
import { test, expect } from '@playwright/test'

test.describe('CV Content', () => {
  test('should display personal information', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.locator('h1')).toContainText('John Britton')
    await expect(page.locator('text=Clinical Psychology Doctoral Student')).toBeVisible()
    await expect(page.locator('text=jbritton10@sycamores.indstate.edu')).toBeVisible()
  })

  test('should download PDF when button is clicked', async ({ page }) => {
    await page.goto('/')
    
    // Start waiting for download before clicking
    const downloadPromise = page.waitForEvent('download')
    
    await page.click('text=Download PDF')
    
    // Wait for download to complete
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('cv')
  })

  test('should display all CV sections', async ({ page }) => {
    await page.goto('/')
    
    // Check that major sections are present
    await expect(page.locator('text=Education')).toBeVisible()
    await expect(page.locator('text=Supervised Clinical Experience')).toBeVisible()
    await expect(page.locator('text=Research Experience')).toBeVisible()
    await expect(page.locator('text=Conference & Professional Presentations')).toBeVisible()
  })

  test('should handle email links correctly', async ({ page }) => {
    await page.goto('/')
    
    const emailLink = page.locator('a[href^="mailto:"]')
    await expect(emailLink).toHaveAttribute('href', 'mailto:jbritton10@sycamores.indstate.edu')
  })
})
```

```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/')
    
    // Check h1 exists and is unique
    const h1Elements = await page.locator('h1').count()
    expect(h1Elements).toBe(1)
    
    // Check h2 sections exist
    await expect(page.locator('h2')).toHaveCount(expect.any(Number))
  })

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/')
    
    // Check navigation has proper ARIA label
    await expect(page.locator('nav[aria-label="CV sections"]')).toBeVisible()
    
    // Check mobile menu button has proper label
    await expect(page.locator('[aria-label="Toggle navigation menu"]')).toBeVisible()
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Tab through navigation items
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Should be able to activate with Enter
    await page.keyboard.press('Enter')
    
    // Check that section is in view
    await expect(page.locator('#education')).toBeInViewport()
  })
})
```

---

## 📊 Test Coverage

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'src/test/',
        'coverage/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
})
```

### Coverage Targets

- **Statements**: 80%+
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+

### Critical Paths (100% Coverage Required)

- Error handling and fallbacks
- Data validation and type safety
- Navigation and routing logic
- PDF generation functionality

---

## 🔄 Continuous Integration

### GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npx playwright test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🐛 Testing Best Practices

### 1. Test Organization

```
src/
├── components/
│   ├── __tests__/
│   │   ├── CVContent.test.tsx
│   │   ├── LeftNav.test.tsx
│   │   └── Timeline.test.tsx
│   └── CVContent.tsx
├── __tests__/
│   ├── App.test.tsx
│   └── integration/
│       ├── Navigation.test.tsx
│       └── DataFlow.test.tsx
└── test/
    ├── setup.ts
    └── utils.tsx
```

### 2. Test Data Management

```typescript
// src/test/fixtures.ts
export const mockCVData = {
  personalInfo: {
    name: 'John Britton',
    address: '123 Test St, Test City, TS 12345',
    phone: '(555) 123-4567',
    email: 'john@example.com'
  },
  education: [{
    degree: 'Test Degree',
    institution: 'Test University',
    location: 'Test City, TS',
    date: '2024'
  }]
}

export const mockSections = [
  { id: 'education', title: 'Education', icon: 'graduation-cap', order: 1 },
  { id: 'experience', title: 'Experience', icon: 'briefcase', order: 2 },
]
```

### 3. Custom Test Utilities

```typescript
// src/test/utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

### 4. Mock Strategies

```typescript
// Mock external dependencies
vi.mock('lucide-react', () => ({
  GraduationCap: () => <div data-testid="graduation-cap-icon" />,
  Briefcase: () => <div data-testid="briefcase-icon" />,
  // ... other icons
}))

// Mock window methods
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
})

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
})
window.IntersectionObserver = mockIntersectionObserver
```

---

## 🎯 Testing Checklist

### Before Each Release

- [ ] All unit tests pass
- [ ] Coverage meets thresholds (80%+)
- [ ] Integration tests pass
- [ ] E2E tests pass on all browsers
- [ ] Accessibility tests pass
- [ ] Performance tests meet targets
- [ ] Mobile responsiveness verified
- [ ] Print functionality tested
- [ ] Error boundaries tested
- [ ] Loading states tested

### Test Quality Metrics

- [ ] Tests are readable and maintainable
- [ ] Tests focus on behavior, not implementation
- [ ] Edge cases are covered
- [ ] Error scenarios are tested
- [ ] Tests run quickly (< 10 seconds for unit tests)
- [ ] Tests are reliable (no flaky tests)

---

## 📞 Support & Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)

### Community
- [Testing Library Discord](https://discord.gg/testing-library)
- [Vitest GitHub Discussions](https://github.com/vitest-dev/vitest/discussions)

---

*Last updated: January 2025*
*For testing questions or issues, please create an issue in the repository.* 