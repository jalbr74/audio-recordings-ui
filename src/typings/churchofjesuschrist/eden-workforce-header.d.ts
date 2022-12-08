declare module '@churchofjesuschrist/eden-workforce-header' {
    declare interface WorkforceHeaderProps {
        name: string | React.ReactElement<HTMLAnchorElement>;
        menuButton?: any;
        tools?: any;
    }

    export function WorkforceHeader(props: WorkforceHeaderProps): any;
}
