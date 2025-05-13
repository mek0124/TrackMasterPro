/*
This files sole purpose is to allow access to the
root variables for styling throughout the *.style.js
files within the styles directory. No other application
styles will be added to this file other than .App as
these come from the create command and keeps the items
correctly proportioned on the screen. All styles for
any components/pages are found within their respective
sub-directories here within the styles folder.
*/

import { createGlobalStyle } from "styled-components";


const GlobalStyle = createGlobalStyle`

  .tektur {
    font-family: "Tektur", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-variation-settings: "wdth" 100;
  }

  :root {
    /* Dark Theme (Coffee/Brown) - Default */
    --bg: #3B1F14;
    --btnBg: #5B2F1F;
    --bdr: #4A2718;
    --hvr: #6A3A26;
    --fg: #83543C;
    --text: #E6D2C7;
    --text-muted: #BEA99E;
    --card-bg: #4A2718;
    --highlight: #C87941;
    --shadow: rgba(0, 0, 0, 0.4);

    /* Accent colors - Same for both themes */
    --accent: #C87941; /* Coffee orange */
    --success: #739E82; /* Muted green */
    --danger: #A35D6A; /* Muted red */
    --warning: #D4B483; /* Muted yellow */
    --info: #6A8CAF; /* Muted blue */
  }

  /* Light Theme */
  body.light-theme {
    --bg: #F5F0E8;
    --btnBg: #E8DFD3;
    --bdr: #D9CDBF;
    --hvr: #E0D5C5;
    --fg: #B8A99A;
    --text: #4A3828;
    --text-muted: #7D6B5A;
    --card-bg: #EEE6DB;
    --highlight: #C87941;
    --shadow: rgba(0, 0, 0, 0.1);
  }

  * {
    box-sizing: border-box;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: var(--bg);
    color: var(--text);
    font-family: 'Tektur', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .App {
    text-align: center;
    background-color: var(--bg);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    font-size: calc(10px + 1.5vmin);
    color: var(--text);
  }

  /* Custom scrollbar for the entire app */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--fg);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--highlight);
  }

  /* Button styles */
  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Link styles */
  a {
    color: var(--accent);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: var(--highlight);
    text-decoration: underline;
  }
`;

export default GlobalStyle;
