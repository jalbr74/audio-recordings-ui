declare module '@churchofjesuschrist/eden-buttons' {
    // These button props definitions mimic react's IntrinsicElements.button found in react/index.d.ts:
    export function Primary (props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>): React.ReactElement;
    export function Secondary(props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>): React.ReactElement;
}
