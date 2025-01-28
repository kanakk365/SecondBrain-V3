import {
  FileText,
  Link,
  Trash2,
  Twitter,
  Youtube,
  FileImage,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "./card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
// import { useState } from 'react'
import axios from "axios";
import { ApiRoutes } from "../utils/routeApi";
import { useState } from "react";
import { CreateCardType } from "./type/Types";
import { YouTubeComp } from "./YoutubeComp";
import { TwitterComp } from "./TweetComp";
import ShinyButton from "./ui/shiny-button";
import { useDispatch } from "react-redux";
import { setOpen, setSummary } from "@/store/slice/contenSlice";



type Type = {
  _id: string;
  title: string;
};
type CardProp = {
  _id: string;
  link: string;
  title: string;
  description?: string;
  date: string;
  tags?: Type[];
  type: string;
};
const iconMap: { [key: string]: React.ElementType } = {
  tweet: Twitter,
  video: Youtube,
  link: Link,
  article: FileText, // Map additional icons here
  image: FileImage,
};

export default function CardComponent({
  cardData,
  setCardData,
  selectedType,
}: {
  cardData: CardProp[];
  setCardData: React.Dispatch<React.SetStateAction<CardProp[]>>;
  selectedType: CreateCardType;
}) {
  const userData = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null; // Check if user data exists in localStorage
  const userId = userData ? userData.id : null;
  const [loading, setLoading] = useState(false);
  const [deleteCardInx, setDeleteCardInx] = useState<number>();

  const removeThought = async (id: string, index: number) => {
    setLoading(true);
    setDeleteCardInx(index);
    // setRemoveContentId(id);
    const deleteContent = {
      contentId: id,
      userId,
    };
    try {
      const response = await axios.delete(ApiRoutes.remove, {
        data: deleteContent,
      });

      if (response.status === 200 || response.statusText === "OK") {
        setCardData((prevCardData) =>
          prevCardData.filter((item) => item._id !== id)
        );
      } else {
        console.log("Error deleting thought");
      }
    } catch (error) {
      console.log("Error:", error);
    }

    setLoading(false);
  };

  // ---------------------------------------------- import link shit-----------------------------------------------------
  const isYoutubeVid = (thoughtLink: string): boolean => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeRegex.test(thoughtLink)) {
      return false;
    } else {
      const videoId = getYouTubeVideoId(thoughtLink);
      if (!videoId) {
        return false;
      }
    }
    return true;
  };

  const getYouTubeVideoId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const isTweet = (thoughtLink: string): boolean => {
    // console.log('this is tweet')
    const twitterRegExp =
      /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
    const xRegExp = /^https?:\/\/x\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/;
    if (twitterRegExp.test(thoughtLink) || xRegExp.test(thoughtLink)) {
      // console.log("its tweet:", thoughtLink)
      // const tweetId = getTweetId(thoughtLink);
      // if(!tweetId){
      //     console.log("not tweet: ", thoughtLink)
      //     return false;
      //   }
      return true;
    } else {
      // console.log("not tweet: ", thoughtLink);
      return false;
    }
  };

  // const [tweetUser, setTweetUser] = useState('')
  // const getTweetId = (url: string): string | null => {
  //   const regExp = /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/
  //   const match = url.match(regExp)
  //   if (match) {
  //     console.log('twitter reg match: ', match)
  //     // setTweetUser(match[1])
  //     return match ? match[3] : null
  //   } else {
  //     const regExp_newformate = /^https?:\/\/x\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/
  //     const match_newformate = url.match(regExp_newformate)
  //     // match_newformate && setTweetUser(match_newformate[1])
  //     return match_newformate ? match_newformate[3] : null
  //   }
  // }

  const refineTweetUrl = (url: string) => {
    const xComPattern = /^https?:\/\/(www\.)?x\.com/;
    if (xComPattern.test(url)) {
      return url.replace(xComPattern, "https://twitter.com");
    }
    return url;
  };
 const dispatch = useDispatch()
  const handleYoutubeSummary = async (link: string) => {
    try {
      const res = await axios.post(ApiRoutes.summary , {url: link})
      const data = res.data
      dispatch(setSummary(data.data))
      dispatch(setOpen(true))
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="h-full ">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-1 w-full rounded-lg ">
        {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-red-400 '> */}
        {cardData
          .slice()
          .reverse()
          .map((data, index) => {
            const IconComponent = iconMap[data.type] || FileText; // Fallback to a default icon if not found
            const date = new Date(data.date);
            if (loading) {
              if (deleteCardInx === index) {
                return (
                  <div
                    key={index}
                    className="w-full h-full rounded-lg flex justify-center items-center animate-pulse bg-slate-300/10"
                  ></div>
                );
              }
            }

            if (!selectedType || data.type === selectedType) {
              // console.log("selectedType is: ", selectedType + thought.type)
              return (
                <div key={index} className="p-3 break-inside-avoid  w-full ">
                  <Card className="shadow-sm bg-[#262626]" key={index}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="flex flex-shrink-0 items-center text-center gap-2 pt-2 pr-3 pl-0">
                        {/* <FileText className='h-4 w-4' /> */}
                        <IconComponent className="h-4 w-4" />{" "}
                        {/* Render the corresponding icon */}
                      </div>
                      <div className="w-full pt-1">
                        <h3 className="font-medium  text-left w-full">
                          {data.title}
                        </h3>
                      </div>
                      <div className="flex flex-shrink-0 gap-2  pt-0">
                        <a href={data.link} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 "
                          onClick={() => removeThought(data._id, index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Separator className="mb-5" />
                      <p className="mb-2">{data.description}</p>
                      <div>
                        {isYoutubeVid(data.link) && (
                          <div>
                            <YouTubeComp url={data.link} />
                          </div>
                        )}

                        {isTweet(data.link) && (
                          <div className="w-full">
                            <TwitterComp tweetUrl={refineTweetUrl(data.link)} />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-5 flex-wrap">
                        {data.tags &&
                          data?.tags?.map((tag, idx) => (
                            <span
                              className="text-[#5E43EC] bg-[#5E43EC]/10 px-2 py-1 rounded-md text-sm"
                              key={idx}
                            >
                              #{tag.title}
                            </span>
                          ))}
                      </div>
                      <div className="flex justify-between items-center">
                        {" "}
                        <div className="text-sm text-muted-foreground mt-4 ">
                          Added on {date.toLocaleDateString()}
                        </div>
                        {isYoutubeVid(data.link) && <ShinyButton onClick={() => handleYoutubeSummary(data.link)}>Summary</ShinyButton>}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}
