import React, { useState } from 'react';

function App() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [sum, setSum] = useState(0);

  const handleSum = () => {
    setSum(Number(num1) + Number(num2));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Sum of Two Numbers</h2>
      <input
        type="number"
        value={num1}
        onChange={e => setNum1(e.target.value)}
        placeholder="First number"
        style={{ marginRight: '1rem' }}
      />
      <input
        type="number"
        value={num2}
        onChange={e => setNum2(e.target.value)}
        placeholder="Second number"
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleSum}>Calculate Sum</button>
      <div style={{ marginTop: '1rem' }}>
        <strong>Sum:</strong> {sum}
      </div>
    </div>
  );
}

export default App;
