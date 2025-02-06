import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar"; // Adjust the path as necessary
import { Link, useNavigate } from "react-router-dom"; // React Router for navigation
import { motion } from "framer-motion";
import QRcode from "qrcode";
import {
  BrainCircuit,
  BrainCircuitIcon,
  Copy,
  FileImage,
  FileText,
  Filter,
  Link2,
  Loader2,
  LogOut,
  Plus,
  Share2,
  Twitter,
  User,
  X,
  Youtube,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateCardProp, CreateCardType } from "./type/Types";
import { Button } from "./ui/button";
import axios from "axios";
import { ApiRoutes } from "@/utils/routeApi";
import CardComponent from "./CardComponent";
import { Separator } from "./ui/separator";
import { useDispatch } from "react-redux";
import { clearAuth } from "@/store/slice/userSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import ShinyButton from "./ui/shiny-button";

export function DashboardSide() {
  const dispatch = useDispatch();
  const links = [
    {
      label: "Video",

      icon: (
        <Youtube className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Tweet",

      icon: (
        <Twitter className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Link",

      icon: (
        <Link2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Image",

      icon: (
        <FileImage className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Article",

      icon: (
        <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user);
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const [selectedType, setSelectedType] = useState<CreateCardType>(null);

  const [signOut, setSignout] = useState(false);
  console.log(signOut);

  const signout = () => {
    setSignout(true);
  };

  const signOutHandler = () => {
    signout();
    dispatch(clearAuth());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className={` rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-[#262626] flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden w-full h-[100vh]`}
    >
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-10 dark:invert dark:opacity-10 "></div>

      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 z-50">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <BrainCircuitIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  selectedType={selectedType}
                  onSelectType={setSelectedType}
                />
              ))}
            </div>
          </div>

          <div className="   flex justify-between items-center">
            <div className="flex gap-2 justify-center items-center cursor-pointer">
              <span className=" p-1 rounded-full">
                <User className=" rounded-full" />
              </span>
              {open && <p>{userData.username}</p>}
            </div>
            {open && (
              <a onClick={signOutHandler}>
                <LogOut className="hover:text-gray-100 text-gray-500 cursor-pointer" />
              </a>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard
        selectedType={selectedType}
        setSelectedType={setSelectedType}
      />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <BrainCircuitIcon color="#ffffff" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Second Brain
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

const Dashboard = ({
  selectedType,
  setSelectedType,
}: {
  selectedType: CreateCardType;
  setSelectedType: React.Dispatch<React.SetStateAction<CreateCardType>>;
}) => {
  const [isCreateNewOpen, setIsCreateNewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [points, setPoints] = useState<string[]>([]);

  useEffect(() => {
    const points = summary
      .split("- ")
      .filter((point) => point.trim() !== "")
      .map((point) => point.trim());
    console.log(points);
    setPoints(points);
  }, [summary, isSummaryOpen]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const openCreate = async () => {
    setIsCreateNewOpen(true);
    fetchTags();
  };
  const closeCreate = async () => {
    setIsCreateNewOpen(false);
    setSelectedTags([]);
    setAlltagsId([]);
  };

  const openShare = () => setIsShareOpen(true);

  const [createCardData, setCreateCardData] = useState<CreateCardProp[]>([]);
  const [dataUpdatedCount, setDataUpdatedCount] = useState(0);
  const [cardLoading, setCardLoading] = useState(false);
  console.log(createCardData, cardLoading);
  const [importLink, setImportLink] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [date] = useState(new Date().toISOString().slice(0, 10));
  const [inputValue, setInputValue] = useState("");
  const [alltags, setAllTags] = useState<{ _id: string; title: string }[]>([]);
  const [filteredTags, setFilteredtags] = useState<
    { _id: string; title: string }[]
  >([]);
  const [alltagsId, setAlltagsId] = useState<string[]>([]);
  const [formError, setFormError] = useState<{
    [key: string]: string;
  }>({});

  const [searchVal , setSearchVal]= useState("")

  const fetchTags = async () => {
    try {
      const res = await axios.get(ApiRoutes.alltags);
      setAllTags(res.data.tags);
      setFilteredtags(res.data.tags);
      console.log(res.data.tags);
    } catch (error) {
      alert("Error fetching tags");
    }
  };

  const createNewTag = async (tagTitle: string) => {
    try {
      const res = await axios.post(ApiRoutes.createtag, {
        title: tagTitle.toLowerCase(),
      });
      console.log(res.data);
      const newAllTags = await axios.get(ApiRoutes.alltags);
      setAllTags(newAllTags.data.tags);

      setSelectedTags([...selectedTags, tagTitle.toLowerCase()]);
      setFilteredtags([
        ...filteredTags,
        newAllTags.data.tags[newAllTags.data.tags.length - 1],
      ]);
      setAlltagsId([
        ...alltagsId,
        newAllTags.data.tags[newAllTags.data.tags.length - 1]._id,
      ]);
    } catch (error) {
      alert("Error adding tag");
    }
  };

  const addTag = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const existingTag = alltags.find(
        (tag) => tag.title === inputValue.trim().toLowerCase()
      );
      if (existingTag) {
        setSelectedTags([...selectedTags, existingTag.title]);
        setAlltagsId([...alltagsId, existingTag._id]);
      } else {
        createNewTag(inputValue.trim());
      }
      setInputValue("");
      e.preventDefault();
    }
  };

  function getVideoId(youtubeUrl: string): string | null {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = youtubeUrl.match(regex);

    return match ? match[1] : null;
  }

  function getTweetId(tweetUrl: string): string | null {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(?:[^/]+)\/status\/(\d+)/;
    const match = tweetUrl.match(regex);
    return match ? match[1] : null;
  }

  const isValidURL = (url: string) => {
    const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;
    return urlRegex.test(url);
  };

  const getVidInfo = async (
    vidId: string
  ): Promise<{ title: string; description: string }> => {
    try {
      const res = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${vidId}`
      );
      const data = await res.json();
      const title = data.title || `Youtube Video ${vidId}`;
      const fullDescription =
        data.author_name + "'s youtube video on - " + title || "";
      const description = fullDescription.split("\n").slice(0, 5).join("\n");
      return { title, description };
    } catch (error) {
      return {
        title: `This Video (${vidId})`,
        description: "",
      };
    }
  };

  const addingFixedTags = (fixtag: string) => {
    const existingTag = alltags.find(
      (tag) => tag.title === fixtag.trim().toLowerCase()
    );
    console.log(existingTag);
    if (existingTag) {
      return existingTag._id;
    }
  };

  const ImportLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const youtubeVidId = getVideoId(importLink);
    const tweetId = getTweetId(importLink);
    console.log(youtubeVidId);
    console.log(tweetId);

    const importErrors: { [key: string]: string } = {};

    if (youtubeVidId) {
      if (!importLink.trim() || !isValidURL(importLink)) {
        importErrors.importLink = "Please enter a Youtube URL ";
      }
      if (importLink.trim() === "") {
        importErrors.importLink = "Please enter a Valid Url";
      }
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      if (!youtubeRegex.test(importLink)) {
        importErrors.importLink = "Please enter a valid Youtube URL";
      }
      const vidId = getVideoId(importLink);
      if (!vidId) {
        importErrors.importLink = "Invalid Youtube Url";
      }
      if (Object.keys(importErrors).length > 0) {
        setFormError(importErrors);
        setTimeout(() => {
          setFormError({});
        }, 3000);
      }

      const vidInfo = vidId
        ? await getVidInfo(vidId)
        : { title: "", description: "" };
      const { title, description } = vidInfo;

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userData ? userData.id : null;
      const tagId = addingFixedTags("youtube");
      const alltagId: string[] = [];
      console.log(tagId);
      if (tagId) {
        alltagId[0] = tagId;
      }
      const content = {
        title,
        description,
        link: importLink,
        type: "video",
        tags: alltagId,
        userId,
      };
      setCardLoading(true);
      try {
        const res = await axios.post(ApiRoutes.create, content, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status === 201) {
          setCreateCardData((prevData) => [...prevData, res.data]);
          setDataUpdatedCount((c) => c + 1);
          onClose();
        } else {
          const error = await res.data;
          alert(`Error: ${error.message}|| "submission failed`);
        }
      } catch (error) {
        console.log(error);
        alert("unexpected error : Please try again..");
      }
      setTitle("");
      setDescription("");
      setAlltagsId([]);
      setType("");
      setLink("");
      setFormError({});
      setCardLoading(false);
      onClose();
      setImportLink("");
    } else if (tweetId) {
      if (!importLink.trim() || isValidURL(importLink)) {
        importErrors.importLink = "Enter a valid import link";
      }
      if (importLink.trim() === "") {
        importErrors.importLink = "Please enter a Twitter Url";
      }
      if (!tweetId) {
        importErrors.importLink = "Invalid Tweet URL";
      }
      if (Object.keys(importErrors).length > 0) {
        setFormError(importErrors);
        setTimeout(() => {
          setFormError({});
        }, 3000);
      }

      const userdata = JSON.parse(localStorage.getItem("user") || "{}");
      console.log(userdata);
      const userId = userdata?.id;
      const tagId = addingFixedTags("tweet");
      const alltagId: string[] = [];
      if (tagId) {
        alltagId[0] = tagId;
      }

      const tweetUsername = importLink.split("/")[3];

      const title = `${tweetUsername}'s tweet`;
      const description = " ";

      setCardLoading(true);

      const content = {
        title,
        description,
        link: importLink,
        type: "tweet",
        tags: alltagId,
        userId,
      };
      try {
        const res = await axios.post(ApiRoutes.create, content, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.data;
        if (res.status === 201) {
          setCreateCardData((prevData) => [...prevData, data]);
          setDataUpdatedCount((c) => c + 1);
          onClose();
        }
      } catch (error) {
        console.log(error);
        alert("An unexpected error occurred. Please try again.(-_-)");
      }
      setTitle("");
      setDescription("");
      setAllTags([]);
      setType("");
      setLink("");
      setFormError({});
      setImportLink("");
    } else {
      importErrors.importLink = "Invalid Url ";
      if (Object.keys(importErrors).length > 0) {
        setFormError(importErrors);
        setTimeout(() => {
          setFormError({});
        }, 3000);
        return;
      }
    }
  };
  const onClose = () => {
    setIsCreateNewOpen(false);
    setIsShareOpen(false);
    setSelectedTags([]);
    setAllTags([]);
    setTitle("");
    setDescription("");
    setFormError({});
    setLink("");
    setAlltagsId([]);
    setType("");
    setIsSummaryOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      submitErrors.title = "Title is missing";
    }
    if (!description.trim()) {
      submitErrors.description = "Description is needed";
    }
    if (!link.trim()) {
      submitErrors.link = "Link is missing";
    }
    if (alltagsId.length <= 0) {
      submitErrors.tag = "Add Tags";
    }

    if (Object.keys(submitErrors).length > 0) {
      setFormError(submitErrors);
      return;
    }
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData ? userData.id : null;
    console.log(type);
    if (type === undefined || type === " " || type === null) {
      setType("article");
    }
    console.log(type);
    const content = {
      title,
      description,
      link,
      type,
      tags: alltagsId,
      userId,
    };

    try {
      const res = await axios.post(ApiRoutes.create, content, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.data;
      if (res.status === 201) {
        setCreateCardData((prevData) => [...prevData, data]);
        setDataUpdatedCount((c) => c + 1);
        onClose();
      } else {
        const error = await res.data;
        console.log(`Error ${error}`);
      }
    } catch (error) {
      alert("An error occured");
    }
    setTitle("");
    setDescription("");
    setLink("");
    setAlltagsId([]);
    setType("");
    setFormError({});
    setCardLoading(false);
    onClose();
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    const filtered = alltags
      .filter((tag) =>
        tag.title.toLowerCase().includes(e.target.value.toLowerCase())
      )
      .slice(0, 5);
    setFilteredtags(filtered);
  };
  const [cardData, setCardData] = useState<CreateCardProp[]>([]);
  const [serverDown, setServerDown] = useState(false);
  console.log(serverDown);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLinkToCopy(`${window.location.origin}`);
    }
  }, []);

  useEffect(() => {
    setCardLoading(true);

    const getUserContents = async () => {
      const userData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : null;
      const userID = userData ? userData.id : null;
      console.log(userID);
      console.log(userData);

      if (userID) {
        try {
          const res = await axios.get(ApiRoutes.contents, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              userID: userID,
            },
          });
          console.log("here");
          console.log(res.data);
          setCardData(res.data);
          console.log(cardData);
        } catch (error) {
          setServerDown(true);
        }
      } else {
        setServerDown(true);
      }
      setCardLoading(false);
    };

    const getUserShareable = async () => {
      const userData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : null;

      const userId = userData?.id;

      if (userId) {
        try {
          const res = await axios.get(`${ApiRoutes.shareHexVal}/${userId}`);
          setHash(res.data.link.hash);
          setOpenAccess(true);
        } catch (error) {
          console.log(error);
          setOpenAccess(false);
        }
      } else {
        alert("Error: User is not defined");
      }
    };
    getUserShareable();
    getUserContents();
  }, [dataUpdatedCount]);

  //  share stuff

  const [openAccess, setOpenAccess] = useState(false);
  const [hash, setHash] = useState<string>("");

  const [showCopiedMsg, setShowCopiedMsg] = useState(false);
  const [linkToCopy, setLinkToCopy] = useState("");
  const [shareBtnLoading, setShareBtnLoading] = useState(false);
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    const generateQr = () => {
      const sharelink = `${linkToCopy}/share/brain/${hash}`;
      QRcode.toDataURL(sharelink).then(setSrc);
    };
    generateQr();
  }, [hash]);

  const sum = useSelector((state: RootState) => state.content.summary);
  const openCheck = useSelector((state: RootState) => state.content.open);
  useEffect(() => {
    if (sum !== null) {
      setSummary(sum);
    }
    setIsSummaryOpen(openCheck);
  }, [sum, openCheck]);

  const shareBrain = async () => {
    const sharelink = `${linkToCopy}/share/brain/${hash}`;

    try {
      await navigator.clipboard.writeText(sharelink);
    } catch (error) {
      alert("failed to copy link");
    }
    setTimeout(() => {
      setShowCopiedMsg(false);
    }, 2000);
    setShowCopiedMsg(true);
  };

  const handlePublicAccessToggle = () => {
    if (!openAccess) {
      setOpenAccess(true);
      shareRequest(true);
    } else {
      setIsShareOpen(false);
      setOpenAccess(false);
      shareRequest(false);
    }
  };

  const shareRequest = async (share: boolean) => {
    const shareReq = {
      share: share,
    };
    setShareBtnLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const res = await axios.post(ApiRoutes.share, shareReq, config);
      const data = await res.data;
      console.log(res);

      if (
        res.status === 201 ||
        res.status === 200 ||
        res.statusText === "OK" ||
        res.statusText.toLowerCase() === "created"
      ) {
        setHash(data.hashVal);
        console.log(data.hashVal);
        setShareBtnLoading(false);
      } else {
        // Handle server errors
        const errorData = await res.data;
        alert(`Error: ${errorData.message || "Submission failed"}`);
        setShareBtnLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [isClear , setIsClear]= useState(false)

  const handleSearch = async()=>{
    
    try {
      
      const res = await axios.post(ApiRoutes.search, {query : searchVal})
      console.log(res)
      setCardData(res.data)
      setIsClear(true)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClearSearch = async()=>{
    const userData = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : null;
      const userID = userData ? userData.id : null;
    try {
      const res = await axios.get(ApiRoutes.contents, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          userID: userID,
        },
      });
      
      console.log("here");
      console.log(res.data);
      setCardData(res.data);
      setIsClear(false)
      console.log(cardData);
    } catch (error) {
      setServerDown(true);
    }
  }

  return (
    <div className="flex flex-1 h-full z-10">
      <div className="border border-neutral-700 md:p-10 p-2 rounded-tl-2xl  flex flex-col gap-2 flex-1 w-full  h-full">
        <div className="flex flex-col gap-2 h-full">
         
          <div className="h-20 w-full rounded-lg flex justify-between items-center px-4 sm:px-6">

  <h1 className="text-xl md:text-3xl sm:block hidden">My Brain</h1>


  <div className="flex items-center justify-center gap-2 sm:gap-5 flex-1">
    <Input
      placeholder="AI Search"
      className="h-8 w-32 sm:w-80"
      onChange={(e) => setSearchVal(e.target.value)}
    />
    {isClear ? (
          <ShinyButton
            onClick={handleClearSearch}
            className="px-3 py-2 text-sm sm:text-base bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Clear
          </ShinyButton>
        ) : (
          <ShinyButton onClick={handleSearch}>Search</ShinyButton>
        )}
  </div>


  <div className="flex gap-2 sm:gap-5 items-center">
    <Button
      onClick={openCreate}
      variant="ghost"
      className="flex items-center gap-1 rounded-md border border-slate-500 px-3 py-2 text-sm sm:text-base font-mono transition-colors hover:text-indigo-300"
    >
      <Plus />
      <span className="hidden sm:inline">Create New</span>
    </Button>

    <Button onClick={openShare} className="flex items-center gap-1 px-3 py-2">
      <Share2 />
      <span className="hidden sm:inline">Share</span>
    </Button>
  </div>
</div>

          {selectedType && (
            <div className="flex items-center gap-2 text-md">
              <div className="bg-purple-200/10 rounded-full px-3 flex justify-center items-center gap-1">
                <Filter className="w-4 h-4" />
                {selectedType}
                <X
                  className="h-4 w-4 text-red-700 hover:text-red-300 cursor-pointer"
                  onClick={() => setSelectedType(null)}
                />
              </div>
            </div>
          )}
          {isCreateNewOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
              <div className="border border-black/[0.2] dark:border-white/[0.2]   bg-[#111111] p-6 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 scale-100">
                <Tabs defaultValue="automatic" className="w-full ">
                  <TabsList className=" w-full">
                    <TabsTrigger value="automatic" className="w-full">
                      Automatic
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="w-full">
                      Manual
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="automatic">
                    <div>
                      <h2 className="text-white text-xl text-center">
                        Just Paste It
                      </h2>
                      <p className="text-center text-gray-200 mb-4">
                        Paste link before you find interesting
                      </p>
                      <p className="text-gray-400 text-sm text-center">
                        *NOTE: This only support{" "}
                        <a href="https://x.com" target="_blank">
                          {" "}
                          <span className="text-purple-200 italic">tweet</span>
                        </a>{" "}
                        and{" "}
                        <a href="https://youtube.com" target="_blank">
                          <span className="text-purple-200 italic">
                            youtube
                          </span>
                        </a>{" "}
                        link for now{" "}
                      </p>
                      <button
                        className="absolute -top-4 -right-6  rounded-full text-xs"
                        onClick={onClose}
                      >
                        <X className="h-5 w-5" />
                      </button>

                      <form
                        onSubmit={ImportLinkSubmit}
                        className="text-white px-4 sm:px-6 md:px-8 lg:px-10 py-4"
                      >
                        {/* Import Link */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-50 mb-1">
                            Import from Link:
                          </label>
                          <input
                            type="text"
                            placeholder="paste your yt/tweet link here"
                            className="w-full px-3 py-2 border border-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent"
                            value={importLink}
                            onChange={(e) => setImportLink(e.target.value)}
                            required
                          />
                          {formError.importLink && (
                            <p className="text-sm text-red-500">
                              {formError.importLink}
                            </p>
                          )}
                          <Button
                            className="mt-3 w-full "
                            disabled={importLink ? false : true}
                            type="submit"
                          >
                            Import
                          </Button>
                        </div>
                      </form>
                    </div>
                  </TabsContent>
                  <TabsContent value="manual">
                    <div>
                      <h2 className="text-white text-xl mb-4 text-center">
                        New Thought
                      </h2>
                      <p className="text-center text-gray-400">
                        Save your new thought before you forget it
                      </p>
                      <button
                        className="absolute -top-4 -right-6  rounded-full text-xs"
                        onClick={onClose}
                      >
                        <X className="h-5 w-5" />
                      </button>

                      <form
                        onSubmit={handleSubmit}
                        className="text-white px-4 sm:px-6 md:px-8 lg:px-10 py-4"
                      >
                        {/* Title */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Title:
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                          {/* {validateFormErr.title && (
                              <p className='text-sm text-red-500'>
                                {validateFormErr.title}
                              </p>
                            )} */}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Description:
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          ></textarea>
                          {/* {validateFormErr.description && (
                              <p className='text-sm text-red-500'>
                                {validateFormErr.description}
                              </p>
                            )} */}
                        </div>

                        {/* Type Selection */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Type:
                          </label>
                          <select
                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent"
                            value={type}
                            onChange={(e) => {
                              // console.log('select called')
                              setType(e.target.value.toLowerCase());
                              // console.log('type:', type.toLowerCase())
                            }}
                          >
                            <option value="tweet" className="bg-slate-950">
                              Tweet
                            </option>
                            <option value="video" className="bg-slate-950">
                              Video
                            </option>
                            <option value="link" className="bg-slate-950">
                              Link
                            </option>
                            <option value="image" className="bg-slate-950">
                              Image
                            </option>
                            <option value="article" className="bg-slate-950">
                              Article
                            </option>
                          </select>
                        </div>

                        {/* Link */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Ref Link:
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required
                          />
                          {/* {validateFormErr.link && (
                              <p className='text-sm text-red-500'>
                                {validateFormErr.link}
                              </p>
                            )} */}
                        </div>

                        {/* Date */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Date:
                          </label>
                          <div className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm bg-transparent dark:text-white">
                            {date}
                          </div>
                        </div>

                        {/* Tags input */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Tags:
                          </label>
                          <div className="relative flex flex-col">
                            <input
                              type="text"
                              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400/40 bg-transparent"
                              value={inputValue}
                              onChange={handleInputChange}
                              onKeyDown={addTag}
                              // onKeyDown={(e) => e.key === 'Enter' && addTag(e)}
                              placeholder="Add tags and press Enter"
                            />
                            {/* {validateFormErr.tag && alltagsId.length <= 0 && (
                                <p className='text-sm text-red-500 text-left'>
                                  {validateFormErr.tag}
                                </p>
                              )} */}

                            {/* Dropdown for filtered tags */}
                            {inputValue && (
                              <ul className="bg-slate-950 absolute top-10 border w-full rounded-b-lg max-h-40 overflow-auto">
                                {filteredTags.map((tag) => (
                                  <li
                                    key={tag._id}
                                    onClick={() => {
                                      setSelectedTags([
                                        ...selectedTags,
                                        tag.title,
                                      ]);
                                      setAlltagsId([...alltagsId, tag._id]);
                                      setInputValue("");
                                    }}
                                    className="px-3 py-2 text-white hover:bg-purple-600 cursor-pointer"
                                  >
                                    {tag.title}
                                  </li>
                                ))}
                                {filteredTags.length === 0 && (
                                  <li className="text-gray-400 px-3 py-2">
                                    No matching tags
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>
                          {/* Display selected tags */}
                          <div className="flex flex-wrap mt-4 gap-2 ">
                            {selectedTags.map((tag, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-purple-400/20 px-2 py-1 rounded-lg text-sm"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedTags(
                                      selectedTags.filter((_, i) => i !== index)
                                    );
                                    setAlltagsId(
                                      alltagsId.filter((_, i) => i !== index)
                                    );
                                  }}
                                  className="ml-2 text-red-600 hover:text-red-800"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row justify-end gap-2">
                          <Button
                            onClick={closeCreate}
                            variant={"ghost"}
                            className="flex justify-center items-center gap-1 text-center rounded-md bg-transparent no-underline cursor-pointer shadow-2xl leading-6  text-white  border-[1px] border-slate-500 px-4 py-2 font-mono font-medium transition-colors hover:text-indigo-300"
                          >
                            Cancel
                          </Button>

                          <Button type="submit">Create</Button>
                        </div>
                      </form>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
          {isShareOpen && (
            <div
              className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
              onClick={onClose}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="border border-black/[0.2] dark:border-white/[0.2]   bg-[#111111] p-6 rounded-lg shadow-lg w-full max-w-md transform transition-transform duration-300 scale-100"
              >
                <h2 className="text-white text-xl mb-4 text-center">
                  Share Your Second Brain
                </h2>
                <button
                  className="absolute top-4 right-6  rounded-full text-xs"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="mt-4 flex items-center justify-between  py-2">
                  <span className="text-sm text-gray-400">
                    Allow public access
                  </span>
                  <Switch
                    checked={openAccess}
                    onCheckedChange={handlePublicAccessToggle}
                  />
                </div>
                {openAccess && (
                  <div className="font-mono text-sm text-wrap">
                    hash: {hash}
                  </div>
                )}
                <Separator />
                <div className="flex flex-col md:flex-row gap-7 mt-2">
                  <div className="flex flex-col gap-5">
                    <span className="text-sm text-gray-300">
                      Share your entire collection of notes, documents, tweets,
                      and videos with others. They&apos;ll be able to import
                      your content into their own second brain.{" "}
                    </span>
                    <div>
                      <Button
                        className="w-full bg-purple-200"
                        onClick={shareBrain}
                        disabled={!openAccess}
                      >
                        {shareBtnLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <>
                            <Copy />
                            Share brain
                          </>
                        )}
                      </Button>
                      <p
                        className={`text-sm text-purple-200 transition-opacity duration-300 ease-out ${
                          showCopiedMsg ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        Copied!
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="w-64 h-64 md:w-32 md:h-32  text-center">
                      {openAccess ? (
                        <div className=" w-full h-full">
                          {shareBtnLoading ? (
                            <div className="w-full h-full bg-slate-600/20 animate-pulse"></div>
                          ) : (
                            <img src={src} className="w-full" />
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full ">
                          <BrainCircuit className="w-full h-full text-purple-100" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isSummaryOpen && (
            <div className="fixed inset-0 z-50">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
              />

              <div className="fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 p-4 sm:p-8">
                <div className="mx-auto max-h-[70vh] w-full max-w-2xl overflow-y-auto rounded-md bg-black p-6 shadow-xl flex flex-col">
                  {points.map((point, index) => (
                    <p key={index} className="mb-3 text-gray-100 last:mb-0">
                      {point}
                    </p>
                  ))}
                  <Button onClick={onClose} className="">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
          <Separator />

          <div
            id="scrollable"
            className=" scroll  overflow-y-auto border border-neutral-700 rounded-lg sm:p-8  max-h-full  bg-white bg-opacity-10 "
          >
            <UserContent
              cardData={cardData}
              setCardData={setCardData}
              selectedType={selectedType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const UserContent = ({
  cardData,
  setCardData,
  selectedType,
}: {
  cardData: CreateCardProp[];
  setCardData: React.Dispatch<React.SetStateAction<CreateCardProp[]>>;
  selectedType: CreateCardType;
}) => {
  return (
    <div>
      <CardComponent
        cardData={cardData}
        setCardData={setCardData}
        selectedType={selectedType}
      />
    </div>
  );
};
