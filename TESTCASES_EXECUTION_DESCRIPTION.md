# Description of Execution of Acceptance Test Cases

---

## BACKEND ACCEPTANCE TESTCASES

### Overview
Backend tests are end-to-end (E2E) integration tests using Jest and Supertest. They verify HTTP endpoints and controller-service interactions by mocking services at the module boundary, keeping tests fast and deterministic without relying on external APIs or databases.

---

### 1. Search Endpoint Tests (`server/src/__tests__/search.e2e.test.js`)

#### Test Case 1.1: Returns movies when query is provided
**Purpose**: Verify successful movie search with a valid query parameter

**Setup**:
- Mock TMDb service with sample movie data
- Mock movie object: 
  ```json
  {
    "id": 1,
    "title": "Star Movie",
    "overview": "Space adventure",
    "posterPath": "/poster.jpg",
    "releaseDate": "2020-01-01"
  }
  ```

**Execution**:
```
GET /api/search?query=star
```

**Expected Behavior**:
- HTTP Status: `200 OK`
- Response Body: `{ movies: [mockMovie] }`
- TMDb service called with: `searchMovies('star', 'en')`

**Acceptance Criteria**:
- ✓ Status code is 200
- ✓ Response body contains movies array
- ✓ Service called with correct parameters (query and language code)
- ✓ Movie objects have required fields (id, title, overview, posterPath, releaseDate)

---

#### Test Case 1.2: Returns 400 when query parameter is missing
**Purpose**: Validate error handling for incomplete/malformed requests

**Setup**:
- No query parameter provided in request
- TMDb service should not be invoked

**Execution**:
```
GET /api/search
```

**Expected Behavior**:
- HTTP Status: `400 Bad Request`
- Response Body: `{ error: 'Missing query parameter' }`
- Service is not called

**Acceptance Criteria**:
- ✓ Status code is 400
- ✓ Appropriate error message returned to client
- ✓ TMDb service mock never called
- ✓ Request fails fast without attempting service invocation

---

### 2. AI Search Endpoint Tests (`server/src/__tests__/ai-search.e2e.test.js`)

#### Test Case 2.1: Returns matches for a simple keyword
**Purpose**: Verify AI search (CSV-based) returns relevant movies for keyword queries

**Setup**:
- CSV fixture loaded: `fixtures/movies_small.csv`
- Environment variable: `CSV_PATH` points to test fixture
- Search query: 'toy'

**Execution**:
```
GET /api/ai-search?query=toy
```

**Expected Behavior**:
- HTTP Status: `200 OK`
- Response Body: `{ movies: [array of matching movies] }`
- Array contains at least one movie with 'toy' in title (case-insensitive)

**Acceptance Criteria**:
- ✓ Status code is 200
- ✓ Response body contains movies array
- ✓ Movies array is not empty
- ✓ At least one movie title includes search term 'toy' (case-insensitive match)
- ✓ CSV data correctly parsed and filtered

---

### 3. Recommendations Endpoint Tests (`server/src/__tests__/recommendations.e2e.test.js`)

#### Test Case 3.1: Returns recommendations when favoriteIds is provided
**Purpose**: Verify recommendation engine generates suggestions based on user's favorite movies

**Setup**:
- Mock RecommendationService with sample data
- Mock recommendation object:
  ```json
  {
    "id": 10,
    "title": "Recommended Movie 1",
    "overview": "A great recommendation",
    "releaseDate": "2020-01-01",
    "posterPath": "/poster1.jpg"
  }
  ```
- Favorite IDs to process: `[1, 2, 3]`

**Execution**:
```
GET /api/movies/recommendations?favoriteIds=1,2,3
```

**Expected Behavior**:
- HTTP Status: `200 OK`
- Response Body: `{ movies: [mockRecommendations] }`
- Recommendation service called with: `getRecommendations([1, 2, 3])`

**Acceptance Criteria**:
- ✓ Status code is 200
- ✓ Response body contains movies array
- ✓ Service receives correct favorite IDs as array of integers
- ✓ Returned movies have required fields (id, title, overview, releaseDate, posterPath)

---

#### Test Case 3.2: Returns AI recommendations when favoriteIds is provided
**Purpose**: Verify AI-powered recommendation engine returns personalized suggestions

**Setup**:
- Mock AI RecommendationService with AI-generated data
- Mock AI recommendation object:
  ```json
  {
    "id": 20,
    "title": "AI Recommended Movie 1",
    "overview": "AI thinks you will like this",
    "releaseDate": "2019-01-01",
    "posterPath": "/ai-poster1.jpg"
  }
  ```
- Favorite IDs: `[7, 8]`

**Execution**:
```
GET /api/movies/ai-recommendations?favoriteIds=7,8
```

**Expected Behavior**:
- HTTP Status: `200 OK`
- Response Body: `{ movies: [mockAiRecommendations] }`
- AI service called with: `getAiRecommendations([7, 8])`

**Acceptance Criteria**:
- ✓ Status code is 200
- ✓ Response body contains movies array
- ✓ AI service receives correct parameters
- ✓ Returned movies include AI-generated personalized suggestions

---

#### Test Case 3.3: Returns 500 when service throws error
**Purpose**: Verify graceful error handling when recommendation service fails

**Setup**:
- Mock AI RecommendationService to throw: `new Error('Service error')`
- Favorite IDs: `[1]`

**Execution**:
```
GET /api/movies/ai-recommendations?favoriteIds=1
```

**Expected Behavior**:
- HTTP Status: `500 Internal Server Error`
- Response Body: `{ error: '<error message string>' }`
- Service error is caught and returned safely

**Acceptance Criteria**:
- ✓ Status code is 500
- ✓ Response body has error property
- ✓ Error value is a string (not object or stack trace)
- ✓ Application does not crash on service failure
- ✓ Client receives appropriate error information

---

## FRONTEND ACCEPTANCE TESTCASES

### Overview
Frontend tests are component tests using Vitest and React Testing Library. They verify React component behavior by mocking the `fetch` API, ensuring tests are fast, deterministic, and validate DOM behavior rather than network effects.

---

### 1. Rendering Tests (`client/src/__tests__/App.test.jsx`)

#### Test Case 1.1: Renders the heading
**Purpose**: Verify core UI components are rendered on app initialization

**Setup**:
- App component mounted
- localStorage cleared
- fetch mocked to return empty arrays

**Execution**:
- Component renders

**Expected Behavior**:
- Logo image with alt text "Movie Search Demo" appears in DOM

**Acceptance Criteria**:
- ✓ Logo element is rendered and accessible
- ✓ Alt text correctly identifies the application
- ✓ Component mounts without errors

---

#### Test Case 1.2: Renders UI components correctly
**Purpose**: Verify all primary UI elements are present and accessible

**Setup**:
- App component mounted
- All fetch calls mocked

**Execution**:
- Component renders

**Expected Behavior**:
- All UI elements present and accessible:
  - Logo image (alt text: "Movie Search Demo")
  - Search input (placeholder: "Search movies by title...")
  - Search button (aria-label: "Search movies")
  - AI Search button (aria-label: "Search movies using AI")
  - Navigation element

**Acceptance Criteria**:
- ✓ Logo is in document
- ✓ Search input field is rendered
- ✓ Search button is accessible
- ✓ AI Search button is accessible
- ✓ Navigation is present
- ✓ All elements have proper accessibility attributes

---

### 2. Search Functionality Tests

#### Test Case 2.1: Performs a successful search and shows results
**Purpose**: Verify search request is sent to backend and results display correctly

**Setup**:
- App component mounted
- Mock movies data:
  ```json
  [
    {
      "id": 1,
      "title": "Inception",
      "releaseDate": "2010-07-16",
      "overview": "A mind-bending thriller",
      "posterPath": null
    },
    {
      "id": 2,
      "title": "Interstellar",
      "releaseDate": "2014-11-07",
      "overview": "Space exploration",
      "posterPath": null
    }
  ]
  ```
- fetch mocked to return movies when `/api/search` is called

**Execution**:
1. User types "nolan" in search input
2. User clicks Search button

**Expected Behavior**:
- Search request sent to: `/api/search?query=nolan`
- Movies are fetched and rendered
- Both "Inception" and "Interstellar" titles display in movie cards

**Acceptance Criteria**:
- ✓ Search input accepts user text
- ✓ Click handler triggers correctly
- ✓ Fetch called with correct search endpoint
- ✓ Movie titles appear in DOM after request
- ✓ Multiple occurrences of titles visible (in cards and overlays)
- ✓ Results display within timeout (5000ms)

---

#### Test Case 2.2: Shows an error message when the search fails
**Purpose**: Verify error handling and user feedback on failed search

**Setup**:
- App component mounted
- fetch mocked to return `{ ok: false }` for `/api/search`
- Error message: "Request failed"

**Execution**:
1. User types "anything" in search input
2. User clicks Search button

**Expected Behavior**:
- Search request sent to: `/api/search?query=anything`
- Backend returns error response
- Error message "Request failed" displays to user

**Acceptance Criteria**:
- ✓ Error request handled gracefully
- ✓ Error message rendered in DOM
- ✓ No crash or console errors
- ✓ Error appears within timeout (3000ms)
- ✓ User can retry without reloading page

---

### 3. AI Search Functionality Test

#### Test Case 3.1: Performs an AI search and shows results
**Purpose**: Verify AI search button triggers different endpoint and displays results

**Setup**:
- App component mounted
- Mock movies data:
  ```json
  [
    {
      "id": 3,
      "title": "The Matrix",
      "releaseDate": "1999-03-31",
      "overview": "Sci-fi classic",
      "posterPath": null
    },
    {
      "id": 4,
      "title": "Blade Runner",
      "releaseDate": "1982-06-25",
      "overview": "Cyberpunk masterpiece",
      "posterPath": null
    }
  ]
  ```
- fetch mocked to return movies when `/api/ai-search` is called

**Execution**:
1. User types "sci-fi movies from the 90s" in search input
2. User clicks AI Search button

**Expected Behavior**:
- AI search request sent to: `/api/ai-search?query=sci-fi movies from the 90s`
- Movies are fetched and rendered
- Both "The Matrix" and "Blade Runner" titles display

**Acceptance Criteria**:
- ✓ AI Search button is distinct from regular Search
- ✓ Different endpoint (`/api/ai-search`) is called
- ✓ Natural language queries are accepted
- ✓ Movie results display correctly
- ✓ Titles appear in DOM after request
- ✓ Results display within timeout (5000ms)

---

### 4. Recommendations Tests

#### Test Case 4.1: Sends recommendation requests when favorites are present
**Purpose**: Verify recommendation endpoints are called when user has favorited movies

**Setup**:
- App component mounted
- localStorage contains two favorite movies:
  ```json
  [
    {
      "id": 1,
      "title": "Favorite Movie 1",
      "overview": "A great movie",
      "releaseDate": "2020-01-01",
      "posterPath": null
    },
    {
      "id": 2,
      "title": "Favorite Movie 2",
      "overview": "Another great movie",
      "releaseDate": "2021-01-01",
      "posterPath": null
    }
  ]
  ```
- fetch mocked to track calls to:
  - `/api/movies/recommendations`
  - `/api/movies/ai-recommendations`

**Execution**:
1. App renders
2. User navigates to Favorites view by clicking Favorites button
3. MovieRecommendations component mounts

**Expected Behavior**:
- `/api/movies/recommendations` endpoint is called
- `/api/movies/ai-recommendations` endpoint is called
- Both recommendation endpoints receive requests

**Acceptance Criteria**:
- ✓ Recommendation call count > 0
- ✓ AI recommendation call count > 0
- ✓ Requests made after Favorites button clicked
- ✓ Requests include favorite movie IDs
- ✓ Requests complete within timeout (5000ms)
- ✓ Component doesn't crash on recommendation calls

---

## Running the Tests

### Backend Tests
```bash
npm --prefix server test
npm --prefix server test search.e2e.test.js
npm --prefix server test ai-search.e2e.test.js
npm --prefix server test recommendations.e2e.test.js
```

### Frontend Tests
```bash
npm --prefix client test
npm --prefix client test App.test.jsx
```

### All Tests
```bash
npm run test
```

---

## Test Execution Summary

| Layer | Test Suite | Test Case | Purpose |
|-------|-----------|-----------|---------|
| **Backend** | Search | Query provided | Successful search retrieval |
| **Backend** | Search | Query missing | Error handling for bad requests |
| **Backend** | AI Search | Keyword match | CSV-based search functionality |
| **Backend** | Recommendations | With favoriteIds | Recommendation generation |
| **Backend** | Recommendations | AI recommendations | AI-powered suggestions |
| **Backend** | Recommendations | Error handling | Graceful failure handling |
| **Frontend** | Rendering | Heading renders | Initial UI setup |
| **Frontend** | Rendering | All UI elements | Component accessibility |
| **Frontend** | Search | Successful search | Search results display |
| **Frontend** | Search | Search fails | Error message handling |
| **Frontend** | AI Search | AI search results | Alternative search method |
| **Frontend** | Recommendations | Favorites to API | Recommendation requests |

---

## Key Testing Principles

### Backend
- **Module-level mocking**: Services mocked before app import for isolation
- **No external dependencies**: No network calls to real APIs
- **Fast execution**: Deterministic results every time
- **Realistic data**: Mock data matches production response schemas

### Frontend
- **API mocking**: fetch intercepted before component execution
- **DOM testing**: Assertions on rendered elements, not implementation
- **User interactions**: Simulates clicks and text input
- **Accessibility**: Tests use proper ARIA labels and roles
- **Timeout handling**: Tests wait for async operations to complete

