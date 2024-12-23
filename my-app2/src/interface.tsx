export interface code {
    lang: string;
    code: string;
}

export interface profile {
    first_name: string;
    last_name: string;
    email: string;
    id: string;
    image: string | null;
}

export interface MessageThread {
    threadId: string;
    messageId: string;
    subjectId: string;
    title: string;
    description: string;
    code: code;
    media: File | null;
    createdby: profile;
    createdon: string;
}

export interface MessageMain {
    messageId: string;
    title: string;
    description: string;
    code: code;
    media: File | null;
    createdby: profile;
    createdon: string;
    threads: string[];
}

export interface subject {
    subjectId: string;
    subjectName: string;
    subjectDescription: string;
    subjectCode: string;
    subjectMedia: File | null;
    subjectCreatedby: profile;
    subjectCreatedon: string;
    subjectMessages: string[];
}