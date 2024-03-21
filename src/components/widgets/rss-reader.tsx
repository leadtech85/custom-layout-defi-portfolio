import React, { useState, useEffect } from "react";
import Parser from "rss-parser";
import TimeAgo from "react-timeago";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TFeedItem = {
  author: string;
  title: string;
  pubDate: string;
  link: string;
};

type TState = {
  feedItems: TFeedItem[];
  feedUrl: string;
};

const options = [
  {
    value: "https://www.reddit.com/.rss",
    label: "Reddit",
  },
  {
    value: "https://feeds.bbci.co.uk/news/world/rss.xml",
    label: "BBC News",
  },
];

const RssReader = () => {
  const initialState = {
    feedItems: [],
    feedUrl: "https://www.reddit.com/.rss",
  };

  const [vState, setState] = useState<TState>(initialState);

  const parser = new Parser();

  const fetchFeed = async () => {
    try {
      const res = await fetch(
        `https://api.allorigins.win/get?url=${vState.feedUrl}`,
      );
      const resContent = await res.json();
      const resXmlContent = atob(resContent.contents.split(",")[1]);
      const parseFeed = await parser.parseString(resXmlContent);

      setState((prevState) => ({
        ...prevState,
        feedItems: parseFeed.items as TFeedItem[],
      }));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    void fetchFeed();
  }, [vState.feedUrl]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-start ">
        <Select
          onValueChange={(value: string) =>
            setState((prevState) => ({ ...prevState, feedUrl: value }))
          }
          value={String(vState.feedUrl)}
        >
          <SelectTrigger className="w-[250px] ">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem value={option.value} key={option.value}>
                {option.label}&nbsp; ({option.value})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row flex-wrap gap-3">
        {vState.feedItems.length > 0 &&
          vState.feedItems.map((item, index) => (
            <aside
              className="w-full max-w-lg rounded-lg bg-gray-800 p-6 font-mono text-white"
              key={index}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <TimeAgo date={new Date(item.pubDate)} />
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {item.author && (
                  <div>
                    <p className="text-green-400">Author</p>
                    <p className="text-sm text-white">{item.author}</p>
                  </div>
                )}
                <div>
                  <p className="text-green-400">Title</p>
                  <p
                    className="cursor-pointer text-sm text-white underline underline-offset-2 duration-300 hover:text-yellow-500 hover:underline-offset-4"
                    onClick={() => window.open(item.link, "_bla")}
                  >
                    {item.title}
                  </p>
                </div>
              </div>
            </aside>
          ))}
      </div>
    </div>
  );
};

export default RssReader;
