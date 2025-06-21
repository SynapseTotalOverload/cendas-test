# Construct Project - Task Management Application

A modern React-based task management application designed for construction projects, featuring interactive canvas-based task placement, Kanban board view, table view, and offline-first architecture with RxDB.

## 🚀 Features

### Core Functionality

- **Interactive Canvas**: Upload construction blueprints/images and place tasks directly on them
- **Task Management**: Create, edit, delete tasks with detailed descriptions and status tracking
- **Checklist System**: Each task contains multiple checklist items with individual status tracking
- **Multiple Views**: Canvas view, Kanban board, and table view for different workflow preferences
- **User Authentication**: Register/login system with persistent sessions
- **Offline-First**: RxDB integration for local data persistence and synchronization

### Technical Features

- **Real-time Synchronization**: Bidirectional sync between Zustand state and RxDB
- **Drag & Drop**: Interactive task placement and Kanban board functionality
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI components
- **Type Safety**: Full TypeScript implementation
- **State Management**: Zustand for global state with RxJS streams

## 📊 Time Spent on Features

### (8 hours)

- **Project Setup & Architecture** (2 hours)
  - Vite + React + TypeScript setup
  - Tailwind CSS configuration
  - Basic project structure
- **Database Design & RxDB Integration** (3 hours)
  - RxDB schema design for tasks, users, active user
  - Database initialization and configuration
  - Basic CRUD operations
- **State Management Setup** (2 hours)
  - Zustand store configuration
  - RxJS stream integration
  - Basic state synchronization
- **User Authentication** (1 hour)
  - Basic login/register forms
  - User store implementation

### (8 hours)

- **Canvas Implementation** (4 hours)
  - React Konva integration
  - Image upload and display
  - Zoom and pan functionality
  - Task placement on canvas
- **Task Management** (3 hours)
  - Task creation, editing, deletion
  - Status management
  - Basic task interactions
- **UI Components** (1 hour)
  - Basic styling and layout
  - Component structure

### (4 hours)

- **Kanban Board** (2 hours)
  - Drag and drop implementation
  - Column-based task organization
  - Status-based filtering
- **Table View** (1 hour)
  - Tabular task display
  - Sorting and filtering
- **Final Polish** (1 hour)
  - Bug fixes
  - UI improvements
  - Documentation

**Total Time: 20 hours (2.5 days) Separated in a week**

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd construct-prjkt

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Environment Setup

No environment variables required - the application uses local storage and IndexedDB for data persistence.

## 📖 Usage Instructions

### Getting Started

1. **Register/Login**: Create an account or login with existing credentials
2. **Upload Blueprint**: Click the upload button to add a construction blueprint image
3. **Add Tasks**: Click "Add Task" and then click on the canvas to place tasks
4. **Manage Tasks**: Right-click tasks to edit, delete, or update status
5. **Switch Views**: Use the navigation to switch between Canvas, Kanban, and Table views

### Task Management

- **Creating Tasks**: Click on canvas in edit mode to place new tasks
- **Editing Tasks**: Right-click tasks to open edit dialog
- **Status Updates**: Change task status via dropdown or Kanban drag-and-drop
- **Checklist Items**: Add, edit, and update status of individual checklist items

### Canvas Navigation

- **Zoom**: Use mouse wheel or zoom buttons
- **Pan**: Click and drag to move around the canvas
- **Reset View**: Use the reset button to return to original view

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **State Management**: Zustand + RxJS
- **Database**: RxDB with IndexedDB storage
- **Canvas**: React Konva
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form + Zod validation

### Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and database setup
├── modules/            # Feature modules
│   ├── dialogs/        # Modal dialogs
│   ├── kanban/         # Kanban board components
│   └── table-view/     # Table view components
├── pages/              # Route components
├── schemas/            # Zod validation schemas
├── stores/             # Zustand stores
└── types/              # TypeScript type definitions
```

### Data Flow

1. **User Actions** → Zustand Store
2. **Zustand Store** → RxDB (via sync function)
3. **RxDB Changes** → Zustand Store (via subscriptions)
4. **UI Updates** based on Zustand state

## 🔧 Potential Improvements & Refactoring

### Code Quality Improvements

1. **Error Handling**: Add comprehensive error boundaries and error handling
2. **Loading States**: Implement proper loading states for async operations
3. **Form Validation**: Enhance form validation with better error messages
4. **Type Safety**: Add stricter TypeScript types and remove any types

### Performance Optimizations

1. **Virtualization**: Implement virtual scrolling for large task lists
2. **Image Optimization**: Add image compression and lazy loading
3. **Memoization**: Add React.memo and useMemo for expensive operations
4. **Bundle Splitting**: Implement code splitting for better load times

### Feature Enhancements

1. **Real-time Collaboration**: Add WebSocket support for multi-user editing
2. **File Attachments**: Allow attaching files to tasks
3. **Search & Filter**: Advanced search and filtering capabilities
4. **Export/Import**: Data export to CSV/PDF and import functionality
5. **Mobile Support**: Responsive design for mobile devices
6. **Offline Sync**: Better offline/online synchronization
7. **Task Templates**: Predefined task templates for common construction activities

### Architecture Improvements

1. **Service Layer**: Extract business logic into service classes
2. **Repository Pattern**: Implement repository pattern for data access
3. **Event System**: Add event-driven architecture for better decoupling
4. **Testing**: Add comprehensive unit and integration tests
5. **CI/CD**: Set up automated testing and deployment pipeline

### UI/UX Improvements

1. **Accessibility**: Add ARIA labels and keyboard navigation
2. **Dark Mode**: Implement theme switching
3. **Animations**: Add smooth transitions and micro-interactions
4. **Responsive Design**: Better mobile and tablet support
5. **Customization**: Allow users to customize colors and layouts

**Built with ❤️ for CANDAS **
