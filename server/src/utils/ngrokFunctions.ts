import ngrok from 'ngrok';

// Function to start Ngrok tunnel
export const startNgrok = async (portNum:number): Promise<string> => {
  try {
    // Configure Ngrok options
    const ngrokOptions = {
      authtoken: '2AJ43fOFXuqthUhqTEdE3QzdGzy_4kNmFwwsaDUUuUDAdtm8y',
      addr: portNum
    };

    // Start Ngrok tunnel
    const ngrokUrl: string = await ngrok.connect(ngrokOptions);

    console.log(`Ngrok tunnel started at: ${ngrokUrl}`);
    return ngrokUrl;
  } catch (error) {
    console.error('Error starting Ngrok:', error);
    throw error;
  }
};
