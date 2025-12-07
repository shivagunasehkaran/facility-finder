# Facility Finder - Coding Challenge

## Overview

Create a small, two-screen React Native application that allows users to find a partner fitness facility. This challenge is designed to be completed within **2 hours** and tests core React Native skills relevant to building fitness applications.

**Important:** The goal is not necessarily to finish every feature. We are most interested in seeing your approach to problem-solving, your coding style, and the architectural decisions you make. A well-structured, partially complete solution is better than a rushed, fully complete one.

## Provided Assets

- A basic Expo TypeScript boilerplate project (in the `app/` folder)
- A `facilities.json` file (in the `assets/` folder) containing **fictional test data** (100 sample fitness facilities across Sydney and Melbourne)

## Core Requirements (MVP for 2 hours)

### 1. Home Screen

- Load and display the list of facilities from the provided `facilities.json` file
- The list must be performant (able to handle 100+ items efficiently)
- Each list item should display the facility's **name** and **address**
- Implement a text input field to allow users to **search/filter** the list by facility name in real-time

### 2. Details Screen

- When a user taps on a facility from the list, they should navigate to a new screen
- This screen should display all the details for the selected facility, including:
  - Name
  - Address
  - List of facilities/amenities

### 3. Technical Requirements

- The project must be written in **TypeScript**
- Choose and implement a state management solution. Be prepared to discuss why you chose it
- Use a navigation library

## Stretch Goals (If you have extra time)

- Add a feature to filter facilities by their amenities
- Add basic unit tests for a component or a utility function
- Show a loading indicator while the initial data is being "fetched" and handle potential error states
- Style the app to look clean and presentable (no need for pixel-perfection)

## Getting Started

1. Navigate to the `app/` folder:
   ```bash
   cd app
   ```

2. Install dependencies (already done, but you can run again if needed):
   ```bash
   npm install
   ```

3. Run on your preferred platform:
   ```bash
   npm run ios      # for iOS
   npm run android  # for Android
   npm run web      # for Web
   ```

## Submission

When you're ready to submit:

1. Ensure your code is well-structured and includes comments where helpful
2. Be prepared to discuss your architectural decisions and trade-offs
3. Submit your solution by either:
   - Sharing a link to a public GitHub repository, or
   - Zipping up the challenge folder and emailing it back to us

Good luck! We look forward to seeing what you build.
