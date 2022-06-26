import { useState } from 'react';

function useForceUpdate(): ()=>void {
  const [_, setValue] = useState(0); // integer state
  return () => setValue((v) => v + 1);
}

export default useForceUpdate;
