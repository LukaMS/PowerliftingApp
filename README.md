# PowerliftingApp

An Expo React Native mobile application for planning and tracking powerlifting workouts.

## Prerequisites

* Node.js (v14+)
* Yarn or npm
* Expo CLI (`npm install -g expo-cli`)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd PowerliftingApp
   ```
2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

## Configuration

* (Optional) Create a `.env` file in the project root for environment variables.
* Ensure any API keys or backend URLs are set in `.env` if required.

## Running the App

Start the Expo development server:

```bash
expo start
```

* Scan the QR code with the Expo Go app (iOS/Android)
* Press `i` to run on iOS Simulator, `a` for Android Emulator

## Project Structure

```
PowerliftingApp/
├── .gitignore               # Git ignore rules (node_modules, .expo, etc.) citeturn1file0
├── app.json                 # Expo configuration (app name, icon, plugins) citeturn1file0
├── assets/                  # Static assets
│   ├── data/                # Sample programs and workouts JSON/TS files
│   │   ├── programs.json    # Pre-defined workout programs citeturn1file0
│   │   └── workouts.ts      # Dummy workouts data citeturn1file0
│   ├── exercises.json       # Exercise database export citeturn1file0
│   ├── new-exercises.json   # Filtered exercise list citeturn1file0
│   └── images/              # App icons and splash images citeturn1file0
├── src/ or app/             # Source code (screens, components, types, api, services)
├── package.json             # Project dependencies and scripts
└── yarn.lock / package-lock.json
```

## Features

* Browse predefined powerlifting programs
* View and time workouts
* Track and persist workouts locally using SQLite
* Navigate using Expo Router with typed routes
* Load custom fonts
* Open exercise instructions in in-app browser


## License

MIT License
