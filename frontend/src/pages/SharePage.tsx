import { Separator } from '@/components/ui/separator'
import { ApiRoutes } from '../utils/routeApi'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  FileText,
  Link,
  Twitter,
  Youtube,
  FileImage,
  MoveUpRight,
  Loader2,
  SearchX
} from 'lucide-react'
import Footer from '../components/Footer'
import { YouTubeComp } from '../components/YoutubeComp'
import { TwitterComp } from '../components/TweetComp'

type AllTagsProps = {
  _id: string
  title: string
}

const iconMap: { [key: string]: React.ElementType } = {
  tweet: Twitter,
  video: Youtube,
  link: Link,
  article: FileText, 
  image: FileImage
}

export default function SharePage () {
  const { hash } = useParams<{ hash: string }>() 
  const [content, setContent] = useState<{
    user: { _id: string; username: string }
    sharedContents: any
  } | null>(null) 
  const [loading, setLoading] = useState<boolean>(true)
  const [alltags, setAllTags] = useState<AllTagsProps[]>([])

  useEffect(() => {
 
    const fetchContent = async () => {
      try {
        const response = await axios.get(ApiRoutes.share + '/' + hash) 
       
        if (response.status === 200 || response.statusText === 'OK') {
         
          setLoading(false)
          setContent(response.data) 
        } else {
          console.log('Failed to fetch content.')
        }
      } catch (error) {
        setLoading(false)
        console.log('Error fetching content:', error)
      }
    }

    const fetchTags = async () => {
      try {
        const response = await axios.get(ApiRoutes.alltags)
        console.log('fetch res:', response.data.tags)
        setAllTags(response.data.tags)
        console.log('typeof:', typeof alltags)
      } catch (error) {
        console.log('Error fetching tags:', error)
      }
    }

    fetchTags()
   
    fetchContent() 
  }, [hash]) 

  if (loading)
    return (
      <div className='w-full h-screen flex flex-col justify-center items-center text-sm md:text-lg '>
        <Loader2 className='animate-spin' />
      </div>
    )
  if (!content)
    return (
      <div className='w-full h-screen flex flex-col justify-center items-center text-sm md:text-lg '>
        <SearchX /> Content not found or invalid link
      </div>
    )

  return (
    <div className='min-h-screen flex flex-col items-center mx-auto bg-transparent max-w-full px-2 sm:px-28 rounded-md w-screen bg-[#0e1012]'>
      
      <div className='p-10 md:p-10 bg-transparent flex flex-col items-center gap-2'>
        <h1 className='text-xl md:text-3xl bg-gradient-to-tr from-purple-300/80 to-white/90 bg-clip-text text-transparent'>
          {`${content.user.username}'s brain`}
        </h1>
        <Separator />
      </div>

      
      <div className='w-full flex-grow  flex justify-center bg-[#0e1012]'>
        <SharedCard contents={content.sharedContents} alltags={alltags} />
      </div>

      
      <div className='mt-auto w-full'>
        <Footer />
      </div>
    </div>
  )
}


const SharedCard = ({
  contents,
  alltags
}: {
  contents: any
  alltags: AllTagsProps[]
}) => {

  const getTagTitles = (tagIds: string[]): string[] => {
    console.log('tagIds:', tagIds)
    console.log('alltags:', alltags)

    if (!Array.isArray(alltags)) {
      console.error('alltags is not an array or is undefined')
      return []
    }

    return tagIds.map(id => {
      const tag = alltags.find(tag => tag._id === id)
      return tag ? tag.title : 'Unknown Tag'
    })
  }

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate)

    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()

    return `${day}/${month}/${year}`
  }

  const isYoutubeVid = (thoughtLink: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
    if (!youtubeRegex.test(thoughtLink)) {
      return false
    } else {
      const videoId = getYouTubeVideoId(thoughtLink)
      if (!videoId) {
        return false
      }
    }
    return true
  }

  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const isTweet = (thoughtLink: string): boolean => {
    const twitterRegExp =
      /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/
    const xRegExp = /^https?:\/\/x\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/
    if (twitterRegExp.test(thoughtLink) || xRegExp.test(thoughtLink)) {
      return true
    } else {
      return false
    }
  }


  const refineTweetUrl = (url: string) => {
    const xComPattern = /^https?:\/\/(www\.)?x\.com/
    if (xComPattern.test(url)) {
      return url.replace(xComPattern, 'https://twitter.com')
    }
    return url
  }

  return (
    <div className='bg-[#0e1012]'>
    
      <div className='columns-1 md:columns-2 lg:columns-3 gap-1 bg-[#0e1012] w-full rounded-lg '>
        {contents.map((content: any, index: number) => {
          const IconComponent = iconMap[content.type] || FileText 

          return (
            <div className='p-3 break-inside-avoid  w-full'>

              <div
                key={index}
                className='border border-black/[0.2] bg-gradient-to-tr bg-[#343434] flex flex-col items-start  relative  w-full px-5 rounded-md '
              >
                

                <div className='p-2  w-full'>
                  <div className='flex flex-row items-center justify-between space-y-0 pb-2 '>
                    <div className='flex gap-2 items-center'>
                     
                      <IconComponent className='h-4 w-4' />
                      <div className='font-medium'>{content.title}</div>
                    </div>
                    <a
                      href={content.link}
                      className='h-8 w-8 flex justify-center items-center'
                    >
                      <MoveUpRight className='h-4 w-4 hover:text-purple-600' />
                    </a>
                  </div>
                  <Separator />
                  <div className=''>
                    {isYoutubeVid(content.link) ? (
                      <div className='bg-purple-300/10 rounded-sm  p-3 mt-2 overflow-hidden'>
                        <div className='line-clamp-[10] overflow-hidden text-ellipsis'>
                          {content.description}
                          <YouTubeComp url={content.link} />
                        </div>
                      </div>
                    ) : isTweet(content.link) ? (
                      <div>
                        <TwitterComp tweetUrl={refineTweetUrl(content.link)} />
                      </div>
                    ) : (
                      <div className='bg-purple-300/10 rounded-sm  p-3 mt-2 overflow-hidden'>
                        <div className='line-clamp-[10] overflow-hidden text-ellipsis'>
                          {content.description}
                        </div>
                      </div>
                    )}
                  </div>
                 
                  <div className=' py-2  bottom-0'>
                    <div className='text-[#5E43EC] flex gap-1 flex-wrap'>
                      {getTagTitles(content.tags).map(tag => (
                        <div className=' bg-[#5E43EC]/10   p-1 text-sm rounded-lg'>
                          #{tag}
                        </div>
                      ))}
                    </div>
                    <div className='text-gray-400  flex justify-end text-sm'>
                      {formatDate(content.date)}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}
