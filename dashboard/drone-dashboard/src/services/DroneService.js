const API_URL = process.env.REACT_APP_API_URL || 'https://your-render-url.onrender.com';

export const DroneService = {
    // Get current drone telemetry
    async getTelemetry() {
        try {
            const response = await fetch(`${API_URL}/telemetry`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching telemetry:', error);
            return null;
        }
    },

    // Send command to drone
    async sendCommand(command, params = {}) {
        try {
            const response = await fetch(`${API_URL}/command`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    command,
                    params
                }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error sending command:', error);
            return { status: 'error', message: 'Failed to send command' };
        }
    },

    // Start polling for telemetry updates
    startPolling(callback, interval = 1000) {
        const poll = async () => {
            const data = await this.getTelemetry();
            if (data) {
                callback(data);
            }
        };

        // Poll immediately
        poll();

        // Continue polling at interval
        const pollerId = setInterval(poll, interval);
        return () => clearInterval(pollerId);
    }
};
