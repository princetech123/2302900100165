const axios = require("axios");

const LOG_API = "http://4.224.186.213/evaluation-service/logs";

// Paste ONLY the access_token value here
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIwOHByaW5jZTk5OUBnbWFpbC5jb20iLCJleHAiOjE3ODA0NjczNjAsImlhdCI6MTc4MDQ2NjQ2MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImU2NTIyZmNkLWYzOTMtNDg0My05NjA0LWE0YWFiODYwZjg3YSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InByaW5jZSB5YWRhdiIsInN1YiI6IjFlYjhhYzllLWVlMDItNDc3ZS04Y2Y2LTNjZjlmNjM1ZDViZiJ9LCJlbWFpbCI6IjA4cHJpbmNlOTk5QGdtYWlsLmNvbSIsIm5hbWUiOiJwcmluY2UgeWFkYXYiLCJyb2xsTm8iOiIyMzAyOTAwMTAwMTY1IiwiYWNjZXNzQ29kZSI6InNkV1dnYyIsImNsaWVudElEIjoiMWViOGFjOWUtZWUwMi00NzdlLThjZjYtM2NmOWY2MzVkNWJmIiwiY2xpZW50U2VjcmV0IjoiSEhlV3JOdUZzR1l5cnh6ZyJ9.sS89bW1YcrxNVbtFZswPekXLTXpp-7cKBvft97V5rGw";

async function Log(stack, level, pkg, message) {
  try {
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error(
      "Logging Error:",
      error.response?.data || error.message
    );
  }
}

module.exports = Log;