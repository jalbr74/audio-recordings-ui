declare module '@churchofjesuschrist/eden-sub-navigation' {
    declare interface SubNavigationProps {
        title?: {
            href: string;
            text: string;
        },

        /** An array of items to show in a callout. See SubNavigationCallout component for shape. */
        items?: {
            text: string;
            href?: string;
            current?: boolean;
        }[],
    }

    export default function SubNavigation(props: SubNavigationProps): React.ReactElement;
}
