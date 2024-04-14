export interface prompt {
    backgroundColor: string;
    logo: string;
    prompt: string;
    title: string;
}

export interface promptObject {
    prompts: prompt[];
}

export interface category {
    [key: string]: promptObject | string[];
}

export interface TransFormedCategory {
    title: string,
    data: prompt[] | string[],
    type: string,
}