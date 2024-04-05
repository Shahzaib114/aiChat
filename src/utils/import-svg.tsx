import * as React from "react";
import {SvgXml} from "react-native-svg";
import {FC} from "react";


interface ISvgImportProps {
    svg: string;
    style?: any;
}

const SvgImport: FC<ISvgImportProps> = ({...props}) => {
    const variable: string = `${props.svg}`;
    const svgMarkup: string = variable;

    return <SvgXml xml={svgMarkup} style={props.style}/>;
};

export default SvgImport;