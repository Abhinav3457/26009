const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://20.207.122.201/evaluation-service';
const LOG_API_URL = `${API_BASE_URL}/logs`;

/**
 * Logger utility for frontend application
 * Sends logs to the centralized logging API
 */

const LOG_LEVELS = {
  'debug': 0,
  'info': 1,
  'warn': 2,
  'error': 3,
  'fatal': 4,
};

class Logger {
  constructor() {
    this.minLevel = LOG_LEVELS['debug'];
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  /**
   * Send log to the logging API
   * @param {String} level - Log level (debug, info, warn, error, fatal)
   * @param {String} message - Log message
   * @param {String} stack - Application stack (frontend, backend)
   * @param {String} packageName - Package/module name
   */
  async sendLog(level, message, stack, packageName) {
    if (LOG_LEVELS[level] < this.minLevel) {
      return;
    }

    try {
      const payload = {
        logId: this.generateLogId(),
        level: level.toLowerCase(),
        message: message,
        stack: stack,
        package: packageName,
        timestamp: new Date().toISOString(),
      };

      // Log to console for debugging
      console.log(`[${level.toUpperCase()}] ${message}`);

      // Build headers
      const headers = {
        'Content-Type': 'application/json',
      };

      if (this.authToken) {
        headers['Authorization'] = this.authToken;
      }

      // Send to logging API (non-blocking)
      try {
        fetch(LOG_API_URL, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload),
        }).catch(() => {
          // Silently fail - logging shouldn't break the app
        });
      } catch (err) {
        // Invalid URL or network error - continue anyway
      }
    } catch (error) {
      console.error('Error in logger:', error);
    }
  }

  generateLogId() {
    return `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  debug(message, stack = 'frontend', packageName = 'app') {
    this.sendLog('debug', message, stack, packageName);
  }

  info(message, stack = 'frontend', packageName = 'app') {
    this.sendLog('info', message, stack, packageName);
  }

  warn(message, stack = 'frontend', packageName = 'app') {
    this.sendLog('warn', message, stack, packageName);
  }

  error(message, stack = 'frontend', packageName = 'app') {
    this.sendLog('error', message, stack, packageName);
  }

  fatal(message, stack = 'frontend', packageName = 'app') {
    this.sendLog('fatal', message, stack, packageName);
  }
}

export const logger = new Logger();
