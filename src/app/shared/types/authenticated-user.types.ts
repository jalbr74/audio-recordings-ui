export interface Permission {
    id: number;
    name: string;
}

export interface Role {
    id: number;
    name: string;
    languageId: number;
    permissions: Permission[];
}

export interface Language {
    id: number;
    name: string;
    alpha2: string;
    alpha3: string;
    nativeName: string;
}

export interface Preferences {
    RecordVolume: string;
    AudioInputDeviceId: string;
}

export interface AuthenticatedUser {
    id: number;
    ldsAccountId: number;
    userName: string;
    preferredName?: string;
    roles?: Role[];
    languages?: Language[];
    preferences?: Preferences;
}
