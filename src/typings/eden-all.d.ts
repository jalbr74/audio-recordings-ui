declare module '@churchofjesuschrist/eden-buttons' {
    // These button props definitions mimic react's IntrinsicElements.button found in react/index.d.ts:
    export function Primary (props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>): any;
    export function Secondary(props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>): any;
}

declare module '@churchofjesuschrist/eden-normalize' {
    export default function Normalize(props: any): any;
}
