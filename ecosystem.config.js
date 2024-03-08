module.exports = {
	apps: [
		{
			name: 'KenjiB0t', // Change this to your app's name
			script: 'index.js', // Specify the entry point for your application
			exec_mode: "fork", // Set the execution mode to "fork"
			instances: 1, // Set the number of instances
			autorestart: true, // Enable automatic restart
			max_restarts: 5, // Maximum number of restarts before stopping
			env: {
				NODE_ENV: 'production', // Set the environment (e.g., 'development', 'production')
			},
			log_date_format: "MM-DD-YYYY HH:mm", // Set the format for the date in the logs
		},
	],
}