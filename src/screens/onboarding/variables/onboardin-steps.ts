import onBoard1 from "../../../../assets/svgs/onBoard1.js";
import onBoard2 from "../../../../assets/svgs/onBoard2.js";
import onBoard3 from "../../../../assets/svgs/onBoard2.js";



export interface IOnboardingStep {
    image?: any;
    heading: string;
    greenText?: string;
    text: string;
    background: any;
    SVG: any;
}

const onboardingSteps: IOnboardingStep[] = [
    // Flat list ref
    {
        SVG: onBoard1,
        image: require("../../../../assets/images/sp1.png"),
        heading: "Powered AI Tool.",
        greenText: "Chat GPT",
        text: "Personalized recommendation & helpful tips. All in one convenient Place.",
        background: require("../../../../assets/images/bg.png")
    },
    {
        SVG: onBoard2,
        heading: "Easy To Use",
        image: require("../../../../assets/images/sp2.png"),

        text: "Just like in a real conversation with a real person, ChatGPT remembers previous responses",
        // greenText: "Easy To"
        background: require("../../../../assets/images/bg2.png")

    },
    {
        SVG: onBoard3,
        image: require("../../../../assets/images/sp3.png"),

        heading: "Chat Engineering",
        text: "Just like in a real conversation with a real person, ChatGPT remembers previous responses",
        // greenText: "Easy To"
        background: require("../../../../assets/images/bg3.png")
    },

];


export default onboardingSteps;