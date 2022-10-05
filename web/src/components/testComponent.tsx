export interface TestComponentProps{
    height: number;
    width: number;
    text: string;
    textColor: string;
    backgroundColor: string;
}

export const TestComponent = ({height, width, text, textColor, backgroundColor}: TestComponentProps): JSX.Element => {
    return <text height={height} width={width} style={{color: textColor, backgroundColor: backgroundColor}}> {text} </text>
}