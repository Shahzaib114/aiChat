import * as React from 'react';
import Root from "./src/screens/root/root.tsx";
import Providers from "./providers.tsx";


function App() {

    return (
        <Providers>
            <Root/>
        </Providers>
    );
}

export default App;