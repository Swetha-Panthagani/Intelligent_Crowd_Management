
export async function emergencyDispatch() {
  alert("kk")
  try {
    // Call the external ambulance dispatch service
    const response = await fetch('http://127.0.0.1:5000/call_ambulance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: "hellof" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dispatch API error:', errorText);
      return {
        status: 'error',
        responseMessage: `Dispatch service returned an error: ${response.statusText}`,
      };
    }

    const result = await response.json();

    return {
      status: result.status || 'info',
      responseMessage: result.message || 'Dispatch completed.',
    };
  } catch (error) {
    console.error('Failed to call dispatch service:', error);
    return {
      status: 'error',
      responseMessage: 'Could not connect to the emergency dispatch service.',
    };
  }
}




