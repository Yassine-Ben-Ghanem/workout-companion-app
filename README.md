# Workout Companion App

A React Native mobile application for tracking workouts, built using Clean Architecture principles.

![CI](https://github.com/yourusername/workout-companion-app/actions/workflows/ci.yml/badge.svg)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (v8 or later)
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/environment-setup))
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/workout-companion-app.git
cd workout-companion-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Setup environment variables:

```bash
cp .env.example .env
```

4. Install iOS dependencies (macOS only):

```bash
cd ios && pod install && cd ..
```

### Available Scripts

- `pnpm start` - Start the Metro bundler
- `pnpm ios` - Run the app on iOS simulator
- `pnpm android` - Run the app on Android emulator/device
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```
API_URL=https://686bec3214219674dcc69e86.mockapi.io
```

The app uses `react-native-config` to manage environment variables with proper TypeScript support.

## 🏗 Architecture Overview

This project follows Clean Architecture with three main layers:

### Domain Layer (Core Business Logic)

- **Entities**: Core business models (e.g., Workout, Exercise)
- **Repositories**: Define data access contracts
- **Use Cases**: Implement business logic operations
- **Services**: Coordinate multiple use cases

### Data Layer (Implementation)

- **Repositories**: Concrete implementations of repository interfaces
- **API**: Network communication
- **Storage**: Local data persistence (MMKV)
- **Store**: State management with Redux

### Presentation Layer (UI)

- **Components**: Reusable UI elements
- **Screens**: Full app screens
- **Navigation**: React Navigation setup
- **Hooks**: Custom React hooks

## 📁 Project Structure

```
src/
├── domain/          # Business logic and interfaces
├── data/            # Data layer implementation
└── presentation/    # UI components and screens
```

## 🧪 Testing

The project uses Jest and React Native Testing Library for testing [[memory:2626814]]. Tests are organized as:

- `__tests__/data/` - Data layer tests
- `__tests__/domain/` - Domain layer tests
- `__tests__/integration/` - Integration tests

Run tests with:

```bash
pnpm test
```

## 🔄 Continuous Integration

The project uses GitHub Actions for CI [[memory:2587494]] with the following checks:

- Linting
- Unit and Integration Tests
- Build Verification

## 📱 Features

- Workout tracking and management
- Progress monitoring
- Weather integration
- Weekly summary charts
- Clean and intuitive UI
