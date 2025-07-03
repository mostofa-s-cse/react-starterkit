# React Starter Kit

A modern, production-ready React application built with JavaScript, Redux Toolkit, Tailwind CSS, and Webpack. Features a complete data table with advanced server-side pagination, search, sorting, and comprehensive API integration.

## ✨ Features

### Core Technologies

- **React 18** with modern JavaScript (ES6+)
- **Redux Toolkit** for efficient state management
- **Tailwind CSS** for responsive, utility-first styling
- **Webpack** for optimized bundling and development
- **Axios** with interceptors for robust API handling
- **ESLint & Prettier** for code quality and formatting

### Advanced Data Table

- **Server-side pagination** with customizable page sizes (10, 20, 50)
- **Debounced search** (500ms delay) across multiple fields
- **Multi-column sorting** with ascending/descending order
- **Loading states** and comprehensive error handling
- **Responsive design** with mobile-friendly controls
- **Real-time data info** (showing X to Y of Z entries)

### API Service Layer

- **Dual API instances** (public/private) with automatic token handling
- **Global error handling** with status-specific responses
- **Request/response interceptors** for authentication
- **Comprehensive API helpers** for common operations
- **Structured error responses** with success/failure states

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd react-starterkit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

**Start the development server:**

```bash
npm start
# or
yarn start
```

The app will be available at [http://localhost:3000](http://localhost:3000) with hot reload enabled.

### Production Build

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` directory.

### Code Quality

```bash
# Lint code
npm run lint
# or
yarn lint

# Fix linting issues
npm run lint:fix
# or
yarn lint:fix

# Format code
npm run format
# or
yarn format
```

## 📁 Project Structure

```
react-starterkit/
├── public/
│   ├── index.html              # Main HTML template
│   ├── favicon.ico             # App favicon
│   └── manifest.json           # PWA manifest
├── src/
│   ├── components/
│   │   ├── Counter.jsx         # Redux counter example
│   │   ├── Layout.jsx          # App layout wrapper
│   │   ├── Post.jsx            # Post component
│   │   └── UserData.jsx        # Advanced data table component
│   ├── services/
│   │   └── apis.js             # API service layer with helpers
│   ├── store/
│   │   ├── index.js            # Redux store configuration
│   │   └── counterSlice.js     # Counter slice with actions
│   ├── styles/
│   │   └── globals.css         # Global styles with Tailwind
│   ├── App.jsx                 # Main app component
│   └── index.jsx               # App entry point
├── dist/                       # Production build output
├── babel.config.js             # Babel configuration
├── webpack.config.js           # Webpack configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── package.json                # Dependencies and scripts
```

## 🛠️ Available Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm start`            | Start development server with hot reload |
| `npm run build`        | Build for production                     |
| `npm test`             | Run test suite                           |
| `npm run lint`         | Lint JavaScript files                    |
| `npm run lint:fix`     | Fix linting issues automatically         |
| `npm run format`       | Format code with Prettier                |
| `npm run format:check` | Check code formatting                    |

## 🔧 API Service Usage

The project includes a comprehensive API service layer with both public and private endpoints:

### Basic Usage

```javascript
import { apiHelpers } from './services/apis';

// Fetch posts with pagination and search
const result = await apiHelpers.getPosts({
  page: 1,
  limit: 10,
  search: 'React',
  sortBy: 'title',
  sortOrder: 'asc',
});

if (result.success) {
  console.log('Posts:', result.data);
  console.log('Total:', result.total);
} else {
  console.error('Error:', result.error);
}
```

### Public vs Private APIs

```javascript
import { publicApi, privateApi } from './services/apis';

// Public API (no authentication required)
const publicData = await publicApi.get('/posts');

// Private API (requires authentication token)
const privateData = await privateApi.get('/user/profile');
```

### Authentication

The private API automatically handles authentication tokens stored in `localStorage`. Set your token like this:

```javascript
localStorage.setItem('token', 'your-jwt-token');
```

## 📊 Data Table Features

The `UserData` component demonstrates advanced data table capabilities:

- **Server-side pagination** with First, Previous, Next, Last controls
- **Debounced search** (500ms delay) to prevent excessive API calls
- **Multi-column sorting** with visual sort indicators
- **Responsive design** that works on mobile devices
- **Loading states** with spinners and visual feedback
- **Error handling** with user-friendly messages
- **Customizable page sizes** (10, 20, 50 items per page)

## 🎨 Styling & Customization

### Tailwind CSS

- **Utility-first** approach for rapid development
- **Responsive design** with mobile-first methodology
- **Custom color palette** and component variants
- **Production optimization** with unused CSS purging

### Component Styling

- **Consistent spacing** using Tailwind's spacing scale
- **Hover states** and **focus indicators** for accessibility
- **Loading animations** with CSS animations
- **Professional color scheme** with proper contrast ratios

## 🚀 Customization Guide

### Adding New API Endpoints

1. Add new functions to `apiHelpers` in `src/services/apis.js`
2. Handle both success and error states
3. Use appropriate API instance (public/private)

### Creating New Components

1. Create component in `src/components/`
2. Use modern React patterns (hooks, functional components)
3. Follow existing patterns for styling and structure

### Adding New Redux State

1. Create new slice in `src/store/`
2. Export actions and selectors
3. Add to store configuration in `src/store/index.js`

### Styling Guidelines

- Use Tailwind utilities for consistent spacing
- Implement hover and focus states for interactive elements
- Ensure responsive design across all screen sizes
- Maintain consistent color scheme throughout the app

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` directory ready for deployment.

### Deployment Platforms

- **Vercel**: Zero-config deployment for React apps
- **Netlify**: Drag-and-drop deployment with continuous integration
- **GitHub Pages**: Free hosting for static sites
- **AWS S3**: Scalable cloud storage with CloudFront CDN
- **Docker**: Containerized deployment for any platform

### Environment Variables

Create a `.env` file in the root directory:

```bash
REACT_APP_API_BASE_URL=https://your-api-url.com
REACT_APP_ENVIRONMENT=production
```

## 🧪 Testing

The project is set up for testing with Jest. Add your tests in:

- `src/components/__tests__/` for component tests
- `src/services/__tests__/` for service tests
- `src/store/__tests__/` for Redux tests

```bash
npm test
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow modern JavaScript best practices
- Use meaningful commit messages
- Write tests for new features
- Update documentation as needed
- Ensure all linting passes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Axios](https://axios-http.com/) - HTTP client
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Fake API for testing

---

**Built with ❤️ using React, JavaScript, and modern web technologies.**
