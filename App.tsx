import * as React from 'react';
import Root from "./src/screens/root/root.tsx";
import Providers from "./providers.tsx";
import {GPT3, typeOfGpt} from "./src/utils/gpt-models.ts";


function App() {

    return (
        <Providers>
            <Root/>
        </Providers>
    );
}

export default App;