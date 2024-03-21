import { TQuote } from "@/config/type";
import { useQuery } from "@tanstack/react-query";
import Typewriter from "typewriter-effect";

function QuotesWidget() {
  const { data } = useQuery({
    queryKey: ["fetch quotes data"],
    queryFn: () =>
      fetch("https://type.fit/api/quotes").then(
        (res) => res.json() as unknown as TQuote[],
      ),
  });

  return (
    <div className="flex">
      <Typewriter
        options={{
          strings: data?.map((item) => item.text),
          autoStart: true,
          loop: true,
        }}
      />
    </div>
  );
}

export default QuotesWidget;
