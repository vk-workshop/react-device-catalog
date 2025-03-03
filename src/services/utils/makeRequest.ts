export const makeRequest = async (message: string) => {
  const response = await fetch('http://localhost:3002', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();

  return data;
};
