import { useEffect, useState } from "react";
import "react-clock/dist/Clock.css";
import Clock from "react-clock";
import {
  useTimezoneSelect,
  allTimezones,
  type ITimezone,
} from "react-timezone-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const labelStyle = "original";
const timezones = {
  ...allTimezones,
};

type TState = {
  clockDate: Date;
  timeZone: ITimezone;
};

function AnalogClocks() {
  const initialState = { clockDate: new Date(), timeZone: "" };
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const [vState, setState] = useState<TState>(initialState);

  useEffect(() => {
    if (vState.timeZone !== "") {
      setTimeout(() => {
        const now = new Date();
        const gmtOffsetByMsec = now.getTimezoneOffset() * 60 * 1000;
        const timeZoneGmtOffsetByMsec =
          Number(parseTimezone(vState.timeZone).offset).valueOf() * 3600 * 1000;
        const timeZoneDate = new Date(
          now.getTime() + gmtOffsetByMsec + timeZoneGmtOffsetByMsec,
        );
        setState((prevState) => ({ ...prevState, clockDate: timeZoneDate }));
      }, 1000);
    } else {
      setTimeout(() => {
        setState((prevState) => ({ ...prevState, clockDate: new Date() }));
      }, 1000);
    }
  }, [vState.timeZone, vState.clockDate, parseTimezone]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-5 2xl:flex-row">
      <Clock value={vState.clockDate} />
      <div className="ml-3">
        <Select
          onValueChange={(value: ITimezone) =>
            setState((prevState) => ({ ...prevState, timeZone: value }))
          }
          value={String(vState.timeZone)}
        >
          <SelectTrigger className="w-[200px] 2xl:w-[110px]">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem value={option.value} key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default AnalogClocks;
