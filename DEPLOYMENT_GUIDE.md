# 🚀 CV Website Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying John Britton's CV website using **free** GitHub Pages hosting with automated CI/CD pipeline.

## 🎯 Deployment Options

### Option 1: GitHub Pages (Recommended - FREE)
- **Cost**: $0/month
- **Custom Domain**: Supported
- **SSL**: Automatic
- **CI/CD**: GitHub Actions
- **Bandwidth**: 100GB/month
- **Storage**: 1GB

### Option 2: Netlify (Alternative - FREE)
- **Cost**: $0/month
- **Custom Domain**: Supported
- **SSL**: Automatic
- **CI/CD**: Built-in
- **Bandwidth**: 100GB/month
- **Build Minutes**: 300/month

### Option 3: Vercel (Alternative - FREE)
- **Cost**: $0/month
- **Custom Domain**: Supported
- **SSL**: Automatic
- **CI/CD**: Built-in
- **Bandwidth**: 100GB/month
- **Build Minutes**: 6000/month

---

## 📋 Prerequisites

- GitHub account
- Repository with CV website code
- Node.js 18+ installed locally
- Basic Git knowledge

---

## 🔧 GitHub Pages Setup (Step-by-Step)

### Step 1: Repository Configuration

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial CV website deployment"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to `Settings` → `Pages`
   - Under "Source", select `GitHub Actions`
   - Save the configuration

### Step 2: Configure Base URL (if using custom path)

If your repository is not named `username.github.io`, update `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Replace with your repository name
  // ... rest of config
})
```

### Step 3: Automated Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:

1. **Run on every push to main branch**
2. **Install dependencies** (`npm ci`)
3. **Run linter** (`npm run lint`)
4. **Run tests** (`npm run test`)
5. **Build project** (`npm run build`)
6. **Deploy to GitHub Pages** (if all tests pass)

### Step 4: Access Your Site

After successful deployment:
- **Default URL**: `https://username.github.io/repository-name/`
- **Custom Domain**: Configure in repository settings

---

## 🌐 Custom Domain Setup

### Step 1: Domain Configuration

1. **Add CNAME file** to `public/` directory:
   ```
   your-domain.com
   ```

2. **Configure DNS** with your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: username.github.io
   
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

3. **GitHub Settings**:
   - Go to `Settings` → `Pages`
   - Enter your custom domain
   - Enable "Enforce HTTPS"

### Step 2: SSL Certificate

GitHub automatically provisions SSL certificates for custom domains. Wait 24-48 hours for DNS propagation.

---

## 🧪 Testing & Quality Assurance

### Local Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Automated Testing Pipeline

The CI/CD pipeline includes:

1. **Unit Tests** (Vitest + React Testing Library)
2. **Linting** (ESLint + TypeScript)
3. **Build Verification**
4. **Deployment** (only on main branch)

### Test Coverage

```bash
# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

---

## 🔄 Deployment Workflow

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and test locally
npm run dev
npm run test

# 3. Commit changes
git add .
git commit -m "Add new feature"

# 4. Push to GitHub
git push origin feature/new-feature

# 5. Create Pull Request
# GitHub Actions will run tests on PR

# 6. Merge to main
# Automatic deployment to GitHub Pages
```

### Production Deployment

1. **Merge to main branch** triggers deployment
2. **GitHub Actions** runs full test suite
3. **Build artifacts** created in `dist/` directory
4. **Deploy to GitHub Pages** if all tests pass
5. **Site live** at your domain within 1-2 minutes

---

## 📊 Performance Optimization

### Build Optimization

The production build includes:
- **Code splitting** for faster loading
- **Asset optimization** (images, CSS, JS)
- **Tree shaking** to remove unused code
- **Minification** for smaller bundle size

### Lighthouse Scores Target

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 95+
- **SEO**: 90+

### Monitoring

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/

# Performance testing
npm install -g lighthouse
lighthouse https://your-domain.com
```

---

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**:
   ```bash
   # Check for TypeScript errors
   npm run lint
   
   # Run tests locally
   npm run test
   ```

2. **Pages Not Loading**:
   - Check `base` URL in `vite.config.ts`
   - Verify GitHub Pages is enabled
   - Check DNS propagation for custom domains

3. **404 Errors**:
   - Ensure `index.html` exists in `dist/`
   - Check routing configuration
   - Verify file paths are correct

### Debug Commands

```bash
# Check build output
npm run build && ls -la dist/

# Test production build locally
npm run preview

# Check GitHub Actions logs
# Go to Actions tab in GitHub repository
```

---

## 🔒 Security Considerations

### Environment Variables

Never commit sensitive data. Use GitHub Secrets for:
- API keys
- Database credentials
- Third-party service tokens

### Content Security Policy

Add CSP headers for production:

```typescript
// vite.config.ts
export default defineConfig({
  // ... other config
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lucide-react']
        }
      }
    }
  }
})
```

---

## 📈 Analytics & Monitoring

### Free Analytics Options

1. **Google Analytics 4**
2. **Plausible Analytics** (privacy-focused)
3. **Simple Analytics**
4. **Fathom Analytics**

### Implementation

```typescript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🎨 Custom Styling & Branding

### Tailwind Configuration

Customize colors, fonts, and spacing in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1e3a8a',
        'secondary-gold': '#f59e0b',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

### Print Styles

The website includes print-optimized CSS for PDF generation:

```css
@media print {
  .print\\:hidden { display: none !important; }
  .print\\:block { display: block !important; }
  /* Custom print styles */
}
```

---

## 📱 Mobile Optimization

### Responsive Design

- **Mobile-first approach**
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly navigation**
- **Optimized typography**

### Testing

```bash
# Mobile testing tools
npm install -g browser-sync
browser-sync start --server dist --files "dist/**/*"
```

---

## 🔄 Continuous Integration

### GitHub Actions Features

- **Parallel job execution**
- **Caching** for faster builds
- **Matrix builds** for multiple Node.js versions
- **Slack/Discord notifications**
- **Dependency vulnerability scanning**

### Advanced Workflow

```yaml
# .github/workflows/advanced-deploy.yml
name: Advanced CV Deployment

on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1' # Weekly dependency updates

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run security audit
        run: npm audit --audit-level moderate
  
  lighthouse:
    needs: deploy
    runs-on: ubuntu-latest
    steps:
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
```

---

## 🎯 Next Steps

1. **Set up monitoring** and analytics
2. **Configure custom domain**
3. **Add chatbot integration** (OpenAI API)
4. **Implement search functionality**
5. **Add blog/articles section**
6. **Set up automated CV updates**

---

## 📞 Support & Resources

### Documentation Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

### Community

- [GitHub Community](https://github.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/github-pages)
- [Discord: Vite Community](https://chat.vitejs.dev/)

---

## ✅ Deployment Checklist

- [ ] Repository created and code pushed
- [ ] GitHub Pages enabled
- [ ] GitHub Actions workflow configured
- [ ] Tests passing locally
- [ ] Build successful
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics implemented
- [ ] Performance optimized
- [ ] Mobile responsive
- [ ] Print styles working
- [ ] Accessibility verified
- [ ] SEO optimized

---

*Last updated: January 2025*
*For questions or issues, please create an issue in the repository.* 

## Deployment Guide

### Current Status
- ✅ CV chatbot fully functional with safety filtering
- ✅ Responses optimized for chatbot format (concise, scannable)
- ✅ Complete CV integration with all 16 sections
- ✅ Professional formatting with psychology focus

### Next Steps Roadmap

#### 1. Response Optimization (COMPLETED)
- ✅ Shortened response format for chatbot interface
- ✅ Bullet points for readability
- ✅ Conversational but professional tone
- ✅ Quick, direct answers

#### 2. Deployment Pipeline (NEXT)
**Options to consider:**
- **Vercel** (Recommended): Easy deployment, automatic builds from git
- **Netlify**: Similar to Vercel with form handling
- **Railway**: Full-stack deployment with backend support
- **AWS/Digital Ocean**: More control but requires more setup

**Deployment Checklist:**
- [ ] Choose hosting platform
- [ ] Set up environment variables (OpenAI API key)
- [ ] Configure build scripts
- [ ] Set up domain (optional)
- [ ] Test production deployment
- [ ] Monitor usage and costs

#### 3. CV Update Workflow
**Automated Pipeline:**
- [ ] GitHub Actions to auto-deploy on CV updates
- [ ] Script to convert DOCX → JSON → Deploy
- [ ] Version control for CV changes
- [ ] Backup system for CV data

**Manual Process (Current):**
1. Update `cv_json_data.json`
2. Test locally
3. Deploy to production
4. Verify chatbot responses

#### 4. Content Enhancement System
**Essay Integration:**
- [ ] Add essays section to CV JSON structure
- [ ] Integrate essays into chatbot knowledge base
- [ ] Allow essays to inform personality and voice
- [ ] Create essay management workflow

**Personality Enhancement:**
- [ ] Add personal anecdotes and stories
- [ ] Include career motivations and goals
- [ ] Add research interests and passions
- [ ] Include teaching philosophy

#### 5. Response Personalization
**Voice Development:**
- [ ] Analyze John's writing style from essays
- [ ] Create personality prompts
- [ ] Add personal touches to responses
- [ ] Include specific examples and stories

**Response Quality:**
- [ ] A/B test different response styles
- [ ] Collect user feedback
- [ ] Refine based on common questions
- [ ] Add contextual responses

#### 6. Technical Improvements
**Performance:**
- [ ] Implement response caching
- [ ] Optimize API calls
- [ ] Add rate limiting
- [ ] Monitor response times

**Features:**
- [ ] Mobile-responsive design
- [ ] Download CV feature
- [ ] Share conversation feature
- [ ] Analytics dashboard

### Immediate Next Steps

1. **Deploy to Production**
   ```bash
   # Choose platform and deploy
   npm run build
   # Deploy to chosen platform
   ```

2. **Set Up CV Update Workflow**
   ```bash
   # Create update script
   python scripts/docx2json.py
   # Test and deploy
   ```

3. **Prepare Essay Integration**
   ```json
   // Add to cv_json_data.json
   "essays": [
     {
       "title": "Personal Statement",
       "content": "...",
       "type": "personal"
     }
   ]
   ```

### Cost Considerations
- OpenAI API usage: Monitor and set limits
- Hosting costs: Usually $0-10/month for small traffic
- Domain costs: $10-15/year (optional)

### Monitoring & Maintenance
- Set up error tracking
- Monitor API usage
- Regular CV updates
- User feedback collection

### Future Enhancements
- Voice chat integration
- Multi-language support
- Advanced analytics
- Integration with professional networks 