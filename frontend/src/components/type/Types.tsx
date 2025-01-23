export type CreateCardProp = {
    _id: string,
    link: string,
    title: string,
    description?: string,
    date: string,
    tags?: Type[],
    type: string,
}

type Type = {
    _id: string,
    title: string
}



export type CreateCardType = 'video' | 'image' | 'article' | 'tweet' | 'link' | null ;