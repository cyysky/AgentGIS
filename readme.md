# Geospatial AI Explorer

A web-based platform that integrates AI with geospatial data, allowing users to search, explore, and analyze land data through natural language queries.

## Features

- Google-like interface for searching geospatial data
- AI-powered natural language processing to interpret user queries
- Interactive map with support for various data layers
- Ability to display polygon data returned from backend queries
- Information panel for detailed feature exploration
- Customizable OpenAI API settings

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn package manager
- OpenAI API key

### Installation

1. Clone the repository:

git clone https://github.com/yourusername/geospatial-ai-portal.git cd geospatial-ai-portal


2. Install dependencies:


3. Create a `.env` file in the root directory with the following variables:

REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_OPENAI_BASE_URL=https://api.openai.com/v1

4. Start the development server:

npm start


The application will be available at `http://localhost:3000`.

## Usage

1. Enter natural language queries in the chat interface:
- "Show me land titles around Lucky Garden"
- "Find all primary schools in Kota Kinabalu"
- "Display land parcels available for commercial development near the city center"

2. The AI will process your query and return relevant information, which will be displayed both in the chat and on the map.

3. Click on map features to see detailed information in the info panel.

4. Use the settings button to configure the OpenAI API connection parameters.

## Backend Integration

This frontend is designed to connect with a backend service that can process the natural language queries and return GeoJSON data. The backend should:

1. Receive the query from the frontend
2. Process it using OpenAI API
3. Execute relevant geospatial data queries
4. Return GeoJSON or other structured data to the frontend

## License

[MIT License](LICENSE)